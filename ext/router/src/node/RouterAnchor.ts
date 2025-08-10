import { $Anchor } from "../../../html/node/$Anchor";

export class RouterAnchor extends $Anchor {
    constructor() {
        super();
        this.on('click', e => { 
            e.preventDefault();
            this.target() === '_replace' 
            ?   $.replace(this.href()) 
            :   $.open(this.href(), this.target())
        })
    }
}

declare module 'amateras/core' {
    export namespace $ {
        export interface NodeMap {
            'ra': typeof RouterAnchor;
        }
    }
}

$.assign(['ra', RouterAnchor]);