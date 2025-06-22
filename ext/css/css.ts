import { $CSSDeclaration } from "#css/$CSSDeclaration";
import { $CSSMediaRule } from "#css/$CSSMediaRule";
import { $CSSRule } from "#css/$CSSRule";
import { $CSSStyleRule } from "#css/$CSSStyleRule";
import { randomId } from "#lib/randomId";
import { $Element } from "#node/$Element";

declare module '#core' {
    export namespace $ {
        export function css(options: $CSSOptions): $CSSStyleRule
        export function CSS(options: $CSSSelector | $CSSMediaSelector): void
    }
}

declare module '#node/$Element' {
    export interface $Element {
        css(...options: $CSSOptions[]): this;
    }
}

Object.defineProperty($, 'css', {
    value: function (options: $CSSOptions) {
        if (options instanceof $CSSRule) return options;
        const className = $CSS.generateClassName();
        const rule = $CSS.createStyleRule(options, [className]);
        rule.className = className;
        return $CSS.insertRule( rule );
    }
})

Object.defineProperty($, 'CSS', {
    value: function (options: $CSSSelector | $CSSMediaRule) {
        return Object.entries(options).map(([selector, declarations]) => {
            return $CSS.insertRule( $CSS.createRule(selector, declarations) );
        })
    }
})

Object.defineProperty($Element.prototype, 'css', {
    value: function (this: $Element, ...options: $CSSOptions[]) {
        options.forEach(options => {
            const rule = $.css(options);
            this.addClass(rule.context[0]?.slice(1) as string);
        })
        return this;
    }
})

export namespace $CSS {
    export const stylesheet = new CSSStyleSheet();
    const generatedIds = new Set<string>();
    document.adoptedStyleSheets.push($CSS.stylesheet);
    export function generateClassName(): string { 
        const id = randomId();
        if (generatedIds.has(id)) return generateClassName();
        generatedIds.add(id);
        return `.${id}`;
    }

    export function createStyleRule<T extends $CSSRule>(options: T, context?: string[]): T;
    export function createStyleRule<T extends $CSSOptions>(options: T, context?: string[]): $CSSStyleRule;
    export function createStyleRule<T extends $CSSOptions>(options: T, context: string[] = []) {
        if (options instanceof $CSSRule) return options;
        const rule = new $CSSStyleRule(context);
        for (const [key, value] of Object.entries(options)) {
            if (value === undefined) continue;
            if (value instanceof Object) rule.rules.add( createRule(key, value, context) )
                 else {
                const declaration = new $CSSDeclaration(key, value);
                rule.declarations.set(declaration.key, declaration);
            }
        }
        return rule;
    }

    export function createRule(selector: string, options: $CSSOptions, context: string[] = []) {
        if (selector.startsWith('@media')) return createMediaRule(selector.replace('@media ', ''), options, context);
        else return createStyleRule(options, [...context, selector],);
    }

    export function createMediaRule(key: string, options: $CSSOptions, context: string[] = []) {
        const rule = new $CSSMediaRule(key);
        rule.rules.add(createStyleRule(options, context));
        return rule;
    }
    
    export function insertRule(rule: $CSSRule) {
        if (rule instanceof $CSSStyleRule && !CSS.supports(`selector(${rule.selector})`)) return rule;
        $CSS.stylesheet.insertRule(rule.toString(), $CSS.stylesheet.cssRules.length);
        if (rule instanceof $CSSMediaRule) return;
        rule.rules.forEach(rule => insertRule(rule))
        return rule;
    }
}

type $CSSOptions = $CSSDeclarations | $CSSSelector | $CSSRule | $CSSMediaSelector;
type $CSSDeclarations = { [key in keyof CSSStyleDeclaration]?: string | number }
type $CSSSelector = { [key: string & {}]: $CSSOptions }
type $CSSMediaSelector = { [key: `@${string}`]: $CSSOptions }

console.debug(document.adoptedStyleSheets[0])