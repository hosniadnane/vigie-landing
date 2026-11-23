// Reference texts of Regulation (EU) 2024/2847 (Cyber Resilience Act), French Official Journal wording,
// copied from EUR-Lex on 2026-11-22 (OJ L, 2024/2847, 20.11.2024). EU legislation may be reused freely.

/** Annex I: Part I 2(a)–(m) product requirements, Part II 1–8 vulnerability handling duties. */
export const REQUIREMENTS = [
  { id: "I.a", part: "I", label: "Aucune vulnérabilité exploitable connue", text: "être mis à disposition sur le marché sans vulnérabilité exploitable connue" },
  { id: "I.b", part: "I", label: "Configuration sécurisée par défaut", text: "être mis à disposition sur le marché avec une configuration de sécurité par défaut, sauf accord contraire entre le fabricant et l'entreprise utilisatrice en ce qui concerne un produit sur mesure comportant des éléments numériques, y compris la possibilité de réinitialiser le produit à son état d'origine" },
  { id: "I.c", part: "I", label: "Correction par mises à jour de sécurité", text: "être conçus de façon à ce leurs vulnérabilités puissent être corrigées par des mises à jour de sécurité, y compris, le cas échéant, par des mises à jour automatiques de sécurité régulières activées par défaut, mais faciles à désactiver, par la communication aux utilisateurs des mises à jour disponibles et par la possibilité de les différer temporairement" },
  { id: "I.d", part: "I", label: "Protection contre les accès non autorisés", text: "assurer la protection contre les accès non autorisés par des mécanismes de contrôle appropriés, y compris, mais sans s'y limiter, par des systèmes d'authentification, d'identité ou de gestion des accès et signaler tout accès non autorisé" },
  { id: "I.e", part: "I", label: "Confidentialité des données", text: "protéger la confidentialité des données stockées, transmises ou traitées de toute autre manière, à caractère personnel ou autres, par exemple en chiffrant les données pertinentes au repos ou en transit au moyen de mécanismes de pointe et par d'autres moyens techniques" },
  { id: "I.f", part: "I", label: "Intégrité des données, programmes et configuration", text: "protéger l'intégrité des données stockées, transmises ou traitées de toute autre manière, à caractère personnel ou autres, des commandes, des programmes et de la configuration contre toute manipulation ou modification non autorisée par l'utilisateur et signaler les corruptions" },
  { id: "I.g", part: "I", label: "Minimisation des données", text: "ne traiter que les données, à caractère personnel ou autres, qui sont adéquates, pertinentes et limitées à ce qui est nécessaire au regard de la finalité prévue du produit comportant des éléments numériques (minimisation des données)" },
  { id: "I.h", part: "I", label: "Disponibilité des fonctions essentielles", text: "protéger la disponibilité des fonctions essentielles et de base, notamment après un incident, y compris par des mesures de résilience et d'atténuation face aux attaques par déni de service" },
  { id: "I.i", part: "I", label: "Effets sur d'autres services ou réseaux", text: "réduire au maximum les répercussions négatives générées par les produits eux-mêmes ou par les appareils connectés sur la disponibilité des services fournis par d'autres dispositifs ou réseaux" },
  { id: "I.j", part: "I", label: "Surface d'attaque limitée", text: "être conçus, développés et fabriqués de manière à limiter les surfaces d'attaque, y compris les interfaces externes" },
  { id: "I.k", part: "I", label: "Limitation des conséquences d'un incident", text: "être conçus, développés et fabriqués de manière à réduire les répercussions d'un incident, en utilisant des mécanismes et des techniques appropriés de limitation de l'exploitation de vulnérabilités" },
  { id: "I.l", part: "I", label: "Journalisation et surveillance", text: "fournir des informations relatives à la sécurité en enregistrant et en surveillant les activités internes pertinentes, y compris l'accès ou la modification des données, des services ou des fonctions, tout en laissant à l'utilisateur la possibilité de désactiver le mécanisme" },
  { id: "I.m", part: "I", label: "Suppression et portabilité des données", text: "donner aux utilisateurs la possibilité de supprimer facilement, en toute sécurité et de manière permanente toutes les données et tous les paramètres et, lorsque ces données peuvent être transférées vers d'autres produits ou systèmes, veiller à ce que cela puisse se faire de manière sécurisée" },
  { id: "II.1", part: "II", label: "Recensement des composants (SBOM)", text: "recensent et documentent les vulnérabilités et les composants des produits, notamment par l'établissement d'une nomenclature des logiciels dans un format couramment utilisé et lisible par machine couvrant au moins les dépendances de niveau supérieur des produits" },
  { id: "II.2", part: "II", label: "Correction sans retard", text: "gèrent et corrigent sans retard les vulnérabilités qui touchent les produits comportant des éléments numériques, y compris par des mises à jour de sécurité; lorsque cela est techniquement possible, de nouvelles mises à jour de sécurité sont fournies séparément des mises à jour de fonctionnalité" },
  { id: "II.3", part: "II", label: "Tests et examens de sécurité réguliers", text: "soumettent régulièrement les produits comportant des éléments numériques à des tests et examens de sécurité efficaces" },
  { id: "II.4", part: "II", label: "Publication des vulnérabilités corrigées", text: "dès la publication d'une mise à jour de sécurité, communiquent sur les vulnérabilités corrigées, en publiant notamment une description des vulnérabilités, des informations permettant aux utilisateurs d'identifier le produit comportant des éléments numérique concerné, les conséquences de ces vulnérabilités, leur gravité et des informations claires et accessibles aidant les utilisateurs à y remédier; dans des cas dûment justifiés, lorsque les fabricants considèrent que les risques pour la sécurité liés à la publication l'emportent sur les avantages en matière de sécurité, ils peuvent retarder la publication des informations relatives à une vulnérabilité corrigée jusqu'à ce que les utilisateurs aient eu la possibilité d'appliquer le correctif adapté" },
  { id: "II.5", part: "II", label: "Politique de divulgation coordonnée", text: "mettent en place et appliquent une politique de divulgation coordonnée des vulnérabilités" },
  { id: "II.6", part: "II", label: "Partage d'informations et contact", text: "prennent des mesures pour faciliter le partage d'informations sur les vulnérabilités potentielles de leurs produits comportant des éléments numériques ainsi que des composants tiers contenus dans ces produits, y compris en fournissant une adresse de contact pour le signalement des vulnérabilités découvertes dans les produits concernés" },
  { id: "II.7", part: "II", label: "Distribution sécurisée des mises à jour", text: "prévoient des mécanismes de distribution sécurisée des mises à jour pour les produits comportant des éléments numériques afin de garantir que les vulnérabilités soient corrigées ou atténuées rapidement et, le cas échéant, automatisent les mises à jour de sécurité" },
  { id: "II.8", part: "II", label: "Diffusion gratuite et sans retard des correctifs", text: "veillent à ce que, lorsque des correctifs ou des mises à jour de sécurité sont disponibles pour remédier à des problèmes de sécurité constatés, ils soient diffusés sans retard et, sauf accord contraire entre un fabricant et un utilisateur professionnel en ce qui concerne un produit sur mesure comportant des éléments numériques, gratuitement et accompagnées de messages consultatifs fournissant aux utilisateurs les informations pertinentes, y compris sur les éventuelles mesures à prendre" }
];

