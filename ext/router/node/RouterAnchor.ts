import { $Anchor } from "#html/$Anchor";

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