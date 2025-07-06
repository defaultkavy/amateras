import { Signal } from "#structure/Signal";
import { $Node } from "#node/$Node";
import { _Array_from, _instanceof, _Object_assign, _Object_entries, _Object_fromEntries, isUndefined } from "#lib/native";
const EVENT_LISTENERS = new WeakMap<$Element, Map<Function, (event: Event) => void>>();

export class $Element<Ele extends Element = Element> extends $Node {
    declare node: Ele
    constructor(resolver: Ele | string) {
        super(_instanceof(resolver, Element) ? resolver : createNode(resolver) as unknown as Ele)
        //@ts-expect-error
        this.node.$ = this;
    }

    attr(): {[key: string]: string};
    attr(obj: {[key: string]: string | number | boolean | Signal<any>}): this;
    attr(obj?: {[key: string]: string | number | boolean | Signal<any>}) {
        if (!arguments.length) return _Object_fromEntries(_Array_from(this.node.attributes).map(attr => [attr.name, attr.value]));
        if (obj) for (let [key, value] of _Object_entries(obj)) {
            const set = (value: any) => !isUndefined(value) && this.node.setAttribute(key, `${value}`)
            if (_instanceof(value, Signal)) value = value.subscribe(set).value();
            set(value);
        }
        return this;
    }

    class(...token: string[]) {
        this.node.classList = token.join(' ');
        return this;
    }

    addClass(...token: string[]) {
        this.node.classList.add(...token);
        return this;
    }
    
    removeClass(...token: string[]) {
        this.node.classList.remove(...token);
        return this;
    }

    use(callback: ($ele: this) => void) {
        callback(this);
        return this;
    }

    on<K extends keyof HTMLElementEventMap>(type: K, listener: ($node: this, event: Event) => void, options?: boolean | AddEventListenerOptions) {
        const handler = (event: Event) => listener(this, event);
        EVENT_LISTENERS.get(this)?.set(listener, handler) ?? EVENT_LISTENERS.set(this, new Map().set(listener, handler));
        this.node.addEventListener(type, handler, options);
        return this;
    }

    off<K extends keyof HTMLElementEventMap>(type: K, listener: ($node: this, event: Event) => void, options?: boolean | EventListenerOptions) {
        const eventMap = EVENT_LISTENERS.get(this);
        const handler = eventMap?.get(listener);
        if (handler) this.node.removeEventListener(type, handler, options);
        eventMap?.delete(listener);
        return this;
    }
    
    once<K extends keyof HTMLElementEventMap>(type: K, listener: ($node: this, event: Event) => void, options?: boolean | AddEventListenerOptions) {
        const handler = ($node: this, event: Event) => {
            this.off(type, handler, options);
            listener($node, event);
        }
        this.on(type, handler, options);
        return this;
    }

    toString() {
        return this.node.outerHTML;
    }
}

function createNode(nodeName: string) {
    //@ts-expect-error
    return !document ? new Node(nodeName) as unknown as Node & ChildNode : document.createElement(nodeName);
}