
interface slice {
    (target: string, start?: number, end?: number): string;
    <T>(target: Array<T>, start?: number, end?: number): T[];
}
const slice: slice = (target: any, start?: number, end?: number) => target.slice(start, end);
export const uppercase = (str: string, start?: number, end?: number) => `${slice(str, 0, start)}${slice(str, start, end).toUpperCase()}${end ? slice(str, end) : ''}`