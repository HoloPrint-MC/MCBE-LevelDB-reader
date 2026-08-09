import type {
	IFile,
	LevelKeyValue
} from "./types.js";

export default class LevelDb {
	ldbFiles: IFile[];
	logFiles: IFile[];
	manifestFiles: IFile[];
	context: string;
	keys: Record<string, LevelKeyValue | false>;
	constructor(
		ldbFiles: IFile[],
		logFiles: IFile[],
		manifestFiles: IFile[],
		context: string
	);
	init(logCallback?: (message: string) => Promise<void> | void): Promise<void>;
}
