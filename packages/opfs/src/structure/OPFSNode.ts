import { OPFS } from "..";
import { URI } from "./URI";

export abstract class OPFSNode {
    name: string;
    uri: URI;
    abstract kind: 'file' | 'directory'
    constructor(path: string) {
        this.uri = new URI(path)
        this.name = this.uri.name;
    }
    
    abstract handle(options?: FileSystemGetFileOptions | FileSystemGetDirectoryOptions): Promise<FileSystemFileHandle | FileSystemDirectoryHandle>
    abstract handle<R>(then: ((handle: FileSystemFileHandle | FileSystemDirectoryHandle) => R) | FileSystemGetFileOptions | FileSystemGetDirectoryOptions, options?: FileSystemGetFileOptions | FileSystemGetDirectoryOptions): Promise<R>
    
    async remove(options?: FileSystemRemoveOptions) { return OPFS.dir(this.uri.dirname).removeEntry(this.name, options) }

    async exists() { return !!await this.handle().catch(_ => false) }
}