import { HTMLAbbrElement } from "#structure/html/HTMLAbbrElement";
import { HTMLAddressElement } from "#structure/html/HTMLAddressElement";
import { HTMLAnchorElement } from "#structure/html/HTMLAnchorElement";
import { HTMLAreaElement } from "#structure/html/HTMLAreaElement";
import { HTMLArticleElement } from "#structure/html/HTMLArticleElement";
import { HTMLAsideElement } from "#structure/html/HTMLAsideElement";
import { HTMLAudioElement } from "#structure/html/HTMLAudioElement";
import { HTMLBDIElement } from "#structure/html/HTMLBDIElement";
import { HTMLBDOElement } from "#structure/html/HTMLBDOElement";
import { HTMLBElement } from "#structure/html/HTMLBElement";
import { HTMLBRElement } from "#structure/html/HTMLBRElement";
import { HTMLBaseElement } from "#structure/html/HTMLBaseElement";
import { HTMLBodyElement } from "#structure/html/HTMLBodyElement";
import { HTMLButtonElement } from "#structure/html/HTMLButtonElement";
import { HTMLCanvasElement } from "#structure/html/HTMLCanvasElement";
import { HTMLCiteElement } from "#structure/html/HTMLCiteElement";
import { HTMLCodeElement } from "#structure/html/HTMLCodeElement";
import { HTMLDDElement } from "#structure/html/HTMLDDElement";
import { HTMLDFNElement } from "#structure/html/HTMLDFNElement";
import { HTMLDListElement } from "#structure/html/HTMLDListElement";
import { HTMLDTElement } from "#structure/html/HTMLDTElement";
import { HTMLDataElement } from "#structure/html/HTMLDataElement";
import { HTMLDataListElement } from "#structure/html/HTMLDataListElement";
import { HTMLDetailsElement } from "#structure/html/HTMLDetailsElement";
import { HTMLDialogElement } from "#structure/html/HTMLDialogElement";
import { HTMLDivElement } from "#structure/html/HTMLDivElement";
import { HTMLEMElement } from "#structure/html/HTMLEMElement";
import { HTMLEmbedElement } from "#structure/html/HTMLEmbedElement";
import { HTMLFieldSetElement } from "#structure/html/HTMLFieldSetElement";
import { HTMLFigCaptionElement } from "#structure/html/HTMLFigCaptionElement";
import { HTMLFigureElement } from "#structure/html/HTMLFigureElement";
import { HTMLFooterElement } from "#structure/html/HTMLFooterElement";
import { HTMLFormElement } from "#structure/html/HTMLFormElement";
import { HTMLHGroupElement } from "#structure/html/HTMLHGroupElement";
import { HTMLHRElement } from "#structure/html/HTMLHRElement";
import { HTMLHeadElement } from "#structure/html/HTMLHeadElement";
import { HTMLHeaderElement } from "#structure/html/HTMLHeaderElement";
import { HTMLHeadingElement } from "#structure/html/HTMLHeadingElement";
import { HTMLHtmlElement } from "#structure/html/HTMLHtmlElement";
import { HTMLIElement } from "#structure/html/HTMLIElement";
import { HTMLIFrameElement } from "#structure/html/HTMLIFrameElement";
import { HTMLImageElement } from "#structure/html/HTMLImageElement";
import { HTMLInputElement } from "#structure/html/HTMLInputElement";
import { HTMLKBDElement } from "#structure/html/HTMLKBDElement";
import { HTMLLIElement } from "#structure/html/HTMLLIElement";
import { HTMLLabelElement } from "#structure/html/HTMLLabelElement";
import { HTMLLegendElement } from "#structure/html/HTMLLegendElement";
import { HTMLLinkElement } from "#structure/html/HTMLLinkElement";
import { HTMLMainElement } from "#structure/html/HTMLMainElement";
import { HTMLMapElement } from "#structure/html/HTMLMapElement";
import { HTMLMarkElement } from "#structure/html/HTMLMarkElement";
import { HTMLMenuElement } from "#structure/html/HTMLMenuElement";
import { HTMLMetaElement } from "#structure/html/HTMLMetaElement";
import { HTMLMeterElement } from "#structure/html/HTMLMeterElement";
import { HTMLModElement } from "#structure/html/HTMLModElement";
import { HTMLNavElement } from "#structure/html/HTMLNavElement";
import { HTMLNoscriptElement } from "#structure/html/HTMLNoscriptElement";
import { HTMLOListElement } from "#structure/html/HTMLOListElement";
import { HTMLObjectElement } from "#structure/html/HTMLObjectElement";
import { HTMLOptionElement } from "#structure/html/HTMLOptionElement";
import { HTMLOptGroupElement } from "#structure/html/HTMLOptGroupElement";
import { HTMLOutputElement } from "#structure/html/HTMLOutputElement";
import { HTMLParagraphElement } from "#structure/html/HTMLParagraphElement";
import { HTMLPictureElement } from "#structure/html/HTMLPictureElement";
import { HTMLPreElement } from "#structure/html/HTMLPreElement";
import { HTMLProgressElement } from "#structure/html/HTMLProgressElement";
import { HTMLQuoteElement } from "#structure/html/HTMLQuoteElement";
import { HTMLRPElement } from "#structure/html/HTMLRPElement";
import { HTMLRTElement } from "#structure/html/HTMLRTElement";
import { HTMLRubyElement } from "#structure/html/HTMLRubyElement";
import { HTMLSElement } from "#structure/html/HTMLSElement";
import { HTMLSampElement } from "#structure/html/HTMLSampElement";
import { HTMLScriptElement } from "#structure/html/HTMLScriptElement";
import { HTMLSectionElement } from "#structure/html/HTMLSectionElement";
import { HTMLSelectElement } from "#structure/html/HTMLSelectElement";
import { HTMLSmallElement } from "#structure/html/HTMLSmallElement";
import { HTMLSlotElement } from "#structure/html/HTMLSlotElement";
import { HTMLSourceElement } from "#structure/html/HTMLSourceElement";
import { HTMLSpanElement } from "#structure/html/HTMLSpanElement";
import { HTMLStrongElement } from "#structure/html/HTMLStrongElement";
import { HTMLStyleElement } from "#structure/html/HTMLStyleElement";
import { HTMLSubElement } from "#structure/html/HTMLSubElement";
import { HTMLSupElement } from "#structure/html/HTMLSupElement";
import { HTMLSummaryElement } from "#structure/html/HTMLSummaryElement";
import { HTMLTableCaptionElement } from "#structure/html/HTMLTableCaptionElement";
import { HTMLTableCellElement } from "#structure/html/HTMLTableCellElement";
import { HTMLTableColElement } from "#structure/html/HTMLTableColElement";
import { HTMLTableElement } from "#structure/html/HTMLTableElement";
import { HTMLTableRowElement } from "#structure/html/HTMLTableRowElement";
import { HTMLTableSectionElement } from "#structure/html/HTMLTableSectionElement";
import { HTMLTemplateElement } from "#structure/html/HTMLTemplateElement";
import { HTMLTextAreaElement } from "#structure/html/HTMLTextAreaElement";
import { HTMLTimeElement } from "#structure/html/HTMLTimeElement";
import { HTMLTitleElement } from "#structure/html/HTMLTitleElement";
import { HTMLTrackElement } from "#structure/html/HTMLTrackElement";
import { HTMLUElement } from "#structure/html/HTMLUElement";
import { HTMLUListElement } from "#structure/html/HTMLUListElement";
import { HTMLVarElement } from "#structure/html/HTMLVarElement";
import { HTMLVideoElement } from "#structure/html/HTMLVideoElement";
import { HTMLWBRElement } from "#structure/html/HTMLWBRElement";

