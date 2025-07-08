import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Anchor extends $HTMLElement<HTMLAnchorElement> {
    constructor() {
        super('a')
    }
}

export interface $Anchor extends $HTMLElement<HTMLAnchorElement> {
    /** {@link HTMLAnchorElement.href} */
    href(href: $Parameter<string>): this;
    href(): string;
    /** {@link HTMLAnchorElement.hreflang} */
    hreflang(hreflang: $Parameter<string>): this;
    hreflang(): string;
    /** {@link HTMLAnchorElement.download} */
    download(download: $Parameter<string>): this;
    download(): string;
    /** {@link HTMLAnchorElement.ping} */
    ping(ping: $Parameter<string>): this;
    ping(): string;
    /** {@link HTMLAnchorElement.referrerPolicy} */
    referrerPolicy(referrerPolicy: $Parameter<string>): this;
    referrerPolicy(): string;
    /** {@link HTMLAnchorElement.rel} */
    rel(rel: $Parameter<string>): this;
    rel(): string;
    /** {@link HTMLAnchorElement.relList} */
    relList(relList: $Parameter<string>): this;
    relList(): DOMTokenList;
    /** {@link HTMLAnchorElement.target} */
    target(target: $Parameter<string>): this;
    target(): string;
    /** {@link HTMLAnchorElement.text} */
    text(text: $Parameter<string>): this;
    text(): string;
    /** {@link HTMLAnchorElement.type} */
    type(type: $Parameter<string>): this;
    type(): string;
}

declare module '#core' {
    export function $(nodeName: 'a'): $Anchor
}

assignHelper(HTMLAnchorElement, $Anchor, 'a');