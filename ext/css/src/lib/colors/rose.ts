import { colorAssign } from "../colorAssign";

const _rose = {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
} as const;

colorAssign('rose', _rose);

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const rose: typeof _rose;
        }
    }
}