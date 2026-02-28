import { test } from "node:test";
import assert from "node:assert";
import { type ExcludeAuthorFields, getAuthor } from "../lib/index.js";

test("Get single author", async () => {
  const [author, err] = await getAuthor("A5023888391");
  assert.strictEqual(err, undefined);
  assert.strictEqual(author?.id, "https://openalex.org/A5023888391");
  const pubDate = author?.createdDate;
  assert.strictEqual(pubDate instanceof Date, true);
  assert.strictEqual(pubDate?.getUTCFullYear(), 2016);
  assert.strictEqual(pubDate?.getUTCMonth(), 5);
  assert.strictEqual(pubDate?.getUTCDate(), 24);
});

test("Get single author, but exclude some fields", async () => {
  const excludedFields: ExcludeAuthorFields[] = ["affiliations", "summary_stats", "last_known_institutions"];
  const [author, err] = await getAuthor("A5023888391", "openalex", excludedFields);
  assert.strictEqual(err, undefined);
  assert.strictEqual(author?.id, "https://openalex.org/A5023888391");
  const pubDate = author?.createdDate;
  assert.strictEqual(pubDate instanceof Date, true);
  assert.strictEqual(pubDate?.getUTCFullYear(), 2016);
  assert.strictEqual(pubDate?.getUTCMonth(), 5);
  assert.strictEqual(pubDate?.getUTCDate(), 24);
  assert.strictEqual(author?.affiliations, undefined);
  assert.strictEqual(author?.summaryStats, undefined);
  assert.strictEqual(author?.lastKnownInstitutions, undefined);
});
