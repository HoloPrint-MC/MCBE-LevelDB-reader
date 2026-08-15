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