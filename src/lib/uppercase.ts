import { slice } from "./native";

export const uppercase = (str: string, start?: number, end?: number) => `${slice(str, 0, start)}${slice(str, start, end).toUpperCase()}${end ? slice(str, end) : ''}`