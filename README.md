# Hopin Styleguide Hugo Theme

![Build and Publish](https://github.com/gauntface/hopin-hugo-styleguide/workflows/Build%20and%20Publish/badge.svg)

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