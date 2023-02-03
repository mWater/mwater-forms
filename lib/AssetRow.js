"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Columns that are also physical columns in asset table, not stored in jsonb field "data" */
const physicalColumns = [
    "parent",
    "asset_id",
    "type",
    "name",
    "description",
    "location",
    "admin_region",
    "admins",
    "viewers",
    "water_system",
    "water_point"
];
/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an asset.
 */
class AssetRow {
    constructor(options) {
        this.systemId = options.systemId;
        this.asset = options.asset;
        this.schema = options.schema;
    }
    // Gets primary key of row. callback is called with (error, value)
    getPrimaryKey() {
        return Promise.resolve(this.asset._id);
    }
    // Gets the value of a column, returning a promise
    getField(columnId) {
        var _a, _b;
        // TODO: Doesn't support 1-n joins
        if (physicalColumns.includes(columnId)) {
            return Promise.resolve((_a = this.asset[columnId]) !== null && _a !== void 0 ? _a : null);
        }
        return Promise.resolve((_b = this.asset.data[columnId]) !== null && _b !== void 0 ? _b : null);
    }
    followJoin(columnId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO joins not supported
            return null;
        });
    }
}
exports.default = AssetRow;
