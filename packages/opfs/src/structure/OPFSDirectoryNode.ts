import { Utils } from "@amateras/utils";
import { OPFS } from "..";
import { OPFSFileNode } from "./OPFSFileNode";
import { OPFSNode } from "./OPFSNode";

export class OPFSDirectoryNode extends OPFSNode {
    kind: 'directory' = 'directory'
    constructor(path: string) {
        super(path)
    }

    async removeEntry(filename: string, options?: FileSystemRemoveOptions) { return this.handle(handle => handle.removeEntry(filename, options)) }


    async* entries(): AsyncGenerator<[string, OPFSFileNode | OPFSDirectoryNode]> { 
        const handle = await this.handle()
        for await (const [key, value] of handle.entries()) {
            const entry = value.kind === 'directory' 
                ?   new OPFSDirectoryNode(this.uri.join(key))
                :   new OPFSFileNode(this.uri.join(key))
            yield [key, entry]
        }
    }

    async* nodes(): AsyncGenerator<OPFSFileNode | OPFSDirectoryNode> {
        const handle = await this.handle()
        for await (const value of handle.values()) {
            const entry = value.kind === 'directory' 
                ?   new OPFSDirectoryNode(this.uri.join(value.name))
                :   new OPFSFileNode(this.uri.join(value.name))
            yield entry
        }
    }

    async* keys() {
        const handle = await this.handle()
        yield* handle.keys()
    }

    async handle(options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>
    async handle<R>(then: ((handle: FileSystemDirectoryHandle) => R) | FileSystemGetDirectoryOptions, options?: FileSystemGetDirectoryOptions): Promise<R>
    async handle<R>(resolve?: ((handle: FileSystemDirectoryHandle) => R) | FileSystemGetDirectoryOptions, options?: FileSystemGetDirectoryOptions) {
        options = Utils.isFunction(resolve) ? options : resolve;
        const then = Utils.isFunction(resolve) ? resolve : Utils.Undefined;
        const handle = await OPFS.dirHandle(this.uri.path, options);
        return then ? then(handle) : handle;
    }
}