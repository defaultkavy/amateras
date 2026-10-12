import { $IDBBuilder } from "#structure/builder/$IDBBuilder";

export * from '#structure/$IDB';
export * from '#structure/$IDBCursor';
export * from '#structure/$IDBIndex';
export * from '#structure/$IDBStore';
export * from '#structure/$IDBStoreBase';
export * from '#structure/$IDBTransaction';
export * from '#structure/builder/$IDBBuilder';
export * from '#structure/builder/$IDBStoreBuilder';

export const createIDB = (name: string, version: number) => new $IDBBuilder({name, version, stores: {}})