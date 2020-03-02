---
title: "Syntax Highlighting"
cardContent: ">_"
weight: 3
menu: 
  styleguide:
    parent: "Elements"
type: "styleguide"
---

## Javascript

```javascript
const fs = require('fs-extra');

// Single line comment

/**
 * Multi-line
 * Comment
 */

const read = async (file) => {
  const buf = await fs.readFile(file);
  return buf.toString();
}

async function main() {
  try {
    await read('~/example.txt']);
  } catch (err) {
    console.error(`Failed to read file: ${err}`);
  }
}
```

## Typescript

```typescript
const fs = require('fs-extra');

// Single line comment

/**
 * Multi-line
 * Comment
 */

async function read(file: string): Promise<string> {
  const buf = await fs.readFile(file);
  return buf.toString();
}

async function main() {
  try {
    await read('~/example.txt']);
  } catch (err) {
    console.error(`Failed to read file: ${err}`);
  }
}
```

## HTML

```html
<!-- Single line comment -->

<!--
Muti-line
Comment
-->
<p>This is HTML.</p>
```

## CSS

```css
/* Single line comment */

/**
 * Multi-line
 * comment
 */

body {
  background: rgba(255, 0, 0, .9);
}

.example-classname {
  background: var(--green);
}

#example-id {
  background: blue;
}

:root {
  --green: #00FF00;
}

p::after {
  content: '';
  margin-bottom: 2px;
}
```

## Bash

```bash
#!/bin/bash

# Single line comment

# Multi-line
# comment

trap uncaughtError ERR
function uncaughtError {
  echo -e "\n\t❌  Error\n"
  echo "$(<${ERROR_LOG})"
  echo -e "\n\t😞  Sorry\n"
  exit $?
}

function runExample() {
  read -p "Should run? : " $USER_INPUT
  select yn in "Yes" "No (Retry)" "No (Skip)"; do
      case $yn in
          Yes )
              echo ""
              eval $USER_INPUT
              break;;
          "No (Retry)" )
              runExample
              break;;
          "No (Skip)" )
              break;;
      esac
  done
  echo ""
}

echo -e "\n📓  Example script\n"

runExample
```

## Go

```go
package main

// Single line comment

/**
 * Multi-line
 * comment
 */

func main() {
  fmt.Println("Hello world")

  test := "example"
  switch test {
  case "example":
    fmt.Println("I knew it")
    break;
  default:
    fmt.Println("This makes no sense!")
  }
}

```

## Chroma Example

Below is the example program used in the [Chrome style gallery](https://xyproto.github.io/splash/docs/longer/all.html):

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
)

type Moo struct {
    Cow   int
    Sound string
    Tube  chan bool
}

// A cow will moo until it is being milked
func cow(num int, mootube chan Moo) {
    tube := make(chan bool)
    for {
        select {
        case mootube <- Moo{num, "moo", tube}:
            fmt.Println("Cow number", num, "mooed through the mootube")
            <-tube
            fmt.Println("Cow number", num, "is being milked and stops mooing")
            mootube <- Moo{num, "mooh", nil}
            fmt.Println("Cow number", num, "moos one last time in relief")
            return
        default:
            fmt.Println("Cow number", num, "mooed through the mootube and was ignored")
            time.Sleep(time.Duration(rand.Int31n(1000)) * time.Millisecond)
        }
    }
}

// The farmer wants to turn on all the milktubes to stop the mooing
func farmer(numcows int, mootube chan Moo, farmertube chan string) {
    fmt.Println("Farmer starts listening to the mootube")
    for unrelievedCows := numcows; unrelievedCows > 0; {
        moo := <-mootube
        if moo.Sound == "mooh" {
            fmt.Println("Farmer heard a moo of relief from cow number", moo.Cow)
            unrelievedCows--
        } else {
            fmt.Println("Farmer heard a", moo.Sound, "from cow number", moo.Cow)
            time.Sleep(2e9)
            fmt.Println("Farmer starts the milking machine on cow number", moo.Cow)
            moo.Tube <- true
        }
    }
    fmt.Println("Farmer doesn't hear a single moo anymore. All done!")
    farmertube <- "yey!"
}

// The farm starts out with mooing cows that wants to be milked
func runFarm(numcows int) {
    farmertube := make(chan string)
    mootube := make(chan Moo)
    for cownum := 0; cownum < numcows; cownum++ {
        go cow(cownum, mootube)
    }
    go farmer(numcows, mootube, farmertube)
    farmerSaid := <-farmertube
    if farmerSaid == "yey!" {
        fmt.Println("All cows are happy.")
    }
}

func main() {
    runFarm(4)
    fmt.Println("done")
}
```