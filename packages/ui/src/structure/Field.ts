import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";
import { Utils } from '@amateras/utils';

export interface FieldProps {
    for?: OrSignal<string>;
    direction?: 'vertical' | 'horizontal'
}

export class Field extends ElementProto<HTMLElement> {
    static tagname = 'field';
    constructor(props: $.Props<FieldProps>, layout?: $.Layout<Field>) {
        super(Field.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 2)',
            width: '100%',

            '&[direction="horizontal"]': {
                flexDirection: 'row',
                placeItems: 'center',
                width: 'unset'
            },

            '&:has(field-error)': {
                'input[ui="input"], textarea[ui="textarea"]': {
                    borderColor: 'var(--destructive-fg)',

                    '&:focus-visible': {
                        outlineColor: 'color-mix(in oklch, var(--destructive-fg) 30%, transparent)'
                    }
                }
            }
        }))
    }

    override props({ for: htmlFor, ...props }: $.Props<FieldProps>): void {
        super.props(props);
        this.for(htmlFor);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.setFor();
        return this;
    }

    for(): string | null;
    for(name?: OrSignal<string>): void
    for(name?: OrSignal<string>) {
        if (!arguments.length) return this.attr('for');
        if (Utils.isUndefined(name)) return;
        $.resolve(name, name => {
            this.attr('for', name);
            this.setFor();
        });
    }

    private setFor() {
        const name = this.for();
        this.findBelow(proto => {
            if (Utils.isInstanceof(proto, ElementProto)) {
                if (proto.tagname === 'input') proto.attr('id', name);
                if (proto.tagname === 'label') proto.attr('for', name)
            }
        })
    }
}

export class FieldLabel extends ElementProto<HTMLElement> {
    static tagname = 'label';
    constructor(props: $.Props, layout?: $.Layout<FieldLabel>) {
        super(FieldLabel.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            'field &': {
                display: 'flex',
                placeItems: 'center',
                userSelect: 'none',
                color: 'var(--fg)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-sm)',
                flexShrink: '0',
                lineHeight: '1em'
            },

            'field[disabled] &': {
                pointerEvents: 'none'
            }
        }))
    }
}

export class FieldDescription extends ElementProto<HTMLElement> {
    static tagname = 'field-description';
    constructor(props: $.Props, layout?: $.Layout<FieldDescription>) {
        super(FieldDescription.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            'field &': {
                display: 'block',
                color: 'var(--muted)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-sm)'
            },

            'field[disabled] &': {
                pointerEvents: 'none'
            }
        }))
    }
}

export class FieldError extends ElementProto {
    static tagname = 'field-error';
    constructor(props: $.Props, layout?: $.Layout<FieldError>) { 
        super(FieldError.tagname, props, layout)
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            fontSize: 'var(--text-sm)',
            color: 'var(--destructive-fg)',
            display: 'block'
        }))
    }
}