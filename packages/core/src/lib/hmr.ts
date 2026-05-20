import { ElementProto } from "#structure/ElementProto";
import { NodeProto } from "#structure/NodeProto";
import { Proto } from "#structure/Proto";
import { ProxyProto } from "#structure/ProxyProto";
import { TextProto } from "#structure/TextProto";
import { Utils } from "@amateras/utils";
import { symbol_ProtoType } from "./symbols";

const elementProtoMap = (() => {
    if (import.meta.hot) return import.meta.hot.data.protoMap ?? new Map<HTMLElement, Proto>();
    return new Map<HTMLElement, Proto>()
})()
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
                Utils.forEach(newProto.toDOM(), newNode => parentElement.insertBefore(newNode,prevSibling.nextSibling))
            else parentElement.append(...newProto.toDOM())
        }
        else {
            parentElement.replaceChildren(...newProto.toDOM())
        }
    }

    function transferNode() {
        if (!Utils.isInstanceof(oldProto, NodeProto) || !Utils.isInstanceof(newProto, NodeProto)) return;
        newProto.node = oldProto.node;
        oldProto.dispose();
        // if (newProto.modifiers) forEach(newProto.modifiers, mod => {
        //     if (!newProto.node) throw 'diff:transferNode:newProto.node==null'
        //     mod(newProto.node)
        // })
    }

    if (!oldProto) {
        processNoneNodeProto();
        return;
    }
    //@ts-ignore
    if (oldProto.constructor[symbol_ProtoType] !== 'Widget' || newProto.constructor[symbol_ProtoType] !== 'Widget') 
    if (oldProto.constructor !== newProto.constructor) {
        if (Utils.isInstanceof(oldProto, NodeProto)) {
            Utils.forEach(newProto.toDOM(), newNode => oldProto.node?.parentNode?.insertBefore(newNode, oldProto.node));
            oldProto.removeNode();
            oldProto.dispose();
            return;
        }
        processNoneNodeProto();
        oldProto.dispose();
        return;
    }
    
    if (Utils.isInstanceof(oldProto, ProxyProto)) {
        oldProto.node?.replaceWith(...newProto.toDOM());
        oldProto.removeNode();
        return;
    }
    if (Utils.isInstanceof(oldProto, TextProto) && Utils.isInstanceof(newProto, TextProto)) {
        if (oldProto.content !== newProto.content) {
            oldProto.node!.textContent = newProto.content;
        }
        transferNode();
        return;
    }
    if (Utils.isInstanceof(oldProto, ElementProto) && Utils.isInstanceof(newProto, ElementProto)) {
        if (!oldProto.node) return processNoneNodeProto();
        if (oldProto.tagname !== newProto.tagname) {
            oldProto.node?.replaceWith(...newProto.toDOM());
            return;
        };
        let newAttrList = Utils.arrayFrom(Utils.entries(newProto.attr()));
        let nodeAttrList = Utils.arrayFrom(oldProto.node.attributes);
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

    const oldProtoList = Utils.arrayFrom(oldProto.protos);
    const newProtoList = Utils.arrayFrom(newProto.protos);
    let length = Math.max(oldProto.protos.length, newProto.protos.length);
    let prevNode: Node | undefined = Utils.is(oldProto, ProxyProto)?.node ?? Utils.Undefined;
    for (let i = 0; i < length; i++) {
        const oldChildProto = oldProtoList[i];
        const newChildProto = newProtoList[i];
        if (!newChildProto) {
            if (oldChildProto) oldChildProto.removeNode();
            continue;
        };
        const parent = Utils.is(oldProto, ElementProto)?.node ?? parentElement;
        diff(parent, newChildProto, oldChildProto, prevNode);
        // set current child proto to be prev proto;
        if (Utils.isInstanceof(newChildProto, NodeProto)) {
            // current proto node should not be undefined
            if (!newChildProto.node) throw 'diff:newChildProto.node==undefined';
            prevNode = newChildProto.node;
        }
    }
}