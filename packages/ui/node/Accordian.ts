import { chain } from "@amateras/core/lib/chain";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";
import type { $Node, $NodeContentResolver } from "@amateras/core/node/$Node";
import { _Array_from, _instanceof, forEach, isNull } from "@amateras/utils";

const [ACCORDIAN, ACCORDIAN_ITEM, ACCORDIAN_TRIGGER, ACCORDIAN_CONTENT, ACCORDIAN_CONTAINER] = ['accordian', 'accordian-item', 'accordian-trigger', 'accordian-content', 'accordian-container'] as const;
forEach([
    `${ACCORDIAN},${ACCORDIAN_ITEM},${ACCORDIAN_TRIGGER}{display:block}`,
    `${ACCORDIAN_CONTENT}{display:grid;grid-template-rows:0fr}`,
    `${ACCORDIAN_CONTENT}[opened]{grid-template-rows:1fr}`,
    `${ACCORDIAN_CONTAINER}{overflow:hidden}`,
], $.style)

export class Accordian extends $HTMLElement {
    #autoclose = false;
    constructor() {
        super(ACCORDIAN);
    }

    autoclose(): boolean;
    autoclose(autoclose: boolean): this;
    autoclose(autoclose?: boolean) {
        return chain(this, arguments, () => this.#autoclose, autoclose, autoclose => this.#autoclose = autoclose);
    }

    get items() {
        return _Array_from($(this.childNodes)).filter($child => _instanceof($child, AccordianItem))
    }
}

export class AccordianItem extends $HTMLElement {
    $content: null | AccordianContent = null;
    $trigger: null | AccordianTrigger = null;
    $root: null | Accordian = null;
    constructor() {
        super(ACCORDIAN_ITEM);
    }

    mounted($parent: $Node): this {
        if (_instanceof($parent, Accordian)) this.$root = $parent;
        forEach($(this.childNodes), $c => {
            if (_instanceof($c, AccordianTrigger)) this.$trigger = $c;
            if (_instanceof($c, AccordianContent)) this.$content = $c;
        })
        return this;
    }
}

export class AccordianTrigger extends $HTMLElement {
    $item: null | AccordianItem = null;
    constructor() {
        super(ACCORDIAN_TRIGGER);
        this.on('click', _ => {
            const $item = this.$item;
            const $root = $item?.$root;
            this.$item?.$content?.use($content => isNull($content.attr('opened')) ? $content.open() : $content.close());
            $root?.autoclose() && $root.items.forEach($i => $i !== $item && $i.$content?.close())
        })
    }

    mounted($parent: $Node): this {
        if (_instanceof($parent, AccordianItem)) this.$item = $parent;
        return this;
    }
}

export class AccordianContent extends $HTMLElement {
    $container = $(AccordianContainer);
    constructor() {
        super(ACCORDIAN_CONTENT);
        super.insert(this.$container);
    }

    content(children: $NodeContentResolver<AccordianContainer>): this {
        this.$container.content(children);
        return this;
    }

    insert(resolver: $NodeContentResolver<AccordianContainer>, position?: number): this {
        this.$container.insert(resolver, position);
        return this;
    }

    open() {
        return this.attr({opened: ''})
    }

    close() {
        return this.attr({opened: null});
    }
}

export class AccordianContainer extends $HTMLElement {
    constructor() {
        super(ACCORDIAN_CONTAINER);
    }
}