import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface ContainerProps {
    name: string
    type?: string
}

export class Container extends ElementProto {
    static tagname = 'container';
    constructor(props: $.Props<ContainerProps>, layout?: $.Layout<Container>) {
        super('container', {type: 'inline-size', ...props}, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            containerName: 'attr(name type(*))',
            containerType: 'attr(type type(*))'
        }))
    }
}