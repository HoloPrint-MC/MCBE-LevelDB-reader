import type { FileEntry } from "@zip.js/zip.js";
import {
	BlobReader,
	Uint8ArrayWriter,
	ZipReader
} from "@zip.js/zip.js";

import type IFile from "./minecraft-creator-tools/IFile.js";
import LevelDb from "./minecraft-creator-tools/LevelDb.js";
import LevelKeyValue from "./minecraft-creator-tools/LevelKeyValue.js";
// export * from "./types.js";
export type * from "./minecraft-creator-tools/IErrorable.js";
export type * from "./minecraft-creator-tools/IFile.js";

/** Extracts all LevelDB keys from a zipped `.mcworld` file. Also accepts the zipped "db" folder. */
export async function readMcworld(mcworld: Blob): Promise<Map<string, LevelKeyValue>> {
	const folder = new ZipReader(new BlobReader(mcworld));
	const fileEntries = await folder.getEntries() as FileEntry[];
	folder.close();
	const currentEntry = fileEntries.find(entry => zipEntryBasename(entry) == "CURRENT");
	if(!currentEntry) {
		throw new Error("Cannot find LevelDB files!");
	}
	const dbRootPath = zipEntryDirname(currentEntry);
	const dbEntries = fileEntries.filter(entry => !entry.directory && entry.filename.startsWith(dbRootPath));
	const dbFiles = await Promise.all(dbEntries.map(entry => zipEntryToFile(entry)));
	return await readLevelDb(dbFiles);
}

/** Converts an Entry from zip.js into a File. */
export async function zipEntryToFile(entry: FileEntry): Promise<File> {
	return new File([await entry.getData(new Uint8ArrayWriter())], zipEntryBasename(entry));
}
/** Finds the basename of an Entry from zip.js. */
export function zipEntryBasename(entry: FileEntry): string {
	return entry.filename.slice(entry.filename.lastIndexOf("/") + 1);
}
/** Finds the directory name of an Entry from zip.js. */
export function zipEntryDirname(entry: FileEntry): string {
	return entry.filename.includes("/")? entry.filename.slice(0, entry.filename.lastIndexOf("/") + 1) : "";
}

/** Reads a LevelDB database from all its files and returns an object with all keys. */
export async function readLevelDb(dbFiles: Array<File>): Promise<Map<string, LevelKeyValue>> {
	const files = await Promise.all(dbFiles.map(async file => {
		const iFile: IFile = {
			content: new Uint8Array(await file.arrayBuffer()),
			name: file.name,
			storageRelativePath: file.name,
			fullPath: file.name,
			isContentLoaded: true,
			unload() {
				this.content = null;
				this.isContentLoaded = false;
			}
		};
		return iFile;
	}));
	
	const logFileArr: IFile[] = [];
	const ldbFileArr: IFile[] = [];
	const manifestFileArr: IFile[] = [];
	files.forEach(file => {
		if(file.name.startsWith("MANIFEST")) {
			manifestFileArr.push(file);
		} else if(file.name.endsWith("ldb")) {
			ldbFileArr.push(file);
		} else if(file.name.endsWith("log")) {
			logFileArr.push(file);
		}
	});

	const levelDb = new LevelDb(ldbFileArr, logFileArr, manifestFileArr, "LlamaStructureReader");
	await levelDb.init(message => {
		console.debug(`LevelDB: ${message}`);
	}, {
		unloadFilesAfterParse: true
	});
	const validKeys = new Map(Array.from(levelDb.keys.entries()).filter(([, val]) => val) as [string, LevelKeyValue][]);
	return validKeys;
}

/** Helper to extract structure files from LevelDB keys object. */
export function extractStructureFilesFromLevelDbKeys(levelDbKeys: Map<string, LevelKeyValue>, removeDefaultNamespace: boolean = true): Map<string, File> {
	const structures = new Map<string, File>();
	const structureKeyPrefix = "structuretemplate_";
	const defaultNamespace = "mystructure:";
	Array.from(levelDbKeys.entries()).forEach(([key, value]) => {
		const strKey = key.toString();
		if(strKey.startsWith(structureKeyPrefix)) {
			const namespacedStructureName = strKey.slice(structureKeyPrefix.length);
			const structureName = removeDefaultNamespace && namespacedStructureName.startsWith(defaultNamespace)? namespacedStructureName.replace(defaultNamespace, "") : namespacedStructureName;
			structures.set(structureName, new File([value.value as Uint8Array<ArrayBuffer>], structureName.replaceAll(":", "_") + ".mcstructure", {
				type: "application/mcstructure"
			}));
		}
	});
	return structures;
}

/** Extracts structure files from a `.mcworld` file. */
export async function extractStructureFilesFromMcworld(mcworld: Blob, removeDefaultNamespace: boolean = true): Promise<Map<string, File>> {
	const levelDbKeys = await readMcworld(mcworld);
	return extractStructureFilesFromLevelDbKeys(levelDbKeys, removeDefaultNamespace);
}
