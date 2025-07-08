import { $Element } from "#node/$Element";

export class $HTMLElement<Ele extends HTMLElement = HTMLElement, EvMap = HTMLElementEventMap> extends $Element<Ele, EvMap> {
    constructor(resolver: string | Ele) {
        super(resolver);
    }
}