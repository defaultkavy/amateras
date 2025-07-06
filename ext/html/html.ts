import '#core';
import { $Node } from '#node/$Node';
import { $HTMLElement } from '#node/$HTMLElement';
import './node/type';
import { assignHelper } from '#lib/assignHelper';
export * from './node/type';

// create element classes
export const [
    $Input,
    $Anchor,
    $Image,
    $Canvas,
    $Dialog,
    $Form,
    $Label,
    $Media,
    $Select,
    $Option,
    $OptGroup,
    $TextArea,
] = [
    $HTMLElementBuilder<HTMLInputElement>('input'),
    $HTMLElementBuilder<HTMLAnchorElement>('a'),
    $HTMLElementBuilder<HTMLImageElement>('img'),
    $HTMLElementBuilder<HTMLCanvasElement>('canvas'),
    $HTMLElementBuilder<HTMLDialogElement>('dialog'),
    $HTMLElementBuilder<HTMLFormElement>('form'),
    $HTMLElementBuilder<HTMLLabelElement>('label'),
    $HTMLElementBuilder<HTMLMediaElement>('media'),
    $HTMLElementBuilder<HTMLSelectElement>('select'),
    $HTMLElementBuilder<HTMLOptionElement>('option'),
    $HTMLElementBuilder<HTMLOptGroupElement>('optgroup'),
    $HTMLElementBuilder<HTMLTextAreaElement>('textarea'),
]

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

function $HTMLElementBuilder<Ele extends HTMLElement>(tagName: string) {
    return class extends $HTMLElement<Ele> {
        constructor() { super(tagName) }
    } 
}