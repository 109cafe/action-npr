import { mkdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, relative, resolve } from "node:path";
import prebundleConfig from "./prebundle.config.mjs";

const require = createRequire(import.meta.url);
const prebundleScope = createRequire(require.resolve("prebundle"));
const { default: ncc } = await import(prebundleScope.resolve("@vercel/ncc"));
const { default: prettier } = await import(prebundleScope.resolve("prettier"));
const { default: terser } = await import(prebundleScope.resolve("terser"));

const DIST = resolve(import.meta.dirname, "dist");
const MAIN_FILE = resolve(DIST, "index.js");
const COMPILED = resolve(import.meta.dirname, "compiled");

const externals = prebundleConfig.dependencies.reduce((acc, dep) => {
  const name = typeof dep === "string" ? dep : dep.name;

  acc[name] = relative(dirname(MAIN_FILE), resolve(COMPILED, `${name}/index.js`));
  return acc;
}, {});
const { code, assets } = await ncc(resolve(import.meta.dirname, "./source/index.ts"), {
  cache: false,
  externals,
  transpileOnly: true,
});

await rm(DIST, { force: true, recursive: true });
await mkdir(DIST, { recursive: true });

assets["index.js"] = { source: code };

for (const [filename, asset] of Object.entries(assets)) {
  const fp = resolve(DIST, filename);

  if (filename === "index.js") {
    asset.source = asset.source.toString("utf8");
    asset.source = (
      await terser.minify(asset.source, {
        module: true,
        compress: false,
        mangle: false,
        ecma: 2022,
      })
    ).code;
    asset.source = await prettier.format(asset.source, { filepath: fp });
  }
  let permission = asset.permission || 0o644;
  permission = permission ^ (permission & 0o022);
  await mkdir(dirname(fp), { recursive: true });
  await writeFile(fp, asset.source, { mode: permission });
}
