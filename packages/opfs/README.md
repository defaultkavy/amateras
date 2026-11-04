# @amateras/opfs
A Bun-like file system APIs for OPFS.

## How To Use
```ts
import { OPFS } from "@amateras/opfs";

const file = OPFS.file('path/to/file/video.mp4')

file.arrayBuffer()
file.bytes()
file.text()
file.stream()
file.slice()

file.name // string
file.kind // 'file'

file.file(); // File
file.file(file => {
    // access origin File directly
    file.type
    file.lastModified
    file.size
    file.webkitRelativePath
})

file.exists() // boolean
file.remove() // remove file from parent directory

const dir = OPFS.dir('path/to/dir')

dir.name // string
dir.kind // 'directory'

dir.exists() // boolean
dir.remove() // remove directory from parent directory
dir.removeEntry('filename') // remove file from this directory

for await (const node of dir.nodes()) {
    // get children node
    node // FileNode or DirectoryNode
}

const writable = file.writable({keepExistingData: true}) // Writable

file.write('This is content of the file') // auto create file and directories if file is not exists
```