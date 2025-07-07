import '#core';
import { $Node } from '#node/$Node';
import { $HTMLElement } from '#node/$HTMLElement';
import { assignHelper } from '#lib/assignHelper';
import { $Anchor } from './node/$Anchor';
import { $Dialog } from './node/$Dialog';
import { $Form } from './node/$Form';
import { $Image } from './node/$Image';
import { $Canvas } from './node/$Canvas';
import { $Input } from './node/$Input';
import { $Label } from './node/$Label';
import { $Media } from './node/$Media';
import { $OptGroup } from './node/$OptGroup';
import { $Option } from './node/$Option';
import { $Select } from './node/$Select';
import { $TextArea } from './node/$TextArea';
export * from './node/$Anchor';
export * from './node/$Canvas';
export * from './node/$Dialog';
export * from './node/$Form';
export * from './node/$Image';
export * from './node/$Input';
export * from './node/$Label';
export * from './node/$Media';
export * from './node/$OptGroup';
export * from './node/$Option';
export * from './node/$Select';
export * from './node/$TextArea';

const targets: [object: Constructor<Node>, target: Constructor<$Node>, tagname?: string][] = [
    [HTMLInputElement, $Input, 'input'],
    [HTMLAnchorElement, $Anchor, 'a'],
    [HTMLImageElement, $Image, 'img'],
    [HTMLCanvasElement, $Canvas, 'canvas'],
    [HTMLDialogElement, $Dialog, 'dialog'],
    [HTMLFormElement, $Form, 'form'],
    [HTMLLabelElement, $Label, 'label'],
    [HTMLMediaElement, $Media, 'media'],
    [HTMLSelectElement, $Select, 'select'],
    [HTMLOptionElement, $Option, 'option'],
    [HTMLOptGroupElement, $OptGroup, 'optgroup'],
    [HTMLTextAreaElement, $TextArea, 'textarea'],
];
assignHelper(targets);

declare module '#core' {
    export function $(nodeName: 'input'): $Input
    export function $(nodeName: 'a'): $Anchor
    export function $(nodeName: 'img'): $Image
    export function $(nodeName: 'dialog'): $Dialog
    export function $(nodeName: 'form'): $Form
    export function $(nodeName: 'label'): $Label
    export function $(nodeName: 'media'): $Media
    export function $(nodeName: 'select'): $Select
    export function $(nodeName: 'option'): $Option
    export function $(nodeName: 'otpgroup'): $OptGroup
    export function $(nodeName: 'textarea'): $TextArea
    export function $(nodeName: string): $HTMLElement
}