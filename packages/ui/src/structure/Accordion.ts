import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";
import { Utils } from '@amateras/utils';

const [ACCORDION, ACCORDION_TRIGGER, ACCORDION_CONTENT, ACCORDION_CONTAINER] = ['accordion', 'accordion-trigger', 'accordion-content', 'accordion-container'] as const;

export class Accordion extends ElementProto {
    $trigger: null | AccordionTrigger = Utils.Null;
    $container: null | AccordionContainer = Utils.Null;
    constructor(props: $.Props, layout?: $.Layout<Accordion>) {
        super(ACCORDION, props, layout);
    }

    static {
        $.style(this, toUICSS(ACCORDION, {
            display: 'block',
            '&[opened]': {
                [ACCORDION_CONTAINER]: {
                    gridTemplateRows: '1fr'
                }
            }
        }))
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

    static {
        $.style(this, toUICSS(ACCORDION_CONTAINER, {
            display: 'grid',
            gridTemplateRows: '0fr',
        }))
    }

    override build(cascading?: boolean): this {
        let accordian = this.findAbove<Accordion>(proto => Utils.is(proto, Accordion));
        if (accordian) accordian.$container = this;
        return super.build(cascading)
    }
}

export class AccordionContent extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<AccordionContent>) {
        super(ACCORDION_CONTENT, props, layout);
    }
    
    static {
        $.style(this, toUICSS(ACCORDION_CONTENT, {
            display: 'block',
            overflow: 'hidden',
        }))
    }
}

export class AccordionTrigger extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<AccordionTrigger>) {
        super(ACCORDION_TRIGGER, props, layout);
    }
    
    static {
        $.style(this, toUICSS(ACCORDION_TRIGGER, {
            display: 'block',
        }))
    }

    override build(cascading?: boolean): this {
        let accordian = this.findAbove<Accordion>(proto => Utils.is(proto, Accordion));
        if (accordian) {
            accordian.$trigger = this;
            this.on('click', () => accordian.switch())
        }
        return super.build(cascading)
    }
}