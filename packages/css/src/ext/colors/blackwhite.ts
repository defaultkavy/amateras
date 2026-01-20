import { colorAssign } from "../../lib/colorAssign";

colorAssign('black', '#000000');
colorAssign('white', '#ffffff');

declare global {
    export namespace $ {
        export namespace color {
            export const black: '#000000';
            export const white: '#ffffff';
        }
    }
}