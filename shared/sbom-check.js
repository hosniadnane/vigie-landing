// Checks an SBOM (CycloneDX or SPDX, JSON) against the CRA (Annex I, Part II, point 1) and against the fields of
// BSI TR-03183-2, the reference used while no harmonised standard is cited. Runs in the browser and in the app.
// Canonical copy: app/src/shared/sbom-check.js; `npm run sync-web` copies it to landing/shared/.

/** @typedef {{ label: string, status: "ok" | "partial" | "missing", detail: string }} Check */

const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);
const ratio = (n, total, what) => ({ status: n === total && total ? "ok" : n ? "partial" : "missing", detail: `${n} sur ${total} composants (${pct(n, total)} %)${what ? ` ${what}` : ""}` });
const versionAtLeast = (v, min) => {
  const a = String(v).split(".").map(Number);
  const b = min.split(".").map(Number);
  for (let i = 0; i < b.length; i++) if ((a[i] || 0) !== b[i]) return (a[i] || 0) > b[i];
  return true;
};

/** Normalises CycloneDX and SPDX 2.x JSON into one shape. */
function normalise(doc) {
  if (doc.bomFormat === "CycloneDX") {
    const comps = [];
    const walk = (list) => { for (const c of list || []) { comps.push(c); walk(c.components); } };
    walk(doc.components);
    const md = doc.metadata || {};
    return {
      format: "CycloneDX", version: doc.specVersion, modern: versionAtLeast(doc.specVersion, "1.6"),
      creator: !!(md.authors?.length || md.manufacturer || md.manufacture || md.supplier || md.tools),
      timestamp: md.timestamp, product: md.component?.name,
      components: comps.map((c) => ({
        name: c.name, version: c.version, id: c.purl || c.cpe,
        supplier: !!(c.supplier || c.author || c.authors?.length || c.publisher || c.group),
        licence: (c.licenses || []).some((l) => l.license?.id || l.expression),
        hash: (c.hashes || []).some((h) => /SHA-(256|384|512)|SHA3/i.test(h.alg)),
        sha512: (c.hashes || []).some((h) => /SHA-512/i.test(h.alg))
      })),
      dependencies: (doc.dependencies || []).some((d) => d.dependsOn?.length)
    };
  }
  if (typeof doc.spdxVersion === "string") {
    const pkgs = doc.packages || [];
    const ci = doc.creationInfo || {};
    return {
      format: "SPDX", version: doc.spdxVersion.replace("SPDX-", ""), modern: false,
      creator: !!ci.creators?.length, timestamp: ci.created, product: doc.name,
      components: pkgs.map((p) => ({
        name: p.name, version: p.versionInfo, id: (p.externalRefs || []).find((r) => r.referenceType === "purl")?.referenceLocator,
        supplier: !!(p.supplier && p.supplier !== "NOASSERTION"),
        licence: [p.licenseConcluded, p.licenseDeclared].some((l) => l && !["NOASSERTION", "NONE"].includes(l)),
        hash: (p.checksums || []).some((c) => /SHA(256|384|512)|SHA3/i.test(c.algorithm)),
        sha512: (p.checksums || []).some((c) => /SHA512/i.test(c.algorithm))
      })),
      dependencies: (doc.relationships || []).some((r) => /DEPENDS_ON|DEPENDENCY_OF|CONTAINS/.test(r.relationshipType))
    };
  }
  if (JSON.stringify(doc["@context"] || "").includes("spdx.org/rdf/3")) return { format: "SPDX", version: "3", unsupported: true };
  return null;
}

/**
 * @param {string} text the SBOM file content
 * @returns {{ error?: string, format?: string, version?: string, total?: number, cra?: Check[], bsi?: Check[] }}
 */
export function checkSbom(text) {
  let doc;
  try {
    doc = JSON.parse(text);
  } catch {
    return { error: "Ce fichier n'est pas du JSON. Le vérificateur lit les SBOM CycloneDX ou SPDX au format JSON." };
  }
  const n = normalise(doc);
  if (!n) return { error: "Ce fichier JSON n'est ni un SBOM CycloneDX ni un SBOM SPDX." };
  if (n.unsupported) return { format: n.format, version: n.version, error: "Les SBOM SPDX 3 (JSON-LD) ne sont pas encore analysés en détail." };
  const comps = n.components;
  const total = comps.length;
  const count = (f) => comps.filter(f).length;

  /** @type {Check[]} */
  const cra = [
    { label: "Format couramment utilisé et lisible par machine", status: "ok", detail: `${n.format} ${n.version}, JSON` },
    { label: "Composants recensés", status: total ? "ok" : "missing", detail: total ? `${total} composants` : "aucun composant : le SBOM doit couvrir au moins les dépendances de niveau supérieur" },
    { label: "Version de chaque composant", ...ratio(count((c) => c.version), total) }
  ];

  /** @type {Check[]} */
  const bsi = [
    { label: n.format === "CycloneDX" ? "CycloneDX 1.6 ou plus récent" : "SPDX 3.0.1 ou plus récent", status: n.modern ? "ok" : "partial", detail: `version ${n.version}` },
    { label: "Créateur du SBOM", status: n.creator ? "ok" : "missing", detail: n.creator ? "indiqué" : "absent (auteur, fabricant ou outil)" },
    { label: "Horodatage", status: n.timestamp ? "ok" : "missing", detail: n.timestamp || "absent" },
    { label: "Produit décrit", status: n.product ? "ok" : "missing", detail: n.product || "absent" },
    { label: "Identifiant unique (package URL ou CPE)", ...ratio(count((c) => c.id), total) },
    { label: "Fournisseur ou auteur du composant", ...ratio(count((c) => c.supplier), total) },
    { label: "Licence (identifiant ou expression SPDX)", ...ratio(count((c) => c.licence), total) },
    { label: "Empreinte cryptographique SHA-512", ...ratio(count((c) => c.sha512), total, count((c) => c.hash && !c.sha512) ? `(et ${count((c) => c.hash && !c.sha512)} avec une autre empreinte)` : "") },
    { label: "Relations de dépendance", status: n.dependencies ? "ok" : "missing", detail: n.dependencies ? "présentes" : "absentes" }
  ];
  return { format: n.format, version: n.version, total, cra, bsi };
}
