import { assertEquals } from "@std/assert";
import { type ExcludeAuthorFields, getAuthor } from "../lib/index.ts";

Deno.test("Get single author", async () => {
  const [author, err] = await getAuthor("A5023888391");
  assertEquals(err, undefined);
  assertEquals(author?.id, "https://openalex.org/A5023888391");
  const pubDate = author?.createdDate;
  assertEquals(pubDate instanceof Date, true);
  assertEquals(pubDate?.getUTCFullYear(), 2016);
  assertEquals(pubDate?.getUTCMonth(), 5);
  assertEquals(pubDate?.getUTCDate(), 24);
});

Deno.test("Get single author, but exclude some fields", async () => {
  const excludedFields: ExcludeAuthorFields[] = ["affiliations", "summary_stats", "last_known_institutions"];
  const [author, err] = await getAuthor("A5023888391", "openalex", excludedFields);
  assertEquals(err, undefined);
  assertEquals(author?.id, "https://openalex.org/A5023888391");
  const pubDate = author?.createdDate;
  assertEquals(pubDate instanceof Date, true);
  assertEquals(pubDate?.getUTCFullYear(), 2016);
  assertEquals(pubDate?.getUTCMonth(), 5);
  assertEquals(pubDate?.getUTCDate(), 24);
  assertEquals(author?.affiliations, undefined);
  assertEquals(author?.summaryStats, undefined);
  assertEquals(author?.lastKnownInstitutions, undefined);
});
