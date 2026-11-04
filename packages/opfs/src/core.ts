import { OPFSDirectoryNode } from "#structure/OPFSDirectoryNode";
import { OPFSFileNode } from "#structure/OPFSFileNode";
import { URI } from "#structure/URI";

export const file = (path: string) => {
    return new OPFSFileNode(path)
}

export const dir = (path: string = '') => {
    return new OPFSDirectoryNode(path)
}

export const rm = (path: string) => {
    const uri = new URI(path);
    return dir(path).removeEntry(uri.name);
}

export const dirHandle = async (path: string, options?: FileSystemGetDirectoryOptions) => {
    const pathnodes = path.split('/');
    let currentDir: FileSystemDirectoryHandle = await navigator.storage.getDirectory();
    for (const path of pathnodes) {
        if (path) currentDir = await currentDir.getDirectoryHandle(path, options)
    }
    return currentDir
}

export const fileHandle = async (path: string, options?: FileSystemGetFileOptions) => {
    const uri = new URI(path);
    let dir: FileSystemDirectoryHandle = await dirHandle(uri.dirname, options);
    return dir.getFileHandle(uri.name, options);
}

export const tree = async (path: string = '', depth: number = 5) => {
    const digger = async (_path: string, _depth: number) => {
        let obj: Record<string, any> = {}
        for await (const node of dir(_path).nodes()) {
            if (node.kind === 'file') obj[node.name] = 'File';
            else obj[node.name] = _depth >= depth ? 'Directory' : await digger(node.uri.path, _depth + 1)
        }
        return obj
    }
    return digger(path, 0)
}

export * from '#structure/OPFSDirectoryNode'
export * from '#structure/OPFSFileNode'
export * from '#structure/OPFSNode'
export * from '#structure/URI'