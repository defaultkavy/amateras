import { generateId } from "#lib/utils";
import type { $Node } from "@amateras/core/node/$Node";
import { _Array_from, _instanceof, _JSON_stringify, _Object_assign, _Object_entries, forEach, isObject, map } from "@amateras/utils"

declare module "@amateras/core" {
    export namespace $ {
        export function css(cssObject: $CSSObject): $CSSRule;
        export function CSS(cssRootObject: $CSSRootObject): void;

        export type $CSSValueExtends = ValueOf<$CSSValueMap>;
        export interface $CSSValueMap {}

        export interface AttrMap {
            css: $CSSObject
        }

        export namespace CSS {
            export function text($nodeList: $Node[]): string;
            export function rules($nodeList: $Node[]): $CSSRule[];
        }
    }
}

type $CSSObject = { [key: string]: $CSSObject | $CSSValue } | $CSSDeclaration;
type $CSSDeclaration = { [key in keyof $CSSDeclarationMap]?: $CSSDeclarationMap[key] | $CSSValue }
type $CSSRootObject = { [key: string]: $CSSObject };
type $CSSValue = '' | 'unset' | 'initial' | 'inherit' | string & {} | number | $.$CSSValueExtends;

class $CSSRule {
    declarations = new Map<string, string>();
    rules = new Map<string, $CSSRule>();
    selector: string;
    readonly css: $CSSObject;
    constructor(selector: string, cssObject: $CSSObject) {
        this.selector = selector;
        if (cssObject) processRule(this, cssObject);
        this.css = cssObject;
    }

    toString(): string {
        let declarations = map(this.declarations, ([name, value]) => `${name.replaceAll(/[A-Z]/g, $0 => `-${$0}`)}: ${value};`);
        let rules = map(this.rules, ([_, rule]) => `${rule}`);
        return `${this.selector} { ${[...declarations, ...rules].join(' ')} }`
    }
}

export const processRule = (rule: $CSSRule, cssObject: $CSSObject) => {
    for (let [key, value] of _Object_entries(cssObject)) {
        if (isObject(value)) {
            let childRule = new $CSSRule(key, value as $CSSObject);
            rule.rules.set(key, childRule);
        }
        else rule.declarations.set(key, `${value}`)
    }
}

const cssRuleBy$NodeMap = new WeakMap<$Node, $CSSRule>();
const cssGlobalRuleSet = new Set<$CSSRule>();

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
const cssRuleByJSONMap = new Map<string, $CSSRule>();

/** Create and return {@link $CSSRule}, if the rule already exists then return the cached rule.
 * 
 * This method will:
 * 1. Check if the css rule is cached, if true return the cached rule.
 * 2. Create a {@link $CSSRule}.
 * 3. Insert the rule into stylesheet.
 * 4. Cache the rule into {@link cssRuleByJSONMap}
 * 5. Return the rule.
 */
const createRule = (selector: () => string, cssObject: $CSSObject) => {
    // Convert $CSSObject to JSON,
    // use JSON string as Map key of $CSSRule.
    let cssObjectJSON = _JSON_stringify(cssObject);
    let cachedRule = cssRuleByJSONMap.get(cssObjectJSON);
    // If $CSSRule is cached, return it.
    // This avoid the rule duplicated and waste memory.
    if (cachedRule) return cachedRule;
    // If the rule is not cached, create new one.
    let rule = new $CSSRule(selector(), cssObject);
    // Insert rule into stylesheet.
    $.style(`${rule}`);
    // Save the JSON and $CSSRule in cache.
    cssRuleByJSONMap.set(cssObjectJSON, rule);
    return rule;
}

// Assign methods to $ object
_Object_assign($, {

    css(cssObject: $CSSObject | $CSSRule) {
        // If argument is $CSSRule, return it.
        if (_instanceof(cssObject, $CSSRule)) return cssObject;
        return createRule(() => `.${generateId()}`, cssObject);
    },
    
    CSS(cssRootObject: $CSSRootObject) {
        // The CSS root object properties value should be $CSSObject,
        // just create rule from for each propperty.
        for (let [key, value] of _Object_entries(cssRootObject)) cssGlobalRuleSet.add(createRule(() => key, value));
    },
})

