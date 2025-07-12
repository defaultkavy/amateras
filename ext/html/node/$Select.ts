import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Select extends $HTMLElement<HTMLSelectElement> {
    constructor() {
        super('select')
    }
}

export interface $Select extends $HTMLElement<HTMLSelectElement> {
    /** {@link HTMLSelectElement.form} */
    readonly form: HTMLFormElement | null;
    /** {@link HTMLSelectElement.labels} */
    readonly labels: NodeListOf<HTMLLabelElement>;
    /** {@link HTMLSelectElement.options} */
    readonly options: HTMLOptionsCollection;
    /** {@link HTMLSelectElement.selectedOptions} */
    readonly selectedOptions: HTMLCollectionOf<HTMLOptionElement>;
    /** {@link HTMLSelectElement.type} */
    readonly type: "select-one" | "select-multiple";
    /** {@link HTMLSelectElement.validationMessage} */
    readonly validationMessage: string;
    /** {@link HTMLSelectElement.validity} */
    readonly validity: ValidityState;
    /** {@link HTMLSelectElement.willValidate} */
    readonly willValidate: boolean;

    /** {@link HTMLSelectElement.autocomplete} */
    autocomplete(autocomplete: $Parameter<AutoFill>): this;
    autocomplete(): AutoFill;
    /** {@link HTMLSelectElement.disabled} */
    disabled(disabled: $Parameter<boolean>): this;
    disabled(): boolean;
    /** {@link HTMLSelectElement.length} */
    length(length: $Parameter<number>): this;
    length(): number;
    /** {@link HTMLSelectElement.multiple} */
    multiple(multiple: $Parameter<boolean>): this;
    multiple(): boolean;
    /** {@link HTMLSelectElement.name} */
    name(name: $Parameter<string>): this;
    name(): string;
    /** {@link HTMLSelectElement.required} */
    required(required: $Parameter<boolean>): this;
    required(): boolean;
    /** {@link HTMLSelectElement.selectedIndex} */
    selectedIndex(selectedIndex: $Parameter<number>): this;
    selectedIndex(): number;
    /** {@link HTMLSelectElement.size} */
    size(size: $Parameter<number>): this;
    size(): number;
    /** {@link HTMLSelectElement.value} */
    value(value: $Parameter<string>): this;
    value(): string;

    /** {@link HTMLSelectElement.add} */
    add(element: HTMLOptionElement | HTMLOptGroupElement, before?: HTMLElement | number | null): this;
    /** {@link HTMLSelectElement.checkValidity} */
    checkValidity(): boolean;
    /** {@link HTMLSelectElement.item} */
    item(index: number): HTMLOptionElement | null;
    /** {@link HTMLSelectElement.namedItem} */
    namedItem(name: string): HTMLOptionElement | null;
    /** {@link HTMLSelectElement.reportValidity} */
    reportValidity(): boolean;
    /** {@link HTMLSelectElement.setCustomValidity} */
    setCustomValidity(error: string): this;
    /** {@link HTMLSelectElement.showPicker} */
    showPicker(): this;
}

assignHelper(HTMLSelectElement, $Select, 'select');

declare module '#core' {
    export function $(nodeName: 'select'): $Select
}