// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const ObjectKeyAvoidTermList = new Set([
	"__proto__",
	"prototype",
	"[[Prototype]]",
	"this",
	"delete",
	"constructor",
	"hasOwnProperty",
	"isPrototypeOf",
	"__defineGetter__",
	"__defineSetter__",
	"__lookupGetter__",
	"__lookupSetter__"
]);

export default class Utilities {
	static isUsableAsObjectKey(term: string) {
		if(term === undefined || term === null) {
			return false;
		}

		return !ObjectKeyAvoidTermList.has(term);
	}

	static readStringASCII(buf: DataView, byteOffset: number, bytesToRead: number) {
		let str = "";
		let byteLength = 0;
		byteOffset = byteOffset || 0;
		let nullTerm = false;

		if(typeof bytesToRead === "undefined") {
			nullTerm = true;
			bytesToRead = buf.byteLength - buf.byteOffset;
		}

		let charCode;

		for(let i = 0; i < bytesToRead; i++) {
			charCode = buf.getUint8(i + byteOffset);
			if(charCode === 0 && nullTerm) {
				break;
			}

			str += String.fromCharCode(charCode);
			byteLength++;
		}

		return {
			str: str,
			byteLength: byteLength + (nullTerm ? 1 : 0)
		};
	}

	static getAsciiString(view: DataView, byteOffset: number, byteLength: number) {
		const result = Utilities.readStringASCII(view, byteOffset, byteLength);

		return result.str;
	}
	static getAsciiStringFromUint8Array(bytes: Uint8Array) {
		let str = "";

		for(let i = 0; i < bytes.length; i++) {
			str += String.fromCharCode(bytes[i]);
		}

		return str;
	}
}
