import { Schema } from "mwater-expressions";
/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an asset.
 */
export default class AssetRow {
    /** System id of asset */
    systemId: number;
    /** Object of asset */
    asset: any;
    /** Schema that includes asset table */
    schema: Schema;
    constructor(options: {
        /** System id of asset */
        systemId: number;
        /** Object of asset */
        asset: any;
        /** Schema that includes asset table */
        schema: Schema;
    });
    getPrimaryKey(): Promise<any>;
    getField(columnId: string): Promise<any>;
    followJoin(columnId: string): Promise<null>;
}
