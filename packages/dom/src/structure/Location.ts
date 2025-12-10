export class Location extends URL {
    constructor() {
        super('http://localhost')
    }

    reload() {}
    replace(url: string | URL) {}
    assign(url: string | URL) {}
}