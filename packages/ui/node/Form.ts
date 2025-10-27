import { $HTMLElement } from "@amateras/core/node/$HTMLElement";
import type { $Node } from "@amateras/core/node/$Node";
import { $Form } from "@amateras/html/node/$Form";
import { $Input } from "@amateras/html/node/$Input";
import { $Label } from "@amateras/html/node/$Label";
import { _instanceof, _undefined } from "@amateras/utils";


export class Form extends $Form {
    constructor() {
        super();
    }

    get data() {
        return Object.fromEntries(new FormData(this.node).entries());
    }
}

export class FormField extends $HTMLElement {
    constructor() {
        super('form-field');
    }
}

export class FormItem extends $HTMLElement {
    constructor(name?: string) {
        super('form-item');
        this.attr({ name });
    }
}

export class Label extends $Label {
    constructor() {
        super();
    }

    mounted($parent: $Node): void {
        if (_instanceof($parent, FormItem)) 
            this.htmlFor($parent.attr('name') ?? _undefined);
    }
}

export class Input extends $Input {
    constructor() {
        super();
    }

    mounted($parent: $Node): void {
        if (_instanceof($parent, FormItem)) {
            const name = $parent.attr('name') ?? _undefined;
            this.id(name).name(name);
        }
    }
}