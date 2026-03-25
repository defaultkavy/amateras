import { For } from "#structure/For";
import { Proto } from '@amateras/core';
import './global';

globalThis.For = For;

$.process.craft.add((value, list, layout) => {
    if (value === For) {
        let forProto = new For(list, layout);
        Proto.proto?.appendProto(forProto);
        return forProto;
    }
})

export * from "#structure/For";
