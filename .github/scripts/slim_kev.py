"""Download the CISA KEV catalogue and write a small copy the scanner can load from the same origin."""
import json
import urllib.request

URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"

with urllib.request.urlopen(URL, timeout=60) as response:
    catalogue = json.load(response)

slim = {
    "source": URL,
    "catalogVersion": catalogue["catalogVersion"],
    "dateReleased": catalogue["dateReleased"],
    "cves": {
        v["cveID"]: [v["vulnerabilityName"], v["dateAdded"], v["knownRansomwareCampaignUse"]]
        for v in catalogue["vulnerabilities"]
    },
}

with open("data/kev.json", "w", encoding="utf-8") as f:
    json.dump(slim, f, ensure_ascii=False, separators=(",", ":"))

print(f"{len(slim['cves'])} entries, catalogue {slim['catalogVersion']}")
