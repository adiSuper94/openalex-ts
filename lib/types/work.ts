import { z } from "@zod/mini";

/** Sources are where works are hosted.
 * The Canonical External ID for sources is ISSN-L.
 * The {@link DehydratedSource} is stripped-down Source
 */
interface DehydratedSource {
  /** OpenAlex ID for this source */
  id: string;
  displayName: string;
  /** OpenAlex ID for the organization that hosts this source.
   * This will be an Institution.id if the source is a repository, and a Publisher.id if the source is a journal, conference, or eBook platform */
  hostOrganizationId?: string;
  hostOrganizationName?: string;
  /** Whether this source is identified as a "core source" by [CWTS](https://www.cwts.nl/), used in the Open Leiden Ranking of universities around the world.
   * The list of core sources can be found [here](https://zenodo.org/records/10949671) */
  isCore: boolean;
  /** Whether this is a journal listed in the [Directory of Open Access Journals](https://doaj.org/) */
  isInDoaj: boolean;
  isOA: boolean;
  /**The ISSNs used by this source. Many publications have multiple ISSNs , so ISSN-L should be used when possible */
  issn?: string[];
  /**The ISSN-L identifying this source. This is the Canonical External ID for sources */
  issnL?: string;
  type:
    | "journal"
    | "repository"
    | "conference"
    | "ebook"
    | "platform"
    | "book serier"
    | "metadata"
    | "other";
}

const DehydratedSourceZchema = z.pipe(
  z.interface({
    id: z.string(),
    display_name: z.string(),
    host_organization: z.nullable(z.string()),
    host_organization_name: z.nullable(z.string()),
    is_core: z.boolean(),
    is_in_doaj: z.boolean(),
    is_oa: z.boolean(),
    issn: z.nullable(z.array(z.string())),
    issn_l: z.nullable(z.string()),
    type: z.union([
      z.literal("journal"),
      z.literal("repository"),
      z.literal("conference"),
      z.literal("ebook"),
      z.literal("platform"),
      z.literal("book series"),
      z.literal("metadata"),
      z.literal("other"),
    ]),
  }),
  z.transform((data) => {
    return {
      id: data.id,
      displayName: data.display_name,
      hostOrganizationId: data.host_organization ?? undefined,
      hostOrganizationName: data.host_organization_name ?? undefined,
      isCore: data.is_core,
      isInDoaj: data.is_in_doaj,
      isOA: data.is_oa,
      issn: data.issn ?? undefined,
      issnL: data.issn_l ?? undefined,
      type: data.type,
    } as DehydratedSource;
  }),
);

interface zDehydratedSource extends z.infer<typeof DehydratedSourceZchema> {}

