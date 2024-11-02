import { inspect } from "node:util";
import { error, group, info, summary } from "@actions/core";
import { type PublishOptions, publish } from "libnpmpublish";
import { clean as cleanVersion, parse as parseVersion } from "semver";
import {
  addRepoInfoToManifest,
  getFirstPath,
  getVersionByGitState,
  parseActionInput,
  setActionOutput,
} from "./action";
import { type Manifest, NPM_COM_REGISTRY, buildMetaUrl, buildWebUrl, cleanManifest } from "./npm";
import { repack } from "./repack";

async function run() {
  const { token, ...inputs } = parseActionInput();
  const tarballPath = await getFirstPath(inputs.tarball);

  const { tarball, manifest } = await group(`Repacking tarball ${tarballPath}`, async () => {
    const version =
      cleanVersion(inputs.version || (await getVersionByGitState()) || "") || undefined;
    const p = await repack(tarballPath, {
      manifest: createPkgJsonTransformer({ name: inputs.name, version }),
    });

    info(`Repacked: ${inspect(p.manifest, { compact: true, depth: Infinity })}`);

    return p;
  });

  const pkg = `${manifest.name}@${manifest.version}`;
  const version = parseVersion(manifest.version)!;

  const { publishConfig: _publishConfig } = manifest;
  const publishManifest = cleanManifest(manifest);
  const tag = `${inputs.distTag || version.prerelease?.[0] || _publishConfig?.tag || _publishConfig?.defaultTag || "latest"}`;
  if (inputs.useRepoInfo) {
    addRepoInfoToManifest(publishManifest);
  }

  const publishConfig: PublishOptions = {
    ..._publishConfig,
    defaultTag: tag,
    registry: inputs.registry || (_publishConfig?.registry as string) || NPM_COM_REGISTRY,
    npmVersion: `action-npr/v1 (+https://github.com/${process.env.GITHUB_ACTION_REPOSITORY || "109cafe/action-npr"})`,
    provenance: inputs.provenance,
    forceAuth: { token },
  };

  await group(`Publishing ${pkg} as ${tag}`, async () => {
    info(`Manifest: ${inspect(publishManifest, { compact: true, depth: Infinity })}`);
    await publish(publishManifest, tarball, publishConfig);

    setActionOutput({
      name: publishManifest.name,
      version: publishManifest.version,
      tag,
    });

    summary.addHeading(`${pkg} published`);

    const metaUrl = buildMetaUrl({
      name: publishManifest.name,
      version: publishManifest.version,
      registry: publishConfig.registry,
    });
    const webUrl = buildWebUrl({
      name: publishManifest.name,
      version: publishManifest.version,
    });
    summary.addRaw(`<p><b>Package: </b><code>${pkg}</code></p>
<p><b>Dist Tag: </b><code>${tag}</code></p>
<p><b>Meta Url: </b><a href="${metaUrl}" target="_blank">${metaUrl}</a></p>
<p><b>Web Url: </b><a href="${webUrl}" target="_blank">${webUrl}</a></p>
`);
    summary.addCodeBlock(`npm i ${pkg}`, "shell");
    summary.addCodeBlock(`pnpm add ${pkg}`, "shell");
    summary.addCodeBlock(`yarn add ${pkg}`, "shell");
    summary.addCodeBlock(`bun add ${pkg}`, "shell");
    try {
      await summary.write({});
    } catch {}
  });
}

run().then(null, (err) => {
  error(err, { title: "Failed running action-npr" });
  throw err;
});

function createPkgJsonTransformer(opts: { name?: string; version?: string }) {
  return (_json: Manifest) => {
    const json = { ..._json };
    if (opts.name) {
      json.name = opts.name;
    }
    if (opts.version) {
      json.version = opts.version;
    }
    return json;
  };
}
