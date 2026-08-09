import fs from "node:fs";
import path from "node:path";

import { extractStructureFilesFromMcworld } from "../dist/index.js";

async function test(db) {
	const bytes = fs.readFileSync(path.join(import.meta.dirname, db));
	const mcworld = new Blob([bytes]);
	console.log("extractStructureFilesFromMcworld count:", (await extractStructureFilesFromMcworld(mcworld)).size);
}

await test("./world.zip");
await test("./db.zip");
