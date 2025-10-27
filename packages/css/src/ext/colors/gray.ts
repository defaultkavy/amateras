import { colorAssign } from "../../lib/colorAssign";

const _gray = {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
} as const;

colorAssign('gray', _gray);

declare module '@amateras/core' {
    export namespace $ {
        export namespace color {
            export const gray: typeof _gray;
        }
    }
}