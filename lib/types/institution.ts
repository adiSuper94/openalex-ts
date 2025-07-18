import * as z from "zod/mini";

/** Institutions are universities and other organizations to which authors claim affiliations.
 * The Canonical External ID for institutions is ROR ID. All institutions have a ROR ID.
 * The {@link DehydratedInstitution} is stripped-down Institution
 */
interface DehydratedInstitution {
  /** OpenAlex ID for this institution */
  id: string;
  displayName: string;
  /** The country where this institution is located, represented as an [ISO two-letter country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). */
  countryCode?: string;

  /** Array of OpenAlex IDs of institutions. Includes this institution's ID, as well as any parent institutions.
   * If this institution has no parent institutions, this list will only contain its own ID */
  lineage: string[];
  /** The ROR ID for this institution. This is the Canonical External ID for institutions */
  ror: string;
  /*The institution's primary type, using the (ROR "type" controlled vocabulary)[https://ror.readme.io/docs/ror-data-structure] */
  types:
    | "education"
    | "archive"
    | "government"
    | "company"
    | "nonprofit"
    | "other"
    | "healthcare"
    | "facility"
    | "funder";
}

const DehydratedInstitutionZchema = z.pipe(
  z.object({
    id: z.string(),
    display_name: z.string(),
    country_code: z.nullable(z.string()),
    lineage: z.array(z.string()),
    ror: z.string(),
    type: z.union([
      z.literal("education"),
      z.literal("archive"),
      z.literal("government"),
      z.literal("company"),
      z.literal("nonprofit"),
      z.literal("other"),
      z.literal("healthcare"),
      z.literal("facility"),
      z.literal("funder"),
    ]),
  }),
  z.transform((data) => {
    return {
      id: data.id,
      displayName: data.display_name,
      countryCode: data.country_code ?? undefined,
      lineage: data.lineage,
      ror: data.ror,
      types: data.type,
    } as DehydratedInstitution;
  }),
);

interface zDehydratedInstitution extends z.infer<typeof DehydratedInstitutionZchema> {}

function _typeTestDehydratedInstitution(z: zDehydratedInstitution): DehydratedInstitution {
  return z;
}
function __typeTestDehydratedInstitution(z: DehydratedInstitution): zDehydratedInstitution {
  return z;
}
export type { DehydratedInstitution, zDehydratedInstitution };
export { DehydratedInstitutionZchema };
