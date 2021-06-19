## Install

Add the project as a submodule and install deps.

```
git submodule add https://github.com/gauntface/hugo-styleguide.git themes/styleguide \
&& npm install -g postcss-cli
```
## Development

Development is done on the dev branch and built like so:

```
git checkout -b dev
npm install
npm run build
```