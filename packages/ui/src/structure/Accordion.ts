import { ElementProto } from "@amateras/core";
import { _null, is } from "@amateras/utils";

const [ACCORDION, ACCORDION_ITEM, ACCORDION_TRIGGER, ACCORDION_CONTENT, ACCORDION_CONTAINER] = ['accordion', 'accordion-item', 'accordion-trigger', 'accordion-content', 'accordion-container'] as const;

export class Accordion extends ElementProto {
    $trigger: null | AccordionTrigger = _null;
    $container: null | AccordionContainer = _null;
    constructor(props: $.Props, layout?: $.Layout<Accordion>) {
        super(ACCORDION, props, layout);
    }

    static {
        $.style(Accordion, [
            `${ACCORDION},${ACCORDION_ITEM},${ACCORDION_TRIGGER}{display:block}`,
            `${ACCORDION_CONTAINER}{display:grid;grid-template-rows:0fr}`,
            `${ACCORDION}[opened] ${ACCORDION_CONTAINER}{grid-template-rows:1fr}`,
            `${ACCORDION_CONTENT}{overflow:hidden}`,
        ])
    }

    open() {
        this.attr('opened', '');
    }

    close() {
        this.attr('opened', null);
    }

    switch() {
        if (this.attr('opened') === '') this.close();
        else this.open();
    }
}

export class AccordionContainer extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<AccordionContainer>) {
        super(ACCORDION_CONTAINER, props, layout);
    }

    override build(cascading?: boolean): this {
        let accordian = this.findAbove<Accordion>(proto => is(proto, Accordion));
        if (accordian) accordian.$container = this;
        return super.build(cascading)
    }
}

export class AccordionContent extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<AccordionContent>) {
        super(ACCORDION_CONTENT, props, layout);
    }
}

export class AccordionTrigger extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<AccordionTrigger>) {
        super(ACCORDION_TRIGGER, props, layout);
    }

    override build(cascading?: boolean): this {
        let accordian = this.findAbove<Accordion>(proto => is(proto, Accordion));
        if (accordian) {
            accordian.$trigger = this;
            this.on('click', () => accordian.switch())
        }
        return super.build(cascading)
    }
}