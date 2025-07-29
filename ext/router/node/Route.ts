import { _instanceof, _Object_fromEntries, _Array_from } from "#lib/native";
import { $Element } from "#node/$Element";
import type { AsyncRoute, RouteBuilder, RouteDataResolver } from "..";
import { Page } from "./Page";

export abstract class BaseRouteNode<Path extends string = string> extends $Element {
    readonly path: Path;
    routes = new Map<string, Route<any>>()
    parent: BaseRouteNode<any> | null = null;
    builder: RouteBuilder<Route<Path>, RouteDataResolver<Path>> | AsyncRoute<Path>
    constructor(path: Path, builder: RouteBuilder<Route<Path>, RouteDataResolver<Path>> | AsyncRoute<Path>, nodeName: string) {
        super(nodeName);
        this.path = path;
        this.builder = builder;
    }

    route<P extends string, J extends `${Path}${P}`>(
        path: P, 
        resolver: RouteBuilder<Route<J>, RouteDataResolver<J>> | Route<J> | AsyncRoute<J>, 
        fn?: (route: Route<J>) => Route<J>
    ) {
        const fullPath = `${this.path}${path}`;
        if (_instanceof(resolver, Route) && fullPath !== resolver.path) throw `Pathname not matched: ${path}`
        const route = resolver instanceof Route ? resolver : new Route(fullPath as J, resolver);
        route.parent = this;
        fn && fn(route);
        this.routes.set(path, route);
        return this;
    }
}

export class Route<Path extends string = string> extends BaseRouteNode<Path> {
    constructor(path: Path, builder: RouteBuilder<Route<Path>, RouteDataResolver<Path>> | AsyncRoute<Path>) {
        super(path, builder, 'route');
    }

    async build(data: {params: any, query: any} = {params: {}, query: {}}, page?: Page) {
        page = page ?? new Page(this, data);
        page.params = data.params;
        page.initial = true;
        let resolver: any = this.builder(page);
        if (_instanceof(resolver, Promise)) {
            const result = await resolver as any;
            // Module import
            if (result[Symbol.toStringTag] === 'Module') {
                page.route = this;
                resolver = result.default.builder(page);
            }
            else resolver = result;
        }
        if (!_instanceof(resolver, Page)) page.content(resolver);
        return page;
    }
}