import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLObjectElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: '',
        archive: '',
        border: '',
        classID: '',
        code: '',
        codeBase: '',
        codeType: '',
        data: '',
        declare: false,
        form: '',
        height: '',
        hspace: '',
        name: '',
        standby: '',
        type: '',
        useMap: '',
        vspace: '',
        width: ''
    }

    constructor() {
        super('object')
    }
}

assignAttributes(HTMLObjectElement, HTMLObjectElement.defaultAttributes)
_Object_assign(globalThis, { HTMLObjectElement })
