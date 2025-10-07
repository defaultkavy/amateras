import { $HTMLElement } from '#node/$HTMLElement';
import { assignProperties } from '#lib/assignProperties';
import { $Element } from '#node/$Element';
import { $Node, $Text } from '#node/$Node';
import { $EventTarget } from '#node/$EventTarget';

assignProperties(EventTarget, $EventTarget);
assignProperties(Node, $Node);
assignProperties(Text, $Text);
assignProperties(Element, $Element);
assignProperties(HTMLElement, $HTMLElement);