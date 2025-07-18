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

/** Authors are people who create works.
 * The Canonical External ID for authors is ORCID ID. Only small % of authors have ORCID IDs.
 */
interface Author {
  /** OpenAlex ID for this author */
  id: string;
  /** External IDs for this author. IDs expressed as URIs whenever possible. */
  ids: {
    /** The ORCID ID for this author. ORCID is a global and unique ID for authors. This is the Canonical external ID for authors
     * Note: ORCID coverage is relatively low in OpenAlex, because ORCID adoption in the wild has been slow. This is particularly an issue when dealing with older works and authors.
     */
    orcid?: string;
    /** Author's wikipedia page */
    wikipedia?: string;
    /** OpenAlex ID for this author */
    openalex: string;
    /** Author's [Scopus Author ID](https://utas.libguides.com/ManageID/Scopus) */
    scopus?: string;
    /** Author's Twitter handle */
    twitter?: string;
  };
  /** List of objects, representing the affiliations this author has claimed in their publications */
  affiliations: {
    institutions: DehydratedInstitution[];
    years: number[];
  };
  /** The total number Works that cite a work this author has created. */
  citedByCount: number;
  /** The number of works this author has created. */
  worksCount: number;
  /** {@link Author.worksCount} and {@link Author.citedByCount} for each of the last ten years, binned by year*/
  countsByYear: {
    year: number;
    worksCount: number;
    citedByCount: number;
  }[];
  createdDate: Date;
  displayName: string;
  displayNameAlternatives: string[];
  /** This author's last known institutional affiliations. In this context "last known" means that
   * we took all the author's Works, sorted them by publication date, and selected the most recent
   * one. If there is only one affiliated institution for this author for the work, this will be a
   * list of length 1; if there are multiple affiliations, they will all be included in the list.
   */
  lastKnownInstitutions?: DehydratedInstitution[];
  /** The ORCID ID for this author. ORCID is a global and unique ID for authors. This is the Canonical external ID for authors
   * Note: ORCID coverage is relatively low in OpenAlex, because ORCID adoption in the wild has been slow. This is particularly an issue when dealing with older works and authors.
   */
  orcid?: string;
  /** Citatation metrics for this author */
  summaryStats: {
    /** The 2-year mean citedness for this source. Also known as [impact factor](https://en.wikipedia.org/wiki/Impact_factor). We use the year prior to the current year for the citations (the numerator) and the two years prior to that for the citation-receiving publications (the denominator). */
    twoYrMeanCitedness: number;
    hIndex: number;
    i10Index: number;
  };
  updatedDate: Date;
  /** An OpenAlex URL, that will fetch all of this author's works */
  worksApiUrl: string;
}

export type { Author, DehydratedAuthor, zDehydratedAuthor };
export { DehydratedAuthorZchema };
