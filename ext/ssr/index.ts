import './env';
import 'amateras';
import { _Array_from, _instanceof, _Object_assign, _Object_defineProperty } from "amateras/lib/native";
import { $Element, $Node, $Text } from "amateras/node";
import { BROWSER, NODE } from 'esm-env';

declare module 'amateras/core' {
    export namespace $ {
        export function mount(id: string, $node: $Element): void;
        export function serverSide(cb: () => any): void;
    }
}

export function onserver<T>(cb: () => T): T | '' {
    if (NODE) return cb();
    return '';
}

export function onclient<T>(cb: () => T): T | undefined {
    if (BROWSER) return cb();
    return;
}

_Object_assign($, {
    mount(id: string, $node: $Element) {
        if (!BROWSER) return;
        const node = document.querySelector(`#${id}`);
        if (!node) throw 'Target node of mounting not found';
        getData(node, $node);
        node.replaceWith($node.node);
    
        function getData(node: Node, $node: $Node) {
            if (node.nodeName === 'SIGNAL' && _instanceof(node, Element) && _instanceof($node, $Text)) {
                const type = $(node).attr()['type'];
                return $node.signals.forEach(signal => signal.value(type === 'number' ? Number(node.textContent) : type === 'boolean' ? node.textContent == 'true' ? true : false : node.textContent));
            }
            if (_instanceof(node, Text)) return $node.textContent(node.textContent);
            if (_instanceof(node, Element) && _instanceof($node, $Element)) $node.attr($(node).attr());
            const arr = _Array_from($node.childNodes);
            node.childNodes.forEach((_node, i) => {
                const targetChildNode = arr.at(i);
                if (!targetChildNode) throw 'Target DOM tree not matched';
                getData(_node, targetChildNode.$)
            })
        }
    }
})