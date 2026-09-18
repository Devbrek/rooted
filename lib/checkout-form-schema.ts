import { z } from "zod";

const POSTAL_CODE_PATTERN = /^\d{5}$/;
// Formats acceptés, avec ou sans espaces : 0X XX XX XX XX ou +33 X XX XX XX XX.
const PHONE_PATTERN =
  /^(0[1-9](?:\s?\d{2}){4}|\+33\s?[1-9](?:\s?\d{2}){4})$/;

const trim = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

function requiredText(max: number, label: string) {
  return z.preprocess(
    trim,
    z
      .string()
      .min(1, `${label} est obligatoire.`)
      .max(max, `${label} ne doit pas dépasser ${max} caractères.`),
  );
}

function optionalText(max: number, label: string) {
  return z.preprocess(
    trim,
    z.string().max(max, `${label} ne doit pas dépasser ${max} caractères.`),
  );
}

const email = z.preprocess(
  trim,
  z
    .string()
    .min(1, "L'email est obligatoire.")
    .email("Le format de l'email n'est pas valide."),
);

const telephone = z.preprocess(
  trim,
  z.union([
    z.literal(""),
    z
      .string()
      .regex(
        PHONE_PATTERN,
        "Le format du téléphone n'est pas valide (numéro français attendu).",
      ),
  ]),
);

const postalCode = (label: string) =>
  z.preprocess(
    trim,
    z
      .string()
      .regex(POSTAL_CODE_PATTERN, `${label} doit contenir exactement 5 chiffres.`),
  );

const commonLivraisonFields = {
  prenom: requiredText(50, "Le prénom"),
  nom: requiredText(50, "Le nom"),
  email,
  societe: optionalText(100, "Le nom de la société"),
  telephone,
  adresse: requiredText(100, "L'adresse"),
  complement: optionalText(100, "Le complément d'adresse"),
  codePostal: postalCode("Le code postal"),
  ville: requiredText(50, "La ville"),
  instructions: optionalText(200, "Les instructions de livraison"),
};

const facturationFields = {
  facturationPrenom: requiredText(50, "Le prénom de facturation"),
  facturationNom: requiredText(50, "Le nom de facturation"),
  facturationAdresse: requiredText(100, "L'adresse de facturation"),
  facturationComplement: optionalText(
    100,
    "Le complément d'adresse de facturation",
  ),
  facturationCodePostal: postalCode("Le code postal de facturation"),
  facturationVille: requiredText(50, "La ville de facturation"),
};

// Schéma unique, partagé entre le formulaire (navigateur) et /api/checkout
// (serveur). Union discriminée sur la case à cocher : les champs de
// facturation ne sont exigés, et donc jamais validés, que si elle est décochée.
export const checkoutFormSchema = z.discriminatedUnion("facturationIdentique", [
  z.object({
    facturationIdentique: z.literal(true),
    ...commonLivraisonFields,
  }),
  z.object({
    facturationIdentique: z.literal(false),
    ...commonLivraisonFields,
    ...facturationFields,
  }),
]);

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function formatCheckoutFieldErrors(
  error: z.ZodError,
): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fields)) {
      fields[key] = issue.message;
    }
  }
  return fields;
}
