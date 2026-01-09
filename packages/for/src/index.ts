import './global';
import { For } from "#structure/For";
import { _instanceof, _Object_assign } from "@amateras/utils";
import { Proto } from '@amateras/core/structure/Proto';

globalThis.For = For;

$.process.craft.add((value, list, builder) => {
    if (value === For) {
        let forProto = new For(list, builder);
        forProto.parent = Proto.proto;
        return forProto;
    }
})