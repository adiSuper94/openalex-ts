import * as z from "zod/mini";
import type { DehydratedInstitution } from "./institution.ts";

/** Authors are people who create works.
 * The Canonical External ID for authors is ORCID ID. Only small % of authors have ORCID IDs.
 * The {@link DehydratedAuthor} is stripped-down Author
 */
interface DehydratedAuthor {
  /** OpenAlex ID for this author */
  id: string;
  displayName: string;
  /** The ORCID ID for this author. ORCID is a global and unique ID for authors. This is the Canonical external ID for authors
   * Note: ORCID coverage is relatively low in OpenAlex, because ORCID adoption in the wild has been slow. This is particularly an issue when dealing with older works and authors.
   */
  orcid?: string;
}

const DehydratedAuthorZchema = z.pipe(
  z.object({
    id: z.string(),
    display_name: z.string(),
    orcid: z.optional(z.string()),
  }),
  z.transform((data) => {
    return {
      id: data.id,
      displayName: data.display_name,
      orcid: data.orcid ?? undefined,
    } as DehydratedAuthor;
  }),
);

interface zDehydratedAuthor extends z.infer<typeof DehydratedAuthorZchema> {}

function _typeTestDehydratedAuthor(z: zDehydratedAuthor): DehydratedAuthor {
  return z;
}

function __typeTestDehydratedAuthor(z: DehydratedAuthor): zDehydratedAuthor {
  return z;
}
