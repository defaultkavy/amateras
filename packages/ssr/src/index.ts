import '@amateras/signal';
import { Page } from "@amateras/router";
import type { SignalFunction } from "@amateras/signal";
import { isAsyncFunction, isFunction } from '@amateras/utils';
import { onclient, onserver } from '@amateras/core/env';

declare global {
    export var hydrate: Record<string, any>;
}

declare module '@amateras/router' {
    export interface Page {
        data<D>(data: D | (() => OrPromise<D>)): Promise<SignalFunction<D>>
    }
}

onclient(() => {
    if (typeof window.hydrate === 'undefined') window.hydrate = {};
})

//@ts-expect-error
onserver(() => global.hydrate = {})

Object.assign(Page.prototype, {
    async data<D>(this: Page, data: D | (() => OrPromise<D>)) {
        const hydrateData = hydrate[this.pathId];
        const d = hydrateData ?? (
            isFunction(data) 
            ?   isAsyncFunction(data) 
                ?   await data() 
                :   data()
            : data
        )
        const data$ = $.signal(d);
        onserver(() => $.effect(() => hydrate[this.pathId] = data$()))
        return data$;
    }
})