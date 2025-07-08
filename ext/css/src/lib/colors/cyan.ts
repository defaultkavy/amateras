import { colorAssign } from "../colorAssign";

const _cyan = {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
} as const;

colorAssign('cyan', _cyan);

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const cyan: typeof _cyan;
        }
    }
}