import { _null } from "@amateras/utils";
import { StatementProto } from "./Statement";

export type ElseBuilder = () => void;
export class Else extends StatementProto {}