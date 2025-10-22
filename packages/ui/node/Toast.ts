import { _document } from "../../../src/lib/env";
import { $HTMLElement } from "../../../src/node/$HTMLElement";

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