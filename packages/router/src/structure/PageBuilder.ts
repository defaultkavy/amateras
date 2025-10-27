import { Page } from "#node/Page";
import type { $NodeContentResolver } from "@amateras/core/node/$Node";
import { _instanceof, _Promise } from "@amateras/utils";
import type { AsyncPageBuilder, RouteParams } from "./Route";

export class PageBuilder<Params extends RouteParams = any> {
    params!: Params
    #builder: PageBuilderFunction<Params> | AsyncPageBuilder<Params>;
    constructor(builder: PageBuilderFunction<Params>) {
        this.#builder = builder;
    }

    async build(page: Page<Params>): Promise<Page<Params>> {
        const resolver = this.#builder(page)
        const handle = async (result: any) => {
            if (_instanceof(result, Page)) return result;
            else if (result[Symbol.toStringTag] === 'Module') return await result.default.build(page);
            else return page.content(result);
        }
        return handle(_instanceof(resolver, _Promise) ? await resolver : resolver);
    }
}

export type PageBuilderFunction<Params extends RouteParams> = (page: Page<Params>) => OrPromise<Page<Params> | $NodeContentResolver<Page<Params>>>