## Install

Add the project as a submodule and install deps.

```
git submodule add -b release-theme https://github.com/gauntface/hugo-styleguide.git themes/styleguide \
&& git submodule add -b release-content https://github.com/gauntface/hugo-styleguide.git content/styleguide \
&& npm install -g postcss-cli
```
## Development

Development is done on the dev branch and built like so:

```
git checkout -b dev
npm install
npm run build
```