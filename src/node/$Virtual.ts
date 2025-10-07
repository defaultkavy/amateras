import { chain } from "#lib/chain";
import { forEach, _Array_from, _instanceof, _null } from "#lib/native";
import { toArray } from "#lib/toArray";
import { $HTMLElement } from "#node/$HTMLElement";
import { $Node, type $NodeContentResolver } from "#node/$Node";

export class $Virtual<Ele extends HTMLElement = HTMLElement, EvMap = HTMLElementEventMap> extends $HTMLElement<Ele, EvMap> {
    nodes = new Set<$Node>();
    hiddenNodes = new Set<$Node>();
    constructor(resolver: string | Ele) {
        super(resolver);
    }

    content(children: $NodeContentResolver<this>) {
        return chain(this, _null, _null, children, children => {
            this.nodes.clear();
            forEach(this.childNodes, node => node.remove());
            this.insert(children);
        })
    }

    insert(resolver: $NodeContentResolver<this>, position = -1) {
        // process nodes
        forEach(toArray(resolver), resolve_child => {
            forEach($Node.process(this, resolve_child), $node => {
                $Virtual.append(this, $node, position)
                if (position >= 0) position++;
            })
        });
        return this;
    }

    hide($node?: $Node | null) {
        if ($node && this.nodes.has($node)) this.hiddenNodes.add($node);
        return this;
    }

    show($node?: $Node | null) {
        if ($node) this.hiddenNodes.delete($node);
        return this;
    }

    render() {
        // remove hidden node
        forEach(this.childNodes, node => this.hiddenNodes.has($(node)) && node.remove());
        // add visible node with position
        forEach(this.nodes, ($node, i) => {
            if (
                !this.hiddenNodes.has($node) // node is not hidden
                && !$node.inDOM() // node is not in dom tree
                && $(this.childNodes).at(i) !== $node // node not matched at position
            ) $Node.append(this, $node, i);
        })
        return this;
    }

    static append($node: $Virtual, child: $Node | undefined | null, position: number) {
        if (child) {
            const childList = _Array_from($node.nodes);
            if (!childList.at(position)) childList.push(child);
            else childList.splice(position >= 0 ? position : childList.length + 1 + position, 0, child);
            $node.nodes = new Set(childList);
        }
    }
}