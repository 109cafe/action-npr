import { createRequire } from "node:module";
import { relative } from "node:path";
const { default: resolver } = await import("enhanced-resolve");
const resolve = resolver.create.sync({
  conditionNames: ["node", "import", "require"],
  mainFields: ["module", "main"],
});

const require = createRequire(import.meta.url);
/** @type {Array<import('prebundle').Config['dependencies'][number]>} */
const TypeMagic = [];
const config = /** @type {import('prebundle').Config} */ ({
  prettier: true,

  dependencies: TypeMagic.concat([
    { name: "cacache", packageJsonField: ["cache-version"] },
    { name: "tar" },
    { name: "semver", ignoreDts: true },
    { name: "@actions/core" },
    { name: "@actions/glob" },
    {
      name: "@sindresorhus/slugify",
    },
    { name: "libnpmpublish", ignoreDts: true },
  ]),
});

let dependencies = config.dependencies.map((dep) => {
  dep = typeof dep === "string" ? { name: dep } : dep;
  return {
    target: "",
    ...dep,
    entry: dep.entry || resolve(process.cwd(), dep.name),
  };
});
dependencies = dependencies.map((dep) => {
  const { name } = dep;
  const externals = dependencies.reduce((acc, dep) => {
    const target = dep.name;
    if (target === name) {
      return acc;
    }

    acc[target] = relative(`/${name}`, `/${target}/index.js`);
    return acc;
  }, {});
  dep.externals = {
    ...externals,
    ...dep.externals,
  };
  return dep;
});

config.dependencies = dependencies;

export default config;
