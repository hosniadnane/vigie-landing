// security.txt and coordinated disclosure policy. Shared by the app and the website's free generator (no Node or DOM APIs).
// Canonical copy: app/src/shared/policies.js; `npm run sync-web` copies it to landing/shared/.

/**
 * RFC 9116. Expires must be less than a year away: the first day of the month 11 months ahead, so the file only
 * changes (and gets a new version) once a month.
 */
export function securityTxt(p, now = new Date()) {
  const expires = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 11, 1));
  const site = p.website.replace(/\/$/, "");
  return `Contact: mailto:${p.security_email}
Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}
Preferred-Languages: fr, en
Policy: ${site}/securite/divulgation
Canonical: ${site}/.well-known/security.txt
`;
}

export function cvdPolicy(p) {
  return `# Politique de divulgation coordonnée des vulnérabilités

${p.company_name} remercie toute personne qui signale de bonne foi une vulnérabilité dans ${p.product_name}.

## Comment signaler

Écrivez à ${p.security_email}. Indiquez si possible :

- la version du produit concernée ;
- la description de la vulnérabilité et son impact ;
- les étapes pour la reproduire ;
- vos coordonnées, si vous souhaitez être recontacté ou cité.

Ne divulguez pas publiquement la vulnérabilité avant qu'un correctif soit disponible ou que le délai ci-dessous soit écoulé.

## Nos engagements

- Accuser réception de votre signalement sous 3 jours ouvrés.
- Vous tenir informé de l'analyse et de la correction.
- Publier un correctif et un avis de sécurité dès que possible, et au plus tard 90 jours après le signalement, sauf accord contraire avec vous.
- Vous citer dans l'avis de sécurité, si vous le souhaitez.

## Recherche de bonne foi

Nous n'engagerons pas de poursuites contre une personne qui respecte cette politique : tests limités à ce qui est nécessaire pour démontrer la vulnérabilité, sans accès aux données d'autrui au-delà, sans interruption de service et sans divulgation prématurée.

## Vulnérabilités activement exploitées

Conformément à l'article 14 du Cyber Resilience Act, nous déclarons les vulnérabilités activement exploitées dans nos produits via la plateforme unique de signalement de l'ENISA.

Contact : ${p.security_email}
Adresse de cette politique : ${p.website.replace(/\/$/, "")}/securite/divulgation
`;
}

