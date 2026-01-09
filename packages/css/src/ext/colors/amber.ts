import { colorAssign } from "../../lib/colorAssign";

const _amber = {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
} as const;

colorAssign('amber', _amber);

declare global {
    export namespace $ {
        export namespace color {
            export const amber: typeof _amber;
        }
    }
}