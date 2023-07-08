# build

Build a project using github actions in simple steps

## Usage

- create a deno script that builds the project

```ts
import { $ } from "https://deno.land/x/dax@0.28.0/mod.ts";
import { Recipe } from "https://raw.githubusercontent.com/sigmaSd/build/master/lib.ts";

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
- now you have a new directory called `scriptnameBuild` that have the github
  action workflow. You just need to push it to a github repo so it can build.

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
cd HelixBuild && git remote add origin git@github.com:username/mythrowawayrepo.git && git init && git add . && git commit -m "helix" && git push
```

(assumes the repo is already created)

3- now the codeaction will run and build the project, you should find the result
under `https://github.com/username/mythrowawayrepo/releases`
