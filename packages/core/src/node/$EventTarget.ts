import { forEach, isBoolean, toArray } from "@amateras/utils";

export class $EventTarget<EvMap = {}> {
    node: EventTarget;
    constructor(node: EventTarget) {
        this.node = node;
        if (node !== window) (node as Mutable<EventTarget>).$ = this;
    }
    
    on(type: string | string[], listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | AddEventListenerOptions): this {
        forEach(toArray(type), type => this.addEventListener(type, listener, options));
        return this;
    }

    off(type: string | string[], listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | EventListenerOptions): this {
        forEach(toArray(type), type => this.removeEventListener(type, listener, options));
        return this
    }
    
    once(type: string | string[], listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | AddEventListenerOptions): this {
        forEach(toArray(type), type => this.on(type, listener, { once: true, ...(isBoolean(options) ? { capture: options } : options ?? {}) }));
        return this
    }
}

export type $Event<E extends $EventTarget, Ev = any> = Ev & {currentTarget: {$: E}};
export type $EventListener<E extends $EventTarget, Ev> = (event: $Event<E, Ev>) => void;
export type $EventListenerObject<E extends $EventTarget, Ev> = { handleEvent(object: $Event<E, Ev>): void; }

export interface $EventTarget<EvMap = {}> {
    /** {@link EventTarget.addEventListener} */
    addEventListener<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | AddEventListenerOptions): this;
    addEventListener(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | AddEventListenerOptions): this;
    /** {@link EventTarget.removeEventListener} */
    removeEventListener<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | EventListenerOptions): this;
    removeEventListener(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | EventListenerOptions): this;
    /** {@link EventTarget.dispatchEvent} */
    dispatchEvent(event: Event): boolean;
    
    on<K extends keyof EvMap, Ev extends EvMap[K]>(type: K | K[], listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | AddEventListenerOptions): this;
    on(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | AddEventListenerOptions): this;

    off<K extends keyof EvMap, Ev extends EvMap[K]>(type: K | K[], listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | EventListenerOptions): this;
    off(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | EventListenerOptions): this;

    once<K extends keyof EvMap, Ev extends EvMap[K]>(type: K | K[], listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | AddEventListenerOptions): this;
    once(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | AddEventListenerOptions): this;
}