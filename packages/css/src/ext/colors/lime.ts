import { colorAssign } from "../../lib/colorAssign";

const _lime = {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
    950: '#1a2e05',
} as const;

colorAssign('lime', _lime);

declare module '@amateras/core' {
    export namespace $ {
        export namespace color {
            export const lime: typeof _lime;
        }
    }
}