import '#env';
import './global'
import { $Node } from "#node/$Node";
import { $TextNode } from "#node/$Text";
import { $Layout } from "#structure/$Layout";
import { _Array_from, _instanceof, _null, _Object_entries, _undefined, forEach, isArray, isFunction, isNumber, isString, startsWith } from "@amateras/utils"
import { _document, onclient } from '#env';

type $ComponentArguments<P> = 
    RequiredKeys<P> extends never 
        ? [ $Props, $Builder ] 
            | [ $Props ] 
            | []
        : [ P, $Builder ]
            | [ P ];

/**  */
export function $<P extends object>(component: (props: P, builder?: $Builder) => $Layout, ...[arg1, arg2]: $ComponentArguments<P>): $Node;
export function $(str: TemplateStringsArray, ...value: $.TextProcessorValue[]): $TextNode[];
export function $(tagname: string, builder: $Builder): $Node;
export function $(tagname: string, props?: $Props, builder?: $Builder): $Node;
export function $(arg1: string | TemplateStringsArray | $Component, ...args: unknown[]) {
    // Create $Node with tagname
    if (isString(arg1)) {
        const parent = $Node.parent;
        const $node = new $Node(arg1);
        const [arg2, arg3] = args as [$Builder | $Props | undefined, $Builder | undefined];
        const processChild = (child: $Builder) => {
            $Node.parent = $node;
            if (isFunction(child)) child?.();
            $Node.parent = parent;
        }
        parent?.nodes.add($node);
        // arg2
        if (arg2) 
            if (isFunction(arg2)) processChild(arg2 as $Builder);
            else {
                forEach(_Object_entries(arg2), ([key, value]) => {
                    for (let processor of $.processor.attr) 
                        if (processor(key, value, $node)) return;
                    $node.attr.set(key, value);
                })
            }
        // arg3
        if (arg3) processChild(arg3);
        if (!parent) $Layout.parent?.nodes.add($node);
        return $node;
    }

    // Create $Node with Layout Function
    if (isFunction(arg1)) {
        let [arg2, arg3] = args as [$Builder | $Props | undefined, $Builder | undefined];
        arg1(isFunction(arg2) ? {} : arg2 ?? {}, arg3).build()
    }

    // Create $TextNode with Template String
    if (isArray(arg1)) {
        let str: string = arg1[0];
        const textArr: $TextNode[] = [];
        loop1: for (let i = 0; i < args.length; i++) {
            let target = args[i];
            if (isString(target) || isNumber(target)) str += target;
            else {
                for (let processor of $.processor.text) {
                    let result = processor(target);
                    if (result) {
                        textArr.push(new $TextNode(str));
                        str = '';
                        textArr.push(result);
                        break loop1;
                    };
                }
                str += target;
            }
        }
        if (str.length) textArr.push(new $TextNode(str));
        forEach(textArr, text => $Node.parent?.nodes.add(text) || $Layout.parent?.nodes.add(text));
        return textArr;
    }

}

type $TextProcessor = (value: any) => $TextNode | void;
type $AttributeProcessor = (key: string, value: any, $node: $Node) => boolean | void;

export namespace $ {

    export const stylesheet = onclient() ? new CSSStyleSheet() : null;
    onclient(() => _document.adoptedStyleSheets.push(stylesheet!));
    export const style = (css: string) => stylesheet?.insertRule(css);

    export const layout = (builder: () => void) => new $Layout(builder);

    export const processor = {
        text: new Set<$TextProcessor>(),
        attr: new Set<$AttributeProcessor>()
    } as const

    export type TextProcessorValue = ValueOf<TextProcessorValueMap>
    export interface TextProcessorValueMap {
        string: string;
        number: number;
        boolean: boolean;
        undefined: undefined;
    }

    export interface AttrMap {
        class: string;
        id: string;
    }
}

$.processor.attr.add((key, value, node) => {
    if (startsWith(key, 'on')) {
        node.ondom(element => element?.addEventListener(key.slice(2), value));
        return true;
    }
})

export type $ = typeof $;
globalThis.$ = $;