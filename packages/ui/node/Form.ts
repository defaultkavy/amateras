import { $Form } from 'amateras/html/$Form';
import { $HTMLElement } from 'amateras/node/$HTMLElement';
import { $Label } from 'amateras/html/$Label';
import { $Input } from 'amateras/html/$Input';
import type { $Node } from '../../../src/node/$Node';
import { _instanceof, _undefined } from '../../../src/lib/native';

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