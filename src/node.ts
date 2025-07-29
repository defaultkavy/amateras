import { $HTMLElement } from '#node/$HTMLElement';
import { assignHelper } from '#lib/assignHelper';
import { $Element } from '#node/$Element';
import { $Node, $Text } from '#node/$Node';

assignHelper(EventTarget, $Node);
assignHelper(Node, $Node);
assignHelper(Text, $Text);
assignHelper(Element, $Element);
assignHelper(HTMLElement, $HTMLElement);