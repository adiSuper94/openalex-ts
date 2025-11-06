import * as z from "@zod/zod/mini";
import { type DehydratedAuthor, DehydratedAuthorZchema } from "./author.ts";
import { type DehydratedInstitution, DehydratedInstitutionZchema } from "./institution.ts";
import { type DehydratedSource, DehydratedSourceZchema } from "./source.ts";
import type { FilterValue, Operator } from "../filter.ts";
import { Filter } from "../filter.ts";

/**
 * Locations are meant to cover anywhere that a given work can be found.
 * This can include journals, proceedings, institutional repositories, and subject-area repositories like arXiv and bioRxiv */
interface Location {
  isOA: boolean;
  /* `true` if this location's version is either acceptedVersion or publishedVersion; otherwise `false` */
  isAccepted?: boolean;
  /* `true` if this location's version is the publishedVersion; otherwise `false` */
  isPublished?: boolean;
  /** A URL where you can find the work at this location as a PDF */
  pdfUrl?: string;
  version?: "submittedVersion" | "acceptedVersion" | "publishedVersion";
  source?: DehydratedSource;
}

const LocationZchema = z.pipe(
  z.object({
    is_oa: z.boolean(),
    is_accepted: z.optional(z.boolean()),
    is_published: z.optional(z.boolean()),
    pdf_url: z.nullable(z.string()),
    version: z.nullable(z.union([
      z.literal("submittedVersion"),
      z.literal("acceptedVersion"),
      z.literal("publishedVersion"),
    ])),
    source: z.nullable(DehydratedSourceZchema),
  }),
  z.transform((data) => {
    const location: Location = {
      isOA: data.is_oa,
    };
    if (data.is_accepted != null) {
      location.isAccepted = data.is_accepted;
    }
    if (data.is_published != null) {
      location.isPublished = data.is_published;
    }
    if (data.source) {
      location.source = data.source;
    }
    if (data.pdf_url) {
      location.pdfUrl = data.pdf_url;
    }
    if (data.version) {
      location.version = data.version;
    }
    return location;
  }),
);

interface zLocation extends z.infer<typeof LocationZchema> {}

