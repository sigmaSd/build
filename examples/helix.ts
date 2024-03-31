import type { Recipe } from "https://raw.githubusercontent.com/sigmaSd/build/master/lib.ts";

const recipe: Recipe = {
  name: "Helix",
  target: "helix.tar",
  projectType: ["cargo"],
};
export default recipe;

if (import.meta.main) {
  const { $ } = await import("jsr:@david/dax@0.39.2");
  await $`git clone https://github.com/helix-editor/helix`;
  await $`cd helix && cargo build --release`;
  await $`rm -rf helix/runtime/grammars/sources`;

  await $`mkdir hx`;
  await $`cp helix/target/release/hx hx/helix-bin`;
  await $`cp -r helix/runtime hx/runtime`;

  const bashWrapper = `\
#!/bin/bash
dir="$(dirname $0)"
runtime="$dir/runtime"
helix="$dir/helix-bin"
HELIX_RUNTIME=$runtime $helix
`;
  Deno.writeTextFileSync("hx/hx", bashWrapper);

  await $`tar -cvf helix.tar hx`;
}
