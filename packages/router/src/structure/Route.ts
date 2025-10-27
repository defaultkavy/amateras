import type { Page } from "#node/Page";
import { _null, _instanceof, isUndefined } from "@amateras/utils";
import { PageBuilder, type PageBuilderFunction } from "./PageBuilder";

export class Route<Path extends RoutePath = RoutePath, Params extends RouteParams = []> {
    readonly routes = new Map<RoutePath, Route>();
    readonly path: Path;
    readonly builder: PageBuilder<any> | undefined;
    readonly paths = new Map<string, RouteAliasParams<RoutePath, Params> | null>()
    readonly pages = new Map<string, Page>();
    redirectURL: string | null = null
    constructor(path: Path, builder?: RouteBuilder<Params>) {
        this.path = path;
        this.paths.set(path, _null);
        this.builder = _instanceof(builder, PageBuilder<any>) || isUndefined(builder) ? builder : new PageBuilder(builder as any);
    }
    

    alias<K extends string, P extends RouteAliasParams<K, Params>>(path: K, ...params: RequireKeys<P> extends never ? [] : [Prettify<P>]): this
    alias(path: string, params: RouteAliasParams<RoutePath, Params> | null = _null) {
        this.paths.set(path, params);
        return this;
    }
}

export interface Route<Path extends RoutePath = RoutePath, Params extends RouteParams = []> {
    route<
        P extends RoutePath, 
        B extends PageBuilder
    >(path: P, builder: B, handle?: (route: Route<`${Path}${P}`, B['params']>) => Route<`${Path}${P}`, B['params']>): this
    route<
        K extends RoutePath, 
        P extends [...Params, ...RouteParamsStrings<K>], 
        F extends PageBuilderFunction<P>
    >(path: K, builder: F, handle?: (route: Route<`${Path}${K}`, P>) => Route<`${Path}${K}`, P>): this
    route<
        K extends RoutePath, 
        P extends [...Params, ...RouteParamsStrings<K>], 
        F extends AsyncPageBuilder<P>
    >(path: K, builder: F, handle?: (route: Route<`${Path}${K}`, P>) => Route<`${Path}${K}`, P>): this
    route<P extends RoutePath>(path: P, builder: RouteBuilder<RouteParamsResolver<`${Path}${P}`>>, handle?: <R extends Route<`${Path}${P}`>>(route: R) => R): this;
    group<P extends RoutePath>(path: P, handle: <R extends Route<`${Path}${P}`>>(route: R) => R): this;
    notFound(builder: RouteBuilder<RouteParamsResolver<`${Path}`>>): this;
}

export type RouteBuilder<Params extends RouteParams = []> = PageBuilder<Params | `${string}?`[]> | AsyncPageBuilder<Params | `${string}?`[]> | PageBuilderFunction<Params>;
export type RoutePath = string;
export type RouteParams = string[]
export type AsyncPageBuilder<Params extends RouteParams = any> = () => Promise<{default: PageBuilder<Params>}>

export type RouteParamsResolver<Path extends RoutePath> = RouteParamsOptional<RouteParamsStrings<Path>>

/** Convert route path to literals array */
export type RouteParamsStrings<Path extends string> = 
    Path extends `${infer Segment}/${infer Rest}`
        ? Segment extends `${string}:${infer Param}` 
            ? [Param, ...RouteParamsStrings<Rest>]
            : [...RouteParamsStrings<Rest>]
        : Path extends `${string}:${infer Param}?${infer Query}`
            ? [Param]
        : Path extends `${string}:${infer Param}` 
            ? [Param] 
            : []
/** Convert route path to object structure */
export type RouteParamsConfig<Path extends string> =
    Path extends `${infer Segment}/${infer Rest}`
        ? Segment extends `${string}:${infer Param}` 
            ? { [key in Param]: string } & RouteParamsConfig<Rest>
            : RouteParamsConfig<Rest>
        : Path extends `${string}:${infer Param}?${infer Query}`
            ? { [key in Param]: string }
        : Path extends `${string}:${infer Param}` 
            ? { [key in Param]: string }
            : {}
/** Convert literals array to optional literals arrays */
export type RouteParamsOptional<Params extends string[]> =
    Params extends [infer A, ...infer Rest]
    ?   Rest extends string[]
        ?   A extends string
            ?   [A | `${A}?`, ...RouteParamsOptional<Rest>] | RouteParamsOptional<Rest>
            :   never
        :   never
    :   []

export type RouteAliasPath<Path extends string, RoutePath extends string> = RouteParamsStrings<RoutePath> extends RouteParamsStrings<Path> ? Route<RoutePath> : never

type RouteParamsConfigByArrayString<RouteParams extends string[]> =
    RouteParams extends [`${infer A}`, ...infer Rest]
    ?   Rest extends string[]
        ?   A extends `${infer P}?`
            ?   { [key in P]?: string } & RouteParamsConfigByArrayString<Rest>
            :   { [key in A]: string } & RouteParamsConfigByArrayString<Rest>
        :   never
    : {}


type RouteAliasParams<Path extends string, Params extends RouteParams> = Omit<RouteParamsConfigByArrayString<Params>, keyof RouteParamsConfig<Path>>

type a<T> = T[keyof T] extends (string | undefined) ? true : false

type b = RequireKeys<{t: string, a?: string, b?: string}> & {}

type RequireKeys<T> = {
    [K in keyof T]: {} extends Pick<T, K> ? never : K 
}[keyof T]; 