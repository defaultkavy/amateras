import { _Array_from, _instanceof, _Object_entries, forEach, startsWith } from "@amateras/utils";
import { $CSS, $CSSStyleRule } from "..";
import { $CSSContainerRule } from "#structure/$CSSContainerRule";

const CONTAINER = '@container'

$CSS.cssTextProcessors.add((rule, _, options) => {
    if (_instanceof(rule, $CSSContainerRule)) {
        const containerContext = [...options?.containerContext ?? [], rule.condition];
        const container: string[] = [], style: string[] = [];
        forEach(
            _Array_from(rule.rules)
                .map(childRule => $CSS.cssText(childRule, '', {...options, containerContext}))
                .flat(),
            (childText => startsWith(childText, CONTAINER) ? container.push(childText) : style.push(childText))
        );
        return [`${CONTAINER} ${rule.name} ${containerContext.join(' and ')} { ${style.join('\n')} }`, ...container]
    }
})

$CSS.createRuleProcessors.add((selector, options, context) => {
    if (startsWith(selector, CONTAINER)) {
        const rule = new $CSSContainerRule(selector);
        // create media rule from $.CSS
        if (!context) forEach(_Object_entries(options), ([key, value]) => rule.rules.add( $CSS.createRule(key, value) ))
        // create from $.css
        else rule.rules.add( $CSS.CSSOptions(new $CSSStyleRule(context), options) );
        return rule;
    }
})

export * from '#structure/$CSSContainerRule';