import { $Element } from "#node/$Element";

export class $HTMLElement<Ele extends HTMLElement = HTMLElement> extends $Element<Ele> {
    constructor(resolver: string | Ele) {
        super(resolver);
    }
}