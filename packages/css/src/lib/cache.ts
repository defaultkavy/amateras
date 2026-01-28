import type { $CSSRule } from "#structure/$CSSRule";
import type { ElementProto } from "@amateras/core";

export const cssRuleByProtoMap = new WeakMap<ElementProto, $CSSRule>();
export const cssGlobalRuleSet = new Set<$CSSRule>();

/** A Map to store ${@link $CSSRule} by JSON string.
 * 
 * Since a css rule might be created many times, in order to avoid unnecessary memory waste,
 * we need a rule store to ensure that the same rules can be detected and retrieved.
 * 
 * ### Why use JSON string as key of the Map?
 * 
 * Theoretically, the structure of a CSS object can be losslessly converted to JSON format,
 * which ensures that the same CSS object structure can be retrieves in the Map.
 * 
 * A JavaScript Map can save keys converted into hash values, which makes its retrieves speed very fast.
 * This is very suitable for storing CSS objects in JSON format, as the length of the JSON string will not
 * affect the retrieve efficiency of the Map.
 */
export const cssRuleByJSONMap: Map<string, $CSSRule> = import.meta.hot?.data.cssMap ?? new Map();

if (import.meta.hot) {
    import.meta.hot.dispose(data => {
        data.cssMap = cssRuleByJSONMap;
    })
}