# build

Build a project using github actions in simple steps

## Usage

- create a deno script that builds the project

```ts
import { $ } from "jsr:@david/dax@0.39.2";
import type { Recipe } from "https://raw.githubusercontent.com/sigmaSd/build/master/lib.ts";

const recipe: Recipe = {
  name: "Helix",
  // path of the executable to upload
  target: "helix/target/release/hx",
  // installs rust toolchain
  projectType: ["cargo"],
};
export default recipe;

if (import.meta.main) {
  await $`git clone https://github.com/helix-editor/helix`;
  await $`cd helix && cargo build --release`;
}
```

- `deno run --reload https://github.com/sigmaSd/build/raw/master/main.ts $scriptPath`
- now you have a new directory called `${recipename}Build` that have the github
  action workflow. You just need to push it to a github repo so it can build.
  You can then manually retirgger the action from the github ui.

Here is the script for example that I'm using to build helix from source, note
BuildMachine repo is just a throw-away repo that I'm using to build and get the
artifacts

```ts
import { $ } from "jsr:@david/dax@0.39.2";
$.setPrintCommand(true);

await $`rm -rf HelixBuild`.noThrow();
await $`deno run -A https://github.com/sigmaSd/build/raw/master/main.ts helix.ts`;
$.cd("HelixBuild");

await $`git init && git commit -m "helix build"`;
await $`git remote add origin git@github.com:sigmaSd/buildMachine.git`;
await $`git push -f --set-upstream origin master`;
```

## Test Drive

build helix project https://github.com/helix-editor/helix

1 - Run helix builder exmaple script

```
deno run  https://github.com/sigmaSd/build/raw/master/main.ts https://github.com/sigmaSd/build/raw/master
/examples/helix.ts
```

2- HelixBuild folder is created, you have to create a throwayway github repo and
push to it, for example

```
cd HelixBuild && git init && git add . && git commit -m "helix build" && git remote add origin git@github.com:username/mythrowawayrepo.git && git push -f --set-upstream origin master
```

(assumes the repo is already created)

3- now the codeaction will run and build the project, you should find the result
under `https://github.com/username/mythrowawayrepo/releases`
