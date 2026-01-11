import type { RouteSlot } from "#structure/RouteSlot";
import type { Widget } from "@amateras/widget/structure/Widget";

export type RoutePath = string;

export type RouteParams = { [key: string]: string }

export type PageBuilder<Path extends RoutePath = any> = (context: { params: PathToParamsMap<Path>, slot: RouteSlot }) => void;

export type AsyncWidget<Params = any> = [() => Promise<{ default: Widget<any, Params> }>]

export type PathToParamsUnion<T extends RoutePath> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | PathToParamsUnion<Rest>
    : T extends `${infer _Start}:${infer Param}`
      ? Param
      : never;

export type ParamsArrayToParamsMap<ParamArray extends string[]> = ParamsUnionToMap<ParamArray[number]>
// type Test_ParamsArrayToParamsMap = ParamsArrayToParamsMap<['test1' | 'test2' | 'test3?' | 'test4']>

export type ParamsUnionToMap<T extends string> = Prettify<{
    [P in T extends `${string}?` ? never : T]: string;
} & {
    [P in T extends `${infer Key}?` ? Key : never]?: string;
}>
// type Test_ParamRequired = ParamsUnionToMap<'test1' | 'test2' | 'test3?' | 'test4'>

export type PathToParamsMap<Path extends RoutePath> = {
    [P in PathToParamsUnion<Path>]: string
}
// type Test_PathToParamsMap = PathToParamsMap<'/path/:test1/path/@:test2/:test3/:test4'>

export type PathConcat<A extends string, B extends string, C extends string = ''> = `${A}${B}${C}`;

export type AliasRequired<Params, AliasParams> = Omit<Params, keyof AliasParams>;

export type ValidatePath<Path extends string, Props, FullPath extends string> = 
    RequiredKeys<Props> extends PathToParamsUnion<FullPath>
        ?   Path
        :   `Error: (${FullPath}) Missing keys: ${Exclude<RequiredKeys<Props>, PathToParamsUnion<FullPath>> & string}`;