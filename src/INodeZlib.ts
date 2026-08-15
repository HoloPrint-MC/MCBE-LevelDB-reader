export default interface INodeZlib {
	inflateRawSync(input: Uint8Array): Uint8Array;
	inflateSync(input: Uint8Array): Uint8Array;
}
