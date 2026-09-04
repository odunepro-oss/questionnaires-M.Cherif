export const QUESTIONNAIRES = {
  patrinove: {
    slug: "patrinove",
    index: "01",
    title: "Patrinove",
    short: "Patrinove",
    teaser:
      "Conseil patrimonial, financement, assurance. Positionnement, image, acquisition, événements.",
    lede: [
      "Ce questionnaire sert à comprendre où en est Patrinove aujourd'hui, ce qui fonctionne déjà, et sur quoi une intervention aurait le plus d'effet.",
      "Il n'y a pas de bonne réponse. Ce qui est utile, c'est ce que vous constatez, pas ce qui devrait être.",
    ],
    groups: [
      {
        title: "Le cadre",
        note: "Pour savoir de quoi on parle, et avec qui.",
        questions: [
          {
            q: "Le projet porte sur Patrinove Ouest, Patrinove Assurances, ou les deux ?",
            hint: "Les deux structures n'ont ni la même activité ni les mêmes contraintes. Savoir laquelle porte le projet change tout le reste.",
          },
          { q: "Qui décide et valide : vous seul, ou avec Abdel El Marzouki ?" },
          { q: "Comment vous répartissez-vous les rôles au quotidien ?" },
          {
            q: "À quelle échéance souhaitez-vous voir un changement ?",
            hint: "Un trimestre, six mois, un an. Un ordre de grandeur suffit.",
          },
        ],
      },
      {
        title: "Ce que vous êtes",
        note: "Le positionnement se construit à partir de là, pas à partir d'une idée abstraite.",
        upload:
          "Supports existants : plaquette, présentation, captures de publicités, photos de l'équipe ou des bureaux.",
        questions: [
          {
            q: "Quelle cible servez-vous aujourd'hui, et laquelle voulez-vous servir demain ?",
            hint: "Décrivez un client type actuel, puis le client type que vous aimeriez voir arriver.",
          },
          { q: "Quel est votre point fort, celui que personne d'autre n'a vraiment ?" },
          {
            q: "Qu'est-ce que vos clients disent qui les a décidés à vous choisir ?",
            hint: "Leurs mots à eux, si vous vous en souvenez, valent mieux qu'un résumé.",
          },
          {
            q: "Quels cabinets ou quelles marques vous servent de référence, en bien comme en mal ?",
            hint: "Y compris hors de votre secteur. Et dites pourquoi.",
          },
        ],
      },
      {
        title: "Ce qui existe déjà",
        note: "Inutile de refaire ce qui fonctionne. Autant savoir ce qui a été tenté.",
        upload:
          "Plaquettes, documents de présentation, captures de campagnes ou de statistiques, publications LinkedIn.",
        questions: [
          {
            q: "Comment arrivent vos clients aujourd'hui : publicité, réseau, recommandation, apporteurs d'affaires ?",
            hint: "Une répartition approximative en pourcentage nous suffit.",
          },
          {
            q: "Publicité : quel budget mettez-vous en ce moment, sur quelles plateformes, et qu'est-ce que cela produit exactement ?",
            hint: "Le point important est le « exactement » : des clics, des formulaires remplis, des rendez-vous tenus, ou des dossiers signés ? Ce ne sont pas les mêmes choses, et cela change complètement la lecture.",
          },
          { q: "Combien de rendez-vous par mois, et combien se transforment en dossier ?" },
          {
            q: "Au-delà du site et des réseaux, quels supports vos clients voient-ils de vous ?",
            hint: "Plaquette, document de présentation, proposition commerciale, support de rendez-vous, signature de mail, cartes. Ce qui existe, même imparfait.",
          },
          {
            q: "Avez-vous des exemples de publicités ou de contenus qui ont bien marché ?",
            hint: "Ceux qui ont amené des demandes, pas ceux qui ont fait des vues. Et si vous savez pourquoi, dites-le.",
          },
          { q: "Qui gère le site aujourd'hui, et avec quel outil ?" },
          {
            q: "Quel est votre numéro ORIAS, et quels statuts détenez-vous ?",
            hint: "COA, MIA, IOBSP, IAS. Ces mentions sont obligatoires sur le site et n'y figurent pas aujourd'hui : autant les remettre au passage.",
          },
          {
            q: "Les 2 millions d'euros, c'est quoi exactement : une levée de fonds, un investissement, autre chose ?",
            hint: "Quel est l'objectif de cette opération, et à quoi servira l'argent ? Et peut-on communiquer dessus, ou pas encore ?",
          },
        ],
      },
    ],
  },

  "soins-intimes": {
    slug: "soins-intimes",
    index: "02",
    title: "Marque de soins intimes",
    short: "Soins intimes",
    teaser:
      "Soin intime féminin. Marque, produit, cadre réglementaire, marché, distribution.",
    lede: [
      "Ce questionnaire sert à comprendre le produit, son cadre réglementaire et le territoire de marque visé.",
      "Le réglementaire conditionne tout le travail créatif : tant que les allégations ne sont pas arrêtées, ni le site ni le packaging ne peuvent être figés. D'où les questions de la troisième partie.",
    ],
    groups: [
      {
        title: "Le cadre",
        note: "Qui porte le projet, et à quel horizon.",
        questions: [
          {
            q: "Qui est le gynécologue associé au projet, quel est son rôle, et souhaite-t-il être visible ?",
            hint: "Caution scientifique en retrait ou visage public de la marque : les deux se défendent, mais ce ne sont pas les mêmes marques.",
          },
          { q: "Qui décide et valide : vous, lui, ou les deux ?" },
          { q: "Quelle date de lancement visez-vous ?" },
        ],
      },
      {
        title: "Le produit",
        note: "Ce que vous vendez, concrètement.",
        upload:
          "Photos d'échantillons, de prototypes de packaging, de projets d'étiquetage, documents laboratoire.",
        questions: [
          {
            q: "Quelles sont les références de la gamme, et à quel moment chacune sert ?",
            hint: "Le nom provisoire, la fonction, le moment d'usage.",
          },
          { q: "Qu'est-ce qui rend vos formules différentes de ce qui existe déjà ?" },
          { q: "Quel laboratoire ou façonnier vous accompagne ?" },
        ],
      },
      {
        title: "Le réglementaire",
        note: "C'est le point bloquant pour la suite. Sans ces réponses, aucun texte de site ni de packaging ne peut être arrêté.",
        upload: "Dossiers, attestations, rapports de tests, projets d'étiquetage.",
        questions: [
          {
            q: "Le statut cosmétique est-il confirmé pour chaque référence ?",
            hint: "Un produit destiné à la muqueuse interne ne relève pas du même régime qu'un soin de la peau intime externe.",
          },
          { q: "Les dossiers d'information produit et la notification européenne sont-ils faits ?" },
          {
            q: "Quelles allégations sont déjà validées et opposables ?",
            hint: "Ce que vous avez le droit d'écrire noir sur blanc, preuves à l'appui, sur le produit fini.",
          },
          { q: "Avez-vous un conseil réglementaire cosmétique dans l'équipe, ou en prestataire ?" },
        ],
      },
      {
        title: "Le marché",
        note: "À qui, où, et contre qui.",
        upload:
          "Références visuelles, marques qui vous parlent, univers que vous aimez, ou au contraire ce que vous refusez.",
        questions: [
          { q: "À qui s'adresse la gamme en priorité, et à quel moment de vie ?" },
          { q: "Où voulez-vous vendre : e-commerce, pharmacie, institut, prescription, export ?" },
          {
            q: "Quelles marques vous servent de référence, en bien comme en mal ?",
            hint: "Dans le soin intime ou ailleurs. Dites ce que vous leur enviez, et ce que vous leur reprochez.",
          },
          {
            q: "Qu'est-ce que vous ne voulez surtout pas que la marque devienne ?",
            hint: "Cette question évite beaucoup d'allers-retours par la suite.",
          },
        ],
      },
      {
        title: "Ce qui existe déjà",
        upload: "Nom, logo, moodboards, essais graphiques, maquettes, comptes réseaux.",
        questions: [
          { q: "Y a-t-il déjà un nom, un logo, un début d'identité, des visuels, des comptes sur les réseaux ?" },
          {
            q: "Qui gérera le site au quotidien une fois en ligne ?",
            hint: "Cela détermine le choix de la plateforme et le niveau de formation à prévoir.",
          },
        ],
      },
    ],
  },
};

export const ORDER = ["patrinove", "soins-intimes"];

export function countQuestions(key) {
  return QUESTIONNAIRES[key].groups.reduce((n, g) => n + g.questions.length, 0);
}
