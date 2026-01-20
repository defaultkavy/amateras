import { _Object_entries, forEach, isArray, isString } from "@amateras/utils";
import type { MetaConfig, MetaOutput } from "../types";

export function resolveMeta(config: MetaConfig) {
    let metaList: MetaOutput[] = [];

    let {description, og, twitter} = config;
    if (description) metaList.push({name: 'description', content: description});
    if (og) determine(og, metaList, 'og', 'property');
    if (twitter) determine(twitter as any, metaList, 'twitter', 'name')
    return metaList;
}

const determine = (obj: MetaConfig, metaList: MetaOutput[], context: string, propName: 'name' | 'property') => {
    let getProperty = (property: string) => context ? `${context}:${property}` : property;
    let push = (property: string, content: string) => metaList.push({[propName]: getProperty(property), content} as MetaOutput);
    for (const [property, content] of _Object_entries(obj)) {
        if (isString(content)) push(property, content);
        else {
            if (isArray(content)) forEach(content as [], c => {
                if (isString(c)) push(property, c);
                else determine(c, metaList, getProperty(property), propName)
            });
            else determine(content as any, metaList, getProperty(property), propName);
        }
    }
}