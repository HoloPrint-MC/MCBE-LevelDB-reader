// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export default class DataUtilities {
	static getUnsignedInteger(num1: number, num2: number, num3: number, num4: number, littleEndian: boolean): number {
		// Ensure inputs are valid bytes and convert to unsigned 32-bit result
		let result: number;
		if(littleEndian) {
			result = ((num4 & 0xff) << 24) | ((num3 & 0xff) << 16) | ((num2 & 0xff) << 8) | (num1 & 0xff);
		} else {
			result = ((num1 & 0xff) << 24) | ((num2 & 0xff) << 16) | ((num3 & 0xff) << 8) | (num4 & 0xff);
		}
		// Convert to unsigned 32-bit by using unsigned right shift
		return result >>> 0;
	}

	static getUnsignedShort(num1: number, num2: number, littleEndian: boolean): number {
		// Direct bitwise operations for 16-bit unsigned value
		if(littleEndian) {
			return ((num2 & 0xff) << 8) | (num1 & 0xff);
		} else {
			return ((num1 & 0xff) << 8) | (num2 & 0xff);
		}
	}

	static getSignedInteger(num1: number, num2: number, num3: number, num4: number, littleEndian: boolean): number {
		// Get unsigned 32-bit value first
		let value: number;
		if(littleEndian) {
			value = ((num4 & 0xff) << 24) | ((num3 & 0xff) << 16) | ((num2 & 0xff) << 8) | (num1 & 0xff);
		} else {
			value = ((num1 & 0xff) << 24) | ((num2 & 0xff) << 16) | ((num3 & 0xff) << 8) | (num4 & 0xff);
		}

		// Convert to signed 32-bit value using JavaScript's signed right shift
		return value | 0;
	}
}
