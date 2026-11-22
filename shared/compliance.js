// The compliance file's data rules: requirements matrix rows, risk register entries and the product's CRA scope.

import { REQUIREMENTS, CLASSES } from "./cra.js";

export const REQ_IDS = REQUIREMENTS.map((r) => r.id);
export const REQ_STATUS = { a_evaluer: "À évaluer", en_cours: "Mesures en cours", conforme: "Conforme", non_applicable: "Non applicable" };

// Four-level scales, likelihood × impact: 1–3 faible, 4–6 modéré, 8–9 élevé, 12–16 critique.
export const LIKELIHOOD = { 1: "Peu probable", 2: "Possible", 3: "Probable", 4: "Très probable" };
export const IMPACT = { 1: "Mineur", 2: "Significatif", 3: "Grave", 4: "Critique" };
export const TREATMENT = { reduire: "Réduire", accepter: "Accepter", transferer: "Transférer", eviter: "Éviter" };

/** @param {number} l @param {number} i */
export function riskLevel(l, i) {
  const score = l * i;
  return { score, label: score >= 12 ? "critique" : score >= 8 ? "élevé" : score >= 4 ? "modéré" : "faible" };
}

const text = (v, max) => String(v ?? "").trim().slice(0, max);

/** One matrix row from a form. A requirement marked not applicable must say why (Annex VII 3). */
export function validateRequirement(input) {
  const errors = [];
  const applicable = input.applicable === "1" ? 1 : input.applicable === "0" ? 0 : null;
  const row = {
    applicable,
    justification: text(input.justification, 3000),
    measures: text(input.measures, 3000),
    evidence: text(input.evidence, 3000),
    status: applicable === 0 ? "non_applicable" : Object.hasOwn(REQ_STATUS, input.status) && input.status !== "non_applicable" ? input.status : "a_evaluer"
  };
  if (applicable === 0 && row.justification.length < 20) errors.push("Une exigence non applicable doit être justifiée (20 caractères au moins).");
  if (row.status === "conforme" && !row.measures) errors.push("Décrivez les mesures qui assurent la conformité.");
  if (row.status === "conforme" && !row.evidence) errors.push("Indiquez au moins une preuve (fichier, rapport de test, configuration…).");
  return { row, errors };
}

const level = (v) => (/^[1-4]$/.test(String(v)) ? Number(v) : null);

/** One risk from a form. */
export function validateRisk(input) {
  const errors = [];
  const risk = {
    threat: text(input.threat, 500),
    asset: text(input.asset, 300),
    likelihood: level(input.likelihood),
    impact: level(input.impact),
    treatment: Object.hasOwn(TREATMENT, input.treatment) ? input.treatment : null,
    measures: text(input.measures, 3000),
    residual_likelihood: level(input.residual_likelihood),
    residual_impact: level(input.residual_impact),
    requirement_ids: String(input.requirement_ids ?? "").split(/[\s,;]+/).filter((id) => REQ_IDS.includes(id)).join(",")
  };
  if (!risk.threat) errors.push("Décrivez la menace.");
  if (!risk.asset) errors.push("Indiquez le bien à protéger.");
  if (!risk.likelihood || !risk.impact) errors.push("Choisissez la vraisemblance et l'impact.");
  if (!risk.treatment) errors.push("Choisissez un traitement.");
  if (risk.treatment === "reduire" && !risk.measures) errors.push("Un risque à réduire doit avoir des mesures.");
  return { risk, errors };
}

/** Matrix completion figures for the dashboard. @param {{ status: string }[]} rows */
export function matrixSummary(rows) {
  const byStatus = Object.fromEntries(Object.keys(REQ_STATUS).map((s) => [s, 0]));
  for (const id of REQ_IDS) byStatus[rows.find((r) => r.req_id === id)?.status ?? "a_evaluer"]++;
  return { total: REQ_IDS.length, ...byStatus, done: byStatus.conforme + byStatus.non_applicable };
}

// ----- Scope and class (Art. 2, 7, 8, 32; Annexes III and IV)

export const DISTRIBUTION = {
  logiciel: "Logiciel installé ou exécuté chez le client (téléchargement, installation, application mobile, bibliothèque, firmware…)",
  saas_composant: "Service en ligne, mais avec une partie installée chez le client (application, agent, extension) ou indispensable à un produit",
  saas_pur: "Service uniquement en ligne (SaaS), rien n'est installé chez le client"
};

