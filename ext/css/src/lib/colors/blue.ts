import { colorAssign } from "../colorAssign";

const _blue = {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
} as const;

colorAssign('blue', _blue);

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const blue: typeof _blue;
        }
    }
}