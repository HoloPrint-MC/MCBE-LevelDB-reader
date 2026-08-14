import fs from "node:fs";
import path from "node:path";

import { extractStructureFilesFromMcworld } from "../dist/index.js";

async function test(db) {
	const bytes = fs.readFileSync(path.join(import.meta.dirname, db));
	const mcworld = new Blob([bytes]);
	const count = (await extractStructureFilesFromMcworld(mcworld)).size;
	console.log("extractStructureFilesFromMcworld count:", count);
	if(count <= 0) {
		throw new Error(`Expected at least 1 structure in ${db}, got ${count}`);
	}
}

await test("./world.zip");
await test("./db.zip");
