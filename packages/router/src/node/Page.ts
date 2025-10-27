import type { RouteParams } from "#structure/Route";
import { chain } from "@amateras/core/lib/chain";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";
import { _null } from "@amateras/utils";
import type { Router } from "./Router";


export class Page<Params extends RouteParams = []> extends $HTMLElement {
    params: PageParamsResolver<Params>;
    router: null | Router = _null
    #pageTitle: string | null = _null;
    built = false;
    pathId: string;
    constructor(pathId: string, params: PageParamsResolver<Params>) {
        super('page');
        this.params = params;
        this.pathId = pathId;
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