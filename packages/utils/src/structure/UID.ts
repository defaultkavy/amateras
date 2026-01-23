import { randomId, type RandomIdOptions } from "#lib/utils";
import type { Proto } from "@amateras/core";

export class UID {
    static map = new Map<string, Set<string>>();

    static generate(key: string, options?: RandomIdOptions): string {
        const set = UID.map.get(key) ?? new Set();
        const id = randomId(options);
        if (set.has(id)) return UID.generate(key);
        return id;
    }

    static persistInProto(proto: Proto, key: string, options?: RandomIdOptions) {
        const id = UID.generate(key, options);
        proto.disposers.add(() => UID.map.get(key)?.delete(id))
    }
}