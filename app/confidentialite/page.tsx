import { ThinBanner } from "@/components/thin-banner";

export default function ConfidentialitePage() {
  return (
    <main>
      <ThinBanner title="Politique de confidentialité" />

      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
        <p className="font-sans text-foreground">
          Rooted est un site de démonstration. Il ne crée aucun compte, ne
          constitue aucun fichier client et ne conserve aucune donnée
          personnelle sur ses serveurs.
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">
            Ce que le site ne fait pas
          </h2>
          <ul className="flex flex-col gap-2 pl-5 font-sans text-foreground">
            <li className="list-disc">
              Aucun traceur publicitaire, aucune mesure d&apos;audience, aucun
              cookie déposé par le site. Aucun bandeau de consentement
              n&apos;est donc nécessaire.
            </li>
            <li className="list-disc">
              Le formulaire de contact et l&apos;inscription à la newsletter
              n&apos;envoient rien : les informations saisies restent dans le
              navigateur et disparaissent en changeant de page.
            </li>
            <li className="list-disc">
              Les informations saisies dans le formulaire de commande ne sont
              ni enregistrées en base de données, ni transmises à un tiers, ni
              inscrites dans les journaux du serveur.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">
            Ce qui reste dans votre navigateur
          </h2>
          <p className="font-sans text-foreground">
            Le panier et les favoris sont conservés dans le stockage local de
            votre navigateur (localStorage). Ces informations ne sont jamais
            envoyées au site et vous pouvez les supprimer à tout moment en
            vidant les données du site dans votre navigateur.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">Paiement</h2>
          <p className="font-sans text-foreground">
            Le paiement est géré par Stripe en mode test, sans débit réel.
            L&apos;adresse email saisie sur la page de paiement est traitée
            par Stripe, dont les serveurs sont situés aux États-Unis,
            conformément à sa propre politique de confidentialité.
            L&apos;éditeur du site ne conserve aucune de ces informations.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">Hébergement</h2>
          <p className="font-sans text-foreground">
            Le site est hébergé par Vercel Inc. Comme tout hébergeur, Vercel
            enregistre automatiquement des données techniques de connexion
            (adresse IP, date, pages consultées) à des fins de sécurité et de
            fonctionnement du service. Ces journaux ne sont pas exploités par
            l&apos;éditeur du site.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground">Vos droits</h2>
          <p className="font-sans text-foreground">
            Conformément au règlement général sur la protection des données
            (RGPD), vous disposez d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement et d&apos;opposition concernant
            vos données. Pour l&apos;exercer : contact[at]devbrek.fr. Vous
            pouvez également adresser une réclamation à la CNIL (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline transition-colors hover:text-foreground"
            >
              www.cnil.fr
            </a>
            ).
          </p>
        </section>

        <p className="font-sans text-sm text-foreground/60">
          Dernière mise à jour : 18 septembre 2026.
        </p>
      </div>
    </main>
  );
}
