import { $ } from "https://deno.land/x/dax@0.28.0/mod.ts";

//FIXME: replace with import, when lib.rs is published
// import { Recipe } from "./lib.ts";
export interface Recipe {
  name: string;
  target: string;
  projectType: ProjectType[];
}
type ProjectType = "cargo";

const recipe: Recipe = {
  name: "Helix",
  target: "helix/target/release/hx",
  projectType: ["cargo"],
};
export default recipe;

if (import.meta.main) {
  await $`git clone https://github.com/helix-editor/helix`;
  await $`cd helix && cargo build --release`;
}
