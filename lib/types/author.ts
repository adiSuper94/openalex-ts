import * as z from "zod/mini";
import { type DehydratedInstitution, DehydratedInstitutionZchema } from "./institution.ts";

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
  affiliations?: {
    institution: DehydratedInstitution;
    years: number[];
  }[];
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
  createdDate?: Date;
  displayName: string;
  displayNameAlternatives?: string[];
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
  summaryStats?: {
    /** The 2-year mean citedness for this source. Also known as [impact factor](https://en.wikipedia.org/wiki/Impact_factor). We use the year prior to the current year for the citations (the numerator) and the two years prior to that for the citation-receiving publications (the denominator). */
    twoYrMeanCitedness: number;
    hIndex: number;
    i10Index: number;
  };
  updatedDate?: Date;
  /** An OpenAlex URL, that will fetch all of this author's works */
  worksApiUrl?: string;
}

const AuthorZchema = z.pipe(
  z.object({
    id: z.string(),
    ids: z.object({
      orcid: z.optional(z.string()),
      wikipedia: z.optional(z.string()),
      openalex: z.string(),
      scopus: z.optional(z.string()),
      twitter: z.optional(z.string()),
    }),
    affiliations: z.optional(z.array(z.object({
      institution: DehydratedInstitutionZchema,
      years: z.array(z.number()),
    }))),
    cited_by_count: z.number(),
    works_count: z.number(),
    counts_by_year: z.array(
      z.object({
        year: z.number(),
        works_count: z.number(),
        cited_by_count: z.number(),
      }),
    ),
    created_date: z.optional(z.string()),
    display_name: z.string(),
    display_name_alternatives: z.optional(z.array(z.string())),
    last_known_institutions: z.optional(z.array(DehydratedInstitutionZchema)),
    orcid: z.optional(z.string()),
    summary_stats: z.optional(z.object({
      "2yr_mean_citedness": z.number(),
      h_index: z.number(),
      i10_index: z.number(),
    })),
    updated_date: z.optional(z.string()),
    works_api_url: z.optional(z.string()),
  }),
  z.transform((data) => {
    const author: Author = {
      id: data.id,
      ids: {
        openalex: data.ids.openalex,
      },
      citedByCount: data.cited_by_count,
      worksCount: data.works_count,
      countsByYear: data.counts_by_year.map((cy) => ({
        year: cy.year,
        worksCount: cy.works_count,
        citedByCount: cy.cited_by_count,
      })),
      displayName: data.display_name,
      displayNameAlternatives: data.display_name_alternatives,
      worksApiUrl: data.works_api_url,
    };
    if (data.ids.orcid) {
      author.ids.orcid = data.ids.orcid;
    }
    if (data.ids.wikipedia) {
      author.ids.wikipedia = data.ids.wikipedia;
    }
    if (data.ids.scopus) {
      author.ids.scopus = data.ids.scopus;
    }
    if (data.ids.twitter) {
      author.ids.twitter = data.ids.twitter;
    }
    if (data.orcid) {
      author.orcid = data.orcid;
    }
    if (data.last_known_institutions) {
      author.lastKnownInstitutions = data.last_known_institutions.map(
        (inst) => inst as DehydratedInstitution,
      );
    }
    if (data.created_date) {
      author.createdDate = new Date(data.created_date);
    }
    if (data.updated_date) {
      author.updatedDate = new Date(data.updated_date);
    }
    if (data.summary_stats) {
      author.summaryStats = {
        twoYrMeanCitedness: data.summary_stats["2yr_mean_citedness"],
        hIndex: data.summary_stats.h_index,
        i10Index: data.summary_stats.i10_index,
      };
    }
    if (data.affiliations) {
      author.affiliations = data.affiliations;
    }
    return author;
  }),
);

interface zAuthor extends z.infer<typeof AuthorZchema> {}
function _typeTestAuthor(z: zAuthor): Author {
  return z;
}
function __typeTestAuthor(z: Author): zAuthor {
  return z;
}

type ExcludeAuthorFields =
  | "affiliations"
  | "created_date"
  | "display_name_alternatives"
  | "last_known_institutions"
  | "summary_stats"
  | "updated_date"
  | "works_api_url";

type AuthorFields =
  | ExcludeAuthorFields
  | "id"
  | "ids"
  | "cited_by_count"
  | "counts_by_year"
  | "works_count"
  | "display_name"
  | "orcid";

const ALL_AUTHOR_FIELDS: AuthorFields[] = [
  "id",
  "ids",
  "cited_by_count",
  "works_count",
  "counts_by_year",
  "created_date",
  "display_name",
  "display_name_alternatives",
  "last_known_institutions",
  "orcid",
  "affiliations",
  "summary_stats",
  "updated_date",
  "works_api_url",
];

function parseAuthor(data: unknown): [Author, undefined] | [undefined, Error] {
  const result = AuthorZchema.safeParse(data);
  if (!result.success) {
    console.log(JSON.stringify(data, null, 2));
    return [undefined, result.error];
  }
  return [result.data, undefined];
}

export type { Author, AuthorFields, DehydratedAuthor, ExcludeAuthorFields, zDehydratedAuthor };
export { ALL_AUTHOR_FIELDS, DehydratedAuthorZchema, parseAuthor };
