import { PromiseExprEvaluatorRow, Schema } from 'mwater-expressions';
import { ResponseData } from './response';
import { FormDesign } from './formDesign';
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
    /** Deployment _id of the response */
    deployment: string;
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
        /** Deployment _id of the response */
        deployment: string;
    });
    getRosterResponseRow(rosterId: string, rosterEntryIndex: number): ResponseRow;
    getPrimaryKey(): any;
    getField(columnId: string): Promise<any>;
}
