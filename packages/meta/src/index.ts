import { resolveMeta } from "#lib/resolveMeta";
import { onclient, onserver } from "@amateras/core";
import { Proto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import type { MetaConfig, MetaOutput } from "./types";

declare global {
    export namespace $ {
        function meta(config: MetaConfig, parent?: Proto | null): void
        
        export namespace meta {
            function resolve(config: MetaConfig): MetaOutput[]
        }
    }
}

declare module '@amateras/core' {
    export interface GlobalState {
        meta: MetaConfig;
    }
}

Utils.assign($, {
    meta(config: MetaConfig, parent = Proto.proto) {
        if (onclient()) return;
        if (!parent) return;
        parent.global.meta = deepMerge(parent.global.meta ?? {}, config);
    }
})

if (onserver()) $.middleware.ssr.add(($html, $head) => {
    const meta = $html.global.meta;
    let metaList = $.meta.resolve(meta);
    Utils.forEach(metaList, (meta => {
        const $meta = $.context($head, () => $.craft('meta', meta));
        $head.append($meta);
        $meta.build();
    }))
})

function deepMerge(target: Record<any, any>, source: Record<any, any>) {
    for (const [key, value] of Utils.entries(source)) {
        if (!Utils.isNull(value) && Utils.isObject(value)) {
            if (!target[key]) target[key] = value;
            else deepMerge(target[key], value);
        }
        else target[key] = value;
    }
    return target;
}

if (onserver()) {
    Utils.assign($.meta, {
        resolve: resolveMeta
    })
}