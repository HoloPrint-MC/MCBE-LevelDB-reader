import type { FileEntry } from "@zip.js/zip.js";
import {
	BlobReader,
	Uint8ArrayWriter,
	ZipReader
} from "@zip.js/zip.js";

import type IFile from "./IFile.js";
import type { ILogger } from "./LevelDb.js";
import LevelDb from "./LevelDb.js";
import LevelKeyValue from "./LevelKeyValue.js";

export { default as DataUtilities } from "./DataUtilities.js";
export type * from "./IErrorable.js";
export type { default as IFile } from "./IFile.js";
export type { default as ILevelDbFileInfo } from "./ILevelDbFileInfo.js";
export type { default as IStorageObject } from "./IStorageObject.js";
export type * from "./LevelDb.js";
export { default as LevelDb } from "./LevelDb.js";
export type * from "./LevelDbIndex.js";
export { default as LevelDbIndex } from "./LevelDbIndex.js";
export { default as LevelKeyValue } from "./LevelKeyValue.js";
export * from "./Utilities.js";
export { default as Utilities } from "./Utilities.js";
export { default as Varint } from "./Varint.js";


/** Unzips a `.mcworld` file and returns all the LevelDB files. Also accepts the zipped "db" folder. */
export async function getLevelDbFilesFromMcworld(mcworld: Blob): Promise<File[]> {
	const folder = new ZipReader(new BlobReader(mcworld));
	const fileEntries = await folder.getEntries() as FileEntry[];
	folder.close();
	const currentEntry = fileEntries.find(entry => zipEntryBasename(entry) == "CURRENT");
	if(!currentEntry) {
		throw new Error("Cannot find LevelDB files!");
	}
	const dbRootPath = zipEntryDirname(currentEntry);
	const dbEntries = fileEntries.filter(entry => !entry.directory && entry.filename.startsWith(dbRootPath) && isInternalLevelDbFile(zipEntryBasename(entry)));
	const dbFiles = await Promise.all(dbEntries.map(entry => zipEntryToFile(entry)));
	return dbFiles;
}
/** Extracts all LevelDB keys from a zipped `.mcworld` file. Also accepts the zipped "db" folder. */
export async function readMcworld(mcworld: Blob, logger?: ILogger): Promise<Map<string, LevelKeyValue>> {
	const levelDbFiles = await getLevelDbFilesFromMcworld(mcworld);
	return await readLevelDb(levelDbFiles, logger);
}
/** Opens a LevelDB database from a zipped `.mcworld` file and returns an uninitialised LevelDB object. Also accepts the zipped "db" folder. You must call init() or initLazy() before accessing any entries. */
export async function openMcworld(mcworld: Blob, logger?: ILogger): Promise<LevelDb> {
	const levelDbFiles = await getLevelDbFilesFromMcworld(mcworld);
	return await openLevelDb(levelDbFiles, logger);
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

/** Checks if a file name looks like it is a relevant LevelDB file, i.e. if it starts with `MANIFEST`, or ends with `.ldb` or `.log`. */
export function isInternalLevelDbFile(fileName: string) {
	return fileName.startsWith("MANIFEST") || fileName.endsWith(".ldb") || fileName.endsWith(".log");
}
/** Reads a LevelDB database from all its files and returns an object with all keys. */
export async function readLevelDb(dbFiles: File[], logger?: ILogger): Promise<Map<string, LevelKeyValue>> {
	const levelDb = await openLevelDb(dbFiles, logger);
	await levelDb.init({
		unloadFilesAfterParse: true
	});
	const validKeys = new Map(Array.from(levelDb.keys.entries()).filter(([, val]) => val) as [string, LevelKeyValue][]);
	return validKeys;
}
/** Opens a LevelDB database from all its files and returns an uninitialised `LevelDB` object. You must call `init()` or `initLazy()` before accessing any entries. */
export async function openLevelDb(dbFiles: File[], logger?: ILogger): Promise<LevelDb> {
	const files = await Promise.all(dbFiles.filter(file => isInternalLevelDbFile(file.name)).map(async file => {
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
		} else if(file.name.endsWith(".ldb")) {
			ldbFileArr.push(file);
		} else if(file.name.endsWith(".log")) {
			logFileArr.push(file);
		}
	});
	
	return new LevelDb(ldbFileArr, logFileArr, manifestFileArr, "LlamaStructureReader", logger);
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
			if(structures.has(structureName)) {
				throw new Error(`Duplicate structure entries for ${structureName}`);
			}
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