/** Annex II: information and instructions for the user. */
export const ANNEX_II = [
  { n: "1", text: "le nom, la raison sociale ou la marque déposée du fabricant et l'adresse postale, l'adresse électronique ou tout autre contact numérique ainsi que, le cas échéant, le site internet sur lequel le fabricant peut être contacté" },
  { n: "2", text: "le point de contact unique où les informations sur les vulnérabilités du produit comportant des éléments numériques peuvent être signalées et reçues, et où peut être trouvée la politique du fabricant en matière de divulgation coordonnée des vulnérabilités" },
  { n: "3", text: "nom et type, ainsi que toute information supplémentaire permettant l'identification unique du produit comportant des éléments numériques" },
  { n: "4", text: "l'utilisation prévue du produit comportant des éléments numériques, y compris l'environnement de sécurité fourni par le fabricant, ainsi que les fonctionnalités essentielles du produit et les informations sur ses propriétés de sécurité" },
  { n: "5", text: "toutes circonstances connues ou prévisibles liées à l'utilisation du produit comportant des éléments numériques conformément à son utilisation prévue ou dans des conditions de mauvaise utilisation raisonnablement prévisible, susceptibles d'entraîner des risques de cybersécurité importants" },
  { n: "6", text: "le cas échéant, l'adresse internet à laquelle la déclaration UE de conformité peut être consultée" },
  { n: "7", text: "le type d'assistance technique en matière de sécurité proposé par le fabricant et la date de fin de la période d'assistance pendant laquelle les utilisateurs peuvent s'attendre à recevoir des mises à jour de sécurité" },
  { n: "8a", text: "les mesures nécessaires lors de la mise en service initiale du produit comportant des éléments numériques et pendant toute sa durée de vie pour assurer sa sécurité d'utilisation" },
  { n: "8b", text: "la façon dont les modifications apportées au produit comportant des éléments numériques peuvent affecter la sécurité des données" },
  { n: "8c", text: "la façon dont les mises à jour pertinentes pour la sécurité peuvent être installées" },
  { n: "8d", text: "la mise hors service sécurisée du produit comportant des éléments numériques, en ce compris des informations sur la manière dont les données utilisateur peuvent être supprimées en toute sécurité" },
  { n: "8e", text: "la manière dont le réglage par défaut permettant l'installation automatique des mises à jour de sécurité, conformément à l'annexe I, partie I, point c), peut être désactivé" },
  { n: "8f", text: "lorsque le produit comportant des éléments numériques est destiné à être intégré dans d'autres produits comportant des éléments numériques, les informations nécessaires à l'intégrateur pour se conformer aux exigences essentielles de cybersécurité énoncées à l'annexe I et aux exigences en matière de documentation énoncées à l'annexe VII" },
  { n: "9", text: "lorsque le fabricant décide de mettre à la disposition de l'utilisateur la nomenclature des logiciels, des informations sur l'endroit où celle-ci peut être consultée" }
];

