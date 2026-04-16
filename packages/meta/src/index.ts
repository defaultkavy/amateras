import { resolveMeta } from "#lib/resolveMeta";
import { onclient, onserver } from "@amateras/core";
import { Proto } from "@amateras/core";
import { _Object_assign, _Object_entries, isNull, isObject } from "@amateras/utils";
import type { MetaConfig } from "./types";

declare global {
    export namespace $ {
        function meta(config: MetaConfig, parent?: Proto | null): void
        
        export namespace meta {
            function resolve(config: MetaConfig): void
            
        }
    }
}

declare module '@amateras/core' {
    export interface GlobalState {
        meta: MetaConfig;
    }
}

_Object_assign($, {
    meta(config: MetaConfig, parent = Proto.proto) {
        if (onclient()) return;
        if (!parent) return;
        parent.global.meta = deepMerge(parent.global.meta ?? {}, config);
    },
})

function deepMerge(target: Record<any, any>, source: Record<any, any>) {
    for (const [key, value] of _Object_entries(source)) {
        if (!isNull(value) && isObject(value)) {
            if (!target[key]) target[key] = value;
            else deepMerge(target[key], value);
        }
        else target[key] = value;
    }
    return target;
}

if (onserver()) {
    _Object_assign($.meta, {
        resolve: resolveMeta
    })
}