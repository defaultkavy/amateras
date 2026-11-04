import { Utils } from "@amateras/utils";
import { OPFS } from "..";
import { OPFSNode } from "./OPFSNode";

export class OPFSFileNode extends OPFSNode {
    kind: 'file' = 'file'
    constructor(path: string) {
        super(path)
    }

    async text() { return this.file(file => file.text()) }
    async bytes() { return this.file(file => file.bytes()) }
    async arrayBuffer() { return this.file(file => file.arrayBuffer()) }
    async stream() { return this.file(file => file.stream()) }
    async slice() { return this.file(file => file.slice()) }

    /**Create directory and file entry and write data into file */
    async write(data: FileSystemWriteChunkType, options?: FileSystemCreateWritableOptions) { 
        return this.writable(w => w.write(data).then(() => w.close()), options) 
    }

    /**Create directory and file entry and return writable file stream */
    async writable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>
    async writable<R>(then?: (writable: FileSystemWritableFileStream) => R, options?: FileSystemCreateWritableOptions): Promise<R>
    async writable<R>(resolve?: ((writable: FileSystemWritableFileStream) => R) | FileSystemCreateWritableOptions, options?: FileSystemCreateWritableOptions) {
        options = Utils.isFunction(resolve) ? options : resolve;
        const then = Utils.isFunction(resolve) ? resolve : Utils.Undefined;
        const writable = await this.handle(handle => handle.createWritable(options), {create: true})
        return then ? then(writable) : writable
    }

    async handle(options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>
    async handle<R>(then: ((handle: FileSystemFileHandle) => R) | FileSystemGetFileOptions, options?: FileSystemGetFileOptions): Promise<R>
    async handle<R>(resolve?: ((handle: FileSystemFileHandle) => R) | FileSystemGetFileOptions, options?: FileSystemGetFileOptions) {
        options = Utils.isFunction(resolve) ? options : resolve;
        const then = Utils.isFunction(resolve) ? resolve : Utils.Undefined;
        const handle = await OPFS.fileHandle(this.uri.path, options);
        return then ? then(handle) : handle;
    }

    async file(): Promise<File>
    async file<R>(then?: (file: File) => R): Promise<R>
    async file<R>(then?: (file: File) => R) {
        const file = await this.handle(handle => handle.getFile())
        return then ? then(file) : file
    }
}