"""Merge CISA's KEV and ENISA's EU KEV into a small copy the browser scanner can load from the same origin.

Each entry: [name, dateAdded, ransomware, sources, euvdId], sources being "C" (CISA), "E" (ENISA) or "CE".
CISA's name, date and ransomware flag win when both catalogues list a CVE.
"""
import json
import urllib.request

CISA_URLS = [
    "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
    # CISA's own GitHub copy, for when the main feed rejects the runner's IP range.
    "https://raw.githubusercontent.com/cisagov/kev-data/main/known_exploited_vulnerabilities.json",
]
ENISA_URL = "https://raw.githubusercontent.com/enisaeu/CNW/main/eukev/eukev.json"


def fetch_json(urls):
    last = None
    for url in urls:
        try:
            with urllib.request.urlopen(url, timeout=60) as response:
                return json.load(response)
        except Exception as e:  # try the next mirror
            last = e
    raise last


def enisa_name(e):
    vendor = (e.get("vendorProject") or "").strip()
    product = (e.get("product") or "").strip()
    if vendor or product:
        return product or vendor if product.lower().startswith(vendor.lower()) else f"{vendor} {product}".strip()
    first = (e.get("shortDescription") or "").split(". ")[0].strip()
    return (first[:1].upper() + first[1:])[:120]


cisa = fetch_json(CISA_URLS)
cves = {
    v["cveID"]: [v["vulnerabilityName"], v["dateAdded"], v["knownRansomwareCampaignUse"], "C", ""]
    for v in cisa["vulnerabilities"]
}

enisa_count = 0
try:
    for e in fetch_json([ENISA_URL]):
        cve = e.get("cveID")
        if not cve:
            continue
        enisa_count += 1
        euvd = e.get("euvdID") or ""
        if cve in cves:
            cves[cve][3] = "CE"
            cves[cve][4] = euvd
        else:
            cves[cve] = [enisa_name(e), (e.get("dateReported") or "").replace("/", "-"), "Unknown", "E", euvd]
except Exception as e:
    # ENISA down: publish CISA alone rather than nothing.
    print(f"ENISA EU KEV unavailable: {e}")

slim = {
    "sources": {"C": CISA_URLS[0], "E": ENISA_URL},
    "catalogVersion": cisa["catalogVersion"],
    "dateReleased": cisa["dateReleased"],
    "cves": cves,
}
with open("data/kev.json", "w", encoding="utf-8") as f:
    json.dump(slim, f, ensure_ascii=False, separators=(",", ":"))

print(f"{len(cves)} entries (CISA {len(cisa['vulnerabilities'])}, ENISA {enisa_count}), catalogue {slim['catalogVersion']}")
