import NodePath from "node:path";
import { setOutput } from "@actions/core";
import { create as createGlob } from "@actions/glob";
import slugify from "@sindresorhus/slugify";
import { clean } from "semver";

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
export function getVersionByGitState() {
  if (process.env.GITHUB_REF_TYPE === "tag") {
    const maybeVersion = process.env.GITHUB_REF_NAME!.split("@").pop();
    return clean(maybeVersion!);
  }
  const ref = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
  const slug = slugify(ref!);
  return `0.0.0-${slug.slice(0, 20)}.${process.env.GITHUB_SHA!.slice(0, 8)}`;
}
