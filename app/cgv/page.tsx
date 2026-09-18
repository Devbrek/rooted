import { ThinBanner } from "@/components/thin-banner";

export default function CgvPage() {
  return (
    <main>
      <ThinBanner title="Conditions générales de vente" />

      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
        <div className="border border-accent/30 bg-section px-4 py-3">
          <p className="font-sans text-sm font-semibold text-foreground">
            Conditions fictives. Rooted est un site de démonstration. Aucune
            vente, aucune livraison et aucun remboursement réels n&apos;ont
            lieu. Ce texte existe pour illustrer le fonctionnement
            d&apos;une boutique en ligne et n&apos;engage personne.
          </p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">1. Commande</h2>
          <p className="font-sans text-foreground">
            Les produits présentés sont fictifs. La commande est validée
            après saisie des informations de livraison et passage par la
            page de paiement, en mode test.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">2. Prix</h2>
          <p className="font-sans text-foreground">
            Les prix sont indiqués en euros, toutes taxes comprises. Les
            frais de livraison sont offerts.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">3. Paiement</h2>
          <p className="font-sans text-foreground">
            Le paiement s&apos;effectue par carte bancaire via Stripe, en
            mode test. Aucune somme n&apos;est débitée.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">4. Livraison</h2>
          <p className="font-sans text-foreground">
            Livraison annoncée sous 3 à 5 jours ouvrés en France
            métropolitaine. Aucune expédition n&apos;a réellement lieu.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">
            5. Droit de rétractation
          </h2>
          <p className="font-sans text-foreground">
            Vous disposez de 14 jours à compter de la réception de votre
            commande pour changer d&apos;avis, sans avoir à vous justifier.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">
            6. Retours et remboursement
          </h2>
          <p className="font-sans text-foreground">
            Pour retourner un article, écrivez à contact[at]devbrek.fr en
            indiquant votre numéro de commande. Les articles doivent être
            renvoyés complets et non utilisés, dans leur emballage
            d&apos;origine. Le remboursement intervient sous 14 jours après
            réception du retour, sur le moyen de paiement utilisé lors de la
            commande. Les frais de retour restent à votre charge.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">7. Garanties</h2>
          <p className="font-sans text-foreground">
            Les produits bénéficient des garanties légales de conformité et
            contre les vices cachés.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">
            8. Service client
          </h2>
          <p className="font-sans text-foreground">
            Pour toute question : contact[at]devbrek.fr.
          </p>
        </section>
      </div>
    </main>
  );
}
