import { colorAssign } from "../colorAssign";

const _orange = {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
} as const;

colorAssign('orange', _orange);

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const orange: typeof _orange;
        }
    }
}