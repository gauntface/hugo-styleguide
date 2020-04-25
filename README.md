# Hopin Styleguide Hugo Theme

[![Build and Test](https://github.com/gauntface/hopin-hugo-styleguide/workflows/Build%20and%20Test/badge.svg)](https://github.com/gauntface/hopin-hugo-styleguide/actions?query=workflow%3A%22Build+and+Test%22) [![Publish](https://github.com/gauntface/hopin-hugo-styleguide/workflows/Publish/badge.svg)](https://github.com/gauntface/hopin-hugo-styleguide/actions?query=workflow%3APublish)

This repo contains a theme to use with hopin-styleguide-content..

## Installing

### Step 1: Install via NPM

```
npm install --save @hopin/hugo-styleguide
```

### Step 2: Use via Gulp

```
const hopinstyleguide = require('@hopin/hugo-styleguide');

gulp.task('styleguide-theme', () => {
  return hopinstyleguide.copyTheme(path.join(__dirname, `themes`, 'hopin-styleguide'));
})

gulp.task('styleguide-content', () => {
  return hopinstyleguide.copyContent(path.join(__dirname, `content`, 'styleguide'));
})
```

### Step 3: Add to Config

Then add the `hopin-styleguide` to your sites config:

```
{
    "baseURL": "...",
    "languageCode": "...",
    "title": "...",
    "publishDir": ".public",

    "theme": ["...", "hopin-styleguide"],
}
```

### Step 4: Add parameters

There are a few optional parameters you will might want to set in your site config:

```
{
    "params": {
        "styleguideSection": "styleguide"
    }
}
```