import { colorAssign } from "../../lib/colorAssign";

const _stone = {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
} as const;

colorAssign('stone', _stone);

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const stone: typeof _stone;
        }
    }
}