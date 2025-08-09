import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");
import denoJson from "../deno.json" with { type: "json" };
const { name, version, license } = denoJson;

await build({
  entryPoints: ["./lib/index.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  test: false,
  typeCheck: false,
  package: {
    name: name,
    version: version,
    description: "OpenAlex API client",
    license: license,
    keywords: ["openalex", "api"],
    repository: {
      "type": "git",
      "url": "git+https://github.com/adiSuper94/openalex-ts.git",
    },
    bugs: {
      "url": "https://github.com/adiSuper94/openalex-ts/issues",
    },
    homepage: "https://github.com/adiSuper94/openalex-ts#readme",
    author: "Aditya Subramanian",
    dependencies: {
      "zod": "^4.0.5",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
