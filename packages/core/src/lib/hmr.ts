import { ElementProto } from "#structure/ElementProto";
import { NodeProto } from "#structure/NodeProto";
import { Proto } from "#structure/Proto";
import { ProxyProto } from "#structure/ProxyProto";
import { TextProto } from "#structure/TextProto";
import { forEach, _instanceof, _Array_from, _undefined, is } from "@amateras/utils";
import { symbol_ProtoType } from "./symbols";

const elementProtoMap = import.meta.hot?.data.protoMap ?? new Map<HTMLElement, Proto>()
// save data before HMR
if (import.meta.hot) import.meta.hot.dispose(data => {
    data.protoMap = elementProtoMap;
})

export const hmr = (element: HTMLElement, proto: Proto): boolean => {
    if (!import.meta.hot) return false;

    function replace() {
        let nodes = proto.build().toDOM();
        element.replaceChildren(...nodes);
        elementProtoMap.set(element, proto);
    }

    // get proto from data;
    const oldProto = elementProtoMap.get(element);
    if (!oldProto) return replace(), true;

    diff(element, proto.build(), oldProto)
    elementProtoMap.set(element, proto);
        
    return true;
}


function diff(parentElement: HTMLElement, newProto: Proto, oldProto?: Proto, prevSibling?: Node): void {
    // console.table({
    //     parent: [parentElement], 
    //     new: [newProto, newProto.toString()], 
    //     old: [oldProto, oldProto?.toString()], 
    //     prev: [prevSibling]
    // })
    function processNoneNodeProto() {
        // None node Proto type
        if (prevSibling) {
            if (prevSibling.nextSibling)
                forEach(newProto.toDOM(), newNode => parentElement.insertBefore(newNode,prevSibling.nextSibling))
            else parentElement.append(...newProto.toDOM())
        }
        else {
            parentElement.replaceChildren(...newProto.toDOM())
        }
    }

    function transferNode() {
        if (!_instanceof(oldProto, NodeProto) || !_instanceof(newProto, NodeProto)) return;
        newProto.node = oldProto.node;
        oldProto.dispose();
        forEach(newProto.modifiers, mod => {
            if (!newProto.node) throw 'diff:transferNode:newProto.node==null'
            mod(newProto.node)
        })
    }

    if (!oldProto) {
        processNoneNodeProto();
        return;
    }
    //@ts-ignore
    if (oldProto.constructor[symbol_ProtoType] !== 'Widget' || newProto.constructor[symbol_ProtoType] !== 'Widget') 
    if (oldProto.constructor !== newProto.constructor) {
        if (_instanceof(oldProto, NodeProto)) {
            forEach(newProto.toDOM(), newNode => oldProto.node?.parentNode?.insertBefore(newNode, oldProto.node));
            oldProto.removeNode();
            oldProto.dispose();
            return;
        }
        processNoneNodeProto();
        oldProto.dispose();
        return;
    }
    
    if (_instanceof(oldProto, ProxyProto)) {
        oldProto.node?.replaceWith(...newProto.toDOM());
        oldProto.removeNode();
        return;
    }
    if (_instanceof(oldProto, TextProto) && _instanceof(newProto, TextProto)) {
        if (oldProto.content !== newProto.content) {
            oldProto.node!.textContent = newProto.content;
        }
        transferNode();
        return;
    }
    if (_instanceof(oldProto, ElementProto) && _instanceof(newProto, ElementProto)) {
        if (!oldProto.node) return processNoneNodeProto();
        if (oldProto.name !== newProto.name) {
            oldProto.node?.replaceWith(...newProto.toDOM());
            return;
        };
        let newAttrList = _Array_from(newProto.attr)
        let nodeAttrList = _Array_from(oldProto.node.attributes);
        let length = Math.max(newAttrList.length, nodeAttrList.length);
        for (let i = 0; i < length; i++) {
            let newAttr = newAttrList[i];
            let nodeAttr = nodeAttrList[i];
            if (!nodeAttr && newAttr) {
                oldProto.node.setAttribute(newAttr[0], newAttr[1])
                continue;
            }
            if (nodeAttr) {
                if (!newAttr) {
                    oldProto.node.removeAttributeNode(nodeAttr);
                    continue;
                }
                else {
                    if (nodeAttr.value !== newAttr[1]) nodeAttr.value = newAttr[1];
                    continue;
                }
            }
            throw 'diff:newAttr==nodeAttr==undefined';
        }
        transferNode();
    }

    const oldProtoList = _Array_from(oldProto.protos);
    const newProtoList = _Array_from(newProto.protos);
    let length = Math.max(oldProto.protos.size, newProto.protos.size);
    let prevNode: Node | undefined = is(oldProto, ProxyProto)?.node ?? _undefined;
    for (let i = 0; i < length; i++) {
        const oldChildProto = oldProtoList[i];
        const newChildProto = newProtoList[i];
        if (!newChildProto) {
            if (oldChildProto) oldChildProto.removeNode();
            continue;
        };
        const parent = is(oldProto, ElementProto)?.node ?? parentElement;
        diff(parent, newChildProto, oldChildProto, prevNode);
        // set current child proto to be prev proto;
        if (_instanceof(newChildProto, NodeProto)) {
            // current proto node should not be undefined
            if (!newChildProto.node) throw 'diff:newChildProto.node==undefined';
            prevNode = newChildProto.node;
        }
    }
}