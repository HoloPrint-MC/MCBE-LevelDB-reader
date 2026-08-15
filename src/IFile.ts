// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import IStorageObject from "./IStorageObject.js";

export default interface IFile extends IStorageObject {
	content: string | Uint8Array | null;
	isContentLoaded: boolean;

	unload(): void;
}
