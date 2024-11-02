import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__ from "../compiled/@actions/core/index.js";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_libnpmpublish_index_js_08dcac83__ from "../compiled/libnpmpublish/index.js";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_semver_index_js_c76cd1cc__ from "../compiled/semver/index.js";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_actions_glob_index_js_3c1cb002__ from "../compiled/@actions/glob/index.js";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_sindresorhus_slugify_index_js_2f927c69__ from "../compiled/@sindresorhus/slugify/index.js";
import * as __WEBPACK_EXTERNAL_MODULE__compiled_tar_index_js_c91d939d__ from "../compiled/tar/index.js";
var __nccwpck_require__ = {};
(() => {
  __nccwpck_require__.n = (module) => {
    var getter =
      module && module.__esModule ? () => module["default"] : () => module;
    __nccwpck_require__.d(getter, { a: getter });
    return getter;
  };
})();
(() => {
  __nccwpck_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (
        __nccwpck_require__.o(definition, key) &&
        !__nccwpck_require__.o(exports, key)
      ) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key],
        });
      }
    }
  };
})();
(() => {
  __nccwpck_require__.o = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
})();
if (typeof __nccwpck_require__ !== "undefined")
  __nccwpck_require__.ab =
    new URL(".", import.meta.url).pathname.slice(
      import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0,
      -1,
    ) + "/";
