import { $HTMLElement } from '#node/$HTMLElement';
import { assignHelper } from '#lib/assignHelper';
import { $Element } from '#node/$Element';
import { $Node, $Text } from './$Node';

export * from './$Node';
export * from './$Element';
export * from './$HTMLElement';

assignHelper(Node, $Node);
assignHelper(Text, $Text);
assignHelper(Element, $Element);
assignHelper(HTMLElement, $HTMLElement);