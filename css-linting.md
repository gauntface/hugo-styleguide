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

{{< styleguide-raw-html >}}
<pre class="n-hopin-styleguide-c-selector-demo">
<code>.n-hopin-styleguide-c-my-component__sub-section--fancy
|__________________|_|___________|____________|_______|
        |           |      |           |          |
    <span class="n-hopin-styleguide-c-selector-demo__item n-hopin-styleguide-c-selector-demo__item--namespace">Namespace</span>      |      |           |          |
                  <span class="n-hopin-styleguide-c-selector-demo__item n-hopin-styleguide-c-selector-demo__item--type">Type</span>    |           |          |
                         <span class="n-hopin-styleguide-c-selector-demo__item n-hopin-styleguide-c-selector-demo__item--body">Body</span>         |          |
                                    <span class="n-hopin-styleguide-c-selector-demo__item n-hopin-styleguide-c-selector-demo__item--element">Element</span>      |
                                              <span class="n-hopin-styleguide-c-selector-demo__item n-hopin-styleguide-c-selector-demo__item--modifier">Modifier</span>
</code>
</pre>
{{</ styleguide-raw-html >}}

The namespace, element and modifier are optional, so you can
have names such as:

.c-header
.c-header--larger
.c-header__link

The `type` of a selector should be one of the following:

- `c` Component
- `l` Layout
- `u` Utility

{{< styleguide-load-static-css suffix=".css" >}}

{{< styleguide-raw-html >}}
<div class='n-hopin-styleguide-js-bem-classnames'></div>
{{< / styleguide-raw-html >}}

### Invalid Classnames

Below is a list of classnames that don't follow the BEM
format described above:

{{< styleguide-raw-html >}}
<div class='n-hopin-styleguide-js-invalid-classnames'></div>
{{< / styleguide-raw-html >}}

## IDs

Below is a list of IDs defined in the stylesheets:

{{< styleguide-raw-html >}}
<div class='n-hopin-styleguide-js-ids'></div>
{{< / styleguide-raw-html >}}

## Elements

Below is a list of elements defined in the stylesheets:

{{< styleguide-raw-html >}}
<div class='n-hopin-styleguide-js-elements'></div>
{{< / styleguide-raw-html >}}
