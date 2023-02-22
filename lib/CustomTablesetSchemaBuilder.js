"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTablesetSchemaBuilder = void 0;
const immer_1 = __importDefault(require("immer"));
const lodash_1 = __importDefault(require("lodash"));
const mwater_expressions_1 = require("mwater-expressions");
// Custom tableset is defined in mwater-common
/** Creates schema table for a custom tableset */
class CustomTablesetSchemaBuilder {
    addTableset(schema, tableset) {
        for (const table of tableset.design.tables) {
            const contents = mapTree(table.properties || [], (prop) => {
                // Sections are untouched
                if (prop.type === "section") {
                    return prop;
                }
                const column = lodash_1.default.pick(prop, "id", "name", "code", "desc", "type", "idTable", "enumValues", "deprecated", "expr", "join");
                return column;
            });
            contents.push({
                id: "_created_by",
                name: {
                    _base: "en",
                    en: "Added by user"
                },
                desc: {
                    _base: "en",
                    en: `User that added this to the database`
                },
                type: "id",
                idTable: "users"
            });
            contents.push({
                id: "_created_on",
                name: {
                    _base: "en",
                    en: "Date added"
                },
                desc: {
                    _base: "en",
                    en: `Date that this was added to the database`
                },
                type: "datetime"
            });
            contents.push({
                id: "_modified_by",
                name: {
                    _base: "en",
                    en: "Last modified by user"
                },
                desc: {
                    _base: "en",
                    en: `User that modified this last`
                },
                type: "id",
                idTable: "users"
            });
            contents.push({
                id: "_modified_on",
                name: {
                    _base: "en",
                    en: "Date last modified"
                },
                desc: {
                    _base: "en",
                    en: `Date that this was last modified`
                },
                type: "datetime"
            });
            const tableId = `custom.${tableset.code}.${table.id}`;
            const schemaTable = {
                id: tableId,
                name: concatLocalizedStrings(tableset.design.name, " > ", table.name),
                desc: table.desc,
                primaryKey: "_id",
                label: table.labelColumn,
                ordering: table.orderingColumn,
                contents: contents,
                deprecated: table.deprecated
            };
            // Create table
            schema = schema.addTable(schemaTable);
            // Add reverse joins to entities, regions and similar tables (if not already present)
            for (const column of (0, mwater_expressions_1.flattenContents)(contents)) {
                if (column.type == "id") {
                    const idTable = column.idTable;
                    const reversible = idTable.startsWith("entities.") || idTable.startsWith("regions.") || idTable == "admin_regions" || idTable == "users" || idTable == "groups" || idTable == "subjects";
                    if (reversible) {
                        const otherTable = schema.getTable(column.idTable);
                        if (otherTable) {
                            const reverseColumn = {
                                id: `!${tableId}:${column.id}`,
                                name: concatLocalizedStrings(schemaTable.name, ": ", column.name),
                                deprecated: column.deprecated || table.deprecated,
                                type: "join",
                                join: {
                                    type: "1-n",
                                    toTable: tableId,
                                    inverse: column.id,
                                    fromColumn: "_id",
                                    toColumn: column.id
                                }
                            };
                            // Prevent adding twice
                            if (schema.getColumn(otherTable.id, reverseColumn.id) == null) {
                                schema = schema.addTable((0, immer_1.default)(otherTable, (draft) => {
                                    draft.contents.push(reverseColumn);
                                }));
                            }
                        }
                    }
                }
            }
        }
        return schema;
    }
}
exports.CustomTablesetSchemaBuilder = CustomTablesetSchemaBuilder;
/** Map a tree that consists of items with optional 'contents' array. null means to discard item */
const mapTree = (tree, func) => {
    if (!tree) {
        return tree;
    }
    return lodash_1.default.compact(lodash_1.default.map(tree, function (item) {
        var newItem;
        newItem = func(item);
        if (newItem && newItem.contents) {
            newItem.contents = mapTree(newItem.contents, func);
        }
        return newItem;
    }));
};
/** Concatinate two localized string with a joiner in-between */
function concatLocalizedStrings(a, joiner, b) {
    let c = {
        _base: a._base
    };
    // Add each language
    for (const lang of lodash_1.default.union(lodash_1.default.keys(a), lodash_1.default.keys(b))) {
        if (lang != "_base") {
            c[lang] = (a[lang] || a[a._base]) + joiner + (b[lang] || b[b._base]);
        }
    }
    return c;
}