function _typeTestDehydratedSource(z: zDehydratedSource): DehydratedSource {
  return z;
}
function __typeTestDehydratedSource(z: DehydratedSource): zDehydratedSource {
  return z;
}

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
  z.interface({
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
  z.interface({
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

/** The Authorship object represents a single author and her institutional affiliations in the context of a given work */
interface Authorship {
  affiliation: {
    rawAffiliation: string;
    institutionIds: string[];
  }[];
  author: DehydratedAuthor;
  authorPosition: "first" | "last" | "middle";
  institutions: DehydratedInstitution[];
  // TODO: is name the same as author.displayName?
  rawAuthorName: string;
  isCorresponding: boolean;
}

const AuthorshipZchema = z.pipe(
  z.interface({
    affiliations: z.array(
      z.interface({
        raw_affiliation_string: z.string(),
        institution_ids: z.array(z.string()),
      }),
    ),
    author: DehydratedAuthorZchema,
    author_position: z.union([
      z.literal("first"),
      z.literal("last"),
      z.literal("middle"),
    ]),
    institutions: z.array(DehydratedInstitutionZchema),
    raw_author_name: z.string(),
    is_corresponding: z.boolean(),
  }),
  z.transform((data) => {
    return {
      affiliation: data.affiliations.map((aff) => ({
        rawAffiliation: aff.raw_affiliation_string,
        institutionIds: aff.institution_ids,
      })),
      author: data.author,
      authorPosition: data.author_position,
      institutions: data.institutions,
      rawAuthorName: data.raw_author_name,
      isCorresponding: data.is_corresponding,
    } as Authorship;
  }),
);

interface zAuthorship extends z.infer<typeof AuthorshipZchema> {}

function _typeTestAuthorship(z: zAuthorship): Authorship {
  return z;
}
function __typeTestAuthorship(z: Authorship): zAuthorship {
  return z;
}

/**
 * Locations are meant to cover anywhere that a given work can be found.
 * This can include journals, proceedings, institutional repositories, and subject-area repositories like arXiv and bioRxiv */
interface Location {
  isOA: boolean;
  /* `true` if this location's version is either acceptedVersion or publishedVersion; otherwise `false` */
  isAccepted: boolean;
  /* `true` if this location's version is the publishedVersion; otherwise `false` */
  isPublished: boolean;
  /** A URL where you can find the work at this location as a PDF */
  pdfUrl?: string;
  version?: "submittedVersion" | "acceptedVersion" | "publishedVersion";
  source: DehydratedSource;
}

const LocationZchema = z.pipe(
  z.interface({
    is_oa: z.boolean(),
    is_accepted: z.boolean(),
    is_published: z.boolean(),
    pdf_url: z.nullable(z.string()),
    version: z.nullable(z.union([
      z.literal("submittedVersion"),
      z.literal("acceptedVersion"),
      z.literal("publishedVersion"),
    ])),
    source: DehydratedSourceZchema,
  }),
  z.transform((data) => {
    return {
      isOA: data.is_oa,
      isAccepted: data.is_accepted,
      isPublished: data.is_published,
      pdfUrl: data.pdf_url ?? undefined,
      version: data.version ?? undefined,
      source: data.source,
    } as Location;
  }),
);

interface zLocation extends z.infer<typeof LocationZchema> {}

function _typeTestLocation(z: zLocation): Location {
  return z;
}
function __typeTestLocation(z: Location): zLocation {
  return z;
}

/** The {@link OpenAccess} object describes access options for a given work */
interface OpenAccess {
  isOA: boolean;
  status: "gold" | "green" | "bronze" | "closed" | "hybrid" | "diamond";
  url: string;
  anyRepositoryHasFulltext: boolean;
}

const OpenAccessZchema = z.pipe(
  z.interface({
    is_oa: z.boolean(),
    oa_status: z.union([
      z.literal("gold"),
      z.literal("green"),
      z.literal("bronze"),
      z.literal("closed"),
      z.literal("hybrid"),
      z.literal("diamond"),
    ]),
    oa_url: z.string(),
    any_repository_has_fulltext: z.boolean(),
  }),
  z.transform((data) => {
    return {
      isOA: data.is_oa,
      status: data.oa_status,
      url: data.oa_url,
      anyRepositoryHasFulltext: data.any_repository_has_fulltext,
    } as OpenAccess;
  }),
);

interface zOpenAccess extends z.infer<typeof OpenAccessZchema> {}

function _typeTestOpenAccess(z: zOpenAccess): OpenAccess {
  return z;
}
function __typeTestOpenAccess(z: OpenAccess): zOpenAccess {
  return z;
}

/** Concepts are abstract ideas that works are about. OpenAlex indexes about 65k concepts
 * The Canonical External ID for concepts is Wikidata ID. All concepts have a Wikidata ID.
 * The {@link DehydratedConcept} is stripped-down Concept
 */
interface DehydratedConcept {
  displayName: string;
  /** OpenAlex ID for this concept */
  id: string;
  /**
   * The level in the concept tree where this concept lives. Lower-level concepts are more general, and higher-level concepts are more specific.
   * Eg. Computer Science has a level of 0; Java Bytecode has a level of 5. Level 0 concepts have no ancestors and level 5 concepts have no descendants.
   */
  level: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * The Wikidata ID for this concept. This is the Canonical External ID for concepts
   */
  wikiDataId: string;
}

const DehydratedConceptZchema = z.pipe(
  z.interface({
    display_name: z.string(),
    id: z.string(),
    level: z.union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
    ]),
    wikidata: z.string(),
  }),
  z.transform((data) => {
    return {
      displayName: data.display_name,
      id: data.id,
      level: data.level,
      wikiDataId: data.wikidata,
    } as DehydratedConcept;
  }),
);

interface zDehydratedConcept extends z.infer<typeof DehydratedConceptZchema> {}

function _typeTestDehydratedConcept(z: zDehydratedConcept): DehydratedConcept {
  return z;
}
function __typeTestDehydratedConcept(z: DehydratedConcept): zDehydratedConcept {
  return z;
}

/**
 * OpenAlex Work object, this can represent an article, preprint, review, etc.
 * Offical OpenAlex Work object [doc](https://docs.openalex.org/api-entities/works/work-object)
 */
export interface Work {
  /** OpenAlex ID for this work */
  id: string;
  title: string;
  ids: {
    /** OpenAlex ID, same as `id` */
    openalex: string;
    doi?: string;
    /** PubMed ID */
    pmid?: string;
    /** PubMed Central ID */
    pmcid?: string;
    /** Microsoft Academic Graph ID */
    mag?: number;
  };
  indexedIn: "arxiv" | "pubmed" | "crossref" | "doaj"[];
  abztract?: string;

  /** List of `Authorship` objects, each representing an author and their institution.
   * Note: Limited to the first 100 authors, access the individual work directly */
  authorships?: Authorship[];
  /** Information about this work's APC ([article processing charge](https://en.wikipedia.org/wiki/Article_processing_charge))
   */
  apcList?: {
    value: number;
    currency: string;
    value_usd: number;
    provenance?: "doaj";
  };
  apcPaid?: {
    value: number;
    currency: string;
    value_usd: number;
    provenanve?: "doaj" | "openapc";
  };
  /** A Primary {@link Location} is where you can find the best (closest to the version of record) copy of this work */
  primaryLocation?: Location;
  /** Best OpenAccess {@link Location} location for this work */
  bestOaLocation?: Location;
  /** List of all {@link Location} objects, each representing a location where this lives*/
  locations: Location[];
  /** A {@link OpenAccess} object with info about access status of work */
  openAccess?: OpenAccess;
  publicationDate: Date;
  publicationYear: number;
  biblio?: {
    volume: string;
    issue?: string;
    firstPage: string;
    lastPage: string;
  };
  // TODO: consider merging fcwi and citationNormalizedPercentile
  /**
   * The Field-weighted Citation Impact (FWCI), calculated for a work as the ratio of citations received / citations expected in the year of publications and three following years
   */
  fwci: number;
  /**
   * The percentile of this work's citation count normalized by work type, publication year, and subfield
   */
  citationNormalizedPercentile: {
    /** This field represents the same information as the {@link fcwi} expressed as a percentile*/
    value: number;
    isInTop1Percent: boolean;
    isInTop10Percent: boolean;
  };
  citationCount: number;
  /** The number of citations received by this work in the last 10 years, and years with 0 citations are removed */
  citationCountByYear?: {
    year: number;
    count: number;
  }[];
  /** List of all Sustainable Development Goals (SDGs) with score more than 0.4*/
  sdg?: {
    id: string;
    name: string;
    score: number;
  }[];
  /** This does not necessarily mean that the full text is available; rather, it means it is fully indexed, powers searches.
   * If full text of the workis required, try {@link openAccess}'s url field */
  fullTextSeachable: boolean;

  /** List of {@link DehydratedConcept} objects, each representing a concept and its score
   * score represents the strength of the connection between the work and this concept
   */
  concepts?: ({ score: number } & DehydratedConcept)[];
}

export const WorkZchema = z.pipe(
  z.interface({
    id: z.string(),
    ids: z.interface({
      openalex: z.string(),
      doi: z.optional(z.string()),
      pmid: z.optional(z.string()),
      pmcid: z.optional(z.string()),
      mag: z.optional(z.coerce.number()),
    }),
    title: z.string(),
    indexed_in: z.array(
      z.union([
        z.literal("arxiv"),
        z.literal("pubmed"),
        z.literal("crossref"),
        z.literal("doaj"),
      ]),
    ),
    "abstract_inverted_index?": z.record(z.string(), z.array(z.number())),
    "authorships?": z.array(AuthorshipZchema),
    apc_list: z.optional(
      z.interface({
        value: z.number(),
        currency: z.string(),
        value_usd: z.number(),
        "provenance?": z.literal("doaj"),
      }),
    ),
    apc_paid: z.optional(
      z.interface({
        value: z.number(),
        currency: z.string(),
        value_usd: z.number(),
        "provenance?": z.union([
          z.literal("doaj"),
          z.literal("openapc"),
        ]),
      }),
    ),
    "primary_location?": LocationZchema,
    "best_oa_location?": LocationZchema,
    "locations?": z.array(LocationZchema),
    "open_access?": OpenAccessZchema,
    publication_date: z.string(),
    publication_year: z.number(),
    biblio: z.optional(
      z.interface({
        volume: z.string(),
        issue: z.nullable(z.string()),
        first_page: z.string(),
        last_page: z.string(),
      }),
    ),
    fwci: z.number(),
    citation_normalized_percentile: z.interface({
      value: z.number(),
      is_in_top_1_percent: z.boolean(),
      is_in_top_10_percent: z.boolean(),
    }),
    cited_by_count: z.number(),
    "citation_count_by_year?": z.array(
      z.interface({
        year: z.number(),
        count: z.number(),
      }),
    ),
    "sustainable_development_goals?": z.array(
      z.interface({
        id: z.string(),
        name: z.string(),
        score: z.number(),
      }),
    ),
    has_fulltext: z.boolean(),
    "concepts?": z.array(z.intersection(z.interface({ score: z.number() }), DehydratedConceptZchema)),
  }),
  z.transform((data) => {
    const inv_index = data.abstract_inverted_index ?? undefined;
    let abztract = undefined;
    if (inv_index) {
      abztract = Object.entries(inv_index).flatMap((
        [word, indices],
      ) => (indices.map((index) => ({ key: index, value: word })))).sort((a, b) => a.key - b.key).map((item) =>
        item.value
      ).join(" ").trim();
    }
    return {
      id: data.id,
      title: data.title,
      ids: data.ids,
      indexedIn: data.indexed_in,
      abztract: abztract ?? undefined,
      authorships: data.authorships ?? undefined,
      apcList: data.apc_list ?? undefined,
      apcPaid: data.apc_paid ?? undefined,
      primaryLocation: data.primary_location ?? undefined,
      bestOaLocation: data.best_oa_location ?? undefined,
      locations: data.locations ?? undefined,
      openAccess: data.open_access ?? undefined,
      publicationDate: new Date(data.publication_date),
      citationCount: data.cited_by_count,
      publicationYear: data.publication_year,
      biblio: data.biblio ?? undefined,
      fwci: data.fwci,
      citationNormalizedPercentile: {
        value: data.citation_normalized_percentile.value,
        isInTop1Percent: data.citation_normalized_percentile.is_in_top_1_percent,
        isInTop10Percent: data.citation_normalized_percentile.is_in_top_10_percent,
      },
      citationCountByYear: data["citation_count_by_year"] ?? undefined,
      sdg: data.sustainable_development_goals ?? undefined,
      fullTextSeachable: data.has_fulltext,
      concepts: data.concepts?.map((concept) => ({
        ...concept,
      })),
    } as Work;
  }),
);

export type ExcludeWorkField =
  | "abstract_inverted_index"
  | "authorships"
  | "apc_list"
  | "apc_paid"
  | "primary_location"
  | "best_oa_location"
  | "locations"
  | "open_access"
  | "biblio"
  | "counts_by_year"
  | "sustainable_development_goals"
  | "concepts";

type WorkField =
  | ExcludeWorkField
  | "id"
  | "ids"
  | "indexed_in"
  | "publication_date"
  | "publication_year"
  | "fwci"
  | "citation_normalized_percentile"
  | "cited_by_count"
  | "title"
  | "has_fulltext";

export const ALL_WORK_FIELDS: WorkField[] = [
  "id",
  "ids",
  "indexed_in",
  "abstract_inverted_index",
  "authorships",
  "apc_list",
  "apc_paid",
  "primary_location",
  "best_oa_location",
  "locations",
  "open_access",
  "publication_date",
  "publication_year",
  "biblio",
  "fwci",
  "citation_normalized_percentile",
  "cited_by_count",
  "counts_by_year",
  "sustainable_development_goals",
  "has_fulltext",
  "concepts",
  "title",
];

export function parseWork(data: unknown): [Work, undefined] | [undefined, Error] {
  const result = WorkZchema.safeParse(data);
  if (result.success) {
    return [result.data, undefined];
  } else {
    return [undefined, result.error];
  }
}
