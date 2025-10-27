import { $HTMLElement } from "@amateras/core/node/$HTMLElement";
import { forEach, isNull } from "@amateras/utils";
const MODAL = 'modal';
const MODAL_CONTENT = 'modal-content'

forEach([
    `${MODAL}{display:flex;justify-content:center;align-items:center;position:fixed;top:0;left:0;height:100%;width:100%;background:#00000050}`,
    `${MODAL_CONTENT}{display:block;}`
], $.style)
export class Modal extends $HTMLElement {
    name?: string;
    constructor(name?: string) {
        super(MODAL);
        this.name = name;
        if (name) 
            $(window).on('routeopen', e => {
                const url = new URL(location.href);
                const param = url.searchParams.get(name);
                if (isNull(param)) return this.close();
                this.open();
            })
    }

    open() {
        $(document.body).insert(this);
        this.once('click', e => {
            if ($(e) === $(e.target)) {
                if (!this.name) this.close();
                else history.back();
            }
        })
        return this;
    }

    close() {
        this.remove();
        return this;
    }
}

export class ModalContent extends $HTMLElement {
    constructor() {
        super(MODAL_CONTENT);
    }
}