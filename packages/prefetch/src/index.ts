import { onclient, onserver } from "@amateras/core";
import { GlobalState } from "@amateras/core";
import { Proto } from "@amateras/core";
import { Utils } from '@amateras/utils';

declare global {
    export namespace $ {
        export function fetch<T, R>(url: string | URL, options?: RequestInit & FetchOptions<T, R>, proto?: Proto | null): Promise<FetchResult<T, R>>

        export namespace fetch {
            export let origin: string;
            export let server: Bun.Server<undefined> | null
        }
    }
    export var prefetch: {[key: string]: { expired: number, data: any }}
}

declare module "@amateras/core" {
    export interface GlobalState {
        prefetch: {
            caches: {[key: string]: { expired: number, data: any }};
            req: null | Request
        }
    }
}

export type FetchOptions<T, R> = {
    record?: (res: Response) => Promise<T> | T;
    then?: (result: T) => R;
}

export type FetchResult<T, R> = {
    record: T;
    result: R;
}

GlobalState.assign(() => ({
    prefetch: {
        caches: {},
        req: null
    }
}))

if (!globalThis.prefetch) globalThis.prefetch = {}

Utils.assign($, {
    // 将资料注册到原型全局变量中：global.prefetch
    // 保证每次全局渲染都在抓取完毕之后：将 Promise 添加到 global.prefetch.fetches 让根原型能确保所有 fetch 运行结束
    // 将已抓取的资料发送到客户端：从 record 函数回传的资料将会被记录在 global.prefetch.caches 当中，并且以抓取 URL 作为索引。
    // 客户端不会用到过时的资料：每个发送到客户端的资料缓存都附上了过期时间
    async fetch<T, R>(url: string | URL, options?: RequestInit & FetchOptions<T, R>, proto = Proto.proto) {
        url = Utils.toURL(url, $.fetch.origin);
        let cache = onclient() ? prefetch[url.href] : Utils.Null;
        let then = options?.then;
        let request = new Promise(async (resolve) => {
            if (cache && Date.now() < cache.expired) {
                let result = then?.(cache.data);
                resolve({record: cache.data, result});
                return ;
            }
            let { origin, server } = $.fetch;
            let cookies = proto?.global.prefetch.req?.headers.get('cookie') || '';
            let response = url.origin === origin && server 
            ?   await server.fetch(new Request(url, {
                ...options,
                headers: {
                    ...options?.headers,
                    'Cookie': cookies
                }
            }))
            :   await fetch(url, options);
            let recordFn = options?.record;
            if (recordFn) {
                let record = Utils.isAsyncFunction(recordFn) ? await recordFn(response) : recordFn(response);
                let result
                if (onserver() && proto) proto.global.prefetch.caches[url.href] = { data: record, expired: Date.now() + 30_000 };
                $.context(Proto, proto, () => {
                    result = then?.(record);
                })
                resolve({record, result});
            }
        })
        if (onserver()) proto?.global.asyncTask(request)
        return request
    }
})

Utils.assign($.fetch, {
    origin: onclient() ? location.origin : 'http://localhost',
    server: null
})