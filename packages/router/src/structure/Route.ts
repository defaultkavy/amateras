import { isFunction, isUndefined } from "@amateras/utils";
import type { Widget } from "@amateras/widget/structure/Widget";
import type { AliasRequired, AsyncWidget, PageBuilder, PathConcat, PathToParamsMap, RouteParams, RoutePath, ValidatePath } from "../types";
import type { Page } from "./Page";
import type { RouteSlot } from "./RouteSlot";
import type { Router } from "./Router";


export abstract class Route<ParentPath extends RoutePath = any, Path extends RoutePath = any, Params = any> {
    declare protos: Set<Page | Route>;
    routes = new Map<string, Route>();
    path: PathConcat<ParentPath, Path>;
    aliases = new Map<string, RouteParams | (() => RouteParams) | undefined>();
    router: Router;
    declare parentPath: ParentPath;
    declare params: Params;
    constructor(router: Router, path: Path) {
        this.path = path as any;
        this.router = router;
    }

    abstract resolve(path: string, slot: RouteSlot, params: Record<string, string>): Promise<boolean>;

    routing(path: string) {
        let pathSegList = path.split('/');
        let params: Record<string, string> = {};
        let passPath = '';

        skipPath: for (let selfPath of [this.path, ...this.aliases.keys()]) {
            let aliasParams = this.aliases.get(selfPath);
            params = {};
            let selfSegList = selfPath.split('/');
            let segList: [string | undefined, string | undefined][] = [];

            for (let i = 0; i < Math.max(pathSegList.length, selfSegList.length); i++) 
                segList.push([selfSegList[i], pathSegList[i]])

            skipSeg: for (let [selfSeg, pathSeg] of segList) {
                let skip = () => {
                    passPath = '';
                }
                let pass = () => {
                    passPath += (passPath !== '/' ? '/' : '') + pathSeg;
                }
                if (isUndefined(selfSeg)) {
                    // all path segment matched;
                    break skipSeg;
                }
                if (isUndefined(pathSeg)) {
                    // this route path is longer than target path;
                    skip();
                    continue skipPath;
                }
                
                if (selfSeg?.includes(':')) {
                    let [prefix, name] = selfSeg.split(':') as [string, string];
                    if (!pathSeg.startsWith(prefix)) {
                        skip();
                        continue skipPath;
                    }
                    // path params
                    params[name] = pathSeg.replace(prefix, '');
                    pass();
                    continue skipSeg;
                }

                if (selfSeg !== pathSeg) {
                    // this segment not matched
                    skip();
                    continue skipPath;
                }
                pass();
            }
            if (!passPath) continue skipPath;
            params = {...params, ...isFunction(aliasParams) ? aliasParams() : aliasParams}
            break skipPath;
        }

        if (!passPath) return false;

        return [passPath, params] as const
    }

    alias<
        _Path extends RoutePath,
        _Params extends AliasRequired<Params, PathToParamsMap<_Path>>,
        Required extends keyof _Params extends [never] ? [] : [_Params | (() => _Params)]
    >(path: _Path, ...required: Required): void;
    alias(path: string, required?: RouteParams | (() => RouteParams)) {
        this.aliases.set(path, required)
    }
}

export interface Route<ParentPath extends RoutePath = any, Path extends RoutePath = any, Params = any> {

    
    route<_Path extends string, Props>(
        path: ValidatePath<_Path, Props, PathConcat<ParentPath, Path, _Path>>,
        widget: Widget<any, Props>,
        handle?: (route: Route<PathConcat<ParentPath, Path>, _Path, PathToParamsMap<PathConcat<Path, _Path>>>) => void): void

    route<_Path extends string, Props>(
        path: ValidatePath<_Path, Props, PathConcat<ParentPath, Path, _Path>>,
        widget: AsyncWidget<Props>,
        handle?: (route: Route<PathConcat<ParentPath, Path>, _Path, PathToParamsMap<PathConcat<Path, _Path>>>) => void): void

    route<
        _Path extends RoutePath,
        Builder extends PageBuilder<PathConcat<ParentPath, Path, _Path>>
    >(path: _Path, builder: Builder, handle?: (route: Route<PathConcat<ParentPath, Path>, _Path, PathToParamsMap<PathConcat<Path, _Path>>>) => void): void

    group<
        _Path extends RoutePath
    >(path: _Path, handle: (route: Route<ParentPath, _Path, PathToParamsMap<PathConcat<Path, _Path>>>) => void): this;

}




