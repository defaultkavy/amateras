import { chain } from "#lib/chain";
import { _document } from "#lib/env";
import { _Array_from, _instanceof, _JSON_stringify, _null, _Promise, forEach, isFunction, isNull, isUndefined } from "#lib/native";
import { toArray } from "#lib/toArray";
import { $EventTarget } from "./$EventTarget";

export class $Node<EvMap = {}> extends $EventTarget<EvMap> {
    declare node: Node & ChildNode & ParentNode;
    static processors = new Set<$NodeContentProcessor>();
    static setters = new Set<$NodeSetterHandler>();
    constructor(node: Node & ChildNode) {
        super(node);
    }

    content(children: $NodeContentResolver<this>) {
        return chain(this, _null, _null, children, children => {
            forEach(_Array_from(this.childNodes), node => node.remove());
            this.insert(children);
        })
    }

    insert(resolver: $NodeContentResolver<this>, position = -1) {
        // process nodes
        forEach(toArray(resolver), resolve_child => forEach($Node.process(this, resolve_child), $node => {
            $Node.append(this, $node, position);
            if (position >= 0) position++;
        }));
        return this;
    }

    await<T>(promise: OrPromise<T>, callback: ($node: this, result: T) => void): this {
        if (_instanceof(promise, Promise)) promise.then(result => callback(this, result));
        else callback(this, promise);
        return this;
    }

    replace($node: $NodeContentResolver<$Node>) {
        if ($node) 
            this.replaceWith(
                ...toArray($Node.process(this, $node)).filter($node => $node).map($node => $node?.node) as Node[]
            )
        return this;
    }

    inDOM() {
        return _document.contains(this.node);
    }

    toString() {
        return this.textContent();
    }

    mounted($parent: $Node) {}
    
    use<F extends ($ele: this, ...args: any) => void>(callback: F, ...args: F extends ($ele: this, ...args: infer P) => void ? P : never) {
        callback(this, ...args);
        return this;
    }

    is<T extends (abstract new (...args: any[]) => $Node)>(instance: T): InstanceType<T> | null {
        return _instanceof(this, instance) ? this : null;
    }

    static process<T extends $Node>($node: T, content: $NodeContentResolver<any>): Array<$Node | undefined | null> {
        for (const processor of this.processors) {
            const result = processor($node, content);
            if (result) return result;
        }
        if (isUndefined(content) || isNull(content) || _instanceof(content, $Node)) return [content];
        // is Promise
        if (_instanceof(content, _Promise)) return [$('async').await(content, ($async, $child) => $async.replace($child as any))];
        // is SignalFunction or ContentHandler
        if (isFunction(content)) {
            const _content = content($node) as $NodeContentResolver<$Node>;
            if (_instanceof(_content, _Promise)) return this.process($node, _content as any);
            else return toArray(_content).map(content => this.process($node, content)).flat();
        }
        // is nested array
        if (_instanceof(content, Array)) return content.map(c => this.process($node, c)).flat();
        // is string | number | boolean
        return [new $Text(`${content}`)];
    }

    /**  */
    static append($node: $Node, child: $Node | undefined | null, position: number) {
        if (child) {
            // get child node at position
            let positionChild = _Array_from($node.childNodes).at(position);
            if (!positionChild) $node.appendChild(child.node);
            else $node.insertBefore(child.node, position < 0 ? positionChild.nextSibling : positionChild);
            child.mounted($node);
        }
    }
}

export class $Text extends $Node {
    constructor(textContent?: string) {
        super(new Text(textContent));
    }
}

export type $NodeSetterHandler = (value: any, set: (value: any) => void) => any;
export type $NodeContentProcessor = <N extends $Node>($node: N, content: $NodeContentResolver<N>) => Array<$Node | undefined | null> | void | undefined;
export type $NodeContentHandler<T extends $Node> = ($node: T) => OrPromise<$NodeContentResolver<T>>;
export type $NodeContentTypes = $Node | string | number | boolean | $.$NodeContentTypeExtends | null | undefined;
export type $NodeContentResolver<T extends $Node> = OrPromise<$NodeContentTypes | $NodeContentHandler<T> | $NodeContentResolver<T>[]>;

export interface $Node<EvMap = {}> extends $EventTarget<EvMap> {
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
    /** {@link ParentNode.childElementCount} */
    readonly childElementCount: number;
    /** {@link ParentNode.children} */
    readonly children: HTMLCollection;
    /** {@link ParentNode.firstElementChild} */
    readonly firstElementChild: Element | null;
    /** {@link ParentNode.lastElementChild} */
    readonly lastElementChild: Element | null;
    
    /** {@link Node.appendChild} */
    appendChild<T extends Node>(node: T): T;
    /** {@link Node.cloneNode} */
    cloneNode(subtree?: boolean): Node;
    /** {@link Node.compareDocumentPosition} */
    compareDocumentPosition(other: $EventTarget | Node): number;
    /** {@link Node.getRootNode} */
    getRootNode(options?: GetRootNodeOptions): Node;
    /** {@link Node.hasChildNodes} */
    hasChildNodes(): boolean;
    /** {@link Node.insertBefore} */
    insertBefore<T extends Node>(node: T, child: Node | null): T;
    /** {@link Node.isDefaultNamespace} */
    isDefaultNamespace(namespace: string | null): boolean;
    /** {@link Node.isEqualNode} */
    isEqualNode(otherNode: $EventTarget | Node | null): boolean;
    /** {@link Node.isSameNode} */
    isSameNode(otherNode: $EventTarget | Node | null): boolean;
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
    /** {@link Node.contains} */
    contains(other: $EventTarget | Node | null | undefined): boolean;

    /** {@link ChildNode.after} */
    after(...nodes: ($EventTarget | Node | string)[]): this;
    /** {@link ChildNode.before} */
    before(...nodes: ($EventTarget | Node | string)[]): this;
    /** {@link ChildNode.remove} */
    remove(): this;
    /** {@link ChildNode.replaceWith} */
    replaceWith(...nodes: ($EventTarget | Node | string)[]): this;
    /** {@link ParentNode.append} */
    append(...nodes: ($EventTarget | Node | string)[]): this;
    /** {@link ParentNode.prepend} */
    prepend(...nodes: ($EventTarget | Node | string)[]): this;
    /** {@link ParentNode.querySelector} */
    querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
    querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
    querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
    querySelector<E extends Element = Element>(selectors: string): E | null;
    /** {@link ParentNode.querySelectorAll} */
    querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
    querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
    querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
    /** {@link ParentNode.replaceChildren} */
    replaceChildren(...nodes: ($EventTarget | Node | string)[]): this;

    /** {@link Node.nodeValue} */
    nodeValue(nodeValue: $Parameter<string | null>): this;
    nodeValue(): string | null;
    /** {@link Node.textContent} */
    textContent(textContent: $Parameter<string | null>): this;
    textContent(): string | null;
}