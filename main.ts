import { ensureDirSync } from "https://deno.land/std@0.177.0/fs/ensure_dir.ts";
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
}

function makeUrl(file: string) {
  try {
    return new URL(file);
  } catch {
    return path.toFileUrl(path.resolve(file));
  }
}
