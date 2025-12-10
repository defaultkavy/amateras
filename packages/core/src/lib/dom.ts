import { _Object_assign } from "@amateras/utils";
import "@amateras/dom/structure/NodeList";
import '@amateras/dom/structure/Node';
import '@amateras/dom/structure/Text';
import '@amateras/dom/structure/Document';
import '@amateras/dom/structure/Element';
import '@amateras/dom/structure/HTMLElement';
import '@amateras/dom/structure/CSSStyleSheet';
import '@amateras/dom/structure/CSS';

import '@amateras/dom/structure/html/HTMLAnchorElement';

import { Window } from "@amateras/dom/structure/Window";

const window = new Window();

_Object_assign(globalThis, {
    window,
    ...window,
})