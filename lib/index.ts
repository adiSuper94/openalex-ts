import { ALL_WORK_FIELDS, type ExcludeWorkField, parseWork, type Work } from "./types/work.ts";
import { ALL_AUTHOR_FIELDS, type Author, type ExcludeAuthorFields, parseAuthor } from "./types/author.ts";

export type WorkIdType = "doi" | "mag" | "pmid" | "pmcid" | "openalex";

export async function getWork(
  workId: string,
  workIdType: WorkIdType = "openalex",
  excludedFields: ExcludeWorkField[] = [],
): Promise<[Work, undefined] | [undefined, Error]> {
  switch (workIdType) {
    case "doi":
      workId = `doi:${workId}`;
      break;
    case "mag":
      workId = `mag:${workId}`;
      break;
    case "pmid":
      workId = `pmid:${workId}`;
      break;
    case "pmcid":
      workId = `pmcid:${workId}`;
      break;
    case "openalex":
      break;
    default:
      return [
        undefined,
        new Error(`Invalid work ID type: ${workIdType}. Valid types are: doi, mag, pmid, pmcid, openalex.`),
      ];
  }
  let selectQuery = "";
  const excludedFieldsSet = new Set(excludedFields);
  const selectedFields = ALL_WORK_FIELDS.filter((field) => !excludedFieldsSet.has(field as ExcludeWorkField));
  selectQuery = `?select=${selectedFields.map((field) => encodeURIComponent(field)).join(",")}`;
  const response = await fetch(`https://api.openalex.org/works/${workId}${selectQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    return [
      undefined,
      new Error(`Failed to fetch work with ID ${workId}: ${response.statusText}`, { cause: response }),
    ];
  }
  const result = await response.json();
  return parseWork(result);
}

export type AuthorIdType = "orcid" | "openalex" | "scopus" | "wikipedia" | "twitter";
export async function getAuthor(
  authorId: string,
  authorIdType: AuthorIdType = "openalex",
  excludedFields: ExcludeAuthorFields[] = [],
): Promise<[Author, undefined] | [undefined, Error]> {
  switch (authorIdType) {
    case "orcid":
      authorId = `orcid:${authorId}`;
      break;
    case "scopus":
      authorId = `scopus:${authorId}`;
      break;
    case "wikipedia":
      authorId = `wikipedia:${authorId}`;
      break;
    case "twitter":
      authorId = `twitter:${authorId}`;
      break;
    case "openalex":
      break;
    default:
      return [
        undefined,
        new Error(
          `Invalid author ID type: ${authorIdType}. Valid types are: orcid, openalex, scopus, wikipedia, twitter.`,
        ),
      ];
  }
  let selectQuery = "";
  const excludedFieldsSet = new Set(excludedFields);
  const selectedFields = ALL_AUTHOR_FIELDS.filter((field) => !excludedFieldsSet.has(field as ExcludeAuthorFields));
  selectQuery = `?select=${selectedFields.map((field) => encodeURIComponent(field)).join(",")}`;
  const response = await fetch(`https://api.openalex.org/authors/${authorId}${selectQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    return [
      undefined,
      new Error(`Failed to fetch works for author with ID ${authorId}: ${response.statusText}`, { cause: response }),
    ];
  }
  const result = await response.json();
  return parseAuthor(result);
}

export type { ExcludeAuthorFields, ExcludeWorkField };
