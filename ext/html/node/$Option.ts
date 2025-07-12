import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Option extends $HTMLElement<HTMLOptionElement> {
    constructor() {
        super('option')
    }
}

export interface $Option extends $HTMLElement<HTMLOptionElement> {
    /** {@link HTMLOptionElement.form} */
    readonly form: HTMLFormElement | null;
    /** {@link HTMLOptionElement.index} */
    readonly index: number;

    /** {@link HTMLOptionElement.defaultSelected} */
    defaultSelected(defaultSelected: $Parameter<boolean>): this;
    defaultSelected(): boolean;
    /** {@link HTMLOptionElement.disabled} */
    disabled(disabled: $Parameter<boolean>): this;
    disabled(): boolean;
    /** {@link HTMLOptionElement.label} */
    label(label: $Parameter<string>): this;
    label(): string;
    /** {@link HTMLOptionElement.selected} */
    selected(selected: $Parameter<boolean>): this;
    selected(): boolean;
    /** {@link HTMLOptionElement.text} */
    text(text: $Parameter<string>): this;
    text(): string;
    /** {@link HTMLOptionElement.value} */
    value(value: $Parameter<string>): this;
    value(): string;
}

assignHelper(HTMLOptionElement, $Option, 'option');

declare module '#core' {
    export function $(nodeName: 'option'): $Option
}