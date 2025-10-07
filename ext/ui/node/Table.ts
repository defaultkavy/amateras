import { $HTMLElement } from "../../../src/node/$HTMLElement";

export class Table extends $HTMLElement {
    constructor() {
        super('table');
    }
}

export class TableHeader extends $HTMLElement {
    constructor() {
        super('thead')
    }
}

export class TableBody extends $HTMLElement {
    constructor() {
        super('tbody')
    }
}

export class TableRow extends $HTMLElement {
    constructor() {
        super('tr')
    }
}

export class TableHead extends $HTMLElement {
    constructor() {
        super('th')
    }
}

export class TableCell extends $HTMLElement {
    constructor() {
        super('td')
    }
}

export class TableFooter extends $HTMLElement {
    constructor() {
        super('tfoot')
    }
}