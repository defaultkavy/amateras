import { Proto } from "#structure/Proto";
import { ProxyProto } from "#structure/ProxyProto";

declare global {
    interface Window {
        __registry_data__: Map<string, Constructor>;
        __registry__: (component: Constructor, moduleId: string, compoenentName: string) => void;
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
    window.__registry__ = (component: Constructor, moduleId: string, componentName: string) => {
        window.__registry_data__.set(`${new URL(moduleId).pathname} > ${componentName}`, component);
        component.moduleId = `${new URL(moduleId).pathname} > ${componentName}`;
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
    return true;
}