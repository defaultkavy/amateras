export abstract class $CSSRule {
    rules = new Set<$CSSRule>();
    constructor() {
    }

    abstract toString(): string;
}