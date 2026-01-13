import { For } from "#structure/For";
import { Proto } from '@amateras/core/structure/Proto';
import './global';

globalThis.For = For;

$.process.craft.add((value, list, layout) => {
    if (value === For) {
        let forProto = new For(list, layout);
        forProto.parent = Proto.proto;
        return forProto;
    }
})