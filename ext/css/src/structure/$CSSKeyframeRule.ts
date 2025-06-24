import { $CSSStyleRule } from "#structure/$CSSStyleRule";

export class $CSSKeyframeRule extends $CSSStyleRule {
    keyframe: string
    constructor(keyframe: string) {
        super();
        this.keyframe = keyframe;
    }

    get css(): string {
        return `${this.keyframe} { ${Array.from(this.declarations).map(([_, dec]) => `${dec}`).join(' ')} }`
    }
}