import type { RouteParams } from "#structure/Route";
import { $HTMLElement } from "amateras/node/$HTMLElement";
import { _null } from "../../../../src/lib/native";
import type { Router } from "./Router";
import { chain } from "../../../../src/lib/chain";

export class Page<Params extends RouteParams = []> extends $HTMLElement {
    params: PageParamsResolver<Params>;
    router: null | Router = _null
    #pageTitle: string | null = _null;
    built = false;
    constructor(params: PageParamsResolver<Params>) {
        super('page');
        this.params = params;
    }

    pageTitle(): string | null;
    pageTitle(title: string | null): this;
    pageTitle(title?: string | null) {
        return chain(this, arguments, () => this.#pageTitle, title, title => this.#pageTitle = title)
    }
}

export type PageParams = { [key: string]: string }
export type PageParamsResolver<Params extends string[]> = 
    Prettify<
        Params extends [`${infer String}`, ...infer Rest]
        ?   Rest extends string[]
            ?   String extends `${infer Key}?`
                ?   { [key in Key]?: string } & PageParamsResolver<Rest>
                :   { [key in String]: string } & PageParamsResolver<Rest>
            :   never
        :   {}
    >