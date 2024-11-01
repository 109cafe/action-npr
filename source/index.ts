import { inspect } from "node:util";
import { debug, error, getBooleanInput, getInput, group, notice } from "@actions/core";
import { type PublishOptions, publish } from "libnpmpublish";
import { clean as cleanVersion, parse as parseVersion } from "semver";
import { getFirstPath, getVersionByGitState, setActionOutput } from "./action";
import { type Manifest, NPM_COM_REGISTRY, buildMetaUrl, cleanManifest } from "./npm";
import { repack } from "./repack";

async function run() {
  const inputs = {
    name: getInput("name"),
    version: getInput("version") || getVersionByGitState(),
    tarball: getInput("tarball", { required: true }),
    registry: getInput("registry"),
    distTag: getInput("dist-tag"),
    provenance: getBooleanInput("provenance"),
  };
  const token = getInput("token", { required: true });
  const tarballPath = await getFirstPath(inputs.tarball);

  const { tarball, manifest } = await group(`Repacking tarball ${tarballPath}`, async () => {
    const version = cleanVersion(inputs.version || "") || undefined;
    return repack(tarballPath, {
      manifest: createPkgJsonTransformer({ name: inputs.name, version }),
    });
  });
  debug(`rawManifest: ${inspect(manifest, { compact: true, depth: Infinity })}`);

  const pkg = `${manifest.name}@${manifest.version}`;
  const version = parseVersion(manifest.version)!;

  const { publishConfig: _publishConfig } = manifest;
  const publishManifest = cleanManifest(manifest);
  const tag = `${inputs.distTag || version.prerelease?.[0] || _publishConfig?.tag || _publishConfig?.defaultTag || "latest"}`;

  const publishConfig: PublishOptions = {
    ..._publishConfig,
    defaultTag: tag,
    registry: inputs.registry || _publishConfig?.registry || NPM_COM_REGISTRY,
    npmVersion: "action-npr/v1 (https://github.com/109cafe/action-npr)",
    provenance: inputs.provenance,
    forceAuth: { token },
  };

  await group(`Publishing ${pkg} as ${tag}`, async () => {
    debug(`publishManifest: ${inspect(publishManifest, { compact: true, depth: Infinity })}`);
    await publish(publishManifest, tarball, publishConfig);

    setActionOutput({
      name: publishManifest.name,
      version: publishManifest.version,
      tag,
    });
    notice(
      `Package: ${pkg}
Dist Tag: ${tag}
Meta: ${buildMetaUrl({ name: publishManifest.name, version: publishManifest.version, registry: publishConfig.registry })}`,
      { title: `${pkg} published` }
    );
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
