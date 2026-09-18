import { ThinBanner } from "@/components/thin-banner";

export default function MentionsLegalesPage() {
  return (
    <main>
      <ThinBanner title="Mentions légales" />

      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">Éditeur du site</h2>
          <p className="font-sans text-foreground">
            Benjamin Sanna
            <br />
            Entrepreneur individuel sous le régime de la micro-entreprise
            <br />
            Immatriculation en cours : le numéro SIRET sera ajouté ici dès son
            attribution.
            <br />
            Montpellier, France
            <br />
            Contact : contact[at]devbrek.fr
          </p>
          <p className="font-sans text-foreground">
            Directeur de la publication : Benjamin Sanna
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">Hébergement</h2>
          <p className="font-sans text-foreground">
            Vercel Inc.
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
            <br />
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline transition-colors hover:text-foreground"
            >
              vercel.com
            </a>
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">Nature du site</h2>
          <p className="font-sans text-foreground">
            Rooted est un site de démonstration réalisé à des fins de
            portfolio. La boutique, les produits, les prix, les avis clients
            et les points de vente affichés sont fictifs. Aucune vente n&apos;a
            lieu : les paiements utilisent Stripe en mode test et aucun débit
            réel n&apos;est effectué. Les conditions générales de vente
            présentées sur ce site sont fictives et n&apos;engagent personne.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">
            Propriété intellectuelle
          </h2>
          <p className="font-sans text-foreground">
            Le code de ce site a été écrit par son éditeur. Les photographies
            proviennent de banques d&apos;images libres de droit (Unsplash,
            Pexels) et restent soumises à leurs licences respectives.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">Contact</h2>
          <p className="font-sans text-foreground">
            Pour toute question relative à ce site : contact[at]devbrek.fr
          </p>
        </section>
      </div>
    </main>
  );
}
