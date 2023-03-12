import { ensureDirSync } from "https://deno.land/std@0.177.0/fs/ensure_dir.ts";
import { $ } from "https://deno.land/x/dax@0.28.0/mod.ts";
import * as path from "https://deno.land/std@0.170.0/path/mod.ts";
import { createAction, Recipe } from "./lib.ts";

if (import.meta.main) {
  const userBuild = Deno.args[0];
  if (!userBuild) throw "No user build specified";
  const userBuildUrl = makeUrl(userBuild);
  const recipe: Recipe = await import(userBuildUrl.href)
    .then((m) => m.default);

  const dir = `${recipe.name}Build`;
  ensureDirSync(dir);

  ensureDirSync(dir + "/.github/workflows");
  Deno.writeTextFileSync(
    dir + "/.github/workflows/recipe.yml",
    await createAction(recipe),
  );
  await fetch(userBuildUrl).then((r) =>
    r.body?.pipeTo(Deno.createSync(dir + "/userBuild.ts").writable)
  );

  await gitAddAndCommit(dir, recipe);
}

async function gitAddAndCommit(dir: string, recipe: Recipe) {
  const cwd = Deno.cwd();
  try {
    $.cd(dir);
    await $`git init`.noThrow();
    await $`git add .`.noThrow();
    await $`git commit -m "commit ${recipe.name}"`.noThrow();
  } finally {
    $.cd(cwd);
  }
}
function makeUrl(file: string) {
  try {
    return new URL(file);
  } catch {
    return path.toFileUrl(path.resolve(file));
  }
}
