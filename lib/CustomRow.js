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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRow = void 0;
const EntityRow_1 = __importDefault(require("./EntityRow"));
/*
  Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
  on custom table rows
*/
class CustomRow {
    // Create a custom row from a row object.
    // Options:
    //  row: row to create for
    //  schema: schema to use
    //  getEntityById(entityType, entityId, callback): looks up entity. Any callbacks after first one will be ignored.
    //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
    constructor(options) {
        this.tableId = options.tableId;
        this.row = options.row;
        this.schema = options.schema;
        this.getEntityById = options.getEntityById;
    }
    // Gets primary key of row
    getPrimaryKey() {
        return this.row._id;
    }
    // Gets the value of a column
    getField(columnId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get column (gracefully handle if no schema)
            if (!this.schema) {
                return this.row[columnId];
            }
            // Get column
            const column = this.schema.getColumn(this.tableId, columnId);
            // Get value
            const value = this.row[columnId];
            // Handle case of column not found by just returning value
            if (!column) {
                return value;
            }
            // Handle null case
            if (value == null) {
                return null;
            }
            return value;
        });
    }
    followJoin(columnId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get column (gracefully handle if no schema)
            if (!this.schema) {
                return null;
            }
            // Get column
            const column = this.schema.getColumn(this.tableId, columnId);
            // Handle case of column not found by just returning null
            if (!column) {
                return null;
            }
            // Get value
            const value = this.row[columnId];
            if (column.type == "id") {
                // If to entity, follow
                if (column.idTable.match(/^entities./)) {
                    // Get the entity
                    const entityType = column.idTable.substr(9);
                    const entity = yield new Promise((resolve, reject) => this.getEntityById(entityType, value, (entity) => resolve(entity)));
                    if (entity) {
                        return new EntityRow_1.default({
                            entityType: entityType,
                            entity: entity,
                            schema: this.schema,
                            getEntityById: this.getEntityById
                        });
                    }
                    return null;
                }
                else {
                    throw new Error("Following non-entity joins not supported");
                }
            }
            // This is legacy code, as newer will leave as type "id"
            if (column.type == "join" && column.join.type == 'n-1') {
                // If to entity, follow
                if (column.join.toTable.match(/^entities./)) {
                    // Get the entity
                    const entityType = column.join.toTable.substr(9);
                    const entity = yield new Promise((resolve, reject) => this.getEntityById(entityType, value, (entity) => resolve(entity)));
                    if (entity) {
                        return new EntityRow_1.default({
                            entityType: entityType,
                            entity: entity,
                            schema: this.schema,
                            getEntityById: this.getEntityById
                        });
                    }
                    return null;
                }
                else {
                    throw new Error("Following non-entity joins not supported");
                }
            }
            throw new Error(`Cannot follow join on type ${column.type}`);
        });
    }
}
exports.CustomRow = CustomRow;
