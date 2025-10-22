import { colorAssign } from "../../lib/colorAssign";

const _yellow = {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
} as const;

colorAssign('yellow', _yellow);

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const yellow: typeof _yellow;
        }
    }
}