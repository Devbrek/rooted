// Boutiques fictives (chantier Q), placées au centre de villes françaises —
// jamais une adresse réelle. Coordonnées : centre-ville approximatif.
// Téléphone et email fictifs, non cliquables à l'affichage (même logique que
// les icônes de réseaux sociaux, chantier R) : aucun canal de contact réel.
export type Shop = {
  name: string;
  city: string;
  hours: string;
  phone: string;
  email: string;
  position: [number, number];
};

export const SHOPS: Shop[] = [
  {
    name: "Rooted Paris",
    city: "Paris",
    hours: "Du mardi au samedi, 10h – 19h",
    phone: "01 23 45 67 89",
    email: "paris@rooted-demo.fr",
    position: [48.8566, 2.3522],
  },
  {
    name: "Rooted Lyon",
    city: "Lyon",
    hours: "Du mardi au samedi, 10h – 18h30",
    phone: "04 12 34 56 78",
    email: "lyon@rooted-demo.fr",
    position: [45.764, 4.8357],
  },
  {
    name: "Rooted Bordeaux",
    city: "Bordeaux",
    hours: "Du mercredi au samedi, 10h30 – 18h",
    phone: "05 67 89 01 23",
    email: "bordeaux@rooted-demo.fr",
    position: [44.8378, -0.5792],
  },
];
