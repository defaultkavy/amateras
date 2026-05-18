import { toUICSS } from "#lib/toCSS";
import { ElementProto, onclient } from "@amateras/core";
import { _instanceof, _null } from "@amateras/utils";

export class ContextMenu extends ElementProto {
    static tagname = 'context-menu';
    private clickListener: ((e: MouseEvent) => void) | null = _null;
    constructor(props: $.Props, layout?: $.Layout<ContextMenu>) {
        super(ContextMenu.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            position: 'fixed',
            top: '0',
            left: '0',
            maxHeight: '50dvh',
            overflowY: 'auto',
            boxSizing: 'border-box',
            border: '1px solid var(--input)',
            background: 'oklch(from var(--bg) l c h)',
            padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
            borderRadius: 'var(--radius)',
            userSelect: 'none',

            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--input) transparent',
        }))
    }

    open(e: MouseEvent) {
        if (onclient()) {
            this.build();
            this.style({
                top: `${e.y}px`,
                left: `${e.x}px`
            })
            this.clickListener = (e) => {
                if (e.target === this.node) return;
                if (e.target && this.node?.contains(e.target as Node)) return;
                this.close();
            }
            setTimeout(() => window.addEventListener('click', this.clickListener!), 1)
            document.body.append(...this.toDOM());
        }
    }

    close(dispose = true) {
        this.removeNode();
        if (this.clickListener) window.removeEventListener('click', this.clickListener);
        this.clickListener = _null;
        if (dispose) this.dispose();
    }
}

export class ContextMenuItem extends ElementProto {
    static tagname = 'context-menu-item'
    private $menu: null | ContextMenu = _null;
    constructor(props: $.Props, layout?: $.Layout<ContextMenuItem>) {
        super(ContextMenuItem.tagname, props, layout);
        this.on('click', () => this.$menu?.close())
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            boxSizing: 'border-box',
            padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1',

            '&:hover, :not(:has(select-item:hover)) &:focus': {
                background: 'oklch(from var(--input) l c h / .1)'
            },
            '&:focus': {
                outline: 'none'
            }
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$menu = this.findAbove(proto => _instanceof(proto, ContextMenu));
        return this;
    }
}