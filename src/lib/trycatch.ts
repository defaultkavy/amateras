import { _instanceof, _JSON_stringify, _null, _Object_assign } from "./native";

export const trycatch = <D>(callback: () => D): Result<D, Error> => {
    try {
        return [callback(), _null];
    } catch (err) {
        return [_null, _instanceof(err, Error) ? err : new Error(_JSON_stringify(err))];
    }
}

_Object_assign($, {trycatch})

declare module '#core' {
    export namespace $ {
        export function trycatch <D>(callback: () => D): Result<D, Error>
    }
}