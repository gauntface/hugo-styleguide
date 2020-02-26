---
title: "CSS Linting"
menu: "styleguide"
weight: 6
type: "styleguide"
---

# CSS Linting

This page will include information on the CSS selectors used in your stylesheets.

## Classnames

This script assumes you are following the pattern of:

```
.n-hopin-styleguide-c-my-component__sub-section--fancy
|__________________|_|___________|____________|_______|
        |           |      |           |         |
    Namespace       |      |           |         |
                  Type     |           |         |
                          Body         |         |
                                    Element      |
                                              Modifier
```

The namespace, element and modifier are optional, so you can
have names such as:

.c-header
.c-header--larger
.c-header__link

The `type` of a selector should be one of the following:

- `c` Component
- `l` Layout
- `u` Utility

{{< styleguide-load-static-css suffix="novars.css" >}}

<div class='n-hopin-styleguide-js-bem-classnames'></div>

### Invalid Classnames

Below is a list of classnames that don't follow the BEM
format described above:

<div class='n-hopin-styleguide-js-invalid-classnames'></div>

## IDs

Below is a list of IDs defined in the stylesheets:

<div class='n-hopin-styleguide-js-ids'></div>

## Elements

Below is a list of elements defined in the stylesheets:

<div class='n-hopin-styleguide-js-elements'></div>
