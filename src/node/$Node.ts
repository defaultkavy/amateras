import { _Array_from, _document, _instanceof, _JSON_stringify, forEach, isFunction, isNull, isObject, isUndefined } from "#lib/native";
import { Signal } from "#structure/Signal";

export class $Node {
    node: Node & ChildNode;
    constructor(node: Node & ChildNode) {
        this.node = node;
        //@ts-expect-error
        this.node.$ = this;
    }

    content(children: $NodeContentResolver<this>) {
        forEach(_Array_from(this.childNodes), node => node.remove());
        return this.insert(children);
    }

    insert(resolver: $NodeContentResolver<this>, position = -1) {
        // insert node helper function for depend position
        const appendChild = (children: OrArray<$Node | undefined | null>) => {
            // insert each child, child may be an array
            forEach($.toArray(children), child => {
                // get child node at position
                let positionChild = _Array_from(this.childNodes).at(position);
                if (!child) return;
                if (_instanceof(child, Array)) this.insert(child);
                else if (!positionChild) this.appendChild(child.node);
                else this.insertBefore(child.node, position < 0 ? positionChild.nextSibling : positionChild);
                // if position is positive, add position count for next child
                position >= 0 && position++
            })
        }
        // process nodes
        forEach($.toArray(resolver), child => !isUndefined(child) && appendChild(processContent(this, child)));
        return this;
    }

    await<T>(promise: OrPromise<T>, callback: ($node: this, result: T) => void): this {
        if (_instanceof(promise, Promise)) return promise.then(result => callback(this, result)), this;
        else return callback(this, promise), this;
    }

    replace($node: $NodeContentResolver<$Node>) {
        if (!$node) return this;
        this.replaceWith(
            ...$.toArray(processContent(this, $node)).filter($node => $node).map($node => $node?.node) as Node[]
        )
        return this;
    }

    toString() {
        return this.textContent();
    }
}

function processContent<T extends $Node>($node: T, content: $NodeContentResolver<any>): OrArray<$Node | undefined | null> {
    if (isUndefined(content)) return;
    if (isNull(content)) return content;
    // is $Element
    if (_instanceof(content, $Node)) return content;
    // is Promise
    if (_instanceof(content, Promise)) return $('async').await(content, ($async, $child) => $async.replace($child as any));
    // is SignalFunction or ContentHandler
    if (isFunction(content)) {
        const signal = (content as any).signal;
        if (_instanceof(signal, Signal)) {
            const resolver = (content as $.SignalFunction<any>)();
            if (_instanceof(resolver, $Node)) {
                // handler signal $Node result
                let node = resolver;
                const set = (value: any) => {
                    node.replace(value);
                    node = value;
                }
                signal.subscribe(set);
                return resolver;
            } else {
                // handler signal other type result
                const $text = _document ? new $Text() : $('signal').attr({ type: typeof signal.value() });
                const set = (value: any) => $text.textContent(isObject(value) ? _JSON_stringify(value) : value);
                if (_instanceof($text, $Text)) $text.signals.add(signal);
                signal.subscribe(set);
                set(resolver);
                return $text;
            }
        } else {
            const _content = content($node) as $NodeContentResolver<$Node>;
            if (_instanceof(_content, Promise)) return processContent($node, _content as any);
            else return $.toArray(_content).map(content => processContent($node, content) as $Node);
        }
    }
    // is nested array
    if (_instanceof(content, Array)) return content.map(c => processContent($node, c) as $Node)
    // is string | number | boolean
    return new $Text(`${content}`);
}

export class $Text extends $Node {
    signals = new Set<Signal<any>>();
    constructor(textContent?: string) {
        super(new Text(textContent));
    }
}

export type $NodeContentHandler<T extends $Node> = ($node: T) => OrPromise<$NodeContentResolver<T>>;
export type $NodeContentTypes = $Node | string | number | boolean | $.SignalFunction<any> | null | undefined;
export type $NodeContentResolver<T extends $Node> = OrPromise<$NodeContentTypes | $NodeContentHandler<T> | $NodeContentResolver<T>[]>;

export interface $Node {
    /** {@link Node.baseURI} */
    readonly baseURI: string;
    /** {@link Node.childNodes} */
    readonly childNodes: NodeListOf<ChildNode>;
    /** {@link Node.firstChild} */
    readonly firstChild: ChildNode | null;
    /** {@link Node.isConnected} */
    readonly isConnected: boolean;
    /** {@link Node.lastChild} */
    readonly lastChild: ChildNode | null;
    /** {@link Node.nextSibling} */
    readonly nextSibling: ChildNode | null;
    /** {@link Node.nodeName} */
    readonly nodeName: string;
    /** {@link Node.nodeType} */
    readonly nodeType: number;
    /** {@link Node.ownerDocument} */
    readonly ownerDocument: Document | null;
    /** {@link Node.parentElement} */
    readonly parentElement?: HTMLElement | null;
    /** {@link Node.parentNode} */
    readonly parentNode?: ParentNode | null;
    /** {@link Node.previousSibling} */
    readonly previousSibling?: ChildNode | null;
    
    /** {@link Node.appendChild} */
    appendChild<T extends Node>(node: T): T;
    /** {@link Node.cloneNode} */
    cloneNode(subtree?: boolean): Node;
    /** {@link Node.compareDocumentPosition} */
    compareDocumentPosition(other: Node): number;
    /** {@link Node.getRootNode} */
    getRootNode(options?: GetRootNodeOptions): Node;
    /** {@link Node.hasChildNodes} */
    hasChildNodes(): boolean;
    /** {@link Node.insertBefore} */
    insertBefore<T extends Node>(node: T, child: Node | null): T;
    /** {@link Node.isDefaultNamespace} */
    isDefaultNamespace(namespace: string | null): boolean;
    /** {@link Node.isEqualNode} */
    isEqualNode(otherNode: Node | null): boolean;
    /** {@link Node.isSameNode} */
    isSameNode(otherNode: Node | null): boolean;
    /** {@link Node.lookupNamespaceURI} */
    lookupNamespaceURI(prefix: string | null): string | null;
    /** {@link Node.lookupPrefix} */
    lookupPrefix(namespace: string | null): string | null;
    /** {@link Node.normalize} */
    normalize(): this;
    /** {@link Node.removeChild} */
    removeChild<T extends Node>(child: T): T;
    /** {@link Node.replaceChild} */
    replaceChild<T extends Node>(node: Node, child: T): T;
    /** {@link Node.replaceChild} */
    after(...nodes: (Node | string)[]): this;
    /** {@link Node.replaceChild} */
    before(...nodes: (Node | string)[]): this;
    /** {@link Node.replaceChild} */
    remove(): this;
    /** {@link Node.replaceChild} */
    replaceWith(...nodes: (Node | string)[]): this;
    /** {@link EventTarget.dispatchEvent} */
    dispatchEvent(event: Event): boolean;

    /** {@link Node.nodeValue} */
    nodeValue(nodeValue: $Parameter<string | null>): this;
    nodeValue(): string | null;
    /** {@link Node.textContent} */
    textContent(textContent: $Parameter<string | null>): this;
    textContent(): string | null;
}