var __webpack_exports__ = {};
const external_node_util_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:util");
var x = (y) => {
  var x = {};
  __nccwpck_require__.d(x, y);
  return x;
};
var y = (x) => () => x;
const index_js_namespaceObject = x({
  ["error"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__.error,
  ["getBooleanInput"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__.getBooleanInput,
  ["getInput"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__.getInput,
  ["group"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__.group,
  ["info"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__.info,
  ["notice"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__.notice,
  ["setOutput"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_core_index_js_9bb3e6a1__.setOutput,
});
var index_js_x = (y) => {
  var x = {};
  __nccwpck_require__.d(x, y);
  return x;
};
var index_js_y = (x) => () => x;
const libnpmpublish_index_js_namespaceObject = index_js_x({
  ["publish"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_libnpmpublish_index_js_08dcac83__.publish,
});
var semver_index_js_x = (y) => {
  var x = {};
  __nccwpck_require__.d(x, y);
  return x;
};
var semver_index_js_y = (x) => () => x;
const semver_index_js_namespaceObject = semver_index_js_x({
  ["clean"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_semver_index_js_c76cd1cc__.clean,
  ["parse"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_semver_index_js_c76cd1cc__.parse,
});
const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:path");
var external_node_path_default = __nccwpck_require__.n(
  external_node_path_namespaceObject,
);
var glob_index_js_x = (y) => {
  var x = {};
  __nccwpck_require__.d(x, y);
  return x;
};
var glob_index_js_y = (x) => () => x;
const glob_index_js_namespaceObject = glob_index_js_x({
  ["create"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_actions_glob_index_js_3c1cb002__.create,
});
var slugify_index_js_x = (y) => {
  var x = {};
  __nccwpck_require__.d(x, y);
  return x;
};
var slugify_index_js_y = (x) => () => x;
const slugify_index_js_namespaceObject = slugify_index_js_x({
  ["default"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_sindresorhus_slugify_index_js_2f927c69__[
      "default"
    ],
});
const external_node_child_process_namespaceObject =
  __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:child_process");
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:fs");
const external_node_stream_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:stream");
const web_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)(
  "node:stream/web",
);
function toReadableStream(pass) {
  if (pass instanceof external_node_stream_namespaceObject.Readable) {
    return external_node_stream_namespaceObject.Readable.toWeb(pass);
  } else if (pass instanceof external_node_stream_namespaceObject.PassThrough) {
    return external_node_stream_namespaceObject.Readable.toWeb(pass);
  } else {
    const passThrough = new external_node_stream_namespaceObject.PassThrough();
    pass.pipe(passThrough);
    return external_node_stream_namespaceObject.Readable.toWeb(passThrough);
  }
}
function toWriteableStream(pass) {
  if (pass instanceof external_node_stream_namespaceObject.Writable) {
    return external_node_stream_namespaceObject.Writable.toWeb(pass);
  } else if (pass instanceof external_node_stream_namespaceObject.PassThrough) {
    return external_node_stream_namespaceObject.Writable.toWeb(pass);
  } else {
    const passThrough = new external_node_stream_namespaceObject.PassThrough();
    passThrough.pipe(pass);
    return external_node_stream_namespaceObject.Writable.toWeb(passThrough);
  }
}
function unstream(transform) {
  let all = [];
  return new web_namespaceObject.TransformStream({
    transform(chunk) {
      all.push(chunk);
    },
    async flush(controller) {
      const blob = new Blob(all);
      all = [];
      const fin = await transform(blob);
      controller.enqueue(fin);
    },
  });
}
function unstreamText(transform) {
  return unstream(async (blob) => {
    const text = new TextDecoder().decode(await blob.arrayBuffer());
    return new TextEncoder().encode(await transform(text));
  });
}
function bufferToReadable(buffer) {
  return new web_namespaceObject.ReadableStream({
    pull(controller) {
      controller.enqueue(buffer);
      controller.close();
    },
  });
}
async function readableToBuffer(readable) {
  const reader = readable.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
function createReadable(filePathOrBuffer) {
  return typeof filePathOrBuffer === "string"
    ? external_node_stream_namespaceObject.Readable.toWeb(
        (0, external_node_fs_namespaceObject.createReadStream)(
          filePathOrBuffer,
        ),
      )
    : bufferToReadable(filePathOrBuffer);
}
class NonZeroExitError extends Error {
  code;
  constructor(code, message) {
    super(message ?? `Process exited with code ${code}`);
    this.code = code;
  }
}
function awaitChildProcess(cp, encoding) {
  const _encoding = encoding === undefined ? "utf8" : encoding;
  return new Promise((resolve, reject) => {
    const p = cp.stdout
      ? readableToBuffer(toReadableStream(cp.stdout)).then((b) =>
          _encoding ? b.toString(_encoding) : b,
        )
      : cp.stdout;
    cp.once("error", reject);
    cp.once("exit", (code) => {
      if (!code) {
        resolve(p);
      } else {
        reject(new NonZeroExitError(code));
      }
    });
  });
}
function dirtyTimestampToDate(ts, ratio = 1) {
  if (!ts) {
    return null;
  }
  const d = new Date(Number(ts) * ratio);
  if (d.getTime()) {
    return d;
  }
  return null;
}
function toYMDHMS(date) {
  return date
    .toISOString()
    .replace(/\..+$/, "")
    .replace(/[^0-9]/g, "");
}
async function destructPromise(promise) {
  try {
    const data = await promise;
    return [true, data];
  } catch (e) {
    return [false, e];
  }
}
async function getCommitTime(commit = "HEAD") {
  const s = await awaitChildProcess(
    (0, external_node_child_process_namespaceObject.spawn)(
      "git",
      ["show", "-s", "--format=%ct", commit],
      { shell: true },
    ),
  );
  return dirtyTimestampToDate(s);
}
function parseActionInput() {
  const inputs = {
    name: (0, index_js_namespaceObject.getInput)("name"),
    version: (0, index_js_namespaceObject.getInput)("version"),
    tarball: (0, index_js_namespaceObject.getInput)("tarball", {
      required: true,
    }),
    registry: (0, index_js_namespaceObject.getInput)("registry"),
    distTag: (0, index_js_namespaceObject.getInput)("dist-tag"),
    provenance: (0, index_js_namespaceObject.getBooleanInput)("provenance"),
    useRepoInfo: (0, index_js_namespaceObject.getBooleanInput)("use-repo-info"),
    token: (0, index_js_namespaceObject.getInput)("token", { required: true }),
  };
  return inputs;
}
async function getFirstPath(globInput) {
  const globber = await (0, glob_index_js_namespaceObject.create)(
    globInput,
    {},
  );
  const path = (await globber.globGenerator().next()).value;
  const relativePath = external_node_path_default().relative(
    process.cwd(),
    path,
  );
  return relativePath.startsWith("..") ? path : relativePath;
}
function setActionOutput(output) {
  for (const [key, value] of Object.entries(output)) {
    (0, index_js_namespaceObject.setOutput)(key, value);
  }
}
async function getIncrementalVersionPart() {
  if (process.env.GITHUB_RUN_ID) {
    return Number(process.env.GITHUB_RUN_ID) - 11643703879;
  } else {
    const [ok, time] = await destructPromise(
      getCommitTime(process.env.GITHUB_SHA ?? "HEAD"),
    );
    if (ok && time) {
      return toYMDHMS(time);
    }
  }
}
async function getVersionByGitState() {
  if (process.env.GITHUB_REF_TYPE === "tag") {
    const maybeVersion = process.env.GITHUB_REF_NAME.split("@").pop();
    return (0, semver_index_js_namespaceObject.clean)(maybeVersion);
  }
  const ref = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
  const slug = (0, slugify_index_js_namespaceObject["default"])(ref);
  const incremental =
    (await getIncrementalVersionPart()) || toYMDHMS(new Date());
  const ver = `0.0.0-${slug.slice(0, 20)}.${incremental}`;
  if (process.env.GITHUB_SHA) {
    return `${ver}+${process.env.GITHUB_SHA.slice(0, 8)}`;
  } else {
    return ver;
  }
}
function addRepoInfoToManifest(manifest) {
  const gh = getGithubRepoInfo();
  if (!manifest.repository) {
    manifest.repository = { type: "git", url: gh.gitRepo };
  } else if (typeof manifest.repository !== "string") {
    if (!manifest.repository.url) {
      manifest.repository.url = gh.gitRepo;
      manifest.repository.type = "git";
    }
  }
  if (!manifest.homepage) {
    manifest.homepage = gh.homepage;
  }
  if (!manifest.bugs) {
    manifest.bugs = gh.bugs;
  } else if (typeof manifest.bugs !== "string") {
    if (!manifest.bugs.url) {
      manifest.bugs.url = gh.bugs;
    }
  }
  if (!manifest.gitHead) {
    manifest.gitHead = process.env.GITHUB_SHA;
  }
}
function getGithubRepoInfo() {
  const server = process.env.GITHUB_SERVER_URL || "https://github.com";
  const homepageUrl = new URL(process.env.GITHUB_REPOSITORY, server);
  return {
    homepage: homepageUrl.href,
    gitRepo: `git+${homepageUrl.href}.git`,
    bugs: `${homepageUrl.href}/issues`,
  };
}
const NPM_COM_REGISTRY = "https://registry.npmjs.org";
function buildMetaUrl(opts) {
  const { name, version, registry = NPM_COM_REGISTRY } = opts;
  const u = new URL(
    [name, version]
      .filter(Boolean)
      .map((c) => encodeURIComponent(c))
      .join("/"),
    registry,
  );
  return u.href;
}
function cleanManifest(manifest, extraReserves = []) {
  const reserves = new Set(getReserveFields().concat(extraReserves));
  return Object.keys(manifest)
    .filter((key) => reserves.has(key))
    .reduce((acc, key) => {
      acc[key] = manifest[key];
      return acc;
    }, {});
}
function getReserveFields() {
  return [
    "name",
    "version",
    "bin",
    "description",
    "keywords",
    "homepage",
    "bugs",
    "license",
    "author",
    "contributors",
    "funding",
    "engines",
    "repository",
    "dependencies",
    "peerDependencies",
    "peerDependenciesMeta",
    "optionalDependencies",
    "os",
    "cpu",
    "libc",
    "languageName",
    "dependenciesMeta",
    "preferUnplugged",
  ];
}
var tar_index_js_x = (y) => {
  var x = {};
  __nccwpck_require__.d(x, y);
  return x;
};
var tar_index_js_y = (x) => () => x;
const tar_index_js_namespaceObject = tar_index_js_x({
  ["Header"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_tar_index_js_c91d939d__.Header,
  ["Pack"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_tar_index_js_c91d939d__.Pack,
  ["ReadEntry"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_tar_index_js_c91d939d__.ReadEntry,
  ["Unpack"]: () =>
    __WEBPACK_EXTERNAL_MODULE__compiled_tar_index_js_c91d939d__.Unpack,
});
function PackJob(pack, keepOrder = false) {
  let queue = Promise.resolve();
  return function schedule(entry) {
    if (!pack.writable) {
      throw new Error("Pack is not on a state that can accept entries");
    }
    const fn =
      "then" in entry
        ? () =>
            entry.then(
              (e) => pack.add(e),
              (e) => {
                pack.emit("error", e);
              },
            )
        : () => pack.add(entry);
    if (keepOrder) {
      queue = queue.then(fn);
      return queue;
    } else {
      return fn();
    }
  };
}
function getEntry(_header, readable) {
  const header = new tar_index_js_namespaceObject.Header(_header);
  if (header.size) {
    const entry = new tar_index_js_namespaceObject.ReadEntry(header);
    readable.pipeTo(toWriteableStream(entry)).then(null, (e) => {
      entry.emit("error", e);
    });
    return entry;
  } else {
    return (async () => {
      const buf = await readableToBuffer(readable);
      const header = new tar_index_js_namespaceObject.Header({
        ..._header,
        size: buf.byteLength,
      });
      const entry = new tar_index_js_namespaceObject.ReadEntry(header);
      entry.end(buf);
      return entry;
    })();
  }
}
function TarTransformStream(getTransformer, options) {
  const pack = new tar_index_js_namespaceObject.Pack(options?.pack);
  const addEntry = PackJob(pack, options?.keepOrder);
  const extract = new tar_index_js_namespaceObject.Unpack({
    ...options?.unpack,
    async onReadEntry(entry) {
      if (options?.unpack?.onReadEntry) {
        options.unpack.onReadEntry(entry);
      }
      try {
        const transformer = getTransformer?.(entry);
        if (transformer) {
          const readable = toReadableStream(entry).pipeThrough(transformer);
          const _header = {
            ...entry.header,
            type: entry.header.type,
            size: transformer.size,
          };
          await addEntry(getEntry(_header, readable));
        } else {
          addEntry(entry);
        }
      } catch (e) {
        pack.emit("error", e);
        throw e;
      }
    },
  });
  extract.once("finish", () => {
    pack.end();
  });
  return {
    readable: toReadableStream(pack),
    writable: toWriteableStream(extract),
  };
}
function createRepack(options) {
  let manifest = null;
  const trans = TarTransformStream(
    (entry) => {
      if (entry.path === "package/package.json") {
        const r = unstreamText((s) => {
          manifest = JSON.parse(s);
          if (typeof options?.manifest === "function") {
            const fin = options.manifest(manifest);
            if (fin) {
              manifest = fin;
              return JSON.stringify(fin, null, 2);
            }
          } else if (options?.manifest) {
            manifest = options.manifest;
            return JSON.stringify(options.manifest, null, 2);
          }
          return s;
        });
        return {
          readable: r.readable,
          writable: r.writable,
          size: options?.manifest ? undefined : entry.size,
        };
      }
      return options?.transform?.(entry);
    },
    { pack: { gzip: { level: 9 }, portable: true }, keepOrder: true },
  );
  const es = new web_namespaceObject.TransformStream();
  const result = trans.readable.pipeTo(es.writable).then(() => ({ manifest }));
  return { writable: trans.writable, readable: es.readable, result };
}
async function repack(tarball, opts = {}) {
  const p = createRepack(opts);
  createReadable(tarball).pipeThrough(p);
  const data = readableToBuffer(p.readable);
  const result = p.result;
  return { tarball: await data, ...(await result) };
}
async function run() {
  const { token, ...inputs } = parseActionInput();
  const tarballPath = await getFirstPath(inputs.tarball);
  const { tarball, manifest } = await (0, index_js_namespaceObject.group)(
    `Repacking tarball ${tarballPath}`,
    async () => {
      const version =
        (0, semver_index_js_namespaceObject.clean)(
          inputs.version || (await getVersionByGitState()) || "",
        ) || undefined;
      const p = await repack(tarballPath, {
        manifest: createPkgJsonTransformer({ name: inputs.name, version }),
      });
      (0, index_js_namespaceObject.info)(
        `Repacked: ${(0, external_node_util_namespaceObject.inspect)(p.manifest, { compact: true, depth: Infinity })}`,
      );
      return p;
    },
  );
  const pkg = `${manifest.name}@${manifest.version}`;
  const version = (0, semver_index_js_namespaceObject.parse)(manifest.version);
  const { publishConfig: _publishConfig } = manifest;
  const publishManifest = cleanManifest(manifest);
  const tag = `${inputs.distTag || version.prerelease?.[0] || _publishConfig?.tag || _publishConfig?.defaultTag || "latest"}`;
  if (inputs.useRepoInfo) {
    addRepoInfoToManifest(publishManifest);
  }
  const publishConfig = {
    ..._publishConfig,
    defaultTag: tag,
    registry: inputs.registry || _publishConfig?.registry || NPM_COM_REGISTRY,
    npmVersion: `action-npr/v1 (+https://github.com/${process.env.GITHUB_ACTION_REPOSITORY || "109cafe/action-npr"})`,
    provenance: inputs.provenance,
    forceAuth: { token },
  };
  await (0, index_js_namespaceObject.group)(
    `Publishing ${pkg} as ${tag}`,
    async () => {
      (0, index_js_namespaceObject.info)(
        `Manifest: ${(0, external_node_util_namespaceObject.inspect)(publishManifest, { compact: true, depth: Infinity })}`,
      );
      await (0, libnpmpublish_index_js_namespaceObject.publish)(
        publishManifest,
        tarball,
        publishConfig,
      );
      setActionOutput({
        name: publishManifest.name,
        version: publishManifest.version,
        tag,
      });
      (0, index_js_namespaceObject.notice)(
        `Package: ${pkg}\nDist Tag: ${tag}\nMeta: ${buildMetaUrl({ name: publishManifest.name, version: publishManifest.version, registry: publishConfig.registry })}`,
        { title: `${pkg} published` },
      );
    },
  );
}
run().then(null, (err) => {
  (0, index_js_namespaceObject.error)(err, {
    title: "Failed running action-npr",
  });
  throw err;
});
function createPkgJsonTransformer(opts) {
  return (_json) => {
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
