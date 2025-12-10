import { _Object_assign } from "@amateras/utils";

export class CSSStyleSheet {
    cssRules: string[] = []
    insertRule(cssText: string) {
        this.cssRules.push(cssText);
    }
}

_Object_assign(globalThis, { CSSStyleSheet })
