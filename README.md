# MCBE-LevelDB-reader

[![NPM](https://img.shields.io/npm/v/mcbe-leveldb-reader)](https://www.npmjs.com/package/mcbe-leveldb-reader)
[![GitHub](https://img.shields.io/badge/GitHub-green?logo=github)](https://github.com/HoloPrint-MC/MCBE-LevelDB-reader)
[![Docs](https://img.shields.io/badge/Docs-3178C6?logo=typescript&logoColor=white)](https://holoprint-mc.github.io/MCBE-LevelDB-reader)
[![Docs](https://img.shields.io/badge/Changelog-green?logo=gitbook&logoColor=white)](./CHANGELOG.md)

Reads a MCBE LevelDB database from a `.mcworld` file. Can also extract all structure files from a world.
Powered by Mojang's code from [Mojang/minecraft-creator-tools](https://github.com/Mojang/minecraft-creator-tools).
Works in the browser and in Node.

[View full docs here.](https://holoprint-mc.github.io/MCBE-LevelDB-reader)

## Browser usage
```js
import { readMcworld } from "https://esm.sh/mcbe-leveldb-reader";

let file = await fetch("./hermitcraft9.mcworld").then(res => res.blob());
let levelDb = await readMcworld(file);
console.log(levelDb);
```

## Node usage
```bash
npm i mcbe-leveldb-reader
```
```js
import { readMcworld } from "mcbe-leveldb-reader";
import { readFile } from "fs/promises";

const fileBuffer = await readFile("./hermitcraft9.mcworld");
const levelDb = await readMcworld(fileBuffer);
console.log(levelDb);
```

## Changes from minecraft-creator-tools
Most files are taken from the LevelDb reader implementation in from https://github.com/Mojang/minecraft-creator-tools
I have taken LevelDb.ts and necessary related files, relocated them around, and changed imports.
Most notably, logging has been extracted from relying on the Log static class to be configurable in the constructor. It defaults to console logs if nothing is provided.
The first parameter in the init() method, originally a log callback function, has been extracted into a property in the logger passed in the constructor. No idea why Mojang decided to not use the regular logger originally.
I have also removed unused methods, interface members etc. in order to keep this library minimal.
I also made some methods and fields annotated with "private" actual private properties (e.g. private _isLazyMode -> #isLazyMode) so that bundlers can minify their names.
