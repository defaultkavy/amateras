import type { $Node } from "#node/$Node";
import type { $TextNode } from "#node/$Text";
import type { $Layout } from "#structure/$Layout";
import * as core from "./index";

declare global {
    export import $ = core.$;
    
    /** $Node content builder function. */
    export type $Builder = () => void | $Node | $TextNode[];
    /** $Node properties. */
    export type $Props<T = {}> = { [key: string & {}]: any } & Partial<$.AttrMap> & T;
    /** A function that return layout of component. */
    export type $Component = (props: any, builder?: $Builder) => $Layout;
}