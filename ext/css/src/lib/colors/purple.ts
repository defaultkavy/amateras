import { colorAssign } from "../colorAssign";

const _purple = {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
} as const;

colorAssign('purple', _purple);

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const purple: typeof _purple;
        }
    }
}