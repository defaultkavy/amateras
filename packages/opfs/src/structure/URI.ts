export class URI {
    path: string;
    dirname: string;
    name: string;
    constructor(filepath: string) {
        this.path = filepath;
        const lastIndex = filepath.lastIndexOf('/');
        this.name = filepath.substring(lastIndex + 1);
        this.dirname = filepath.substring(0, lastIndex);
    }

    join(path: string) {
        return `${this.path}/${path}`
    }
}