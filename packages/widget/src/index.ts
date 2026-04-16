import { WidgetConstructor } from '#structure/Widget';
import { type Proto } from '@amateras/core';
import { _Object_assign } from '@amateras/utils';

declare global {
    export namespace $ {
        export function widget<Props = {}, Parent extends Proto = never>(builder: WidgetBuilder<Props, Parent>): WidgetConstructor<Props, Parent>;

        export interface Overload<I> {
            widget: [
                input: [WidgetConstructor<any, any>],
                output: I[0] extends WidgetConstructor ? InstanceType<I[0]> : never,
                args: I[0] extends WidgetConstructor<infer Props, infer Parent> 
                    ?   WidgetConstructorArguments<Props, Parent>
                    :   never
            ]
        }
    }

    // export function $<Props, Parent extends Proto>(widget: WidgetConstructor<Props, Parent>, ...args: WidgetConstructorArguments<Props, Parent>): Widget<Props, Parent>;
}

export type WidgetBuilder<Props = any, Parent extends Proto = any> = (props: $.Props<Props>, children: $.Layout<Parent>) => void;

type WidgetConstructorArguments<Props, Parent extends Proto> = 
    RequiredKeys<Props> extends never
    ? [props?: $.Props<Props>, children?: $.Layout<Parent>] | [children?: $.Layout<Parent>]
    : [props: $.Props<Props>, children?: $.Layout<Parent>];

_Object_assign($, {
    widget(builder: WidgetBuilder) {
        return WidgetConstructor(builder);
    }
})

export * from '#structure/Widget';