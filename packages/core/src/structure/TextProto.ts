import { forEach } from "@amateras/utils";
import { NodeProto } from "./NodeProto";

export class TextProto extends NodeProto<Text> {
    content: string;
    constructor(content: string) {
        super();
        this.content = content;
    }

    override toString(): string {
        return this.content;
    }

    override toDOM(): Text[] {
        if (this.node) return [this.node];
        let node = new Text(this.content);
        this.node = node;
        forEach(this.modifiers, mod => mod(node));
        return [node];
    }
}