import { _Array_from, _instanceof, isFunction, isNull, isObject, isUndefined } from "#lib/native";
import { Signal } from "#structure/Signal";

export class $Node {
    node: Node;
    constructor(node: Node) {
        this.node = node;
        //@ts-expect-error
        this.node.$ = this;
    }

    content(children: $NodeContentResolver<this>) {
        _Array_from(this.node.childNodes).forEach(node => node.remove());
        return this.insert(children);
    }

    insert(resolver: $NodeContentResolver<this>, position = -1) {
        if (isFunction(resolver)) {
            const content = resolver(this);
            if (_instanceof(content, Promise)) content.then(content => $Node.insertChild(this.node, content, position))
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
        const positionChild = _Array_from(node.childNodes).filter(node => node.nodeType !== node.TEXT_NODE).at(position);
        // insert node helper function for depend position
        const append = (child: Node | undefined | null) => {
            if (!child) return;
            if (!positionChild) node.appendChild(child);
            else node.insertBefore(child, position < 0 ? positionChild.nextSibling : positionChild);
        }
        // process nodes
        for (const child of children) !isUndefined(child) && append($Node.processContent(child))
    }

    static processContent(content: $NodeContentTypes): Node;
    static processContent(content: undefined | null): undefined | null;
    static processContent(content: OrPromise<undefined | null>): undefined | null;
    static processContent(content: OrPromise<$NodeContentTypes>): Node;
    static processContent(content: OrPromise<$NodeContentTypes | undefined | null>): Node | undefined | null
    static processContent(content: OrPromise<$NodeContentTypes | undefined | null>) {
        if (isUndefined(content)) return;
        if (isNull(content)) return content;
        // is $Element
        if (_instanceof(content, $Node)) return content.node;
        // is Promise
        if (_instanceof(content, Promise)) {
            const async = $('async').await(content, ($async, $child) => $async.replace($child));
            return async.node;
        }
        // is SignalFunction
        if (isFunction(content) && _instanceof((content as $.SignalFunction<any>).signal ,Signal)) {
            const text = new Text();
            const set = (value: any) => text.textContent = isObject(value) ? JSON.stringify(value) : value;
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