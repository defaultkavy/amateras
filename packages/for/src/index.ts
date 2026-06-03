import { For } from "#structure/For";
import './global';

globalThis.For = For;

$.middleware.craft.add((value, list, layout) => {
    if (value === For) {
        return new For(list, layout);
    }
})

export * from "#structure/For";
