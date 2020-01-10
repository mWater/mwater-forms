import _ from "lodash"
import { Schema, Section, Column, Table, LocalizedString } from "mwater-expressions"

// Custom tableset is defined in mwater-common

/** Creates schema table for a custom tableset */
export class CustomTablesetSchemaBuilder {
  addTableset(schema: Schema, tableset: any): Schema {
    for (const table of tableset.design.tables) {
      const contents: Array<Column | Section> = mapTree(table.properties || [], (prop: Column | Section) => {
        // Sections are untouched
        if (prop.type === "section") {
          return prop
        }

        const column: Column = _.pick(prop, "id", "name", "code", "desc", "type", "idTable", "enumValues", "deprecated", "expr", "join")

        // Convert id to join
        if (column.type === "id") {
          column.type = "join"
          column.join = {
            type: "n-1",
            toTable: prop.idTable!,
            fromColumn: prop.id,
            // HACK for primary keys of tables not loaded yet
            toColumn: schema.getTable(column.idTable!) ? schema.getTable(column.idTable!)!.primaryKey : "_id"
          }
          delete column.idTable
        }

        return column
      })

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
        type: "join",
        join: {
          type: "n-1",
          toTable: "users",
          fromColumn: "_created_by",
          toColumn: "_id"
        }
      })

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
      })

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
        type: "join",
        join: {
          type: "n-1",
          toTable: "users",
          fromColumn: "_modified_by",
          toColumn: "_id"
        }
      })

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
      })

      const tableId = `custom.${tableset.code}.${table.id}`

      const schemaTable: Table = {
        id: tableId,
        name: concatLocalizedStrings(tableset.design.name, " > ", table.name),
        desc: table.desc,
        primaryKey: "_id",
        label: table.labelColumn,
        ordering: table.orderingColumn,
        contents: contents,
        deprecated: table.deprecated
      }

      // Create table
      schema = schema.addTable(schemaTable)
    }

    return schema
  }
}

/** Map a tree that consists of items with optional 'contents' array. null means to discard item */
const mapTree = (tree: any, func: any) => {
  if (!tree) {
    return tree
  }
  return _.compact(_.map(tree, function(item) {
    var newItem
    newItem = func(item)
    if (newItem && newItem.contents) {
      newItem.contents = mapTree(newItem.contents, func)
    }
    return newItem
  }))
}

/** Concatinate two localized string with a joiner in-between */
function concatLocalizedStrings(a: LocalizedString, joiner: string, b: LocalizedString): LocalizedString {
  let c: LocalizedString = {
    _base: a._base
  }

  // Add each language
  for (const lang of _.union(_.keys(a), _.keys(b))) {
    if (lang != "_base") {
      c[lang] = (a[lang] || a[a._base]) + joiner + (b[lang] || b[b._base])
    }
  }
  return c
}
