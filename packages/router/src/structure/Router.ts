import { onclient } from "@amateras/core";
import { Proto } from "@amateras/core";
import { _JSON_parse, _JSON_stringify, _null, _Object_entries, forEach, map, toURL } from "@amateras/utils";
import type { Widget } from "@amateras/widget";
import type { AsyncWidget, PageLayout, PathToParamsMap, RoutePath, ValidatePath } from "../types";
import type { Route } from "./Route";
import { RouteSlot } from "./RouteSlot";

type Mode = 1 | 2;
type RouterDicrection = 'forward' | 'back';

let index = 0;
const [PUSH, REPLACE] = [1, 2] as const;
const [FORWARD, BACK] = ['forward', 'back'] as const;
const SCROLL_KEY = '__scroll_history__';
const storage = onclient() ? sessionStorage : _null;
const _addEventListener = onclient() ? window.addEventListener : _null;
const _removeEventListener = onclient() ? window.removeEventListener : _null;
if (onclient()) history.scrollRestoration = 'manual';

type ScrollData = {[key: number]: { [id: string]: { x: number, y: number }}};

const scrollRecord = (e?: Event) => {
    const data = RouterProto.scrollHistory;
    if (e) {
        let element = e.target as HTMLElement;
        if (element.id === '') return;
        data[index] = { [element.id]: { x: element.scrollLeft, y: element.scrollTop } };
    } else {
        forEach(_Object_entries(data), ([i]) => +i >= index && delete data[+i]);
    }
    storage?.setItem(SCROLL_KEY, _JSON_stringify(data));
}

export class RouterProto extends Proto {
    direction: RouterDicrection = FORWARD;
    prev: URL | null = _null;
    routes = new Map<string, Route>();
    slot = new RouteSlot();
    static routers = new Set<RouterProto>();
    constructor() {
        super(() => $(this.slot));
        if (onclient()) RouterProto.routers.add(this);
    }

    set href(url: URL) {
        this.global.router.href = url;
    }

    override build() {
        if (onclient()) {
            const resolve = () => {
                const stateIndex = history.state?.index ?? 0;
                if (index > stateIndex) this.direction = BACK;
                if (index < stateIndex) this.direction = FORWARD;
                index = stateIndex;
                this.prev = this.href;
                this.href = toURL(location.href);
                this.resolve(location.href);
            }
            resolve();
            _addEventListener?.('popstate', resolve);
            _addEventListener?.('scroll', scrollRecord, {
                capture: true,
                passive: false
            });
            this.disposers.add(() => {
                _removeEventListener?.('popstate', resolve);
                _removeEventListener?.('scroll', scrollRecord, {
                    capture: true
                })
            })
        }
        return super.build();
    }

    async resolve(path: string | URL) {
        if (!path) return;
        let url = toURL(path);
        for (let [,route] of this.routes) {
            let routes = await route.resolve(url.pathname, this.slot, {});
            // 一旦有一个 route 解析成功就跳过剩下的 routes
            if (routes) {
                // 实现 NavLink 自动检测 href 匹配当前 location
                this.global.router.routes = routes;
                let parentPaths: string[] = [''];
                let paths: string[] = [];
                forEach(routes, route => {
                    parentPaths = map(route.validPaths, validPath => 
                        map(parentPaths, path => path + validPath)
                    ).flat()
                    paths.push(...parentPaths);
                    return parentPaths
                })
                this.global.router.matchPaths = paths;
                break;
            };
        }
        // NavLink 检测匹配
        forEach(this.global.router.navlinks, navlink => navlink.checkActive())
        // location 变更事件触发
        RouterProto.dispatchEvent();
        // restore scroll position
        RouterProto.scrollRestoration();
    }

    static open(path: string, target?: string) {
        RouterProto.writeState(path, PUSH, target);
    }

    static forward() {
        history.forward();
    }

    static back() {
        history.back();
    }

    static replace(path: string) {
        RouterProto.writeState(path, REPLACE);
    }

    static get scrollData(): ScrollData[number] {
        return this.scrollHistory[index] ?? {}
    }

    static get scrollHistory(): ScrollData {
        return _JSON_parse(storage?.getItem(SCROLL_KEY) ?? '{}')
    }

    static scrollRestoration() {
        if (onclient()) {
            let scrollData = RouterProto.scrollData ?? {x: 0, y: 0};
            forEach(_Object_entries(scrollData), ([id, {x, y}]) => document.querySelector(`#${id}`)?.scrollTo(x, y));
        }
    }

    private static writeState(path: string | URL | Nullish, mode: Mode, target?: string) {
        if (!path) return;
        let url = toURL(path);
        if (onclient() && url.href === location.href) return;
        if (target && target !== '_self') return open(url, target);
        if (mode === PUSH) index++;
        if (onclient()) scrollRecord();
        forEach(this.routers, router => {
            router.direction = FORWARD;
            if (onclient()) {
                router.prev = toURL(location.href);
                history[mode === PUSH ? 'pushState' : 'replaceState']({index}, '', url);
            }
            router.href = url;
            router.resolve(path)
        })
        RouterProto.dispatchEvent();
    }

    private static dispatchEvent() {
        if (onclient()) window.dispatchEvent(new Event('pathchange'));
    }
}

declare global {
    export interface GlobalEventHandlersEventMap {
        pathchange: Event
    }
}


export interface RouterProto {
    route<_Path extends RoutePath, Props>(
        path: ValidatePath<_Path, Props, _Path>,
        widget: Widget<any, Props>,
        handle?: (route: Route<'', _Path, PathToParamsMap<_Path>>) => void): void

    route<_Path extends RoutePath, Props>(
        path: ValidatePath<_Path, Props, _Path>,
        widget: AsyncWidget<Props>,
        handle?: (route: Route<'', _Path, PathToParamsMap<_Path>>) => void): void

    route<
        Path extends RoutePath,
        Layout extends PageLayout<Path>
    >(path: Path, layout: Layout, handle?: (route: Route<'', Path, PathToParamsMap<Path>>) => void): void


    group<
        Path extends RoutePath
    >(path: Path, handle: (route: Route<'', Path, PathToParamsMap<Path>>) => void): void;

    notFound(layout: Widget): void;
    notFound(layout: PageLayout): void;
}