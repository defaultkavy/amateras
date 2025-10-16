import { _Array_from, _instanceof, _Object_entries, forEach, startsWith } from "../../../../src/lib/native";
import { $CSS, $CSSStyleRule } from "..";
import { $CSSMediaRule } from "#structure/$CSSMediaRule";

const MEDIA = '@media'

$CSS.cssTextProcessors.add((rule, _, options) => {
    if (_instanceof(rule, $CSSMediaRule)) {
        const mediaContext = [...options?.mediaContext ?? [], rule.condition];
        const media: string[] = [], style: string[] = []
        forEach(
            _Array_from(rule.rules)
                .map(childRule => $CSS.cssText(childRule, '', {...options, mediaContext}))
                .flat(),
            (childText => startsWith(childText, MEDIA) ? media.push(childText) : style.push(childText))
        );
        return [`${MEDIA} ${mediaContext.join(' and ')} { ${style.join('\n')} }`, ...media]
    }
})

$CSS.createRuleProcessors.add((selector, options, context) => {
    if (startsWith(selector, MEDIA)) {
        const rule = new $CSSMediaRule(selector);
        // create media rule from $.CSS
        if (!context) forEach(_Object_entries(options), ([key, value]) => rule.rules.add( $CSS.createRule(key, value) ))
        // create from $.css
        else rule.rules.add( $CSS.CSSOptions(new $CSSStyleRule(context), options) );
        return rule;
    }
})

export * from '#structure/$CSSMediaRule';
