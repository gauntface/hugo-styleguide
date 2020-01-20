# Hopin Styleguide Hugo Theme

This repo contains a theme to use with hopin-styleguide-content..

## Installing

### Step 1A: Git submodule over SSH

```
git submodule add git@github.com:gauntface/hopin-styleguide-hugo-theme.git themes/hopin-styleguide
```

### Step 1B: Git submodule over HTTP

```
git submodule add https://github.com/gauntface/hopin-styleguide-hugo-theme.git themes/hopin-styleguide
```

### Step 2: Build Theme

```
npm install && npm run build-for-hugo
```

### Step 3: Add to Config

Then add the `hopin-styleguide` to your sites config:

```
{
    "baseURL": "...",
    "languageCode": "...",
    "title": "...",
    "publishDir": ".public",

    "theme": ["...", "hopin-styleguide"]
}
```