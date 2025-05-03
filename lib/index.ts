import { ALL_WORK_FIELDS, type ExcludeWorkField, parseWork, type Work } from "./types/work.ts";

export type WorkIdType = "doi" | "mag" | "pmid" | "pmcid" | "openalex";

export async function getWork(
  wordId: string,
  workIdType: WorkIdType = "openalex",
  excludedFields: ExcludeWorkField[] = [],
): Promise<[Work, undefined] | [undefined, Error]> {
  switch (workIdType) {
    case "doi":
      wordId = `doi:${wordId}`;
      break;
    case "mag":
      wordId = `mag:${wordId}`;
      break;
    case "pmid":
      wordId = `pmid:${wordId}`;
      break;
    case "pmcid":
      wordId = `pmcid:${wordId}`;
      break;
    case "openalex":
      break;
    default:
  }
  let selectQuery = "";
  const excludedFieldsSet = new Set(excludedFields);
  const selectedFields = ALL_WORK_FIELDS.filter((field) => !excludedFieldsSet.has(field as ExcludeWorkField));
  selectQuery = `?select=${selectedFields.map((field) => encodeURIComponent(field)).join(",")}`;
  const response = await fetch(`https://api.openalex.org/works/${wordId}${selectQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    return [
      undefined,
      new Error(`Failed to fetch work with ID ${wordId}: ${response.statusText}`, { cause: response }),
    ];
  }
  const result = await response.json();
  return parseWork(result);
}

export type { ExcludeWorkField };
