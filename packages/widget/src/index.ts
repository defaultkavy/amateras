import { WidgetConstructor, type Widget } from '#structure/Widget';
import { type Proto } from '@amateras/core';
import { _Object_assign } from '@amateras/utils';

declare global {
    export namespace $ {
        export function widget<Props = {}, Parent extends Proto = never>(builder: WidgetBuilder<Props, Parent>): Widget<Props, Parent>;
    }

    export function $<Props, Parent extends Proto>(block: Widget<Props, Parent>, ...args: BlockCraftArguments<Props, Parent>): Widget<Props, Parent>;
}
export type WidgetBuilder<Props = any, Parent extends Proto = any> = (props: $.Props<Props>, children: $.Layout<Parent>) => void;
type BlockCraftArguments<Props, Parent extends Proto> = 
        RequiredKeys<Props> extends never
        ?   [children?: $.Layout<Parent>] | [props?: $.Props<Props>, children?: $.Layout<Parent>]
        :   [props: $.Props<Props>, children?: $.Layout<Parent>];

_Object_assign($, {
    widget(builder: WidgetBuilder) {
        return WidgetConstructor(builder);
    }
})

export * from '#structure/Widget';