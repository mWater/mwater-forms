import EntityRow from "./EntityRow";
import { PromiseExprEvaluatorRow, Schema, Row } from "mwater-expressions";
import { ResponseData } from "./response";
import { FormDesign } from "./formDesign";
import { CustomRow } from "./CustomRow";
export default class ResponseRow implements PromiseExprEvaluatorRow {
    /** data of entire response */
    responseData: ResponseData;
    /** design of the form */
    formDesign: FormDesign;
    /** schema to use */
    schema: Schema;
    /** id of roster if it is a roster row */
    rosterId?: string;
    /** index of roster row */
    rosterEntryIndex?: number;
    /** looks up entity. Any callbacks after first one will be ignored.
     * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void;
    /** looks up an entity. Any callbacks after first one will be ignored.
     * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityByCode: (entityType: string, entityCode: string, callback: (entity: any) => void) => void;
    /** Get a specific row of a custom table */
    getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>;
    /** Deployment _id of the response */
    deployment?: string;
    /** Optional submitted on */
    submittedOn?: string;
    /** Optional code */
    code?: string;
    constructor(options: {
        /** data of entire response */
        responseData: ResponseData;
        /** design of the form */
        formDesign: FormDesign;
        /** schema to use */
        schema: Schema;
        /** id of roster if it is a roster row */
        rosterId?: string;
        /** index of roster row */
        rosterEntryIndex?: number;
        /** looks up entity. Any callbacks after first one will be ignored.
         * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
         */
        getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void;
        /** looks up an entity. Any callbacks after first one will be ignored.
         * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
         */
        getEntityByCode: (entityType: string, entityCode: string, callback: (entity: any) => void) => void;
        /** Get a specific row of a custom table */
        getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>;
        /** Deployment _id of the response */
        deployment?: string;
        /** Optional submitted on */
        submittedOn?: string;
        /** Optional code */
        code?: string;
    });
    getRosterResponseRow(rosterId: string, rosterEntryIndex: number): ResponseRow;
    getPrimaryKey(): any;
    getField(columnId: string): Promise<any>;
    /** Follows a join to get row or rows */
    followJoin(columnId: string): Promise<EntityRow | CustomRow | ResponseRow | ResponseRow[] | null>;
}
