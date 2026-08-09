/** The IFile interface as found in minecraft-creator-tools */
export interface IFile {
    name: string;
    storageRelativePath: string;
    fullPath: string;
    content: Uint8Array;
    loadContent: (force?: boolean) => unknown;
}
/** Interface representing a LevelDB key-value pair. */
export declare class LevelKeyValue {
    fileBytes: Uint8Array | undefined;
    startIndex: number | undefined;
    unsharedKeyBytes: Uint8Array | undefined;
    keyDelta: string | undefined;
    value: Uint8Array<ArrayBuffer> | undefined;
    sharedKey: string | undefined;
    sharedByteLength: number | undefined;
    length: number | undefined;
    previousKey: LevelKeyValue | undefined;
    keyCached: string | undefined;
    fullBytesCached: Uint8Array | undefined;
    get unsharedKey(): string | undefined;
    get key(): string;
    get keyBytes(): Uint8Array | undefined;
    get isRestart(): boolean;
    loadFromLdb(incomingBytes: Uint8Array, startingIndex: number, prevKey: LevelKeyValue | undefined): void;
}
