import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface CardProps {
    
}

export class Card extends ElementProto {
    static tagname = 'card';
    constructor(props: $.Props<CardProps>, layout?: $.Layout<Card>) {
        super(Card.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 4)',

            paddingBlock: 'calc(var(--spacing) * 4)',
            background: 'var(--secondary-bg)',
            borderRadius: 'calc(var(--radius) * 1.4)',
            overflow: 'hidden',
            // boxShadow: '0 0 0 1px color-mix(in oklab, var(--fg) 10%, transparent)',

            '&:has(> card-footer)': {
                paddingBottom: '0'
            }
        }))
    }
}

export class CardHeader extends ElementProto {
    static tagname = 'card-header';
    constructor(props: $.Props, layout?: $.Layout<Card>) {
        super(CardHeader.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: 'var(--spacing)',

            paddingInline: 'calc(var(--spacing) * 4)',
        }))
    }
}

export class CardContent extends ElementProto {
    static tagname = 'card-content';
    constructor(props: $.Props, layout?: $.Layout<CardContent>) {
        super(CardContent.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            paddingInline: 'calc(var(--spacing) * 4)',
        }))
    }
}

export class CardFooter extends ElementProto {
    static tagname = 'card-footer';
    constructor(props: $.Props, layout?: $.Layout<CardFooter>) {
        super(CardFooter.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            paddingInline: 'calc(var(--spacing) * 4)',
            paddingBlock: 'calc(var(--spacing) * 4)',
            background: 'color-mix(in oklab, var(--muted) 5%, transparent)'
        }))
    }
}

export class CardTitle extends ElementProto<HTMLHeadingElement> {
    static tagname = 'h3';
    constructor(props: $.Props, layout?: $.Layout<Card>) {
        super(CardTitle.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(`card ${this.tagname}`, {
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: '1.375',
            fontSize: 'var(--text-md)',
            color: 'var(--fg)'
        }))
    }
}

export class CardDescription extends ElementProto<HTMLParagraphElement> {
    static tagname = 'card-description';
    constructor(props: $.Props, layout?: $.Layout<Card>) {
        super(CardDescription.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(`card ${this.tagname}`, {
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-sm)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted)'
        }))
    }
}