import { PromiseExprEvaluatorRow } from "mwater-expressions";
declare type Asset = any;
/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an asset.
 *
 * Note: this is a copy of mwater-common's AssetRow
 */
export declare class AssetRow implements PromiseExprEvaluatorRow {
    asset: Asset;
    constructor(asset: Asset);
    getPrimaryKey(): Promise<any>;
    getField(columnId: string): Promise<any>;
    followJoin(columnId: string): Promise<PromiseExprEvaluatorRow | PromiseExprEvaluatorRow[] | null>;
}
export {};
