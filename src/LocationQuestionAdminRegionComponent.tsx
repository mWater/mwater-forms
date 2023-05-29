import { JsonQLQuery } from "jsonql"
import { ExprCompiler, Schema } from "mwater-expressions"
import MWaterDataSource from "mwater-expressions/lib/MWaterDataSource"
import React, { useEffect, useState } from "react"

type LocationQuestionAdminRegionComponentProps = {
  apiUrl?: string
  login?: any
  /** Schema including the form */
  schema: Schema

  dataId: string

  table: string

  responseCode: string
}

const LocationQuestionAdminRegionComponent: React.FC<LocationQuestionAdminRegionComponentProps> = ({
  apiUrl,
  login,
  schema,
  dataId,
  table,
  responseCode
}) => {
  const [adminRegion, setAdminRegion] = useState<string|null>(null)
  useEffect(() => {
    if(apiUrl && login) {

      const colId = `data:${dataId}:value:admin_region`
      const exprCompiler = new ExprCompiler(schema)

      const jsonql: JsonQLQuery = {
        type: 'query',
        selects: [
          {type: 'select', expr: {type: 'field', tableAlias: 'ar', column: 'full_name'} , alias: 'fullname'}, 
        ],
        from: {
          type: 'join',
          kind: 'right',
          left: {type: 'table', table: 'admin_regions', alias: 'ar'},
          right: {
            alias: 't',
            type: 'subquery',
            query: {
              type: 'query',
              selects: [
                {type: 'select', expr: exprCompiler.compileExpr({
                  expr: {
                    table,
                    column: colId,
                    type: "field",
                  },
                  tableAlias: 'main'
                }), alias: 'id'}, 
              ],
              from: {type: 'table', table, alias: 'main'},
              where: {
                type: 'op',
                op: '=',
                exprs: [
                  {type: 'field', tableAlias: 'main', column: 'code'},
                  responseCode
                ]
              },
            }
          },
          on: {
            type: 'op',
            op: '=',
            exprs: [
              {type: 'field', tableAlias: 'ar', column: '_id'},
              {type: 'field', tableAlias: 't', column: 'id'},
            ]
          }
        }
      }

      ;(async () => {
        const datasource = new MWaterDataSource(apiUrl, login.client)
        const rows = await datasource.performQuery(jsonql)
        if(rows.length > 0) {
          setAdminRegion(rows[0].fullname)
        }
      })()
    }
    
  }, [])
  
  if (!adminRegion) return null

  return <p>{adminRegion}</p>
}

export default LocationQuestionAdminRegionComponent