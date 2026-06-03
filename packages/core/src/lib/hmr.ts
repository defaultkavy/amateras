import { Proto } from "#structure/Proto";
import { ProxyProto } from "#structure/ProxyProto";

declare global {
    interface Window {
        __registry_data__: Map<string, Constructor>;
        __registry__: (component: Constructor, moduleId: string) => void;
        __reload_module__: () => void;
    }

    interface Object {
        moduleId: string | undefined;
    }
}

let rootProto: Proto | null = null;

if (import.meta.hot) {
    import.meta.hot.dispose((data) => {
        data.rootProto = rootProto;
    })

    window.__registry_data__ = new Map();
    window.__registry__ = (component: Constructor, moduleId: string) => {
        window.__registry_data__.set(new URL(moduleId).pathname, component);
        component.moduleId = new URL(moduleId).pathname;
    }
    window.__reload_module__ = () => {
        const root = import.meta.hot.data.rootProto as Proto ?? rootProto;
        if (!root) return;
        root.findBelowAll(proto => {
            if (proto.constructor.moduleId) {
                const constructor = window.__registry_data__.get(proto.constructor.moduleId);
                if (!constructor) return;
                if (proto.constructor === constructor) return;
                if (proto instanceof ProxyProto === false) return;
                //@ts-ignore
                proto.constructor.builder = constructor.builder;
                const [_, ...oldNodes] = proto.toDOM();
                const oldNode = proto.node;
                $.context(proto.parent, () => {
                    const nodes = proto.build().toDOM();
                    oldNode?.replaceWith(...nodes);
                })
                //@ts-ignore
                oldNodes.forEach(node => node.remove())
                return true;
            }
        })
    }
}

export const hmr = (element: Element, newProto: Proto) => {
    if (!import.meta.hot) return false;

    const oldProto = import.meta.hot.data.rootProto;
    rootProto = newProto;
    if (!oldProto) return false;
    element.replaceChildren(...newProto.toDOM())
    oldProto.dispose();
    // diff(oldProto, newProto);
    return true;
}

// function diff(oldProto: Proto, newProto: Proto) {
//     if ((newProto.constructor as any)[symbol_ProtoType] === 'Widget' && (oldProto.constructor as any)[symbol_ProtoType] === 'Widget') {}
//     else if (newProto.constructor !== oldProto.constructor) {
//         if (oldProto instanceof NodeProto) {
//             const oldNode = oldProto.node as Node | null;
//             const newNodes = newProto.toDOM();
//             if (oldNode instanceof Element) oldNode.replaceWith(...newNodes);
//             else oldNode?.parentNode?.append(...newNodes)
//         }
//         else {
//             if (newProto.parent) newProto.parent.toDOM();
//             else location.reload();
//         }
//         oldProto.dispose();
//         return false;
//     }

//     transfer(oldProto, newProto)
    
//     if (newProto instanceof ProxyProto) {
//         oldProto.dispose();
//         return true;
//     }

//     const oldProtoChildren = oldProto.protos;
//     const newProtoChildren = newProto.protos;
//     const length = Math.max(oldProto.protos.length, newProto.protos.length);
//     let offset = 0;
//     for (let i = 0; i < length; i++) {
//         const oldChildProto = oldProtoChildren[i + offset];
//         const newChildProto = newProtoChildren[i];
//         if (!newChildProto) {
//             oldChildProto?.removeNode();
//             oldChildProto?.dispose();
//             continue;
//         }
//         if (!oldChildProto) {
//             newProto.virtual = true;
//             newProto.toDOM();
//             newProto.virtual = false;
//             break;
//         }
//         if (!diff(oldChildProto, newChildProto)) offset--;
//     }
//     oldProto.dispose(false);
//     return true;
// }

// function transfer(oldProto: Proto, newProto: Proto) {
//     if (oldProto instanceof ProxyProto && newProto instanceof ProxyProto) {
//         oldProto.node?.replaceWith(...newProto.toDOM());
//         oldProto.removeNode();
//         return;
//     }
//     if (oldProto instanceof NodeProto && newProto instanceof NodeProto) {
//         newProto.node = oldProto.node;
//         newProto.listeners?.dom?.forEach(fn => fn(newProto.node));
//     }
//     if (oldProto instanceof TextProto && newProto instanceof TextProto) {
//         if (oldProto.content !== newProto.content) newProto.node!.textContent = newProto.content;
//     }

//     if (oldProto instanceof ElementProto && newProto instanceof ElementProto) {
//         console.debug(oldProto.attr(), newProto.attr())
//         if (!Utils.isEqual(oldProto.attr(), newProto.attr())) {
//             console.debug(true)
//             ElementProto.attrProcess(newProto, newProto.attr())
//         }
//     }
// }