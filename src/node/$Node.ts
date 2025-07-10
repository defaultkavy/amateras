import { _Array_from, _instanceof, forEach, isFunction, isNull, isObject, isUndefined } from "#lib/native";
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
            // get child node at position
            const positionChild = _Array_from(this.childNodes).filter(node => node.nodeType !== node.TEXT_NODE).at(position);
            forEach($.toArray(children), child => {
                if (!child) return;
                if (_instanceof(child, Array)) this.insert(child);
                else if (!positionChild) this.appendChild(child.node);
                else this.insertBefore(child.node, position < 0 ? positionChild.nextSibling : positionChild);
            })
        }
        // process nodes
        for (const child of $.toArray(resolver)) !isUndefined(child) && appendChild(processContent(this, child))
        return this;
    }

    await<T>(promise: Promise<T>, callback: ($node: this, result: T) => void): this {
        return promise.then(result => callback(this, result)), this;
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
        if (_instanceof((content as $.SignalFunction<any>).signal, Signal)) {
            const signalFn = content as $.SignalFunction<any>;
            const $text = document ? new $Text() : $('signal').attr({ type: typeof signalFn.signal.value() });
            const set = (value: any) => $text.textContent(isObject(value) ? JSON.stringify(value) : value);
            if (_instanceof($text, $Text)) $text.signals.add(signalFn.signal);
            signalFn.signal.subscribe(set);
            set(signalFn());
            return $text;
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
export type $NodeContentResolver<T extends $Node> = OrMatrix<OrPromise<$NodeContentTypes | $NodeContentHandler<T>>>;

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

    /** {@link Node.nodeValue} */
    nodeValue(nodeValue: $Parameter<string | null>): this;
    nodeValue(): string | null;
    /** {@link Node.textContent} */
    textContent(textContent: $Parameter<string | null>): this;
    textContent(): string | null;
}