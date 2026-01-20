import { forEach } from "@amateras/utils";

export class WidgetEvent {
    name: string;
    subs = new Set<() => void>();
    constructor(name: string) {
        this.name = name;
    }

    emit() {
        forEach(this.subs, sub => sub())
    }

    listen(sub: () => void) {
        this.subs.add(sub);
    }
}