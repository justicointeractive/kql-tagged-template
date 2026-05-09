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

Create and push a semver tag to publish a GitHub Release with the packaged VSIX attached:

```sh
git tag v0.0.1
git push origin v0.0.1
```

The release workflow validates the extension manifest and grammar JSON, packages the extension with `@vscode/vsce`, and uploads the generated `.vsix` to the GitHub Release.

You can also run the **Release VSIX** workflow manually against an existing tag.

