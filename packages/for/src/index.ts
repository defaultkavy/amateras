import { For } from "#structure/For";
import './global';

globalThis.For = For;

$.process.craft.add((value, list, layout) => {
    if (value === For) {
        return new For(list, layout);
    }
})

export * from "#structure/For";
