import { colorAssign } from "../../lib/colorAssign";

const _neutral = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
} as const;

colorAssign('neutral', _neutral);

declare module '@amateras/core' {
    export namespace $ {
        export namespace color {
            export const neutral: typeof _neutral;
        }
    }
}