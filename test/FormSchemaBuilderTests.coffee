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

  it "adds form join to entity"

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
          # data#>>'{questionid,value,quantity}::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
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
          # data#>>'{questionid,value,quantity}::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
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
      @testQuestion({ _type: "LocationQuestion" }, [
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
            fromColumn: { 
              type: "op"
              op: "coalesce"
              exprs: [
                { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value,code}"] }
                { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
              ]
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
          # data#>>'{questionid,alternate}' = 'na'
          jsonql: {
            type: "op"
            op: "="
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,alternate}"] }
              "na"
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
          # data#>>'{questionid,alternate}' = 'na'
          jsonql: {
            type: "op"
            op: "="
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,alternate}"] }
              "dontknow"
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
        type: "number"
        name: { en: "Number1" }
        jsonql: 
          { 
            type: "op"
            op: "+"
            exprs: [
              {
                type: "op"
                op: "convert_to_decimal"
                exprs: [
                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
                ]
              }
              { type: "literal", value: 5 }
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
        type: "number"
        name: { en: "Number2" }
        jsonql: 
          {
            type: "op"
            op: "-"
            exprs: [
              { 
                type: "op"
                op: "+"
                exprs: [
                  {
                    type: "op"
                    op: "convert_to_decimal"
                    exprs: [
                      { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{questionid,value}"] }
                    ]
                  }
                  { type: "literal", value: 5 }
                ]
              }
              { type: "literal", value: 3 }
            ]
          }
      })

    it "correctly orders indicators of indicators", ->
      # Create form with number question and indicator calculation
      indicatorCalculations = [ # Deliberately in opposite order to force testing dependency calculation
        {
          _id: "ic2"
          indicator: "ind1"
          expressions: {
            num2: {
              type: "op"
              op: "-"
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
      assert.deepEqual _.pluck(new FormSchemaBuilder().orderIndicatorCalculation(indicatorCalculations), "_id"), ["ic1", "ic2"]
