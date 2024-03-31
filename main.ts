import { ensureDirSync } from "jsr:@std/fs@0.221.0/ensure-dir";
import * as path from "jsr:@std/path@0.221.0";
import { createAction, type Recipe } from "./lib.ts";

if (import.meta.main) {
  const userBuild = Deno.args[0];
  if (!userBuild) throw "No user build specified";
  const userBuildUrl = makeUrl(userBuild);
  const recipe: Recipe = await import(userBuildUrl.href)
    .then((m) => m.default);

  const dir = `${recipe.name}Build`;
  ensureDirSync(dir);

  ensureDirSync(`${dir}/.github/workflows`);
  Deno.writeTextFileSync(
    `${dir}/.github/workflows/recipe.yml`,
    await createAction(recipe),
  );
  await fetch(userBuildUrl).then((r) =>
    r.body?.pipeTo(Deno.createSync(`${dir}/userBuild.ts`).writable)
  );
}

function makeUrl(file: string) {
  try {
    return new URL(file);
  } catch {
    return path.toFileUrl(path.resolve(file));
  }
}
