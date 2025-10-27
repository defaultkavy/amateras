import { _Array_from, _instanceof, _JSON_stringify, _Object_assign, _Object_entries, _Object_fromEntries, forEach, isObject, isUndefined, startsWith } from "@amateras/utils";
import { $Element } from "@amateras/core/node/$Element";
import { $CSSDeclaration } from "#structure/$CSSDeclaration";
import { $CSSRule } from "#structure/$CSSRule";
import { $CSSStyleRule } from "#structure/$CSSStyleRule";
import { generateId } from "./lib/utils";

declare module '@amateras/core' {
    export namespace $ {
        export function css(options: $CSSMap | $CSSStyleRule): $CSSStyleRule
        export function CSS(options: $CSSSelectors | $CSSGlobalDeclarationExtends): void

        export interface $CSSValueTypeExtendsMap {}
        export type $CSSValueTypeExtends = $CSSValueTypeExtendsMap[keyof $CSSValueTypeExtendsMap]

        export interface $CSSGlobalDeclarationExtendsMap {}
        export type $CSSGlobalDeclarationExtends = $CSSGlobalDeclarationExtendsMap[keyof $CSSGlobalDeclarationExtendsMap];
    }
}

declare module '@amateras/core/node/$Element' {
    export interface $Element {
        css(...options: ($CSSMap | $CSSStyleRule)[]): this;
    }
}


export namespace $CSS {

    const stylesheet = $.stylesheet;
    const cssTextMap = new Map<string, $CSSStyleRule>();

    export const valueInstances = new Set<any>();
    export const cssTextProcessors = new Set<$TextProcessor>();
    export type $TextProcessor = (rule: $CSSRule, context: string, data?: {mediaContext?: string[], containerContext?: string[]}) => string[] | undefined;
    export const createRuleProcessors = new Set<$CreateRuleProcessor>();
    export type $CreateRuleProcessor = (selector: string, options: $CSSMap, context?: string) => $CSSRule | undefined;

    export const CSSOptions = <T extends $CSSStyleRule>(
        rule: T, 
        options: $CSSMap, 
    ): T => {
        for (const [key, value] of _Object_entries(options)) {
            if (isUndefined(value)) continue;
            else if (_instanceof(value, $CSSDeclaration)) rule.declarations.set(value.key, value);
            else if (isObject(value) && !_instanceof(value, ...valueInstances)) 
                rule.rules.add( createRule(key, value, rule.selector) );
            else {
                const declaration = new $CSSDeclaration(key, `${value}`);
                rule.declarations.set(declaration.key, declaration);
            }
        }
        return rule;
    }

    /** Create rule with several type depend on selector content.
     * @param context - for media rule creation, it should be style rule selector same as nested parent of media rule.
     */
    export const createRule = (selector: string, options: $CSSMap, context?: string) => {
        for (const processor of createRuleProcessors) {
            const result = processor(selector, options, context);
            if (!isUndefined(result)) return result;
        }
        return createStyleRule(selector, options);
    }

    const createStyleRule = <T extends $CSSMap>(selector: string, options: T) => CSSOptions(new $CSSStyleRule(selector), options);

    export const insertRule = (rule: $CSSRule) => {
        cssText(rule).forEach(text => {
            const selector = text.match(/^(.+?) {/)?.[1];
            if (!selector) return;
            if (!startsWith(selector, '@') && selector.split(',').find(str => !CSS.supports(`selector(${str})`))) return;
            $.style(text, stylesheet.cssRules.length);
        })
        return rule
    }

    export const cssText = (rule: $CSSRule, context: string = '', data?: {mediaContext?: string[], containerContext?: string[]}): string[] => {
        if (_instanceof(rule, $CSSStyleRule)) {
            const split = (str: string) => str.split(',');
            const relation = (str: string, ctx: string): string => {
                if (str.includes('&')) return str.replaceAll('&', ctx);
                else return `${ctx ? ctx + ' ': ''}${str}`
            }
            const selectors = split(rule.selector);
            const selector = split(context).map(ctx => selectors.map(selector => relation(selector, ctx))).join(', ');
            const text = `${selector} { ${_Array_from(rule.declarations).map(([_, dec]) => `${dec}`).join(' ')} }`
            return [text, ..._Array_from(rule.rules).map(childRule => cssText(childRule, selector, data)).flat()]
        }
        for (const processor of cssTextProcessors) {
            const result = processor(rule, context, data);
            if (!isUndefined(result)) return result;
        }
        throw '$CSS RULE TYPE ERROR'
    }

    // Add $.css and $.CSS methods
    _Object_assign($, {
        css(options: $CSSMap | $CSSStyleRule) {
            if (_instanceof(options, $CSSRule)) return options;
            const cssText = _JSON_stringify(options);
            const cacheRule = cssTextMap.get(cssText);
            if (cacheRule) return cacheRule;
            const className = `.${generateId()}`;
            const rule = createStyleRule(className, options);
            cssTextMap.set(_JSON_stringify(options), rule);
            return insertRule( rule );
        },
        CSS(options: $CSSSelectors) {
            return _Object_entries(options).map(([selector, declarations]) => {
                return insertRule( createRule(selector, declarations) );
            })
        }
    })

    // Add $Element.css method
    _Object_assign($Element.prototype, {
        css(this: $Element, ...options: ($CSSMap | $CSSStyleRule)[]) {
            forEach(options, options => {
                const rule = $.css(options);
                this.addClass(rule.selector.replace(/^./, ''));
            })
            return this;
        }
    })
}

export * from "#structure/$CSSDeclaration";
export * from "#structure/$CSSRule";
export * from "#structure/$CSSStyleRule";

export type $CSSMap = $CSSDeclarations | $CSSSelectors;
export type $CSSValueType = '' | 'unset' | 'initial' | 'inherit' | string & {} | number | $.$CSSValueTypeExtends
export type $CSSDeclarations = { [key in keyof $CSSDeclarationMap]?: $CSSDeclarationMap[key] | $CSSValueType } | { [key: string]: $CSSValueType }
export type $CSSSelectors = { [key: string & {}]: $CSSMap }

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