export const htmlElementMap = new Map()
.set('a', HTMLAnchorElement)
.set('abbr', HTMLAbbrElement)
.set('address', HTMLAddressElement)
.set('area', HTMLAreaElement)
.set('article', HTMLArticleElement)
.set('aside', HTMLAsideElement)
.set('audio', HTMLAudioElement)
.set('b', HTMLBElement)
.set('bdi', HTMLBDIElement)
.set('bdo', HTMLBDOElement)
.set('blockquote', HTMLQuoteElement)
.set('br', HTMLBRElement)
.set('base', HTMLBaseElement)
.set('body', HTMLBodyElement)
.set('button', HTMLButtonElement)
.set('canvas', HTMLCanvasElement)
.set('caption', HTMLTableCaptionElement)
.set('cite', HTMLCiteElement)
.set('code', HTMLCodeElement)
.set('col', HTMLTableColElement)
.set('colgroup', HTMLTableColElement)
.set('data', HTMLDataElement)
.set('datalist', HTMLDataListElement)
.set('dd', HTMLDDElement)
.set('del', HTMLModElement)
.set('details', HTMLDetailsElement)
.set('dfn', HTMLDFNElement)
.set('dialog', HTMLDialogElement)
.set('div', HTMLDivElement)
.set('dl', HTMLDListElement)
.set('dt', HTMLDTElement)
.set('em', HTMLEMElement)
.set('embed', HTMLEmbedElement)
.set('fieldset', HTMLFieldSetElement)
.set('figcaption', HTMLFigCaptionElement)
.set('figure', HTMLFigureElement)
.set('footer', HTMLFooterElement)
.set('form', HTMLFormElement)
.set('h1', HTMLHeadingElement)
.set('h2', HTMLHeadingElement)
.set('h3', HTMLHeadingElement)
.set('h4', HTMLHeadingElement)
.set('h5', HTMLHeadingElement)
.set('h6', HTMLHeadingElement)
.set('head', HTMLHeadElement)
.set('header', HTMLHeaderElement)
.set('hgroup', HTMLHGroupElement)
.set('hr', HTMLHRElement)
.set('html', HTMLHtmlElement)
.set('i', HTMLIElement)
.set('iframe', HTMLIFrameElement)
.set('img', HTMLImageElement)
.set('input', HTMLInputElement)
.set('ins', HTMLModElement)
.set('kbd', HTMLKBDElement)
.set('label', HTMLLabelElement)
.set('legend', HTMLLegendElement)
.set('li', HTMLLIElement)
.set('link', HTMLLinkElement)
.set('main', HTMLMainElement)
.set('map', HTMLMapElement)
.set('mark', HTMLMarkElement)
.set('menu', HTMLMenuElement)
.set('meta', HTMLMetaElement)
.set('meter', HTMLMeterElement)
.set('nav', HTMLNavElement)
.set('noscript', HTMLNoscriptElement)
.set('object', HTMLObjectElement)
.set('ol', HTMLOListElement)
.set('optgroup', HTMLOptGroupElement)
.set('option', HTMLOptionElement)
.set('output', HTMLOutputElement)
.set('p', HTMLParagraphElement)
.set('picture', HTMLPictureElement)
.set('pre', HTMLPreElement)
.set('progress', HTMLProgressElement)
.set('q', HTMLQuoteElement)
.set('rp', HTMLRPElement)
.set('rt', HTMLRTElement)
.set('ruby', HTMLRubyElement)
.set('s', HTMLSElement)
.set('samp', HTMLSampElement)
.set('script', HTMLScriptElement)
.set('section', HTMLSectionElement)
.set('select', HTMLSelectElement)
.set('small', HTMLSmallElement)
.set('slot', HTMLSlotElement)
.set('source', HTMLSourceElement)
.set('span', HTMLSpanElement)
.set('strong', HTMLStrongElement)
.set('style', HTMLStyleElement)
.set('sub', HTMLSubElement)
.set('summary', HTMLSummaryElement)
.set('sup', HTMLSupElement)
.set('table', HTMLTableElement)
.set('tbody', HTMLTableSectionElement)
.set('td', HTMLTableCellElement)
.set('template', HTMLTemplateElement)
.set('textarea', HTMLTextAreaElement)
.set('tfoot', HTMLTableSectionElement)
.set('th', HTMLTableCellElement)
.set('thead', HTMLTableSectionElement)
.set('time', HTMLTimeElement)
.set('title', HTMLTitleElement)
.set('tr', HTMLTableRowElement)
.set('track', HTMLTrackElement)
.set('u', HTMLUElement)
.set('ul', HTMLUListElement)
.set('var', HTMLVarElement)
.set('video', HTMLVideoElement)
.set('wbr', HTMLWBRElement)