import { toUICSS } from "#lib/toCSS";
import { ElementProto, onclient } from "@amateras/core";
import { Utils } from '@amateras/utils';

export class ContextMenu extends ElementProto {
    static tagname = 'context-menu';
    private clickListener: ((e: MouseEvent) => void) | null = Utils.Null;
    constructor(props: $.Props, layout?: $.Layout<ContextMenu>) {
        super(ContextMenu.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            position: 'absolute',
            maxHeight: '50dvh',
            overflowY: 'auto',
            boxSizing: 'border-box',
            border: '1px solid var(--input)',
            background: 'oklch(from var(--secondary-bg) l c h)',
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
            this.clickListener = (e) => {
                if (e.target === this.node) return;
                if (e.target && this.node?.contains(e.target as Node)) return;
                this.close();
            }
            setTimeout(() => window.addEventListener('click', this.clickListener!), 1)
            document.body.append(...this.toDOM());
            if (!this.node) return;
            const overX = e.x + this.node.offsetWidth > innerWidth;
            const overY = e.y + this.node.offsetHeight > innerHeight;
            this.style({
                top: overY ? '' : `${scrollY + e.y}px`,
                bottom: overY ? `calc(${-scrollY}px + 1rem)` : '',
                left: overX ? '' : `${scrollX + e.x}px`,
                right: overX ? `calc(1rem)` : ''
            })
        }
    }

    close(dispose = true) {
        this.removeNode();
        if (this.clickListener) window.removeEventListener('click', this.clickListener);
        this.clickListener = Utils.Null;
        if (dispose) this.dispose();
    }
}

export class ContextMenuItem extends ElementProto {
    static tagname = 'context-menu-item'
    private $menu: null | ContextMenu = Utils.Null;
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
        this.$menu = this.findAbove(proto => Utils.isInstanceof(proto, ContextMenu));
        return this;
    }
}