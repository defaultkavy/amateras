import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export class DescriptionList extends ElementProto {
    static tagname = 'dl';
    constructor(props: $.Props, layout?: $.Layout<DescriptionList>) {
        super(DescriptionList.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'flex',
            flexDirection: 'column',
        }))
    }
}

export class DescriptionContent extends ElementProto {
    static tagname = 'dc';
    constructor(props: $.Props, layout?: $.Layout<DescriptionContent>) {
        super(DescriptionContent.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            paddingBlock: '1rem',
            borderBottom: `1px solid color-mix(in oklch, var(--input) 50%, transparent)`,
            '&:last-child': {
                borderBottom: 'none'
            }
        }))
    }
}

export class DescriptionTerm extends ElementProto {
    static tagname = 'dt';
    constructor(props: $.Props, layout?: $.Layout<DescriptionTerm>) {
        super(DescriptionTerm.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            fontSize: `var(--text-sm)`,
            fontWeight: `var(--font-weight-medium)`
        }))
    }
}

export class DescriptionDetail extends ElementProto {
    static tagname = 'dd';
    constructor(props: $.Props, layout?: $.Layout<DescriptionDetail>) {
        super(DescriptionDetail.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            margin: '0',
            fontSize: `var(--text-sm)`,
            color: `var(--muted)`
        }))
    }
}