/** Annex III (important products, classes I and II) and Annex IV (critical products), French wording. */
export const CLASSES = {
  I: [
    "Systèmes de gestion des identités et logiciels et dispositifs de gestion des accès privilégiés, dont lecteurs d'authentification et de contrôle d'accès et lecteurs biométriques",
    "Navigateurs autonomes et intégrés",
    "Gestionnaires de mots de passe",
    "Logiciels qui recherchent, suppriment ou mettent en quarantaine des logiciels malveillants",
    "Produits comportant des éléments numériques avec la fonction de réseau privé virtuel (VPN)",
    "Systèmes de gestion de la qualité", // as published in the French OJ; the English text reads "Network management systems"
    "Systèmes de gestion des informations et des événements de sécurité (SIEM)",
    "Gestionnaires de démarrage",
    "Infrastructure à clé publique et logiciels d'émission de certificats numériques",
    "Interfaces réseau physiques et virtuelles",
    "Systèmes d'exploitation",
    "Routeurs, modems destinés à la connexion à l'internet et commutateurs",
    "Microprocesseurs dotés de fonctionnalités liées à la sécurité",
    "Microcontrôleurs dotés de fonctionnalités liées à la sécurité",
    "Circuits intégrés spécifiques à l'application (ASIC) et réseaux de portes programmables (FPGA) dotés de fonctionnalités liées à la sécurité",
    "Assistants virtuels polyvalents pour maison intelligente",
    "Produits domestiques intelligents dotés de fonctionnalités de sécurité, notamment serrures, caméras de sécurité, systèmes de surveillance pour bébé et systèmes d'alarme",
    "Jouets connectés qui présentent des caractéristiques sociales interactives (par exemple, parler ou filmer) ou qui possèdent des fonctions de localisation",
    "Produits portables personnels destinés à la surveillance de la santé, ou produits portables personnels destinés à être utilisés par et pour les enfants"
  ],
  II: [
    "Hyperviseurs et systèmes d'exécution de conteneurs prenant en charge l'exécution virtualisée de systèmes d'exploitation et d'environnements similaires",
    "Pare-feu, systèmes de détection et de prévention des intrusions",
    "Microprocesseurs résistants aux manipulations",
    "Microcontrôleurs résistants aux manipulations"
  ],
  critical: [
    "Dispositifs matériels avec boîtier de sécurité",
    "Passerelles pour compteur intelligent et autres dispositifs à des fins de sécurité avancées, y compris pour un traitement cryptographique sécurisé",
    "Cartes à puce ou dispositifs similaires, y compris éléments sécurisés"
  ]
};
