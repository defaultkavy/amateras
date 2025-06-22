import { assignHelper } from '#lib/assignHelper';
import { $Element } from '#node/$Element';
import { $Node } from './$Node';

export * from './$Element';
export * from './$Node';

assignHelper([
    [Node, $Node], 
    [Element, $Element],
])