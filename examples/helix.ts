import { Recipe } from "https://raw.githubusercontent.com/sigmaSd/build/master/lib.ts";

const recipe: Recipe = {
  name: "Helix",
  target: "helix.tar",
  projectType: ["cargo"],
};
export default recipe;

if (import.meta.main) {
  const { $ } = await import("https://deno.land/x/dax@0.28.0/mod.ts");
  await $`git clone https://github.com/helix-editor/helix`;
  await $`cd helix && cargo build --release`;
  await $`cp helix/target/release/hx helix-bin`;
  await $`rm -rf helix/runtime/grammars/sources`;

  const bashWrapper = `\
#!/bin/bash
dir="$(dirname $0)"
runtime="$dir/runtime"
helix="$dir/helix-bin"
HELIX_RUNTIME=$runtime $helix
`;
  Deno.writeTextFileSync("hx", bashWrapper);
  await $`tar -cvf helix.tar hx helix-bin helix/runtime`;
}
