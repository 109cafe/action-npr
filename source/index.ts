import { inspect } from "node:util";
import { debug, error, getBooleanInput, getInput, group, notice, setOutput } from "@actions/core";
import { PublishOptions, publish } from "libnpmpublish";
import { clean as cleanVersion, parse as parseVersion } from "semver";
import { getFirstPath, getVersionByGitState, setActionOutput } from "./action";
import { Manifest, readAll } from "./helpers";
import { NPM_COM_REGISTRY, buildMetaUrl, cleanManifest } from "./npm";
import { modifyTarball } from "./repack";

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
    return modifyTarball(tarballPath, {
      transformManifest: createPkgJsonTransformer({ name: inputs.name, version }),
    });
  });
  debug(`rawManifest: ${inspect(manifest, { compact: true, depth: Infinity })}`);

  const pkg = `${manifest.name}@${manifest.version}`;
  const version = parseVersion(manifest.version)!;

  const { publishConfig: _publishConfig } = manifest;
  const publishManifest = cleanManifest(manifest);

  const publishConfig: PublishOptions = {
    defaultTag: "latest",
    ..._publishConfig,
    registry: inputs.registry || _publishConfig?.registry || NPM_COM_REGISTRY,
    npmVersion: "action-npr/v1 (https://github.com/109cafe/action-npr)",
    provenance: inputs.provenance,
    forceAuth: { token },
  };
  publishManifest.tag =
    inputs.distTag || version.prerelease?.[0] || publishConfig.defaultTag || "latest";

  await group(`Publishing ${pkg} as ${publishManifest.tag}`, async () => {
    debug(`publishManifest: ${inspect(publishManifest, { compact: true, depth: Infinity })}`);
    await publish(publishManifest, await readAll(tarball), publishConfig);

    setActionOutput({
      name: publishManifest.name,
      version: publishManifest.version,
      tag: publishManifest.tag,
    });
    notice(
      `Package: ${pkg}
Dist Tag: ${publishManifest.tag}
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
