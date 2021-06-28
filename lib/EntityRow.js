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
/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an entity
 */
class EntityRow {
    constructor(options) {
        this.entityType = options.entityType;
        this.entity = options.entity;
        this.schema = options.schema;
        this.getEntityById = options.getEntityById;
    }
    // Gets primary key of row. callback is called with (error, value)
    getPrimaryKey() {
        return Promise.resolve(this.entity._id);
    }
    // Gets the value of a column, returning a promise
    getField(columnId) {
        // Get column (gracefully handle if no schema)
        let column;
        if (this.schema) {
            column = this.schema.getColumn(`entities.${this.entityType}`, columnId);
        }
        // Get value
        const value = this.entity[columnId];
        // Handle case of column not found by just returning value
        if (!column) {
            return Promise.resolve(value);
        }
        if (value == null) {
            return Promise.resolve(null);
        }
        // Simple value
        return Promise.resolve(value);
    }
    followJoin(columnId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get column (gracefully handle if no schema)
            let column, entity, entityType;
            if (this.schema) {
                column = this.schema.getColumn(`entities.${this.entityType}`, columnId);
            }
            if (!column) {
                return null;
            }
            // Get value
            const value = this.entity[columnId];
            if (column.type === "id") {
                // Can handle joins to another entity
                if (column.idTable.match(/^entities\./)) {
                    // Get the entity
                    entityType = column.idTable.substr(9);
                    entity = yield new Promise((resolve, reject) => {
                        return this.getEntityById(entityType, value, (entity) => resolve(entity));
                    });
                    if (entity) {
                        return new EntityRow({
                            entityType,
                            entity,
                            schema: this.schema,
                            getEntityById: this.getEntityById
                        });
                    }
                    return null;
                }
            }
            // This is legacy code, as newer will leave as type "id"
            if (column.type === "join") {
                // Do not support n-n, 1-n joins
                if (["1-n", "n-n"].includes(column.join.type)) {
                    return null;
                }
                // Can handle joins to another entity
                if (column.join.toTable.match(/^entities\./)) {
                    // Get the entity
                    entityType = column.join.toTable.substr(9);
                    entity = yield new Promise((resolve, reject) => {
                        return this.getEntityById(entityType, value, (entity) => resolve(entity));
                    });
                    if (entity) {
                        return new EntityRow({
                            entityType,
                            entity,
                            schema: this.schema,
                            getEntityById: this.getEntityById
                        });
                    }
                    return null;
                }
            }
            return null;
        });
    }
}
exports.default = EntityRow;
