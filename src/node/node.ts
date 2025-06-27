import { assignHelper } from '#lib/assignHelper';
import { $Element } from '#node/$Element';
import { $Node, $Text } from './$Node';

export * from './$Element';
export * from './$Node';

assignHelper([
    [Node, $Node], 
    [Text, $Text], 
    [Element, $Element],
])