function _typeTestLocation(z: zLocation): Location {
  return z;
}
function __typeTestLocation(z: Location): zLocation {
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
  z.object({
    affiliations: z.array(
      z.object({
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

/** The {@link OpenAccess} object describes access options for a given work */
interface OpenAccess {
  isOA: boolean;
  status: "gold" | "green" | "bronze" | "closed" | "hybrid" | "diamond";
  url?: string;
  anyRepositoryHasFulltext: boolean;
}

const OpenAccessZchema = z.pipe(
  z.object({
    is_oa: z.boolean(),
    oa_status: z.union([
      z.literal("gold"),
      z.literal("green"),
      z.literal("bronze"),
      z.literal("closed"),
      z.literal("hybrid"),
      z.literal("diamond"),
    ]),
    oa_url: z.nullish(z.string()),
    any_repository_has_fulltext: z.boolean(),
  }),
  z.transform((data) => {
    const oa: OpenAccess = {
      isOA: data.is_oa,
      status: data.oa_status,
      anyRepositoryHasFulltext: data.any_repository_has_fulltext,
    };

    if (data.oa_url) {
      oa.url = data.oa_url;
    }
    return oa;
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
  z.object({
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
  indexedIn: ("arxiv" | "pubmed" | "crossref" | "doaj" | "datacite")[];
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
  locations?: Location[];
  /** A {@link OpenAccess} object with info about access status of work */
  openAccess?: OpenAccess;
  publicationDate: Date;
  publicationYear: number;
  biblio?: {
    volume?: string;
    issue?: string;
    firstPage?: string;
    lastPage?: string;
  };
  // TODO: consider merging fcwi and citationNormalizedPercentile
  /**
   * The Field-weighted Citation Impact (FWCI), calculated for a work as the ratio of citations received / citations expected in the year of publications and three following years
   */
  fwci?: number;
  /**
   * The percentile of this work's citation count normalized by work type, publication year, and subfield
   */
  citationNormalizedPercentile?: {
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
    display_name: string;
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
  z.object({
    id: z.string(),
    ids: z.object({
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
        z.literal("datacite"),
      ]),
    ),
    abstract_inverted_index: z.nullish(z.record(z.string(), z.array(z.number()))),
    authorships: z.optional(z.array(AuthorshipZchema)),
    apc_list: z.nullish(
      z.object({
        value: z.number(),
        currency: z.string(),
        value_usd: z.number(),
        provenance: z.optional(z.literal("doaj")),
      }),
    ),
    apc_paid: z.nullish(
      z.object({
        value: z.number(),
        currency: z.string(),
        value_usd: z.number(),
        provenance: z.optional(z.union([
          z.literal("doaj"),
          z.literal("openapc"),
        ])),
      }),
    ),
    primary_location: z.nullish(LocationZchema),
    best_oa_location: z.nullish(LocationZchema),
    locations: z.optional(z.array(LocationZchema)),
    open_access: z.optional(OpenAccessZchema),
    publication_date: z.string(),
    publication_year: z.number(),
    biblio: z.optional(
      z.object({
        volume: z.nullable(z.string()),
        issue: z.nullable(z.string()),
        first_page: z.nullable(z.string()),
        last_page: z.nullable(z.string()),
      }),
    ),
    fwci: z.nullable(z.number()),
    citation_normalized_percentile: z.nullish(z.object({
      value: z.number(),
      is_in_top_1_percent: z.boolean(),
      is_in_top_10_percent: z.boolean(),
    })),
    cited_by_count: z.number(),
    citation_count_by_year: z.optional(z.array(
      z.object({
        year: z.number(),
        count: z.number(),
      }),
    )),
    sustainable_development_goals: z.optional(z.array(
      z.object({
        id: z.string(),
        display_name: z.string(),
        score: z.number(),
      }),
    )),
    has_fulltext: z.boolean(),
    concepts: z.optional(z.array(z.intersection(z.object({ score: z.number() }), DehydratedConceptZchema))),
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
    const work: Work = {
      id: data.id,
      title: data.title,
      ids: data.ids,
      indexedIn: data.indexed_in,
      authorships: data.authorships ?? undefined,
      locations: data.locations ?? undefined,
      openAccess: data.open_access ?? undefined,
      publicationDate: new Date(data.publication_date),
      citationCount: data.cited_by_count,
      publicationYear: data.publication_year,
      citationCountByYear: data["citation_count_by_year"] ?? undefined,
      sdg: data.sustainable_development_goals ?? undefined,
      fullTextSeachable: data.has_fulltext,
      concepts: data.concepts?.map((concept) => ({
        ...concept,
      })),
    };
    if (abztract) {
      work.abztract = abztract;
    }
    if (data.apc_list) {
      work.apcList = data.apc_list;
    }
    if (data.apc_paid) {
      work.apcPaid = data.apc_paid;
    }
    if (data.primary_location) {
      work.primaryLocation = data.primary_location;
    }
    if (data.best_oa_location) {
      work.bestOaLocation = data.best_oa_location;
    }
    if (data?.biblio?.volume) {
      work.biblio = work.biblio ?? {};
      work.biblio.volume = data.biblio.volume;
    }
    if (data?.biblio?.first_page) {
      work.biblio = work.biblio ?? {};
      work.biblio.firstPage = data.biblio.first_page;
    }
    if (data?.biblio?.last_page) {
      work.biblio = work.biblio ?? {};
      work.biblio.lastPage = data.biblio.last_page;
    }
    if (data?.biblio?.issue) {
      work.biblio = work.biblio ?? {};
      work.biblio.issue = data.biblio.issue;
    }
    if (data.fwci) {
      work.fwci = data.fwci;
    }
    if (data.citation_normalized_percentile) {
      work.citationNormalizedPercentile = {
        value: data.citation_normalized_percentile.value,
        isInTop1Percent: data.citation_normalized_percentile.is_in_top_1_percent,
        isInTop10Percent: data.citation_normalized_percentile.is_in_top_10_percent,
      };
    }
    return work;
  }),
);

type ExcludeWorkField =
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

type WorkStringFilterAttributes =
  | "authorships.affiliations.institution_ids"
  | "authorships.author.id"
  | "author.id"
  | "authorships.author.orcid"
  | "author.orcid"
  | "authorships.countries"
  | "authorships.institutions.country_code"
  | "institutions.country_code"
  | "authorships.institutions.id"
  | "institutions.id"
  | "authorships.institutions.lineage"
  | "authorships.institutions.ror"
  | "institutions.ror"
  | "authorships.institutions.type"
  | "apc_list.currency"
  | "apc_list.provenance"
  | "apc_paid.currency"
  | "apc_paid.provenance"
  | "best_oa_location.license"
  | "best_oa_location.source.id"
  | "best_oa_location.source.issn"
  | "best_oa_location.source.type"
  | "best_oa_location.source.host_organization"
  | "best_oa_location.version"
  | "biblio.issue"
  | "biblio.last_page"
  | "biblio.volume"
  | "biblio.first_page"
  | "concepts.id"
  | "concept.id"
  | "concepts.wikidata"
  | "corresponding_author_ids"
  | "corresponding_institution_ids"
  | "doi"
  | "fulltext_origin"
  | "grants.award_id"
  | "grants.funder"
  | "ids.pmcid"
  | "ids.pmid"
  | "ids.openalex"
  | "ids.mag"
  | "indexed_in"
  | "keywords.keyword"
  | "language"
  | "locations.source.issn"
  | "locations.source.id"
  | "locations.source.host_organization"
  | "locations.source.type"
  | "locations.version"
  | "open_access.oa_status"
  | "oa_status"
  | "primary_location.source.id"
  | "primary_location.license"
  | "primary_location.source.issn"
  | "primary_location.source.host_organization"
  | "primary_location.source.type"
  | "primary_location.version"
  | "primary_topic.id"
  | "primary_topic.domain.id"
  | "primary_topic.field.id"
  | "primary_topic.subfield.id"
  | "sustainable_development_goals.id"
  | "topics.id"
  | "topics.domain.id"
  | "topics.field.id"
  | "topics.subfield.id"
  | "type"
  | "type_crossref"
  | "publication_date";

type WorkNumberFilterAttributes =
  | "apc_list.value"
  | "apc_list.value_usd"
  | "apc_paid.value"
  | "apc_paid.value_usd"
  | "cited_by_count"
  | "countries_distinct_count"
  | "fwci"
  | "institutions_distinct_count"
  | "locations_count"
  | "publication_year";

type WorkBooleanFilterAttributes =
  | "authorships.is_corresponding"
  | "is_corresponding"
  | "best_oa_location.is_accepted"
  | "best_oa_location.is_published"
  | "best_oa_location.source.is_in_doaj"
  | "has_fulltext"
  | "is_paratext"
  | "is_retracted"
  | "locations.is_accepted"
  | "locations.is_oa"
  | "locations.is_published"
  | "locations.license"
  | "locations.source.is_core"
  | "locations.source.is_in_doaj"
  | "open_access.any_repository_has_fulltext"
  | "open_access.is_oa"
  | "is_oa"
  | "primary_location.is_accepted"
  | "primary_location.is_oa"
  | "primary_location.is_published"
  | "primary_location.source.is_core"
  | "primary_location.source.is_in_doaj";

type WorkFilterAttributes =
  | WorkStringFilterAttributes
  | WorkNumberFilterAttributes
  | WorkBooleanFilterAttributes;

export class WorkFilter extends Filter {
  override add(field: WorkStringFilterAttributes, value: string | string[], operator?: Operator): this;
  override add(field: WorkNumberFilterAttributes, value: number | number[], operator?: Operator): this;
  override add(field: WorkBooleanFilterAttributes, value: boolean | boolean[], operator?: Operator): this;

  override add(field: WorkFilterAttributes, value: FilterValue | FilterValue[], operator: Operator = ""): this {
    return super.add(field, value, operator);
  }
}

export type {
  ExcludeWorkField,
  WorkBooleanFilterAttributes,
  WorkFilterAttributes,
  WorkNumberFilterAttributes,
  WorkStringFilterAttributes,
};
