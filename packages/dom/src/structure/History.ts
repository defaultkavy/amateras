export class History {
    scrollRestoration: ScrollRestoration = 'manual';
    readonly length = 0;
    readonly state: any;

    back() {}
    forward() {}
    go(delta?: number) {}
    pushState() {}
    replaceState() {}
}