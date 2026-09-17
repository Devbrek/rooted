// Articles de blog fictifs (chantier Y), textes et choix de photo validés par
// Ben avant intégration. Stockage en dur : pas de base, pas de CMS.
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  paragraphs: string[];
};

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "creer-une-ambiance-apaisante-chez-soi",
    title: "Créer une ambiance apaisante chez soi",
    excerpt:
      "Quelques gestes simples pour transformer une pièce en refuge, sans rien changer de fondamental à son intérieur.",
    image: "/tirage-brume-matin.jpg",
    paragraphs: [
      "Une pièce apaisante n'est pas forcément une pièce vide, ni une pièce minutieusement décorée. C'est souvent une question de rythme : celui de la lumière, des matières, des objets qu'on choisit de garder à portée de regard. Avant de penser à ajouter quoi que ce soit, on aime commencer par retirer — les objets qui traînent sans raison, les piles qui s'accumulent près de la porte, tout ce qui capte l'attention sans rien lui apporter en retour. Une surface dégagée repose l'œil autant que l'esprit.",
      "Vient ensuite la lumière. La lumière naturelle, d'abord : on évite de l'obstruer avec des meubles trop hauts près des fenêtres, on laisse les rideaux légers filtrer plutôt que bloquer. Le soir, on troque le plafonnier unique contre plusieurs sources plus douces — une lampe basse, une bougie, une veilleuse. Ce n'est pas une question d'esthétique seulement : une pièce éclairée de façon homogène et dure invite rarement à ralentir.",
      "Les matières comptent aussi. Le bois brut, le lin froissé, la céramique mate renvoient une lumière différente du plastique ou du verre poli — plus feutrée, moins réfléchissante. On aime associer deux ou trois matières maximum dans une même pièce, plutôt que de multiplier les textures qui finissent par se neutraliser.",
      "Enfin, on garde de la place pour le vivant : une plante, une branche séchée, un peu de désordre organique qui rappelle que la pièce est habitée, pas mise en scène. L'ambiance qu'on recherche n'est pas figée — elle change avec la saison, l'heure, l'humeur du jour. C'est peut-être ça, au fond, ralentir chez soi : accepter qu'une pièce respire, plutôt que de vouloir la figer dans un état parfait.",
    ],
  },
  {
    slug: "entretenir-les-matieres-naturelles",
    title: "Entretenir les matières naturelles au fil des saisons",
    excerpt:
      "Bois, lin, mousse stabilisée : quelques habitudes simples pour que ces matières vieillissent bien, sans produits compliqués.",
    image: "/plaid-refuge.jpg",
    paragraphs: [
      "Les matières naturelles ont ceci de particulier qu'elles vieillissent plutôt qu'elles ne s'usent : le bois se patine, le lin se froisse d'une façon qui lui est propre, la mousse stabilisée garde sa texture pendant longtemps si on lui évite certains excès. Pas besoin de rituel compliqué pour en prendre soin — quelques habitudes simples suffisent la plupart du temps.",
      "Pour le bois, on préfère un chiffon doux et sec pour la poussière du quotidien, et on évite de l'exposer trop longtemps en plein soleil direct : la lumière intense a tendance à en accentuer la décoloration de façon inégale. Un objet qu'on déplace de temps en temps vieillit souvent plus harmonieusement qu'un objet resté immobile pendant des années au même endroit.",
      "Pour les textiles — coussins, plaids — on aime les aérer de temps en temps, dehors ou près d'une fenêtre ouverte, plutôt que de les laver trop fréquemment. Un lavage doux, quand il est nécessaire, suffit généralement ; on évite les cycles trop chauds ou les produits très parfumés qui peuvent, avec le temps, rigidifier certaines fibres.",
      "La mousse stabilisée, elle, n'a besoin ni d'eau ni de lumière pour se maintenir : on la garde simplement à l'abri d'une humidité excessive et on la dépoussière, si besoin, avec de l'air soufflé doucement plutôt qu'un chiffon humide.",
      "Dans l'ensemble, l'idée n'est pas de figer ces objets dans leur état d'origine, mais de les accompagner dans leur vieillissement — qui, avec les matières naturelles, est rarement un défaut.",
    ],
  },
  {
    slug: "petits-rituels-pour-ralentir",
    title: "Petits rituels pour ralentir en fin de journée",
    excerpt:
      "Allumer une bougie, tamiser la lumière, s'accorder dix minutes de calme : des rituels courts pour marquer une pause.",
    image: "/bougie-sous-bois.jpg",
    paragraphs: [
      "On n'a pas toujours le temps, ni l'envie, de consacrer une heure entière à « décompresser » en fin de journée. Mais quelques minutes suffisent parfois à marquer une transition — entre la journée qui s'achève et la soirée qui commence. C'est l'idée derrière ce qu'on appelle, un peu grandement, un rituel : un geste court, répété, qui sert avant tout de repère.",
      "Allumer une bougie en est un exemple simple. Le geste lui-même prend quelques secondes, mais il a souvent valeur de signal : on referme l'ordinateur, on range son téléphone un peu plus loin, on change d'éclairage. Certains y associent une tisane, d'autres quelques pages d'un livre, d'autres encore rien du tout — juste s'asseoir un instant, sans autre objectif que celui d'être là.",
      "Tamiser la lumière fonctionne dans le même esprit. Passer d'un éclairage vif à une lumière plus douce, plus basse, envoie une forme de signal au reste de la soirée : on ralentit, on ne cherche plus à « faire », on laisse la pièce — et soi-même — se poser. Ce n'est ni une méthode ni une promesse, seulement une habitude qu'on peut essayer et garder si elle convient.",
      "L'important, on le pense, n'est pas le rituel en lui-même mais sa régularité : dix minutes chaque soir marquent souvent plus qu'une heure de temps en temps. Et si certains jours ce rituel n'a pas lieu, ce n'est pas grave non plus — il sera toujours temps de rallumer une bougie le lendemain.",
    ],
  },
];

export function getBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPost(slug: string): BlogPost | null {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}
