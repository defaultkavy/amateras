import type { $Node } from "#node/$Node";
import { _Array_from, _null, forEach, map } from "@amateras/utils";

export class $Layout {
    static parent: $Layout | null = _null;
    nodes = new Set<$Node>();
    #builder: () => void;
    constructor(builder: () => void) {
        this.#builder = builder;
    }

    build(): $Node[];
    build(target: 'html'): string[];
    build(target: 'dom'): Node[];
    build(target?: 'html' | 'dom') {
        let parent = $Layout.parent;
        $Layout.parent = this;
        this.#builder();
        $Layout.parent = parent;
        forEach(this.nodes, $node => parent?.nodes.add($node));
        let nodes = _Array_from(this.nodes);
        this.nodes.clear();
        if (target === 'html') return map(nodes, $node => $node.toHTML());
        else if (target === 'dom') return map(nodes, $node => $node.toDOM());
        return nodes;
    }
}