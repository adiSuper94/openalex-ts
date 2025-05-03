import { assertEquals } from "@std/assert";
import { type ExcludeWorkField, getWork } from "../lib/index.ts";

Deno.test("Get single work", async () => {
  const [work, err] = await getWork("W2741809807");
  assertEquals(err, undefined);
  assertEquals(work?.id, "https://openalex.org/W2741809807");
  const pubDate = work?.publicationDate;
  assertEquals(pubDate instanceof Date, true);
  assertEquals(pubDate?.getFullYear(), 2018);
  assertEquals(pubDate?.getMonth(), 1);
  assertEquals(pubDate?.getDate(), 12);
});

Deno.test("Get single work, but exclude some fields", async () => {
  const excludedFields: ExcludeWorkField[] = ["abstract_inverted_index", "primary_location", "open_access", "concepts"];
  const [work, err] = await getWork("W2741809807", "openalex", excludedFields);
  assertEquals(err, undefined);
  assertEquals(work?.id, "https://openalex.org/W2741809807");
  const pubDate = work?.publicationDate;
  assertEquals(pubDate instanceof Date, true);
  assertEquals(pubDate?.getFullYear(), 2018);
  assertEquals(pubDate?.getMonth(), 1);
  assertEquals(pubDate?.getDate(), 12);
  assertEquals(work?.abztract, undefined);
  assertEquals(work?.primaryLocation, undefined);
  assertEquals(work?.openAccess, undefined);
  assertEquals(work?.concepts, undefined);
});
