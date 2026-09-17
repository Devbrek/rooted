"use client";

import { useState, type FormEvent } from "react";
import { ThinBanner } from "@/components/thin-banner";

type ContactErrors = {
  prenom?: string;
  email?: string;
  message?: string;
};

type NewsletterErrors = {
  email?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

export default function ContactPage() {
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [newsletterErrors, setNewsletterErrors] = useState<NewsletterErrors>(
    {},
  );
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const prenom = String(data.get("prenom") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const errors: ContactErrors = {};
    if (!prenom) {
      errors.prenom = "Le prénom est obligatoire.";
    }
    if (!email) {
      errors.email = "L'email est obligatoire.";
    } else if (!isValidEmail(email)) {
      errors.email = "Le format de l'email n'est pas valide.";
    }
    if (!message) {
      errors.message = "Le message est obligatoire.";
    }

    setContactErrors(errors);
    if (Object.keys(errors).length > 0) {
      setContactSubmitted(false);
      return;
    }

    form.reset();
    setContactSubmitted(true);
  }

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    const errors: NewsletterErrors = {};
    if (!email) {
      errors.email = "L'email est obligatoire.";
    } else if (!isValidEmail(email)) {
      errors.email = "Le format de l'email n'est pas valide.";
    }

    setNewsletterErrors(errors);
    if (Object.keys(errors).length > 0) {
      setNewsletterSubmitted(false);
      return;
    }

    form.reset();
    setNewsletterSubmitted(true);
  }

  return (
    <main>
      <ThinBanner title="Contact" />

      <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16">
        <div className="border border-accent/30 bg-section px-4 py-3">
          <p className="font-sans text-sm text-foreground/80">
            Projet démo : ce formulaire et l&apos;inscription à la newsletter
            ne transmettent et ne conservent aucune donnée personnelle.
          </p>
        </div>

        <section
          aria-labelledby="contact-heading"
          className="flex flex-col gap-4"
        >
          <h2
            id="contact-heading"
            className="font-serif text-2xl text-foreground"
          >
            Nous écrire
          </h2>
          <form
            onSubmit={handleContactSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="prenom"
                className="flex flex-col gap-1 font-sans text-sm text-foreground"
              >
                Prénom
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  autoComplete="given-name"
                  aria-invalid={Boolean(contactErrors.prenom)}
                  aria-describedby={
                    contactErrors.prenom ? "prenom-error" : undefined
                  }
                  className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                />
              </label>
              {contactErrors.prenom ? (
                <p
                  id="prenom-error"
                  className="font-sans text-sm text-secondary"
                >
                  {contactErrors.prenom}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="contact-email"
                className="flex flex-col gap-1 font-sans text-sm text-foreground"
              >
                Email
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(contactErrors.email)}
                  aria-describedby={
                    contactErrors.email ? "contact-email-error" : undefined
                  }
                  className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                />
              </label>
              {contactErrors.email ? (
                <p
                  id="contact-email-error"
                  className="font-sans text-sm text-secondary"
                >
                  {contactErrors.email}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="message"
                className="flex flex-col gap-1 font-sans text-sm text-foreground"
              >
                Message
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  aria-invalid={Boolean(contactErrors.message)}
                  aria-describedby={
                    contactErrors.message ? "message-error" : undefined
                  }
                  className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                />
              </label>
              {contactErrors.message ? (
                <p
                  id="message-error"
                  className="font-sans text-sm text-secondary"
                >
                  {contactErrors.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              className="self-start bg-accent px-8 py-3 text-sm tracking-wide text-foreground uppercase transition-colors hover:bg-secondary hover:text-background"
            >
              Envoyer
            </button>

            {contactSubmitted ? (
              <p role="status" className="font-sans text-sm text-foreground/80">
                Site de démonstration : aucun message n&apos;est envoyé ni
                conservé.
              </p>
            ) : null}
          </form>
        </section>

        <section
          aria-labelledby="newsletter-heading"
          className="flex flex-col gap-4 border-t border-accent/30 pt-10"
        >
          <h2
            id="newsletter-heading"
            className="font-serif text-2xl text-foreground"
          >
            Newsletter
          </h2>
          <form
            onSubmit={handleNewsletterSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="newsletter-email"
                className="flex flex-col gap-1 font-sans text-sm text-foreground"
              >
                Email
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(newsletterErrors.email)}
                  aria-describedby={
                    newsletterErrors.email
                      ? "newsletter-email-error"
                      : undefined
                  }
                  className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                />
              </label>
              {newsletterErrors.email ? (
                <p
                  id="newsletter-email-error"
                  className="font-sans text-sm text-secondary"
                >
                  {newsletterErrors.email}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              className="self-start bg-accent px-8 py-3 text-sm tracking-wide text-foreground uppercase transition-colors hover:bg-secondary hover:text-background"
            >
              S&apos;inscrire
            </button>

            {newsletterSubmitted ? (
              <p role="status" className="font-sans text-sm text-foreground/80">
                Site de démonstration : aucun message n&apos;est envoyé ni
                conservé.
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
