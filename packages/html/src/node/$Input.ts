import { assignProperties } from "@amateras/core/lib/assignProperties";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

export class $Input extends $HTMLElement<HTMLInputElement> {
    constructor() {
        super('input')
    }
}

export interface $Input extends $HTMLElement<HTMLInputElement> {
    /** {@link HTMLInputElement.form} */
    readonly form: HTMLFormElement | null;
    /** {@link HTMLInputElement.labels} */
    readonly labels: NodeListOf<HTMLLabelElement> | null;
    /** {@link HTMLInputElement.list} */
    readonly list: HTMLDataListElement | null;
    /** {@link HTMLInputElement.validationMessage} */
    readonly validationMessage: string;
    /** {@link HTMLInputElement.validity} */
    readonly validity: ValidityState;
    /** {@link HTMLInputElement.webkitEntries} */
    readonly webkitEntries: ReadonlyArray<FileSystemEntry>;
    /** {@link HTMLInputElement.willValidate} */
    readonly willValidate: boolean;

    /** {@link HTMLInputElement.checkValidity} */
    checkValidity(): boolean;
    /** {@link HTMLInputElement.reportValidity} */
    reportValidity(): boolean;
    /** {@link HTMLInputElement.select} */
    select(): this;
    /** {@link HTMLInputElement.setCustomValidity} */
    setCustomValidity(error: string): this;
    /** {@link HTMLInputElement.setRangeText} */
    setRangeText(replacement: string): this;
    setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): this;
    /** {@link HTMLInputElement.setSelectionRange} */
    setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none"): this;
    /** {@link HTMLInputElement.showPicker} */
    showPicker(): this;
    /** {@link HTMLInputElement.stepDown} */
    stepDown(n?: number): this;
    /** {@link HTMLInputElement.stepUp} */
    stepUp(n?: number): this;
    
    /** {@link HTMLInputElement.accept} */
    accept(accept: $Parameter<string>): this;
    accept(): string;
    /** {@link HTMLInputElement.alt} */
    alt(alt: $Parameter<string>): this;
    alt(): string;
    /** {@link HTMLInputElement.autoFill} */
    autoFill(autoFill: $Parameter<AutoFill>): this;
    autoFill(): AutoFill;
    /** {@link HTMLInputElement.capture} */
    capture(capture: $Parameter<string>): this;
    capture(): string;
    /** {@link HTMLInputElement.checked} */
    checked(checked: $Parameter<boolean>): this;
    checked(): boolean;
    /** {@link HTMLInputElement.defaultChecked} */
    defaultChecked(defaultChecked: $Parameter<boolean>): this;
    defaultChecked(): string;
    /** {@link HTMLInputElement.defaultValue} */
    defaultValue(defaultValue: $Parameter<string>): this;
    defaultValue(): string;
    /** {@link HTMLInputElement.dirName} */
    dirName(dirName: $Parameter<string>): this;
    dirName(): string;
    /** {@link HTMLInputElement.disabled} */
    disabled(disabled: $Parameter<boolean>): this;
    disabled(): boolean;
    /** {@link HTMLInputElement.files} */
    files(files: $Parameter<FileList | null>): this;
    files(): string;
    /** {@link HTMLInputElement.formAction} */
    formAction(formAction: $Parameter<string>): this;
    formAction(): string;
    /** {@link HTMLInputElement.formEnctype} */
    formEnctype(formEnctype: $Parameter<string>): this;
    formEnctype(): string;
    /** {@link HTMLInputElement.formMethod} */
    formMethod(formMethod: $Parameter<string>): this;
    formMethod(): string;
    /** {@link HTMLInputElement.formNoValidate} */
    formNoValidate(formNoValidate: $Parameter<boolean>): this;
    formNoValidate(): boolean;
    /** {@link HTMLInputElement.formTarget} */
    formTarget(formTarget: $Parameter<string>): this;
    formTarget(): string;
    /** {@link HTMLInputElement.height} */
    height(height: $Parameter<number>): this;
    height(): number;
    /** {@link HTMLInputElement.indeterminate} */
    indeterminate(indeterminate: $Parameter<boolean>): this;
    indeterminate(): boolean;
    /** {@link HTMLInputElement.max} */
    max(max: $Parameter<string>): this;
    max(): string;
    /** {@link HTMLInputElement.maxLength} */
    maxLength(maxLength: $Parameter<number>): this;
    maxLength(): number;
    /** {@link HTMLInputElement.min} */
    min(min: $Parameter<string>): this;
    min(): string;
    /** {@link HTMLInputElement.minLength} */
    minLength(minLength: $Parameter<string>): this;
    minLength(): string;
    /** {@link HTMLInputElement.multiple} */
    multiple(multiple: $Parameter<boolean>): this;
    multiple(): boolean;
    /** {@link HTMLInputElement.name} */
    name(name: $Parameter<string>): this;
    name(): string;
    /** {@link HTMLInputElement.pattern} */
    pattern(pattern: $Parameter<string>): this;
    pattern(): string;
    /** {@link HTMLInputElement.placeholder} */
    placeholder(placeholder: $Parameter<string>): this;
    placeholder(): string;
    /** {@link HTMLInputElement.readOnly} */
    readOnly(readOnly: $Parameter<boolean>): this;
    readOnly(): boolean;
    /** {@link HTMLInputElement.required} */
    required(required: $Parameter<boolean>): this;
    required(): boolean;
    /** {@link HTMLInputElement.selectionDirection} */
    selectionDirection(selectionDirection: $Parameter<'forward' | 'backward' | 'none' | null>): this;
    selectionDirection(): 'forward' | 'backward' | 'none' | null;
    /** {@link HTMLInputElement.selectionEnd} */
    selectionEnd(selectionEnd: $Parameter<number | null>): this;
    selectionEnd(): number | null;
    /** {@link HTMLInputElement.selectionStart} */
    selectionStart(selectionStart: $Parameter<number>): this;
    selectionStart(): number;
    /** {@link HTMLInputElement.size} */
    size(size: $Parameter<number>): this;
    size(): number;
    /** {@link HTMLInputElement.src} */
    src(src: $Parameter<string>): this;
    src(): string;
    /** {@link HTMLInputElement.step} */
    step(step: $Parameter<string>): this;
    step(): string;
    /** {@link HTMLInputElement.type} */
    type(type: $Parameter<InputType>): this;
    type(): InputType;
    /** {@link HTMLInputElement.value} */
    value(value: $Parameter<string>): this;
    value(): string;
    /** {@link HTMLInputElement.valueAsDate} */
    valueAsDate(valueAsDate: $Parameter<Date | null>): this;
    valueAsDate(): Date | null;
    /** {@link HTMLInputElement.valueAsNumber} */
    valueAsNumber(valueAsNumber: $Parameter<number>): this;
    valueAsNumber(): number;
    /** {@link HTMLInputElement.webkitdirectory} */
    webkitdirectory(webkitdirectory: $Parameter<boolean>): this;
    webkitdirectory(): boolean;
    /** {@link HTMLInputElement.width} */
    width(width: $Parameter<number>): this;
    width(): number;
}

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

assignProperties(HTMLInputElement, $Input, 'input');

declare module "@amateras/core" {
    export function $(nodeName: 'input'): $Input
}