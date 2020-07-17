import EntityRow from './EntityRow';
import { PromiseExprEvaluatorRow, Schema, Row } from 'mwater-expressions';
export declare class CustomRow implements PromiseExprEvaluatorRow {
    /** Custom table id (e.g. custom.xyz.abc) */
    tableId: string;
    /** Custom row */
    row: Row;
    /** schema to use */
    schema?: Schema;
    /** looks up entity. Any callbacks after first one will be ignored.
     * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void;
    constructor(options: {
        /** Custom table id (e.g. custom.xyz.abc) */
        tableId: string;
        /** Custom table row */
        row: Row;
        /** schema to use */
        schema?: Schema;
        /** looks up entity. Any callbacks after first one will be ignored.
         * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
         */
        getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void;
    });
    getPrimaryKey(): any;
    getField(columnId: string): Promise<any>;
    followJoin(columnId: string): Promise<EntityRow | null>;
}
