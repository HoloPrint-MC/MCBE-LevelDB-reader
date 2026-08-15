import IFile from "./IFile.js";

export default interface ILevelDbFileInfo {
	file: IFile;
	index: number;
	isDeleted: boolean;
	level: number;
}
