import { toCSS } from "#lib/toCSS";
import { ElementProto, onclient } from "@amateras/core";
import { _null } from "@amateras/utils";

export class Toast extends ElementProto {
    static $container: null | ToastContainer = _null;
    constructor(props: $.Props, layout?: $.Layout<Toast>) {
        super('toast', props, layout);
    }

    static popup({position, ...props}: $.Props, layout?: $.Layout<Toast>) {
        if (!onclient()) return;
        this.$container = this.$container ?? new ToastContainer({});
        const $toast = new Toast(props, layout);
        const $list = this.$container.list(position ?? 'top');
        this.$container.append($list);
        $list.append($toast);
        $toast.build();
        // render container and children
        const nodes = this.$container.toDOM();
        if (!document.body.contains(this.$container.node)) document.body.append(...nodes);
        setTimeout(() => {
            $toast.remove();
            $toast.removeNode();
            $toast.dispose();
        }, 3000);
    }
}

export type ToastPosition = 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

class ToastContainer extends ElementProto {
    static tagname = 'toast-container';
    listMap = {} as Record<ToastPosition, ToastList | undefined>
    constructor(props: $.Props, layout?: $.Layout<ToastContainer>) {
        super('toast-container', props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            position: 'fixed',
            inset: '0 0 0 0',
            pointerEvents: 'none'
        }))
    }

    list(position: ToastPosition) {
        return this.listMap[position] = this.listMap[position] ?? new ToastList({position}).build();
    }
}

interface ToastListProps {
    position: ToastPosition
}

class ToastList extends ElementProto {
    static tagname = 'toast-list';
    constructor(props: $.Props<ToastListProps>, layout?: $.Layout<ToastList>) {
        super('toast-list', props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 2)',
            pointerEvents: 'auto',
            position: 'absolute',
            
            '&[position="top"]': {
                top: '0',
                placeSelf: 'center'
            },
            
            '&[position="top-left"]': {
                top: '0',
                placeSelf: 'start'
            },
            
            '&[position="top-right"]': {
                top: '0',
                placeSelf: 'end'
            },
            
            '&[position="bottom"]': {
                bottom: '0',
                placeSelf: 'center'
            },
            
            '&[position="bottom-left"]': {
                bottom: '0',
                placeSelf: 'start'
            },
            
            '&[position="bottom-right"]': {
                bottom: '0',
                placeSelf: 'end'
            }
        }))
    }
}