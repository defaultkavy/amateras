import { $Anchor } from "#html";

export class RouterAnchor extends $Anchor {
    constructor() {
        super();
        this.on('click', e => { e.preventDefault(); $.open(this.href()) })
    }
}