import { test } from "node:test";
import assert from "node:assert";
import { type ExcludeWorkField, getWork, getWorks } from "../lib/index.js";
import { WorkFilter } from "../lib/types/work.js";

test("Get single work", async () => {
  const [work, err] = await getWork("W2741809807");
  assert.strictEqual(err, undefined);
  assert.strictEqual(work?.id, "https://openalex.org/W2741809807");
  const pubDate = work?.publicationDate;
  assert.strictEqual(pubDate instanceof Date, true);
  assert.strictEqual(pubDate?.getUTCFullYear(), 2018);
  assert.strictEqual(pubDate?.getUTCMonth(), 1);
  assert.strictEqual(pubDate?.getUTCDate(), 13);
});

test("Get single work, but exclude some fields", async () => {
  const excludedFields: ExcludeWorkField[] = ["abstract_inverted_index", "primary_location", "open_access", "concepts"];
  const [work, err] = await getWork("W2741809807", "openalex", excludedFields);
  assert.strictEqual(err, undefined);
  assert.strictEqual(work?.id, "https://openalex.org/W2741809807");
  const pubDate = work?.publicationDate;
  assert.strictEqual(pubDate instanceof Date, true);
  assert.strictEqual(pubDate?.getUTCFullYear(), 2018);
  assert.strictEqual(pubDate?.getUTCMonth(), 1);
  assert.strictEqual(pubDate?.getUTCDate(), 13);
  assert.strictEqual(work?.abztract, undefined);
  assert.strictEqual(work?.primaryLocation, undefined);
  assert.strictEqual(work?.openAccess, undefined);
  assert.strictEqual(work?.concepts, undefined);
});

test("Get all works by a specific author", async () => {
  const workFilter = new WorkFilter();
  workFilter.add("author.id", "A5023888391");
  const [works, err] = await getWorks(workFilter);
  assert.strictEqual(err, undefined);
  assert.strictEqual(Array.isArray(works), true);
  for (const work of works ?? []) {
    if (!work.authorships) throw new Error(`WorkId: ${work.id} does not have authorships`);
    const authorIds = work.authorships.map((authorship) => authorship.author.id);
    assert.ok(authorIds.includes("https://openalex.org/A5023888391"));
  }
});
