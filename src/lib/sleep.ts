import { _Promise } from "./native";

export const sleep = async (ms: number) => new _Promise(resolve => setTimeout(resolve, ms));