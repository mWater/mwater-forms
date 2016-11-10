_ = require 'lodash'
assert = require('chai').assert
Schema = require('mwater-expressions').Schema
FormSchemaBuilder = require '../src/FormSchemaBuilder'
canonical = require 'canonical-json'

compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

describe "FormSchemaBuilder addForm", ->
  it "adds form as table", ->
    # Create form
    form = {
      _id: "formid"
      design: {
        _type: "Form"
        name: { en: "Form" }
        contents: []
      }
    }

    # Add to blank schema
    schema = new FormSchemaBuilder().addForm(new Schema(), form)

    table = schema.getTable("responses:formid")

    compare(table.id, "responses:formid")
    compare(table.name, { en: "Form" })

  it "adds form join to entity", ->
    # Add water point table
    schema = new Schema()
    schema = schema.addTable({
      id: "entities.water_point"
      name: { en: "Water Points" }
      contents: [
        { id: "name", name: { en: "Name" }, type: "text" }
      ]
    })

    # Add form with one site question
    form = {
      _id: "formid"
      design: {
        _type: "Form"
        name: { en: "Form" }
        contents: [
          { 
            _id: "site1"
            _type: "SiteQuestion" 
            text: { en: "Site1" }
            siteTypes: ["Water point"]
          } 
        ]
      }
    }

    schema = new FormSchemaBuilder().addForm(schema, form)

    # Check that join to form is present
    column = schema.getColumn("entities.water_point", "responses:formid:data:site1:value")
    assert column, "Column should exist"
    assert.equal column.name.en, "Form: Site1"
    assert.equal column.type, "join"
    assert.equal column.join.type, "1-n"
    assert.equal column.join.toTable, "responses:formid"

  it "adds structure", ->
    # Create form
    form = {
      _id: "formid"
      design: {
        _type: "Form"
        name: { en: "Form" }
        contents: [
          {
            _type: "Section"
            name: { en: "Section X" }
            contents: [
              {
                _id: "questionid"
                _type: "TextQuestion"
                text: { _base: "en", en: "Question" } 
                conditions: []
              }              
            ]
          }
        ]
      }
    }

    # Add to blank schema
    schema = new FormSchemaBuilder().addForm(new Schema(), form)

    # Adds section
    assert.equal _.findWhere(schema.getTable("responses:formid").contents, type: "section").type, "section"
    compare(_.findWhere(schema.getTable("responses:formid").contents, type: "section").name, { en: "Section X" })
    assert.equal _.findWhere(schema.getTable("responses:formid").contents, type: "section").contents.length, 1

  it "adds metadata fields", ->
    # Create form
    form = {
      _id: "formid"
      design: {
        _type: "Form"
        name: { en: "Form" }
        contents: []
      }
    }

    # Add to blank schema
    schema = new FormSchemaBuilder().addForm(new Schema(), form)

    assert schema.getColumn("responses:formid", "user")
    assert schema.getColumn("responses:formid", "submittedOn")
    assert schema.getColumn("responses:formid", "deployment")

  describe "Answer types", ->
    before ->
      @testQuestion = (questionOptions, expectedColumns) ->
        # Create question
        question = {
          _id: "questionid"
          text: { _base: "en", en: "Question" } 
          conditions: []
        }
        _.extend(question, questionOptions)

        # Create form
        form = {
          _id: "formid"
          design: {
            _type: "Form"
            name: { en: "Form" }
            contents: [question]
          }
        }

        # Add to blank schema
        schema = new FormSchemaBuilder().addForm(new Schema(), form)

        # Get column
        for expectedColumn in expectedColumns
          column = schema.getColumn("responses:formid", expectedColumn.id)
          if not column
            throw new Error("Column #{expectedColumn.id} missing")

          # Compare specified keys to expected
          for key, value of expectedColumn
            compare(column[key], value)

    it "text", ->
      @testQuestion({ _type: "TextQuestion" }, [
        { 
          id: "data:questionid:value" 
          type: "text"
          name: { _base: "en", en: "Question" } 
          # data#>>'{questionid,value}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "text with code", ->
      @testQuestion({ _type: "TextQuestion", code: "x" }, [
        { 
          id: "data:questionid:value" 
          type: "text"
          name: { _base: "en", en: "Question" } 
          code: "x"
          # data#>>'{questionid,value}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "text with code and exportId", ->
      @testQuestion({ _type: "TextQuestion", code: "x", exportId: "y" }, [
        { 
          id: "data:questionid:value" 
          type: "text"
          name: { _base: "en", en: "Question" } 
          code: "y"
          # data#>>'{questionid,value}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "number", ->
      @testQuestion({ _type: "NumberQuestion", decimal: false }, [
        { 
          id: "data:questionid:value" 
          type: "number"
          # convert_to_decimal(data#>>'{questionid,value}')
          jsonql: {
            type: "op"
            op: "convert_to_decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
            ]
          }
        }
      ])

      @testQuestion({ _type: "NumberQuestion", decimal: true }, [
        { 
          id: "data:questionid:value" 
          type: "number"
          # convert_to_decimal(data#>>'{questionid,value}')'
          jsonql: {
            type: "op"
            op: "convert_to_decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
            ]
          }
        }
      ])

    it "choice", ->
      @testQuestion({ 
        _type: "RadioQuestion",  
        choices: [
          { id: "yes", label: { _base:"en", en: "Yes"}}
          { id: "no", label: { _base:"en", en: "No"}}
        ]
       }, [
        { 
          id: "data:questionid:value"
          type: "enum"
          # data#>>'{questionid,value}''
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
          enumValues: [
            { id: "yes", name: { _base:"en", en: "Yes"} }
            { id: "no", name: { _base:"en", en: "No"} }
          ]
        }
      ])

    it "choice specify", ->
      @testQuestion({ 
        _type: "RadioQuestion",  
        choices: [
          { id: "yes", label: { _base:"en", en: "Yes"}, specify: true}
          { id: "no", label: { _base:"en", en: "No"}}
        ]
       }, [
        { 
          id: "data:questionid:specify:yes"
          type: "text"
          name: { _base: "en", en: "Question (Yes)" } 
          # data#>>'{questionid,specify,yes}''
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,specify,yes}"] }
        }
      ])

    it "choices", ->
      @testQuestion({ 
        _type: "MulticheckQuestion",  
        choices: [
          { id: "yes", label: { _base:"en", en: "Yes"}}
          { id: "no", label: { _base:"en", en: "No"}}
        ]
       }, [
        { 
          id: "data:questionid:value"
          type: "enumset"
          # data#>'{questionid,value}'
          jsonql: { type: "op", op: "#>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "choices specify", ->
      @testQuestion({ 
        _type: "MulticheckQuestion",  
        choices: [
          { id: "yes", label: { _base:"en", en: "Yes"}, specify: true}
          { id: "no", label: { _base:"en", en: "No"}}
        ]
       }, [
        { 
          id: "data:questionid:specify:yes"
          type: "text"
          name: { _base: "en", en: "Question (Yes)" } 
          # data#>>'{questionid,specify,yes}''
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,specify,yes}"] }
        }
      ])

    it "date", ->
      # Take as datetime, padding out to date minimum
      @testQuestion({ 
        _type: "DateQuestion",  
        format: "YYYY-MM"
       }, [
        { 
          id: "data:questionid:value"
          type: "date"
          # substr(rpad(data#>>'{questionid,value}',10, '-01-01'), 1, 10)
          jsonql: {
            type: "op"
            op: "substr"
            exprs: [
              {
                type: "op"
                op: "rpad"
                exprs: [
                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
                  10
                  "-01-01"
                ]
              }
              1
              10
            ]
          }
        }
      ])

    it "datetime", ->
      # Take as datetime, padding out to date minimum
      @testQuestion({ 
        _type: "DateQuestion",  
        format: "YYYY-MM-DD hh:mm"
       }, [
        { 
          id: "data:questionid:value"
          type: "datetime"
          # data#>>'{questionid,value}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "aquagenx CBT", ->
      @testQuestion({
        _type: "AquagenxCBTQuestion"
      }, [
        {
          id: "data:questionid:value:cbt:mpn"
          type: "number"
          name: { _base: "en", en: "Question (MPN/100ml)" }
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              {
                type: "op"
                op: "#>>"
                exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,mpn}"]
              }
            ]
          }
        }
        {
          id: "data:questionid:value:cbt:confidence"
          type: "number"
          name: { _base: "en", en: "Question (Upper 95% Confidence Interval/100ml)" }
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              {
                type: "op"
                op: "#>>"
                exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,confidence}"]
              }
            ]
          }
        }
        {
          id: "data:questionid:value:cbt:healthRisk"
          type: "enum"
          name: { _base: "en", en: "Question (Health Risk Category)" }
          jsonql: {
            type: "op",
            op: "#>>",
            exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,healthRisk}"]
          }
        }
        {
          id: "data:questionid:value:image"
          type: "image"
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,image}"] }
        }
        {
          id: "data:questionid:value:cbt:c1"
          type: "boolean"
          name: { _base: "en", en: "Question (Compartment 1)" }
          jsonql: {
            type: "op"
            op: "::boolean"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,c1}"] }
            ]
          }
        }
        {
          id: "data:questionid:value:cbt:c2"
          type: "boolean"
          name: { _base: "en", en: "Question (Compartment 2)" }
          jsonql: {
            type: "op"
            op: "::boolean"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,c2}"] }
            ]
          }
        }
        {
          id: "data:questionid:value:cbt:c3"
          type: "boolean"
          name: { _base: "en", en: "Question (Compartment 3)" }
          jsonql: {
            type: "op"
            op: "::boolean"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,c3}"] }
            ]
          }
        }
        {
          id: "data:questionid:value:cbt:c4"
          type: "boolean"
          name: { _base: "en", en: "Question (Compartment 4)" }
          jsonql: {
            type: "op"
            op: "::boolean"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,c4}"] }
            ]
          }
        }
        {
          id: "data:questionid:value:cbt:c5"
          type: "boolean"
          name: { _base: "en", en: "Question (Compartment 5)" }
          jsonql: {
            type: "op"
            op: "::boolean"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,cbt,c5}"] }
            ]
          }
        }
      ])

    it "units integer with multiple", ->
      @testQuestion({ 
        _type: "UnitsQuestion",  
        decimal: false
        units: [
          { id: "m", label: { _base:"en", en: "M"}}
          { id: "ft", label: { _base:"en", en: "Ft"}}
        ]
       }, [
        { 
          id: "data:questionid:value:quantity"
          type: "number"
          name: { _base: "en", en: "Question (magnitude)" }
          # convert_to_decimal(data#>>'{questionid,value,quantity})
          jsonql: {
            type: "op"
            op: "convert_to_decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,quantity}"] }
            ]
          }
        }
        { 
          id: "data:questionid:value:units"
          type: "enum"
          name: { _base: "en", en: "Question (units)" }
          # data#>>'{questionid,value,units}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,units}"] }
          enumValues: [
            { id: "m", name: { _base:"en", en: "M"} }
            { id: "ft", name: { _base:"en", en: "Ft"} }
          ]
        }
      ])

    it "units decimal with single", ->
      @testQuestion({ 
        _type: "UnitsQuestion",  
        decimal: true
        units: [
          { id: "m", label: { _base:"en", en: "M"}}
        ]
       }, [
        { 
          id: "data:questionid:value:quantity"
          type: "number"
          name: { _base: "en", en: "Question (magnitude)" }
          # convert_to_decimal(data#>>'{questionid,value,quantity})
          jsonql: {
            type: "op"
            op: "convert_to_decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,quantity}"] }
            ]
          }
        }
        { 
          id: "data:questionid:value:units"
          type: "enum"
          name: { _base: "en", en: "Question (units)" }
          # data#>>'{questionid,value,units}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,units}"] }
          enumValues: [
            { id: "m", name: { _base:"en", en: "M"} }
          ]
        }
      ])

    it "boolean", ->
      @testQuestion({ _type: "CheckQuestion" }, [
        { 
          id: "data:questionid:value" 
          type: "boolean"
          # data#>>'{questionid,value}'
          jsonql: {
            type: "op"
            op: "::boolean"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
            ]
          }
        }
      ])

    it "location", ->
      @testQuestion({ _type: "LocationQuestion", calculateAdminRegion: true }, [
        { 
          id: "data:questionid:value" 
          type: "geometry"
          name: { _base: "en", en: "Question" }
          # ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326)
          jsonql: {
            type: "op"
            op: "ST_SetSRID"
            exprs: [
              {
                type: "op"
                op: "ST_MakePoint"
                exprs: [
                  {
                    type: "op"
                    op: "::decimal"
                    exprs: [
                      { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,longitude}"] }
                    ]
                  }
                  {
                    type: "op"
                    op: "::decimal"
                    exprs: [
                      { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,latitude}"] }
                    ]
                  }
                ]
              }
              4326
            ]
          }
        }
        { 
          id: "data:questionid:value:admin_region" 
          type: "join"
          name: { _base: "en", en: "Question (administrative region)" }
          join: {
            type: "n-1"
            toTable: "admin_regions"
            jsonql: {
              type: "op"
              op: "and"
              exprs: [
                # Make sure leaf node
                { type: "field", tableAlias: "{to}", column: "leaf" }
                { type: "op", op: "&&", exprs: [
                  # ST_Transform(ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326), 3857)
                  {
                    type: "op"
                    op: "ST_Transform"
                    exprs: [
                      {
                        type: "op"
                        op: "ST_SetSRID"
                        exprs: [
                          {
                            type: "op"
                            op: "ST_MakePoint"
                            exprs: [
                              {
                                type: "op"
                                op: "::decimal"
                                exprs: [
                                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{from}", column: "data" }, "{questionid,value,longitude}"] }
                                ]
                              }
                              {
                                type: "op"
                                op: "::decimal"
                                exprs: [
                                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{from}", column: "data" }, "{questionid,value,latitude}"] }
                                ]
                              }
                            ]
                          }
                          4326
                        ]
                      }
                      3857
                    ]
                  }
                  { type: "field", tableAlias: "{to}", column: "shape" }
                ]}
                { type: "op", op: "ST_Intersects", exprs: [
                  # ST_Transform(ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326), 3857)
                  {
                    type: "op"
                    op: "ST_Transform"
                    exprs: [
                      {
                        type: "op"
                        op: "ST_SetSRID"
                        exprs: [
                          {
                            type: "op"
                            op: "ST_MakePoint"
                            exprs: [
                              {
                                type: "op"
                                op: "::decimal"
                                exprs: [
                                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{from}", column: "data" }, "{questionid,value,longitude}"] }
                                ]
                              }
                              {
                                type: "op"
                                op: "::decimal"
                                exprs: [
                                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{from}", column: "data" }, "{questionid,value,latitude}"] }
                                ]
                              }
                            ]
                          }
                          4326
                        ]
                      }
                      3857
                    ]
                  }
                  { type: "field", tableAlias: "{to}", column: "shape" }
                ]}
              ]
            }
          }
        }
        { 
          id: "data:questionid:value:accuracy" 
          type: "number"
          name: { _base: "en", en: "Question (accuracy)" }
          # data#>>'{questionid,value,accuracy}'::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,accuracy}"] }
            ]
          }
        }
        { 
          id: "data:questionid:value:altitude" 
          type: "number"
          name: { _base: "en", en: "Question (altitude)" }
          # data#>>'{questionid,value,altitude}'::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,altitude}"] }
            ]
          }
        }
      ])

    it "entity", ->
      @testQuestion({ 
        _type: "EntityQuestion" 
        entityType: "water_point"
      }, [
        { 
          id: "data:questionid:value" 
          type: "join"
          # data#>>'{questionid,value} = entities.water_point._id'
          join: {
            type: "n-1"
            toTable: "entities.water_point"
            fromColumn: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] } 
            toColumn: "_id"
          }
        }
      ])

    # TODO possibly use containment
    # # But since #>> is not indexed, we need to use containment test
    # # e.g. from.data @> { questionid: { value: to._id }}
    # # which is from.data @> json_build_object('questionid', json_build_object('value', to._id))::jsonb
    # join: {
    #   type: "n-1"
    #   toTable: "entities.water_point"
    #   jsonql: {
    #     type: "op"
    #     op: "@>"
    #     exprs: [
    #       { type: "field", tableAlias: "{from}", column: "data" }
    #       {
    #         type: "op"
    #         op: "::jsonb"
    #         exprs: [
    #           { 
    #             type: "op"
    #             op: "json_build_object"
    #             exprs: [
    #               "questionid"
    #               { 
    #                 type: "op"
    #                 op: "json_build_object"
    #                 exprs: [
    #                   "value"
    #                   { type: "field", tableAlias: "{to}", column: "_id" }
    #                 ]
    #               }
    #             ]
    #           }
    #         ]
    #       }
    #     ]
    #   }


    it "site", ->
      @testQuestion({ 
        _type: "SiteQuestion" 
        # Only takes first
        siteTypes: ["Water point", "Sanitation facility"]
      }, [
        { 
          id: "data:questionid:value" 
          type: "join"
          # data#>>'{questionid,value,code}'
          join: {
            type: "n-1"
            toTable: "entities.water_point"
            fromColumn: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,code}"] }
            toColumn: "code"
          }
        }
      ])

    it "items_choices", ->
      # items_choices (Likert) has a database column for each item, all in one section
      # Each value is stored as follows: data:QUESTIONID:value:ITEMID, corresponding to the actual path to get data
      @testQuestion({ 
        _type: "LikertQuestion" 
        items: [
          { id: "item1", label: { _base:"en", en: "Item 1" } }
          { id: "item2", label: { _base:"en", en: "Item 2" } }
        ]
        choices: [
          { id: "yes", label: { _base:"en", en: "Yes"}}
          { id: "no", label: { _base:"en", en: "No"}}
        ]
      }, 
      [
        # Item 1
        { 
          id: "data:questionid:value:item1" 
          type: "enum"
          name: { _base: "en", en: "Question: Item 1"}
          enumValues: [
            { id: "yes", name: { _base:"en", en: "Yes"} }
            { id: "no", name: { _base:"en", en: "No"} }
          ]
          # data#>>'{questionid,value,item1}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item1}"] }
        }
        # Item 2
        { 
          id: "data:questionid:value:item2" 
          type: "enum"
          name: { _base: "en", en: "Question: Item 2"}
          enumValues: [
            { id: "yes", name: { _base:"en", en: "Yes"} }
            { id: "no", name: { _base:"en", en: "No"} }
          ]
          # data#>>'{questionid,value,item2}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item2}"] }
        }
      ])

    describe "matrix", ->
      it "adds columns", ->
        # Matrix has a database column for each column/item combination, sectioned by item
        # Each value is stored as follows: data:QUESTIONID:value:ITEMID:COLUMNID:value, corresponding to the actual path to get data
        @testQuestion({ 
          _type: "MatrixQuestion" 
          items: [
            { id: "item1", label: { _base:"en", en: "Item 1" } }
            { id: "item2", label: { _base:"en", en: "Item 2" } }
          ]
          columns: [
            { _id: "col1", _type: "TextColumnQuestion", text: { _base: "en", en: "Col 1" } }
            { _id: "col2", _type: "NumberColumnQuestion", text: { _base: "en", en: "Col 2" }, decimal: true }
            { _id: "col3", _type: "CheckColumnQuestion", text: { _base: "en", en: "Col 3" } }
            { _id: "col4", _type: "DropdownColumnQuestion", text: { _base: "en", en: "Col 4" }, choices: [
              { id: "yes", label: { _base:"en", en: "Yes"}}
              { id: "no", label: { _base:"en", en: "No"}}
            ]}
            { _id: "col5", _type: "UnitsColumnQuestion", text: { _base: "en", en: "Col 5" }, decimal: false, units: [
              { id: "m", label: { _base:"en", en: "M"}}
              { id: "ft", label: { _base:"en", en: "Ft"}}
            ]}
            { _id: "col6", _type: "SiteColumnQuestion", text: { _base: "en", en: "Col 6" }, siteType: "water_point" }
          ]
        }, [
          # TextColumnQuestion
          { 
            id: "data:questionid:value:item1:col1:value" 
            type: "text"
            name: { _base: "en", en: "Question: Item 1 - Col 1"}
            # data#>>'{questionid,value,item1,col1,value}'
            jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item1,col1,value}"] }
          }
          # NumberColumnQuestion
          { 
            id: "data:questionid:value:item2:col2:value" 
            type: "number"
            name: { _base: "en", en: "Question: Item 2 - Col 2"}
            # data#>>'{questionid,value,item1,col1,value}::boolean
            jsonql: {
              type: "op"
              op: "convert_to_decimal"
              exprs: [            
                { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item2,col2,value}"] }
              ]
            }
          }
          # Handles boolean field
          { 
            id: "data:questionid:value:item1:col3:value" 
            type: "boolean"
            name: { _base: "en", en: "Question: Item 1 - Col 3"}
            # 
            jsonql: {
              type: "op"
              op: "::boolean"
              exprs: [            
                { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item1,col3,value}"] }
              ]
            }
          }
          # DropdownColumnQuestion
          { 
            id: "data:questionid:value:item1:col4:value" 
            type: "enum"
            name: { _base: "en", en: "Question: Item 1 - Col 4"}
            enumValues: [
              { id: "yes", name: { _base:"en", en: "Yes"} }
              { id: "no", name: { _base:"en", en: "No"} }
            ]
            # data#>>'{questionid,value,item1,col4,value}'
            jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item1,col4,value}"] }
          }
          # UnitsColumnQuestion
          { 
            id: "data:questionid:value:item1:col5:value:quantity"
            type: "number"
            name: { _base: "en", en: "Question: Item 1 - Col 5 (magnitude)" }
            # convert_to_decimal(data#>>'{questionid,value,item1,col5,value,quantity})
            jsonql: {
              type: "op"
              op: "convert_to_decimal"
              exprs: [
                { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item1,col5,value,quantity}"] }
              ]
            }
          }
          { 
            id: "data:questionid:value:item1:col5:value:units"
            type: "enum"
            name: { _base: "en", en: "Question: Item 1 - Col 5 (units)" }
            # data#>>'{questionid,value,item1,col1,value,units}'
            jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item1,col5,value,units}"] }
            enumValues: [
              { id: "m", name: { _base:"en", en: "M"} }
              { id: "ft", name: { _base:"en", en: "Ft"} }
            ]
          }
          # SiteColumnQuestion
          { 
            id: "data:questionid:value:item1:col6:value" 
            type: "join"
            name: { _base: "en", en: "Question: Item 1 - Col 6"}
            # data#>>'{questionid,value,item1,col6,value,code}'
            join: {
              type: "n-1"
              toTable: "entities.water_point"
              fromColumn: { 
                type: "op"
                op: "#>>"
                exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,item1,col6,value,code}"] 
              }
              toColumn: "code"
            }
          }
        ])

    it "adds location stamp", ->
      @testQuestion({ _type: "TextQuestion", recordLocation: true }, [
        { 
          id: "data:questionid:location" 
          type: "geometry"
          name: { _base: "en", en: "Question (Location Answered)" }
          # ST_SetSRID(ST_MakePoint(data#>>'{questionid,location,longitude}'::decimal, data#>>'{questionid,location,latitude}'::decimal),4326)
          jsonql: {
            type: "op"
            op: "ST_SetSRID"
            exprs: [
              {
                type: "op"
                op: "ST_MakePoint"
                exprs: [
                  {
                    type: "op"
                    op: "::decimal"
                    exprs: [
                      { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,location,longitude}"] }
                    ]
                  }
                  {
                    type: "op"
                    op: "::decimal"
                    exprs: [
                      { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,location,latitude}"] }
                    ]
                  }
                ]
              }
              4326
            ]
          }
        }
        { 
          id: "data:questionid:location:accuracy" 
          type: "number"
          name: { _base: "en", en: "Question (Location Answered - accuracy)" }
          # data#>>'{questionid,location,accuracy}'::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,location,accuracy}"] }
            ]
          }
        }
        { 
          id: "data:questionid:location:altitude" 
          type: "number"
          name: { _base: "en", en: "Question (Location Answered - altitude)" }
          # data#>>'{questionid,location,altitude}'::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,location,altitude}"] }
            ]
          }
        }
      ])


    it "adds timestamp", ->
      @testQuestion({ 
        _type: "TextQuestion" 
        recordTimestamp: true
      }, [
        { 
          id: "data:questionid:timestamp" 
          type: "datetime"
          name: { _base: "en", en: "Question (Time Answered)" }
          # data#>>'{questionid,timestamp}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,timestamp}"] }
        }
      ])

    it "image", ->
      @testQuestion({ 
        _type: "ImageQuestion" 
      }, [
        { 
          id: "data:questionid:value" 
          type: "image"
          # data#>>'{questionid,value}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "image", ->
      @testQuestion({ 
        _type: "ImagesQuestion" 
      }, [
        { 
          id: "data:questionid:value" 
          type: "imagelist"
          # data#>>'{questionid,value}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "texts", ->
      @testQuestion({ 
        _type: "TextListQuestion" 
      }, [
        { 
          id: "data:questionid:value" 
          type: "text[]"
          # data#>>'{questionid,value}'
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
        }
      ])

    it "adds n/a", ->
      @testQuestion({ _type: "TextQuestion", alternates: { na: true } }, [
        { 
          id: "data:questionid:na" 
          type: "boolean"
          name: { _base: "en", en: "Question (Not Applicable)" } 
          # nullif(data#>>'{questionid,alternate}' = 'na', false)
          jsonql: {
            type: "op"
            op: "nullif"
            exprs: [
              {
                type: "op"
                op: "="
                exprs: [
                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,alternate}"] }
                  "na"
                ]
              }
              false
            ]
          }
        }
      ])

    it "adds don't know", ->
      @testQuestion({ _type: "TextQuestion", alternates: { dontknow: true } }, [
        { 
          id: "data:questionid:dontknow" 
          type: "boolean"
          name: { _base: "en", en: "Question (Don't Know)" } 
          # nullif(data#>>'{questionid,alternate}' = 'dontknow', false)
          jsonql: {
            type: "op"
            op: "nullif"
            exprs: [
              {
                type: "op"
                op: "="
                exprs: [
                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,alternate}"] }
                  "dontknow"
                ]
              }
              false
            ]
          }
        }
      ])

    it "adds comments", ->
      @testQuestion({ _type: "TextQuestion", commentsField: true }, [
        { 
          id: "data:questionid:comments" 
          type: "text"
          name: { _base: "en", en: "Question (Comments)" } 
          # data#>>'{questionid,comments}'
          jsonql: {
            type: "op"
            op: "#>>"
            exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,comments}"]
          }
        }
      ])

  describe "indicator calculations", ->
    before ->
      # Indicator table with num1 and num2
      indicatorTableWithTwoFields = {
        id: "indicator_values:ind1",
        name: { en: "Indicator1" }
        primaryKey: "_id"
        ordering: "datetime"
        contents: [
          {
            id: "num1",
            name: { en: "Number1" }
            type: "number"
            jsonql: {
              type: "op",
              op: "::decimal"
              exprs: [{ type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "num1"] }]
            }
          }
          {
            id: "num2",
            name: { en: "Number2" }
            type: "number"
            jsonql: {
              type: "op",
              op: "::decimal"
              exprs: [{ type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "num2"] }]
            }
          }
          {
            id: "datetime"
            name: { en: "Date" }
            type: "datetime"
          }
        ]
      }

      @schema = new Schema().addTable(indicatorTableWithTwoFields)

    it "adds indicator calculations to section called Indicators", ->
      # Create form with number question and indicator calculation
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [
            {
              _id: "questionid"
              _type: "NumberQuestion"
              text: { _base: "en", en: "Question" } 
              decimal: true
              conditions: []
            }              
          ]
        }
        indicatorCalculations: [
          {
            _id: "ic1"
            indicator: "ind1"
            expressions: {
              num1: {
                type: "op"
                op: "+"
                table: "responses:formid"
                exprs: [
                  { type: "field", table: "responses:formid", column: "data:questionid:value" }
                  { type: "literal", valueType: "number", value: 5 }
                ]
              }
            }
          }
        ]
      }
      schema = new FormSchemaBuilder().addForm(@schema, form)

      # Check that indicators section exists
      assert.equal _.last(schema.getTable("responses:formid").contents).name.en, "Indicators"

      # Check that indicator section exists
      assert.equal _.last(schema.getTable("responses:formid").contents).contents[0].name.en, "Indicator1"

      # Check that indicator calculation added
      compare(schema.getColumn("responses:formid", "indicator_calculation:ic1:num1"), {
        id: "indicator_calculation:ic1:num1"
        type: "expr"
        name: { en: "Number1" }
        expr: {
          type: "op"
          op: "+"
          table: "responses:formid"
          exprs: [
            { type: "field", table: "responses:formid", column: "data:questionid:value" }
            { type: "literal", valueType: "number", value: 5 }
          ]
        }
      })

    it "adds indicator calculations with filters as case", ->
      # Create form with number question and indicator calculation
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [
            {
              _id: "questionid"
              _type: "NumberQuestion"
              text: { _base: "en", en: "Question" } 
              decimal: true
              conditions: []
            }              
          ]
        }
        indicatorCalculations: [
          {
            _id: "ic1"
            indicator: "ind1"
            expressions: {
              num1: {
                type: "op"
                op: "+"
                table: "responses:formid"
                exprs: [
                  { type: "field", table: "responses:formid", column: "data:questionid:value" }
                  { type: "literal", valueType: "number", value: 5 }
                ]
              }
            }
            # Condition on indicator
            condition: {
              type: "op"
              op: ">"
              table: "responses:formid"
              exprs: [
                { type: "field", table: "responses:formid", column: "data:questionid:value" }
                { type: "literal", valueType: "number", value: 3 }
              ]
            }
          }
        ]
      }
      schema = new FormSchemaBuilder().addForm(@schema, form)

      # Check that indicator calculation added with condition
      compare(schema.getColumn("responses:formid", "indicator_calculation:ic1:num1"), {
        id: "indicator_calculation:ic1:num1"
        type: "expr"
        name: { en: "Number1" }
        expr: {
          type: "case"
          table: "responses:formid"
          cases: [
            { 
              when: {
                type: "op"
                op: ">"
                table: "responses:formid"
                exprs: [
                  { type: "field", table: "responses:formid", column: "data:questionid:value" }
                  { type: "literal", valueType: "number", value: 3 }
                ]
              }
              then: { 
                type: "op"
                op: "+"
                table: "responses:formid"
                exprs: [
                  { type: "field", table: "responses:formid", column: "data:questionid:value" }
                  { type: "literal", valueType: "number", value: 5 }
                ]
              }
            }
          ]
        }
      })

    it "add indicators fields with no calculation as jsonql literal null", ->
      # Create form with number question and indicator calculation
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [
            {
              _id: "questionid"
              _type: "NumberQuestion"
              text: { _base: "en", en: "Question" } 
              decimal: true
              conditions: []
            }              
          ]
        }
        indicatorCalculations: [
          {
            _id: "ic1"
            indicator: "ind1"
            expressions: { } # No calculations
          }
        ]
      }
      schema = new FormSchemaBuilder().addForm(@schema, form)

      # Check that indicator calculation not added
      assert.deepEqual schema.getColumn("responses:formid", "indicator_calculation:ic1:num1").jsonql, { type: "literal", value: null }

    it "adds indicators of indicators", ->
      # Create form with number question and indicator calculation
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [
            {
              _id: "questionid"
              _type: "NumberQuestion"
              text: { _base: "en", en: "Question" } 
              decimal: true
              conditions: []
            }              
          ]
        }
        indicatorCalculations: [ # Deliberately in opposite order to force testing dependency calculation
          {
            _id: "ic2"
            indicator: "ind1"
            expressions: {
              num2: {
                type: "op"
                op: "-"
                table: "responses:formid"
                exprs: [
                  { type: "field", table: "responses:formid", column: "indicator_calculation:ic1:num1" }  # References ic1 indicator calculation
                  { type: "literal", valueType: "number", value: 3 }
                ]
              }
            }
          }
          {
            _id: "ic1"
            indicator: "ind1"
            expressions: {
              num1: {
                type: "op"
                op: "+"
                exprs: [
                  { type: "field", table: "responses:formid", column: "data:questionid:value" }
                  { type: "literal", valueType: "number", value: 5 }
                ]
              }
            }
          }
        ]
      }
      schema = new FormSchemaBuilder().addForm(@schema, form)

      # Check that indicator calculation added
      compare(schema.getColumn("responses:formid", "indicator_calculation:ic2:num2"), {
        id: "indicator_calculation:ic2:num2"
        type: "expr"
        name: { en: "Number2" }
        expr: {
          type: "op"
          op: "-"
          table: "responses:formid"
          exprs: [
            { type: "field", table: "responses:formid", column: "indicator_calculation:ic1:num1" }  # References ic1 indicator calculation
            { type: "literal", valueType: "number", value: 3 }
          ]
        }
      })

    it "adds roster indicator calculations", ->
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [{
            _id: "roster1"
            _type: "RosterGroup"
            name: { en: "Roster1" }
            contents: [
              { _id: "q1", _type: "TextQuestion", text: { en: "Q1" }}
              { _id: "q2", _type: "NumberQuestion", text: { en: "Q2" }}
            ]
          }]
        }
        indicatorCalculations: [
          {
            _id: "ic1"
            indicator: "ind1"
            roster: "roster1"
            expressions: {
              num1: {
                type: "op"
                op: "+"
                table: "responses:formid:roster:roster1"
                exprs: [
                  { type: "field", table: "responses:formid:roster:roster1", column: "data:q2:value" }
                  { type: "literal", valueType: "number", value: 5 }
                ]
              }
            }
          }
        ]
      }

      schema = new FormSchemaBuilder().addForm(@schema, form)

      # Check that indicators section exists
      assert.equal _.last(schema.getTable("responses:formid:roster:roster1").contents).name.en, "Indicators"

      # Check that indicator section exists
      assert.equal _.last(schema.getTable("responses:formid:roster:roster1").contents).contents[0].name.en, "Indicator1"

      # Check that indicator calculation added
      compare(schema.getColumn("responses:formid:roster:roster1", "indicator_calculation:ic1:num1"), {
        id: "indicator_calculation:ic1:num1"
        type: "expr"
        name: { en: "Number1" }
        expr: {
          type: "op"
          op: "+"
          table: "responses:formid:roster:roster1"
          exprs: [
            { type: "field", table: "responses:formid:roster:roster1", column: "data:q2:value" }
            { type: "literal", valueType: "number", value: 5 }
          ]
        }
      })

    # it "correctly orders indicators of indicators", ->
    #   # Create form with number question and indicator calculation
    #   indicatorCalculations = [ # Deliberately in opposite order to force testing dependency calculation
    #     {
    #       _id: "ic2"
    #       indicator: "ind1"
    #       expressions: {
    #         num2: {
    #           type: "op"
    #           op: "-"
    #           exprs: [
    #             { type: "field", table: "responses:formid", column: "indicator_calculation:ic1:num1" }  # References ic1 indicator calculation
    #             { type: "literal", valueType: "number", value: 3 }
    #           ]
    #         }
    #       }
    #     }
    #     {
    #       _id: "ic1"
    #       indicator: "ind1"
    #       expressions: {
    #         num1: {
    #           type: "op"
    #           op: "+"
    #           exprs: [
    #             { type: "field", table: "responses:formid", column: "data:questionid:value" }
    #             { type: "literal", valueType: "number", value: 5 }
    #           ]
    #         }
    #       }
    #     }
    #   ]
    #   assert.deepEqual _.pluck(new FormSchemaBuilder().orderIndicatorCalculation(indicatorCalculations), "_id"), ["ic1", "ic2"]

  describe "Roster Group", ->
    beforeEach ->
      # Form with roster group
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [{
            _id: "roster1"
            _type: "RosterGroup"
            name: { en: "Roster1" }
            contents: [
              { _id: "q1", _type: "TextQuestion", text: { en: "Q1" }}
              { _id: "q2", _type: "NumberQuestion", text: { en: "Q2" }}
            ]
          }]
        }
      }

      # Add to blank schema
      @schema = new FormSchemaBuilder().addForm(new Schema(), form)

    it "creates new table with column", ->
      assert.equal @schema.getTable("responses:formid:roster:roster1").name.en, "Form: Roster1"

      # Check that column was added
      assert @schema.getColumn("responses:formid:roster:roster1", "data:q1:value")
      compare(@schema.getColumn("responses:formid:roster:roster1", "data:q1:value").jsonql, {
        # data#>>'{questionid,value}'
        type: "op"
        op: "#>>"
        exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{q1,value}"]
      })

    it "adds index to roster table", ->
      assert.equal @schema.getColumn("responses:formid:roster:roster1", "index").type, "number"

    it "adds join to roster table", ->
      assert.equal @schema.getColumn("responses:formid", "data:roster1").join.toTable, "responses:formid:roster:roster1"
      assert.equal @schema.getColumn("responses:formid", "data:roster1").join.type, "1-n"

    it "adds join back to main table", ->
      assert.equal @schema.getColumn("responses:formid:roster:roster1", "response").join.toTable, "responses:formid"
      assert.equal @schema.getColumn("responses:formid:roster:roster1", "response").join.type, "n-1"

    it "reuses existing table when rosterId specified", ->
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [
            {
              _id: "roster1"
              _type: "RosterGroup"
              name: { en: "Roster1" }
              contents: [
                { _id: "q1", _type: "TextQuestion", text: { en: "Q1" }}
              ]
            }
            {
              _id: "roster2"
              _type: "RosterGroup"
              rosterId: "roster1"
              name: { en: "Roster2" }
              contents: [
                { _id: "q2", _type: "TextQuestion", text: { en: "Q2" }}
              ]
            }
          ]
        }
      }

      # Add to blank schema
      schema = new FormSchemaBuilder().addForm(new Schema(), form)

      # Check that was added
      assert schema.getColumn("responses:formid:roster:roster1", "data:q1:value"), "original should be there"
      assert schema.getColumn("responses:formid:roster:roster1", "data:q2:value"), "new should be there"

    it "works with master forms"

  
  describe "Roster Matrix", ->
    it "adds columns", ->
      # Form with roster group
      form = {
        _id: "formid"
        design: {
          _type: "Form"
          name: { en: "Form" }
          contents: [{
            _id: "roster1"
            _type: "RosterMatrix"
            name: { en: "Roster1" }
            contents: [
              { _id: "q1", _type: "TextColumnQuestion", text: { en: "Q1" }}
            ]
          }]
        }
      }

      # Add to blank schema
      schema = new FormSchemaBuilder().addForm(new Schema(), form)

      # Check that was added
      assert schema.getColumn("responses:formid:roster:roster1", "data:q1:value")
      compare(schema.getColumn("responses:formid:roster:roster1", "data:q1:value").jsonql, {
        # data#>>'{questionid,value}'
        type: "op"
        op: "#>>"
        exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{q1,value}"]
      })

    it "works with master forms"