export const CATEGORY_OPTIONS = {
  aucune: "Aucune de ces catégories (produit « par défaut »)",
  ...Object.fromEntries(CLASSES.I.map((c, i) => [`I.${i + 1}`, `Classe I : ${c}`])),
  ...Object.fromEntries(CLASSES.II.map((c, i) => [`II.${i + 1}`, `Classe II : ${c}`])),
  ...Object.fromEntries(CLASSES.critical.map((c, i) => [`C.${i + 1}`, `Critique : ${c}`]))
};

/** @returns {{ scope: Record<string, string>, errors: string[] }} */
export function validateScope(input) {
  const scope = {
    distribution: Object.hasOwn(DISTRIBUTION, input.distribution) ? input.distribution : "",
    commercial: input.commercial === "oui" || input.commercial === "non" ? input.commercial : "",
    category: Object.hasOwn(CATEGORY_OPTIONS, input.category) ? input.category : "",
    standards: input.standards === "oui" ? "oui" : "non"
  };
  const errors = [];
  if (!scope.distribution) errors.push("Indiquez comment le produit est fourni.");
  if (!scope.commercial) errors.push("Indiquez s'il est fourni dans le cadre d'une activité commerciale.");
  if (!scope.category) errors.push("Choisissez une catégorie.");
  return { scope, errors };
}

/**
 * What the CRA asks for this product. A first assessment to confirm, not legal advice.
 * @param {Record<string, string>} s
 */
export function assessScope(s) {
  if (s.distribution === "saas_pur") {
    return {
      inScope: false,
      verdict: "Probablement hors du champ du CRA",
      explanation: "Le CRA vise les produits comportant des éléments numériques mis à disposition sur le marché. Un service purement en ligne en est exclu, sauf s'il constitue la « solution de traitement des données à distance » d'un produit (par exemple le cloud d'une application installée). Les obligations NIS2 et DORA de vos clients peuvent en revanche vous concerner comme fournisseur.",
      route: null
    };
  }
  if (s.commercial === "non") {
    return {
      inScope: false,
      verdict: "Probablement hors du champ du CRA",
      explanation: "Un logiciel libre fourni en dehors de toute activité commerciale n'est pas visé. Attention : la monétisation (support payant, version commerciale, collecte de données à des fins lucratives) peut constituer une activité commerciale. Une fondation ou entité qui soutient durablement un logiciel libre destiné à des activités commerciales est un « intendant du logiciel libre », avec des obligations allégées (article 24).",
      route: null
    };
  }
  const [cls] = s.category.split(".");
  const routes = {
    aucune: { label: "Produit par défaut", route: "Contrôle interne (module A) : vous évaluez vous-même la conformité et signez la déclaration UE." },
    I: { label: "Produit important de classe I", route: s.standards === "oui"
      ? "Contrôle interne (module A) possible, à condition d'appliquer intégralement des normes harmonisées, spécifications communes ou un schéma européen de certification (niveau « substantiel »). Aucune norme harmonisée n'est encore citée au Journal officiel : vérifiez ce point avant de vous y fier."
      : "Évaluation par un organisme notifié : examen UE de type (module B) puis conformité au type (module C), ou assurance complète de la qualité (module H), tant que des normes harmonisées ne sont pas intégralement appliquées." },
    II: { label: "Produit important de classe II", route: "Évaluation par un organisme notifié obligatoire : module B suivi du module C, module H, ou un schéma européen de certification lorsqu'il existe." },
    C: { label: "Produit critique", route: "Certification européenne de cybersécurité lorsqu'elle est exigée par acte délégué ; à défaut, les procédures de la classe II." }
  };
  const r = routes[s.category === "aucune" ? "aucune" : cls];
  return {
    inScope: true,
    verdict: `Dans le champ du CRA : ${r.label.toLowerCase()}`,
    explanation: s.distribution === "saas_composant"
      ? "La partie installée chez le client est un produit au sens du CRA, et le service en ligne qui lui est indispensable en est la « solution de traitement des données à distance » : les deux sont couverts."
      : "Votre logiciel est un produit comportant des éléments numériques.",
    route: r.route,
    label: r.label,
    moduleA: s.category === "aucune" || (cls === "I" && s.standards === "oui")
  };
}

/** Key dates (Art. 71). */
export const CRA_DATES = [
  { date: "2026-09-11", label: "Obligations de signalement à l'ENISA (article 14) : vulnérabilités activement exploitées et incidents graves" },
  { date: "2027-12-11", label: "Application de l'ensemble des obligations : exigences essentielles, documentation technique, déclaration UE, marquage CE" }
];
