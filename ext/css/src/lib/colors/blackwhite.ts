import { colorAssign } from "../colorAssign";

colorAssign('black', '#000000');
colorAssign('white', '#ffffff');

declare module 'amateras/core' {
    export namespace $ {
        export namespace color {
            export const black: '#000000';
            export const white: '#ffffff';
        }
    }
}