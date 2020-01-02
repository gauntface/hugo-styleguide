# Hopin Styleguide Hugo Theme

This repo contains a theme to use with hopin-styleguide-content..

## Installing with Hugo

```
git submodule add https://github.com/gauntface/hopin-styleguide-hugo-theme.git themes/hopin-styleguide
```

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