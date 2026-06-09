import { toCSS, toUICSS } from "#lib/toCSS";
import { ElementProto, onclient } from "@amateras/core";
import { Utils } from '@amateras/utils';
import { content_css } from "../style/content_style";

export class ContextMenu extends ElementProto {
    static tagname = 'context-menu';
    $content: ContextMenuContent | null = Utils.Null;
    constructor(props: $.Props, layout?: $.Layout<ContextMenu>) {
        super(ContextMenu.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            position: 'fixed',
            inset: '0',
            transition: 'all .3s ease',
            zIndex: '999',

            '&[touch]': {
                background: 'oklch(from var(--bg) calc(l - 0.1) c h / .5)'
            }
        }))

        $.style(this, toCSS('html:has(context-menu)', {
            scrollbarGutter: 'stable', 
            overflowY: 'hidden',
            overflowX: 'hidden',
            height: '100dvh'
        }))
    }

    open({x, y, position, size}: {x: number, y: number, position?: 'top' | 'bottom', size?: number}) {
        if (onclient()) {
            this.build();
            this.on('pointerdown', (e) => {
                if (e.target === this.$content?.node) return;
                if (e.target && this.$content?.node?.contains(e.target as Node)) return;
                this.close();
            })
            document.body.append(...this.toDOM());
            const contentNode = this.$content?.node;
            if (!contentNode) return;
            const overX = x + contentNode.offsetWidth > innerWidth;
            const overY = y + contentNode.offsetHeight > innerHeight;
            if (innerWidth < 800 && document.documentElement.hasAttribute('touch')) {
                this.attr('touch', '');
                this.$content?.style({
                    bottom: '0',
                    width: '100dvw'
                })
                contentNode.animate({
                    translate: ['0 100%', '0 0']
                }, {
                    duration: 300,
                    easing: 'ease',
                    fill: 'both'
                })
            }
            else if (position) {
                this.$content?.style({
                    top: position === 'top' ? '' : `${y}px`,
                    bottom: position === 'top' ? `${innerHeight - y}px` : ``,
                    left: overX ? '' : `${x}px`,
                    right: overX ? `calc(var(--spacing) * 4)` : '',
                    width: size ? `${size}px` : ``
                })
            }
            else {
                this.$content?.style({
                    top: overY ? '' : `${y}px`,
                    bottom: overY? `calc(var(--spacing) * 4)` : '',
                    left: overX ? '' : `${x}px`,
                    right: overX ? `calc(var(--spacing) * 4)` : '',
                    width: size ? `${size}px` : ``
                })
            }
        }
    }

    close(dispose = true) {
        const remove = () => {
            this.removeNode()
            if (dispose) this.dispose();
        }
        if (!this.hasAttr('touch')) remove();
        else {
            if (!this.$content?.node) return;
            this.style({ background: 'transparent' })
            const animation = this.$content.node.animate({
                translate: ['0 0', '0 100%']
            }, {
                duration: 300,
                easing: 'ease',
                fill: 'both'
            })
            animation.addEventListener('finish', remove)
            animation.addEventListener('cancel', remove)
        }
    }
}

export class ContextMenuContent extends ElementProto {
    static tagname = 'context-menu-content'
    private $menu: null | ContextMenu = Utils.Null;
    constructor(props: $.Props, layout?: $.Layout<ContextMenuContent>) {
        super(ContextMenuContent.tagname, props, layout);
        this.on('click', () => this.$menu?.close())
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            ...content_css,
            background: 'oklch(from var(--secondary-bg) l c h)',

            'context-menu[touch] &': {
                borderRadius: 'calc(var(--radius) * 2)',
                padding: 'calc(var(--spacing) * 4)',
                gap: '0.1rem',
                border: 'none',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',

                '& > context-menu-item:first-child, & > :first-child context-menu-item': {
                    borderTopLeftRadius: 'calc(var(--radius) * 2)',
                    borderTopRightRadius: 'calc(var(--radius) * 2)',
                },
                '& > context-menu-item:last-child, & > :last-child context-menu-item': {
                    borderBottomLeftRadius: 'calc(var(--radius) * 2)',
                    borderBottomRightRadius: 'calc(var(--radius) * 2)',
                }
            },
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$menu = this.findAbove(proto => Utils.isInstanceof(proto, ContextMenu));
        if (this.$menu) this.$menu.$content = this;
        return this;
    }
}

export class ContextMenuItem extends ElementProto {
    static tagname = 'context-menu-item'
    private $menu: null | ContextMenu = Utils.Null;
    constructor(props: $.Props, layout?: $.Layout<ContextMenuItem>) {
        super(ContextMenuItem.tagname, props, layout);
        this.on('click', () => requestAnimationFrame(() => this.$menu?.close()))
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            boxSizing: 'border-box',
            padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-md)',
            fontWeight: '500',
            lineHeight: '1',

            'context-menu[touch] &': {
                fontSize: 'var(--text-md)',
                padding: 'calc(var(--spacing) * 4)',
                background: 'color-mix(in oklch, var(--secondary-bg), var(--input) 40%)',
                transition: 'all .3s ease',
                borderRadius: '0',

                'html:not([touch]) &:hover': {
                    background: 'color-mix(in oklch, var(--secondary-bg), var(--input) 20%)',
                },

                '&:active': {
                    scale: '.99 .99',
                    background: 'color-mix(in oklch, var(--secondary-bg), var(--input) 20%)',
                }
            },

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