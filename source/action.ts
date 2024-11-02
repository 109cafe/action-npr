import NodePath from "node:path";
import { getBooleanInput, getInput, setOutput } from "@actions/core";
import { create as createGlob } from "@actions/glob";
import slugify from "@sindresorhus/slugify";
import { clean } from "semver";
import { getCommitTime } from "./git";
import type { Manifest } from "./npm";
import { destructPromise, toYMDHMS } from "./utils";

export interface ActionInput {
  name?: string;
  version?: string;
  tarball: string;
  registry?: string;
  distTag?: string;
  provenance: boolean;
  token: string;
  useRepoInfo: boolean;
}

export function parseActionInput(): ActionInput {
  const inputs = {
    name: getInput("name"),
    version: getInput("version"),
    tarball: getInput("tarball", { required: true }),
    registry: getInput("registry"),
    distTag: getInput("dist-tag"),
    provenance: getBooleanInput("provenance"),
    useRepoInfo: getBooleanInput("use-repo-info"),
    token: getInput("token", { required: true }),
  };
  return inputs;
}

export async function getFirstPath(globInput: string) {
  const globber = await createGlob(globInput, {});
  const path = (await globber.globGenerator().next()).value!;
  const relativePath = NodePath.relative(process.cwd(), path);
  return relativePath.startsWith("..") ? path : relativePath;
}

export interface ActionOutput {
  name: string;
  version: string;
  tag: string;
}

export function setActionOutput(output: ActionOutput) {
  for (const [key, value] of Object.entries(output)) {
    setOutput(key, value);
  }
}
async function getIncrementalVersionPart() {
  if (process.env.GITHUB_RUN_ID) {
    // to make it smaller; the magic number is the first run id of this action
    return Number(process.env.GITHUB_RUN_ID) - 11643703879;
  } else {
    const [ok, time] = await destructPromise(getCommitTime(process.env.GITHUB_SHA ?? "HEAD"));
    if (ok && time) {
      return toYMDHMS(time);
    }
  }
}
export async function getVersionByGitState() {
  if (process.env.GITHUB_REF_TYPE === "tag") {
    const maybeVersion = process.env.GITHUB_REF_NAME!.split("@").pop();
    return clean(maybeVersion!);
  }
  const ref = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
  const slug = slugify(ref!);
  const incremental = (await getIncrementalVersionPart()) || toYMDHMS(new Date());
  const ver = `0.0.0-${slug.slice(0, 20)}.${incremental}`;
  if (process.env.GITHUB_SHA) {
    return `${ver}+${process.env.GITHUB_SHA.slice(0, 8)}`;
  } else {
    return ver;
  }
}

export function addRepoInfoToManifest(manifest: Manifest) {
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

export function getGithubRepoInfo() {
  const server = process.env.GITHUB_SERVER_URL || "https://github.com";
  const homepageUrl = new URL(process.env.GITHUB_REPOSITORY!, server);
  return {
    homepage: homepageUrl.href,
    gitRepo: `git+${homepageUrl.href}.git`,
    bugs: `${homepageUrl.href}/issues`,
  };
}
