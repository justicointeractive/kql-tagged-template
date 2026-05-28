# KQL Tagged Template Highlighting

Syntax highlighting for Kusto/KQL tagged template literals in JavaScript and TypeScript.

This extension injects the Kuskus Kusto TextMate grammar into template literals tagged with `kql` or `kusto`.

```ts
const kql = String.raw;

const query = kql`
StormEvents
| take 10
`;
```

It also supports comment markers:

```ts
const query = /* kql */ `
StormEvents
| take 10
`;
```

## Requirements

Install the Kuskus Kusto syntax grammar:

- [`rosshamish.kuskus-kusto-syntax-highlighting`](https://marketplace.visualstudio.com/items?itemName=rosshamish.kuskus-kusto-syntax-highlighting)

This extension declares Kuskus as an extension dependency.

## Supported files

- JavaScript
- JavaScript React
- TypeScript
- TypeScript React

## Development

Package locally:

```sh
npx @vscode/vsce package
```

Install the generated `.vsix` in VS Code:

```sh
code --install-extension kql-tagged-template-0.0.1.vsix
```

Then run **Developer: Reload Window**.

## Releasing

Every push to `main` runs the **Release VSIX** workflow and publishes a patch release. The workflow reuses a semver tag already pointing at the commit when rerun; otherwise it picks the next patch version after the highest existing `vX.Y.Z` tag, updates `package.json` in the runner for packaging, creates the GitHub Release and tag, and uploads the generated VSIX.

The same workflow then publishes that packaged VSIX to the VS Code Marketplace, avoiding a nested tag-push workflow.

You can also run **Release VSIX** manually with a specific version input, for example `0.0.2`. If the matching tag already exists at a different commit, the workflow fails instead of moving it.

Marketplace publishing uses the `vsce` GitHub environment:

- secret `PAT` — Visual Studio Marketplace personal access token
- variable `PUBLISHER_ID` — expected Marketplace publisher ID; this must match `package.json`'s `publisher`

You can also run the **Release VSIX** workflow manually against an existing tag.

