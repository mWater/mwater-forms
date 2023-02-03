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
exports.AssetRow = void 0;
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
 *
 * Note: this is a copy of mwater-common's AssetRow
 */
class AssetRow {
    constructor(asset) {
        this.asset = asset;
    }
    getPrimaryKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.asset._id;
        });
    }
    getField(columnId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (physicalColumns.includes(columnId)) {
                return this.asset[columnId];
            }
            else {
                return this.asset.data[columnId];
            }
        });
    }
    followJoin(columnId) {
        throw new Error("Following joins not implemented for assets");
    }
}
exports.AssetRow = AssetRow;
