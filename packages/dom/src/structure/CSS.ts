import { _Object_assign } from "@amateras/utils"

export class CSS {
    static supports() { return true }
}

_Object_assign(globalThis, { CSS })