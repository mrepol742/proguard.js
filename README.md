# proguard.js
This package is not related to (Guardspace proguard) use to obfuscate & optimize Android APP. It was design like proguard to flatten the package and include the javascript filenames in obfuscation!

## Installation
Usig NPM or YARN
``` sh
yarn add --dev proguard.js
```
or
``` sh
npm install --save-dev proguard.js
 ```
## Usage

``` js
import { scanFiles } from "proguard.js";
// const { scanFiles } = require("proguard.js");


// current dir = process.cwd() use __dirname for commonJS
/**
 * @param {string} dir
 * @param {ObfuscatorOptions} inputOptions
 * @optional
 * @param {array} excludeFiles
 */
scanFiles(process.cwd(), {
    /*
     * refer to this package for more indepth info about options
     * https://www.npmjs.com/package/javascript-obfuscator
     */
    compact: true,
    simplify: true,
    splitStrings: false,
    stringArray: true,
});

// another example with exlucudeFiles (src, dist and index.js)
scanFiles(process.cwd(), { compact: true }, ["/src", "/dist", "/index.js"])

// input
project ->
    src ->
        exam ->
           cycle.js
        routes - >
           test.js
        this.js
        do.js
        what.js
    index.js
    package.json

// output
project-dist ->
    1adfbbc6...js
    ca5y77b6...js
    dak4ffav...js
    3ab8t36h...js
    jaaqgn44...js
    0ab827b9...js
    package.json

```

This package is inspired by Guardspace Proguard.