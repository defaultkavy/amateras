import { Utils } from "@amateras/utils";

export const container = (condition: string, map: OrArray<$.CSSDeclarationMap[]>) => ({ [`@container ${condition}`]: Utils.merge(...Utils.toArray(map)) });