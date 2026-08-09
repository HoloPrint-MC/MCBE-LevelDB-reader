import * as NBT from "nbtify-readonly-typeless";

import { extractStructureFilesFromMcworld } from "../dist/index.js";

async function test(db) {
	const mcworld = await fetch(db).then(res => res.blob());
	const structureFiles = await extractStructureFilesFromMcworld(mcworld);
	console.log(structureFiles);
	const structures = new Map();
	await Promise.all(Array.from(structureFiles).map(async ([name, structureFile]) => {
		structures.set(name, await NBT.read(structureFile));
	}));
	console.log(structures);
}

await test("./world.zip");
await test("./db.zip");
