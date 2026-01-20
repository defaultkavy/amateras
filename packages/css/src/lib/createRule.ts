import { $CSSRule } from "#structure/$CSSRule";
import { _JSON_stringify, _null } from "@amateras/utils";
import { cssRuleByJSONMap } from "./cache";

/** Create and return {@link $CSSRule}, if the rule already exists then return the cached rule.
 * 
 * This method will:
 * 1. Check if the css rule is cached, if true return the cached rule.
 * 2. Create a {@link $CSSRule}.
 * 3. Insert the rule into stylesheet.
 * 4. Cache the rule into {@link cssRuleByJSONMap}
 * 5. Return the rule.
 */
export const createRule = (selector: () => string, cssMap: $.CSSMap, cache = true) => {
    // Convert $CSSObject to JSON,
    // use JSON string as Map key of $CSSRule cache.
    let cssObjectJSON = cache ? _JSON_stringify(cssMap) : '';
    if (cache) {
        let cachedRule = cssRuleByJSONMap.get(cssObjectJSON);
        // If $CSSRule is cached, return it.
        // This avoid the rule duplicated and waste memory.
        if (cachedRule) return cachedRule;
    }
    // If the rule is not cached, create new one.
    let rule = new $CSSRule(selector(), cssMap, _null);
    // Insert rule into stylesheet.
    $.style(_null, `${rule}`);
    // Save the JSON and $CSSRule in cache.
    if (cache) cssRuleByJSONMap.set(cssObjectJSON, rule);
    return rule;
}