import { resolveMeta } from "#lib/resolveMeta";
import { onclient, onserver } from "@amateras/core";
import { Proto } from "@amateras/core";
import { _Object_assign } from "@amateras/utils";
import type { MetaConfig } from "./types";

declare global {
    export namespace $ {
        function meta(config: MetaConfig): void
        
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
    meta(config: MetaConfig) {
        if (onclient()) return;
        let proto = Proto.proto;
        if (proto) proto.global.meta = config;
    },
})

if (onserver()) {
    _Object_assign($.meta, {
        resolve: resolveMeta
    })
}