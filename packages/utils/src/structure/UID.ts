import { randstr, type RandomIdOptions } from "#lib/randstr";
import type { Proto } from "@amateras/core";

export class UID {
    static map = new Map<string, Set<string>>();

    static generate(key: string, options?: RandomIdOptions): string {
        const set = UID.map.get(key) ?? new Set();
        const id = randstr(options);
        if (set.has(id)) return UID.generate(key);
        return id;
    }

    static persistInProto(proto: Proto, key: string, options?: RandomIdOptions) {
        const id = UID.generate(key, options);
        proto.listen('dispose', () => UID.map.get(key)?.delete(id))
        return id;
    }
}