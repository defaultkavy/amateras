declare global {
    type Nullish = null | undefined;
    type OrArray<T> = T | T[];
    type OrMatrix<T> = T | OrMatrix<T>[];
    type OrPromise<T> = T | Promise<T>;
    type OrNullish<T> = T | Nullish;
    type Constructor<T = any> = { new (...args: any[]): T }
    type Mutable<T> = {
        -readonly [P in keyof T]: T[P];
    }
    type AsyncFunction<T> = (...args: any[]) => Promise<T>;
    type Ok<D> = [data: D, err: null];
    type Err<E> = [data: null, err: E]
    type Result<D, E> = Ok<D> | Err<E>
    type Repeat<T, N extends number, Acc extends T[] = []> = 
        Acc['length'] extends 500
        ?   T[]
        :   Acc['length'] extends N
            ? Acc
            : Repeat<T, N, [...Acc, T]>;
    type Prettify<T> = {
        [K in keyof T]: T[K];
    } & {};
    type Narrow<T> = T extends boolean ? boolean : T;
    type ValueOf<T> = T[keyof T];
    type RequiredKeys<T> = {
        [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
    }[keyof T];
}