import { toCSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface CardProps {
    
}

export class Card extends ElementProto {
    static tagname = 'card';
    constructor(props: $.Props<CardProps>, layout?: $.Layout<Card>) {
        super(Card.tagname, props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing))',

            paddingBlock: 'calc(var(--spacing) * 4)',
            background: 'var(--secondary-bg)',
            borderRadius: 'calc(var(--radius) * 1.4)'
        }))
    }
}

export class CardHeader extends ElementProto {
    static tagname = 'card-header';
    constructor(props: $.Props, layout?: $.Layout<Card>) {
        super(CardHeader.tagname, props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: 'var(--spacing)',
            container: 'card-header / inline-size ',

            paddingInline: 'calc(var(--spacing) * 4)',
        }))
    }
}

export class CardContent extends ElementProto {
    static tagname = 'card-content';
    constructor(props: $.Props, layout?: $.Layout<Card>) {
        super(CardContent.tagname, props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            paddingInline: 'calc(var(--spacing) * 4)',
        }))
    }
}

export class CardTitle extends ElementProto<HTMLHeadingElement> {
    static tagname = 'h3';
    constructor(props: $.Props, layout?: $.Layout<Card>) {
        super(CardTitle.tagname, props, layout);
    }

    static {
        $.style(this, toCSS(`card ${this.tagname}`, {
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: '1.375',
            fontSize: 'var(--text-base)',
            color: 'var(--fg)'
        }))
    }
}

export class CardDescription extends ElementProto<HTMLParagraphElement> {
    static tagname = 'p';
    constructor(props: $.Props, layout?: $.Layout<Card>) {
        super(CardDescription.tagname, props, layout);
    }

    static {
        $.style(this, toCSS(`card ${this.tagname}`, {
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-sm)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted)'
        }))
    }
}