# proguard.js
This package is not related to proguard use to obfuscate Android APK. It was design like proguard to flatten the package and include the javascript filenames in obfuscation!

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


```