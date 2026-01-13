import { onclient, onserver } from "@amateras/core/env";
import { GlobalState } from "@amateras/core/structure/GlobalState";
import { Proto } from "@amateras/core/structure/Proto";
import { _null, _Object_assign, isAsyncFunction, toURL } from "@amateras/utils";

declare global {
    export namespace $ {
        export function fetch<T = any>(url: string | URL, options?: RequestInit & FetchOptions<T>): Promise<T>
    }
    export var prefetch: {[key: string]: { expired: number, data: any }}
}

declare module "@amateras/core/structure/GlobalState" {
    export interface GlobalState {
        prefetch: {
            fetches: Set<Promise<any>>,
            caches: {[key: string]: { expired: number, data: any }}
        }
    }
}

export type FetchOptions<T> = {
    record?: (res: Response) => Promise<T> | void;
    then?: (result: T) => void;
}

_Object_assign(GlobalState.prototype, {
    prefetch: {
        fetches: new Set(),
        caches: {}
    }
})

GlobalState.disposers.add(global => {
    global.prefetch.fetches.clear();
})

if (!globalThis.prefetch) globalThis.prefetch = {}

_Object_assign($, {
    // 将资料注册到原型全局变量中：global.prefetch
    // 保证每次全局渲染都在抓取完毕之后：将 Promise 添加到 global.prefetch.fetches 让根原型能确保所有 fetch 运行结束
    // 将已抓取的资料发送到客户端：从 record 函数回传的资料将会被记录在 global.prefetch.caches 当中，并且以抓取 URL 作为索引。
    // 客户端不会用到过时的资料：每个发送到客户端的资料缓存都附上了过期时间
    async fetch<T>(url: string | URL, options?: RequestInit & FetchOptions<T>) {
        url = toURL(url);
        let proto = Proto.proto;
        let cache = onclient() ? prefetch[url.href] : _null;
        let then = options?.then;
        let request = new Promise(async (resolve) => {
            if (cache && Date.now() < cache.expired) {
                then?.(cache.data);
                resolve(cache);
                return;
            }
            let response = await fetch(url, options);
            let record = options?.record;
            if (record) {
                const result = isAsyncFunction(record) ? await record(response) : record(response);
                if (onserver() && proto) proto.global.prefetch.caches[url.href] = { data: result, expired: Date.now() + 30_000 };
                $.context(Proto, proto, () => {
                    then?.(result);
                })
                resolve(result);
            }
        })
        if (onserver()) proto?.global.prefetch.fetches.add(request)
        return request
    }
})