_Object_assign($.CSS, {
    rules($nodeList: $Node[] | Set<$Node>) {
        let ruleSet = new Set<$CSSRule>();
        forEach($nodeList, $node => {
            let rule = cssRuleBy$NodeMap.get($node);
            if (rule) ruleSet.add(rule);
            forEach(this.rules($node.nodes), rule => ruleSet.add(rule));
        })
        return _Array_from(ruleSet);
    },

    text($nodeList: $Node[] | Set<$Node>) {
        return [...cssGlobalRuleSet, ...this.rules($nodeList)].join('\n');
    }
})

// Add processor of css attribute
$.processor.attr.add((key, value, $node) => {
    if (key === 'css') {
        let rule = $.css(value);
        $node.addTokens('class', rule.selector.slice(1))
        cssRuleBy$NodeMap.set($node, rule);
        return true;
    }
})

interface $CSSDeclarationMap {
    alignContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'normal';
    alignItems: 'normal' | 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline';
    alignSelf: 'auto' | 'normal' | 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline';
    all: 'initial' | 'inherit' | 'unset';
    animation: string;
    animationDelay: string;
    animationDirection: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    animationDuration: string;
    animationFillMode: 'none' | 'forwards' | 'backwards' | 'both';
    animationIterationCount: 'infinite' | number;
    animationName: string;
    animationPlayState: 'running' | 'paused';
    animationTimingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'step-start' | 'step-end';
    animationComposition: 'replace' | 'add' | 'accumulate';
    aspectRatio: string;
    appearance: 'none' | 'auto' | 'menulist-button' | 'textfield' | 'base-select' | 'button' | 'checkbox';
    backdropFilter: string;
    backfaceVisibility: 'visible' | 'hidden';
    background: string;
    backgroundAttachment: 'scroll' | 'fixed' | 'local';
    backgroundBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
    backgroundClip: 'border-box' | 'padding-box' | 'content-box' | 'text';
    backgroundColor: string;
    backgroundImage: string;
    backgroundOrigin: 'border-box' | 'padding-box' | 'content-box';
    backgroundPosition: string;
    backgroundRepeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'space' | 'round';
    backgroundSize: 'auto' | 'cover' | 'contain';
    border: string;
    borderBottom: string;
    borderBottomColor: string;
    borderBottomLeftRadius: string;
    borderBottomRightRadius: string;
    borderBottomStyle: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    borderBottomWidth: string;
    borderCollapse: 'collapse' | 'separate';
    borderColor: string;
    borderImage: string;
    borderImageOutset: string;
    borderImageRepeat: 'stretch' | 'repeat' | 'round' | 'space';
    borderImageSlice: string;
    borderImageSource: string;
    borderImageWidth: string;
    borderLeft: string;
    borderLeftColor: string;
    borderLeftStyle: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    borderLeftWidth: string;
    borderRadius: string;
    borderRight: string;
    borderRightColor: string;
    borderRightStyle: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    borderRightWidth: string;
    borderSpacing: string;
    borderStyle: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    borderTop: string;
    borderTopColor: string;
    borderTopLeftRadius: string;
    borderTopRightRadius: string;
    borderTopStyle: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    borderTopWidth: string;
    borderWidth: string;
    bottom: string;
    boxShadow: string;
    boxSizing: 'content-box' | 'border-box';
    breakAfter: 'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'recto' | 'verso' | 'column' | 'avoid-column';
    breakBefore: 'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'recto' | 'verso' | 'column' | 'avoid-column';
    breakInside: 'auto' | 'avoid' | 'avoid-page' | 'avoid-column';
    captionSide: 'top' | 'bottom';
    caretColor: string;
    clear: 'none' | 'left' | 'right' | 'both';
    clip: string;
    clipPath: string;
    color: string;
    columnCount: 'auto' | number;
    columnFill: 'balance' | 'auto';
    columnGap: string;
    columnRule: string;
    columnRuleColor: string;
    columnRuleStyle: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    columnRuleWidth: string;
    columnSpan: 'none' | 'all';
    columnWidth: string;
    columns: string;
    content: string;
    counterIncrement: string;
    counterReset: string;
    containerName: string;
    containerType: 'inline-size' | 'size' | 'normal' | 'scroll-state';
    cursor: 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';
    direction: 'ltr' | 'rtl';
    display: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'flow-root' | 'none' | 'contents' | 'table' | 'table-row' | 'table-cell' | 'table-column' | 'table-column-group' | 'table-header-group' | 'table-footer-group' | 'table-row-group' | 'list-item';
    emptyCells: 'show' | 'hide';
    filter: string;
    flex: string;
    flexBasis: string;
    flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    flexFlow: string;
    flexGrow: number;
    flexShrink: number;
    flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
    float: 'left' | 'right' | 'none';
    font: string;
    fontFamily: string;
    fontFeatureSettings: string;
    fontKerning: 'auto' | 'normal' | 'none';
    fontLanguageOverride: string;
    fontOpticalSizing: 'auto' | 'none';
    fontSize: string;
    fontSizeAdjust: string;
    fontStretch: 'normal' | 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded';
    fontStyle: 'normal' | 'italic' | 'oblique';
    fontSynthesis: string;
    fontVariant: 'normal' | 'small-caps';
    fontVariantCaps: 'normal' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' | 'titling-caps';
    fontVariantEastAsian: string;
    fontVariantLigatures: string;
    fontVariantNumeric: string;
    fontVariantPosition: 'normal' | 'sub' | 'super';
    fontWeight: 'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    gap: string;
    grid: string;
    gridArea: string;
    gridAutoColumns: string;
    gridAutoFlow: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
    gridAutoRows: string;
    gridColumn: string;
    gridColumnEnd: string;
    gridColumnGap: string;
    gridColumnStart: string;
    gridGap: string;
    gridRow: string;
    gridRowEnd: string;
    gridRowGap: string;
    gridRowStart: string;
    gridTemplate: string;
    gridTemplateAreas: string;
    gridTemplateColumns: string;
    gridTemplateRows: string;
    height: string;
    hyphens: 'none' | 'manual' | 'auto';
    imageRendering: 'auto' | 'crisp-edges' | 'pixelated';
    isolation: 'auto' | 'isolate';
    justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    justifyItems: 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'self-start' | 'self-end' | 'left' | 'right';
    justifySelf: 'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'self-start' | 'self-end' | 'left' | 'right';
    left: string;
    letterSpacing: 'normal';
    lineHeight: 'normal' | number;
    listStyle: string;
    listStyleImage: string;
    listStylePosition: 'inside' | 'outside';
    listStyleType: 'disc' | 'circle' | 'square' | 'decimal' | 'georgian' | 'trad-chinese-informal' | 'none';
    margin: string;
    marginBottom: string;
    marginLeft: string;
    marginRight: string;
    marginTop: string;
    marginBlock: string;
    marginBlockStart: string;
    marginBlockEnd: string;
    marginInline: string;
    marginInlineStart: string;
    marginInlineEnd: string;
    mask: string;
    maskClip: string;
    maskComposite: string;
    maskImage: string;
    maskMode: string;
    maskOrigin: string;
    maskPosition: string;
    maskRepeat: string;
    maskSize: string;
    maskType: string;
    maxHeight: string;
    maxWidth: string;
    minHeight: string;
    minWidth: string;
    mixBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
    objectFit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition: string;
    opacity: number;
    order: number;
    outline: string;
    outlineColor: string;
    outlineOffset: string;
    outlineStyle: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    outlineWidth: string;
    overflow: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowWrap: 'normal' | 'break-word' | 'anywhere';
    overflowX: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowY: 'visible' | 'hidden' | 'scroll' | 'auto';
    overscrollBehavior: 'auto' | 'contain' | 'none';
    overscrollBehaviorX: 'auto' | 'contain' | 'none';
    overscrollBehaviorY: 'auto' | 'contain' | 'none';
    padding: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    paddingTop: string;
    paddingBlock: string;
    paddingBlockStart: string;
    paddingBlockEnd: string;
    paddingInline: string;
    paddingInlineStart: string;
    paddingInlineEnd: string;
    pageBreakAfter: 'auto' | 'always' | 'avoid' | 'left' | 'right';
    pageBreakBefore: 'auto' | 'always' | 'avoid' | 'left' | 'right';
    pageBreakInside: 'auto' | 'avoid';
    paintOrder: string;
    perspective: string;
    perspectiveOrigin: string;
    placeContent: string;
    placeItems: string;
    placeSelf: string;
    pointerEvents: 'auto' | 'none';
    position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    quotes: string;
    resize: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline';
    right: string;
    rotate: string;
    rowGap: string;
    scale: string;
    scrollBehavior: 'auto' | 'smooth';
    scrollMargin: string;
    scrollMarginBottom: string;
    scrollMarginLeft: string;
    scrollMarginRight: string;
    scrollMarginTop: string;
    scrollMarginBlock: string;
    scrollMarginBlockStart: string;
    scrollMarginBlockEnd: string;
    scrollMarginInline: string;
    scrollMarginInlineStart: string;
    scrollMarginInlineEnd: string;
    shapeRendering: 'auto' | 'optimizeSpeed' | 'crispEdges' | 'geometricPrecision';
    stopColor: string;
    stopOpacity: string;
    stroke: string;
    strokeDasharray: string;
    strokeDashoffset: string;
    strokeLinecap: 'butt' | 'round' | 'square';
    strokeLinejoin: 'miter' | 'round' | 'bevel';
    strokeMiterlimit: string;
    strokeOpacity: string;
    strokeWidth: string;
    tabSize: string;
    tableLayout: 'auto' | 'fixed';
    textAlign: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
    textAlignLast: 'auto' | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
    textAnchor: 'start' | 'middle' | 'end';
    textCombineUpright: 'none' | 'all';
    textDecoration: 'none' | 'underline' | 'overline' | 'line-through' | 'grammar-error' | 'spelling-error' | 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
    textDecorationColor: string;
    textDecorationLine: 'none' | 'underline' | 'overline' | 'line-through' | 'grammar-error' | 'spelling-error';
    textDecorationStyle: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
    textDecorationThickness: string;
    textDecorationSkipInk: 'auto' | 'none';
    textEmphasis: string;
    textIndent: string;
    textJustify: 'auto' | 'inter-word' | 'inter-character' | 'none';
    textOrientation: 'mixed' | 'upright' | 'sideways';
    textOverflow: 'clip' | 'ellipsis';
    textRendering: 'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision';
    textShadow: string;
    textTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    textUnderlineOffset: string;
    textUnderlinePosition: 'auto' | 'under' | 'left' | 'right';
    top: string;
    touchAction: 'auto' | 'none' | 'pan-x' | 'pan-y' | 'manipulation';
    transform: string;
    transformBox: 'border-box' | 'fill-box' | 'view-box';
    transformOrigin: string;
    transformStyle: 'flat' | 'preserve-3d';
    transition: string;
    transitionDelay: string;
    transitionDuration: string;
    transitionProperty: string;
    transitionTimingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'step-start' | 'step-end';
    translate: string;
    unicodeBidi: 'normal' | 'embed' | 'isolate' | 'bidi-override' | 'isolate-override' | 'plaintext';
    userSelect: 'auto' | 'none' | 'text' | 'contain' | 'all';
    verticalAlign: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom';
    viewTimeline: string;
    viewTimelineAxis: string;
    viewTimelineInset: string;
    viewTimelineName: string;
    viewTransitionName: string;
    viewTransitionClass: string;
    visibility: 'visible' | 'hidden' | 'collapse';
    whiteSpace: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
    width: string;
    willChange: string;
    wordBreak: 'normal' | 'break-all' | 'keep-all' | 'break-word';
    wordSpacing: string;
    wordWrap: 'normal' | 'break-word';
    writingMode: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
    zIndex: 'auto' | number;
};