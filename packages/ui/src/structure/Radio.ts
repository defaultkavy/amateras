import { ElementProto } from "@amateras/core";
import { _null, is } from "@amateras/utils";
import { UID } from "@amateras/utils";

export interface RadioGroupProps {
    value?: any;
    name?: string;
}

export class RadioGroup extends ElementProto {
    value: any;
    constructor({value, ...props}: $.Props<RadioGroupProps>, layout?: $.Layout<RadioGroup>) {
        super('radio-group', props, layout);
        this.value = value;
        this.on('input', e => {
            this.value = is(e.target, HTMLInputElement)?.value
        })
    }

    static {
        $.style(RadioGroup, 'radio-group{display:block}')
    }
}

export interface RadioItemProps {
    inputId?: string;
    name?: string;
    value: any;
}

export class RadioItem<T> extends ElementProto {
    inputId: string;
    name: string | null;
    value: T;
    constructor({inputId, name, value, ...props}: $.Props<RadioItemProps>, layout?: $.Layout<RadioItem<T>>) {
        super('radio-item', props, layout);
        this.inputId = inputId ?? `input-${UID.persistInProto(this, 'radio-item')}`;
        this.name = name ?? _null;
        this.value = value;
    }

    static {
        $.style(RadioItem, 'radio-item{display:block}')
    }
}

export class Radio extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<Radio>) {
        super('input', {type: 'radio', ...props}, layout);
    }

    override build(children?: boolean): this {
        let selector = this.findAbove(proto => is(proto, RadioItem));
        if (selector) {
            this.attr('id', selector.inputId);
            this.attr('name', selector.name);
        }
        return super.build(children);
    }
}

export class Label extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<Label>) {
        super('label', props, layout);
    }

    override build(children?: boolean): this {
        let selector = this.findAbove(proto => is(proto, RadioItem));
        if (selector) this.attr('for', selector.inputId)
        return super.build(children);
    }
}

const randomIdMap = new Map<string, Set<string>>();
function randomIdUnique() {

}