import type { Element } from "#structure/Element"
import { _Object_assign, _Object_defineProperty, _Object_entries, forEach } from "@amateras/utils"

export const assignAttributes = (target: any, props: {[key: string]: any}) => {
    forEach(_Object_entries(props), ([name]) => {
        _Object_defineProperty(target.prototype, name, {
            enumerable: true,
            get(this: Element) {
                return this.getAttribute(name)
            },
            set(this: Element, value: any) {
                this.setAttribute(name, value);
            }
        })
    })
}