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

Merge a PR to `main` with `package.json`'s `version` bumped to the version you want to ship. The **Tag release from main** workflow creates and pushes the matching semver tag, for example `v0.0.2`.

That tag push starts the **Release VSIX** workflow, which validates the extension manifest and grammar JSON, packages the extension with `@vscode/vsce`, uploads the generated `.vsix` to the GitHub Release, then publishes that package to the VS Code Marketplace.

If the matching tag already exists at a different commit, the tag workflow fails instead of moving the tag. Bump `package.json` before merging another release PR.

Marketplace publishing uses the `vsce` GitHub environment:

- secret `PAT` — Visual Studio Marketplace personal access token
- variable `PUBLISHER_ID` — expected Marketplace publisher ID; this must match `package.json`'s `publisher`

You can also run the **Release VSIX** workflow manually against an existing tag.

