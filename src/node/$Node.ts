import { Signal } from "#structure/Signal";

export class $Node {
    node: Node;
    constructor(node: Node) {
        this.node = node;
        //@ts-expect-error
        this.node.$ = this;
    }

    content(children: $NodeContentResolver<this>) {
        this.node.childNodes.forEach(node => node.remove());
        return this.insert(children);
    }

    insert(resolver: $NodeContentResolver<this>, position = -1) {
        if (resolver instanceof Function) {
            const content = resolver(this);
            if (content instanceof Promise) content.then(content => $Node.insertChild(this.node, content, position))
            else $Node.insertChild(this.node, content, position);
        } else $Node.insertChild(this.node, resolver, position);
        return this;
    }

    await<T>(promise: Promise<T>, callback: ($node: this, result: T) => void): this {
        promise.then(result => callback(this, result));
        return this;
    }

    replace($node: $NodeContentTypes | undefined | null) {
        if (!$node) return this;
        this.node.parentNode?.replaceChild($Node.processContent($node), this.node);
        return this; 
    }

    static insertChild(node: Node, children: OrArray<OrPromise<$NodeContentTypes>>, position = -1) {
        children = $.orArrayResolver(children);
        // get child node at position
        const positionChild = Array.from(node.childNodes).filter(node => node.nodeType !== node.TEXT_NODE).at(position);
        // insert node helper function for depend position
        const append = (child: Node | undefined | null) => {
            if (!child) return;
            if (!positionChild) node.appendChild(child);
            else node.insertBefore(child, position < 0 ? positionChild.nextSibling : positionChild);
        }
        // process nodes
        for (const child of children) if (child !== undefined) append($Node.processContent(child))
    }

    static processContent(content: $NodeContentTypes): Node;
    static processContent(content: undefined | null): undefined | null;
    static processContent(content: OrPromise<undefined | null>): undefined | null;
    static processContent(content: OrPromise<$NodeContentTypes>): Node;
    static processContent(content: OrPromise<$NodeContentTypes | undefined | null>): Node | undefined | null
    static processContent(content: OrPromise<$NodeContentTypes | undefined | null>) {
        if (content === undefined) return undefined;
        if (content === null) return null;
        // is $Element
        if (content instanceof $Node) return content.node;
        // is Promise
        if (content instanceof Promise) {
            const async = $('async').await(content, ($async, $child) => $async.replace($child));
            return async.node;
        }
        // is SignalFunction
        if (content instanceof Function && (content as $.SignalFunction<any>).signal instanceof Signal) {
            const text = new Text();
            const set = (value: any) => text.textContent = value instanceof Object ? JSON.stringify(value) : value;
            (content as $.SignalFunction<any>).signal.subscribe(set);
            set((content as $.SignalFunction<any>)());
            return text;
        }
        // is string | number | boolean
        return new Text(`${content}`);
    }
}

export type $NodeContentTypes = $Node | string | number | boolean | $.SignalFunction<any>;
export type $NodeContentHandler<T extends $Node> = ($node: T) => OrPromise<OrArray<$NodeContentTypes>>;
export type $NodeContentResolver<T extends $Node> = $NodeContentHandler<T> | OrArray<OrPromise<$NodeContentTypes>>