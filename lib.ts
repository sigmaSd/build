export interface Recipe {
  name: string;
  target: string;
  projectType: ProjectType[];
}

type ProjectType = "cargo";

export async function createAction(recipe: Recipe) {
  let template = await fetch(import.meta.resolve("./template.yml"))
    .then((r) => r.text());
  template = template.replace("$$$osArray$$$", getOs());
  template = template.replace("$$$targetFile$$$", recipe.target);
  template = template.replace(
    "$$$extraBuildSteps$$$",
    getExtraBuildSteps(recipe.projectType),
  );
  return template;
}

function getOs() {
  switch (Deno.build.os) {
    case "linux":
      return "[ubuntu-latest]";
    case "darwin":
      return "[macos-latest]";
    case "windows":
      return "[windows-latest]";
    default:
      throw "unsupported os";
  }
}

function getExtraBuildSteps(projectType: ProjectType[]) {
  if (projectType.length === 0) return "";

  let result = "";
  for (const project of projectType) {
    switch (project) {
      case "cargo":
        result += `\
- uses: actions-rs/toolchain@v1
      with:
        toolchain: stable`;
        break;
      default:
        throw "unsupported project type";
    }
  }
  return result;
}
