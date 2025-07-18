import * as z from "zod/mini";

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
  z.object({
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

export type { DehydratedSource, zDehydratedSource };
export { DehydratedSourceZchema };
