## Install

Add the project as submodules. The site needs
[hugo-base-theme](https://github.com/gauntface/hugo-base-theme) to build the
TypeScript.

```
git submodule add -b release-theme https://github.com/gauntface/hugo-styleguide.git themes/styleguide \
&& git submodule add -b release-content https://github.com/gauntface/hugo-styleguide.git content/styleguide
```

## Component examples

Components in `layouts/partials/components/` are added to the styleguide. To
give one demo data, create `layouts/partials/styleguide-examples/components/<name>.html`.
Layouts work the same way with `styleguide-examples/layouts/`.

## Limiting the themes scanned

If `themes/` has themes that are not in use, list the ones to scan with
`params.baseTheme.themes`.

## Development

The source is on the `v2` branch. The `content` branch holds the pages. Pushes
publish them to `release-theme` and `release-content`.

```
git worktree add content origin/content
npm install
npm test
```
