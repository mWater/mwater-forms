import { JsonQLQuery } from "jsonql"
import { ExprCompiler, Schema } from "mwater-expressions"
import MWaterDataSource from "mwater-expressions/lib/MWaterDataSource"
import React, { useEffect, useState } from "react"

type LocationQuestionAdminRegionComponentProps = {
  apiUrl?: string
  login?: any

  location: { longitude: number; latitude: number; method: string }
}

const LocationQuestionAdminRegionComponent: React.FC<LocationQuestionAdminRegionComponentProps> = ({
  apiUrl,
  login,
  location
}) => {
  const [adminRegion, setAdminRegion] = useState<string | null>(null)
  useEffect(() => {
    if (apiUrl && login) {
      const jsonql = generateJsonql(location)

      ;(async () => {
        const datasource = new MWaterDataSource(apiUrl, login.client)
        try {
          const rows = await datasource.performQuery(jsonql)
          if (rows.length > 0) {
            setAdminRegion(rows[0].fullname)
          }
        } catch (error) {}
      })()
    }
  }, [])

  if (!adminRegion) return null

  return <p>{adminRegion}</p>
}

export default LocationQuestionAdminRegionComponent

const generateJsonql = (location: any): JsonQLQuery => ({
  type: "query",
  selects: [{ type: "select", expr: { type: "field", tableAlias: "main", column: "full_name" }, alias: "fullname" }],
  from: { type: "table", table: "admin_regions", alias: "main" },
  where: {
    type: "op",
    op: "and",
    exprs: [
      {
        type: "field",
        tableAlias: "main",
        column: "leaf"
      },
      {
        type: "op",
        op: "&&",
        exprs: [
          {
            type: "op",
            op: "ST_Transform",
            exprs: [
              {
                type: "op",
                op: "ST_Intersection",
                exprs: [
                  {
                    type: "op",
                    op: "ST_SetSRID",
                    exprs: [
                      {
                        type: "op",
                        op: "ST_MakePoint",
                        exprs: [location.longitude, location.latitude]
                      },
                      4326
                    ]
                  },
                  {
                    type: "op",
                    op: "ST_MakeEnvelope",
                    exprs: [-180, -85, 180, 85, 4326]
                  }
                ]
              },
              3857
            ]
          },
          {
            type: "field",
            tableAlias: "main",
            column: "shape"
          }
        ]
      },
      {
        type: "op",
        op: "ST_Intersects",
        exprs: [
          {
            type: "op",
            op: "ST_Transform",
            exprs: [
              {
                type: "op",
                op: "ST_Intersection",
                exprs: [
                  {
                    type: "op",
                    op: "ST_SetSRID",
                    exprs: [
                      {
                        type: "op",
                        op: "ST_MakePoint",
                        exprs: [location.longitude, location.latitude]
                      },
                      4326
                    ]
                  },
                  {
                    type: "op",
                    op: "ST_MakeEnvelope",
                    exprs: [-180, -85, 180, 85, 4326]
                  }
                ]
              },
              3857
            ]
          },
          {
            type: "field",
            tableAlias: "main",
            column: "shape"
          }
        ]
      }
    ]
  }
})
