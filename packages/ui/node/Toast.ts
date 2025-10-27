import { _document } from "@amateras/core/lib/env";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

$.style('toast{position:absolute}')

export class Toast extends $HTMLElement {
    constructor() {
        super('toast');
    }

    popup(duration = 3000) {
        $(_document.body).insert(this);
        setTimeout(() => this.remove(), duration)
        return this;
    }
}