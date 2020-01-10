"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
// Custom tableset is defined in mwater-common
/** Creates schema table for a custom tableset */
var CustomTablesetSchemaBuilder = /** @class */ (function () {
    function CustomTablesetSchemaBuilder() {
    }
    CustomTablesetSchemaBuilder.prototype.addTableset = function (schema, tableset) {
        for (var _i = 0, _a = tableset.design.tables; _i < _a.length; _i++) {
            var table = _a[_i];
            var contents = mapTree(table.properties || [], function (prop) {
                // Sections are untouched
                if (prop.type === "section") {
                    return prop;
                }
                var column = lodash_1.default.pick(prop, "id", "name", "code", "desc", "type", "idTable", "enumValues", "deprecated", "expr", "join");
                // Convert id to join
                if (column.type === "id") {
                    column.type = "join";
                    column.join = {
                        type: "n-1",
                        toTable: prop.idTable,
                        fromColumn: prop.id,
                        // HACK for primary keys of tables not loaded yet
                        toColumn: schema.getTable(column.idTable) ? schema.getTable(column.idTable).primaryKey : "_id"
                    };
                    delete column.idTable;
                }
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
                    en: "User that added this to the database"
                },
                type: "join",
                join: {
                    type: "n-1",
                    toTable: "users",
                    fromColumn: "_created_by",
                    toColumn: "_id"
                }
            });
            contents.push({
                id: "_created_on",
                name: {
                    _base: "en",
                    en: "Date added"
                },
                desc: {
                    _base: "en",
                    en: "Date that this was added to the database"
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
                    en: "User that modified this last"
                },
                type: "join",
                join: {
                    type: "n-1",
                    toTable: "users",
                    fromColumn: "_modified_by",
                    toColumn: "_id"
                }
            });
            contents.push({
                id: "_modified_on",
                name: {
                    _base: "en",
                    en: "Date last modified"
                },
                desc: {
                    _base: "en",
                    en: "Date that this was last modified"
                },
                type: "datetime"
            });
            var tableId = "custom." + tableset.code + "." + table.id;
            var schemaTable = {
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
        }
        return schema;
    };
    return CustomTablesetSchemaBuilder;
}());
exports.CustomTablesetSchemaBuilder = CustomTablesetSchemaBuilder;
/** Map a tree that consists of items with optional 'contents' array. null means to discard item */
var mapTree = function (tree, func) {
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
    var c = {
        _base: a._base
    };
    // Add each language
    for (var _i = 0, _a = lodash_1.default.union(lodash_1.default.keys(a), lodash_1.default.keys(b)); _i < _a.length; _i++) {
        var lang = _a[_i];
        if (lang != "_base") {
            c[lang] = (a[lang] || a[a._base]) + joiner + (b[lang] || b[b._base]);
        }
    }
    return c;
}
