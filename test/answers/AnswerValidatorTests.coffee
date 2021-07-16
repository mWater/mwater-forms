assert = require('chai').assert
AnswerValidator = require '../../src/answers/AnswerValidator'

describe 'AnswerValidator', ->
  before ->
    @answerValidator = new AnswerValidator({}, {})

  describe 'validate', ->
    describe 'TestQuestion', ->
      it "returns null for non required value that are null or empty", ->
        answer = {value: null}
        question = {format: 'url', required: false}

        result = await @answerValidator.validate(question, answer)
        assert.equal null, result

        answer = {value: ''}
        result = await @answerValidator.validate(question, answer)
        assert.equal null, result

      it "returns null for required but disabled questions' value that are null or empty", ->
        answer = {value: null}
        question = {format: 'url', disabled: true, required: true}

        result = await @answerValidator.validate(question, answer)
        assert.equal null, result

        answer = {value: ''}
        result = await @answerValidator.validate(question, answer)
        assert.equal null, result

      it "returns an error for required value that are null or empty", ->
        answer = {value: null}
        question = {format: 'url', required: true}

        result = await @answerValidator.validate(question, answer)
        assert result

        answer = {value: ''}
        result = await @answerValidator.validate(question, answer)
        assert result

      it "can apply a validator", ->
        answer = {value: '1234567'}
        question = {
          format: 'singleline',
          validations: [
            {
              op: "lengthRange"
              rhs: { literal: { max: 6 } }
              message: { _base: "en", en: "message" }
            }
          ]
        }
        result = await @answerValidator.validate(question, answer)
        assert.equal result, "message"

      it "allows alternate for required", ->
        answer = {alternate: 'na'}
        question = {required: true, alternates: {na: true}}

        result = await @answerValidator.validate(question, answer)
        assert.equal null, result, 'alternate is valid for a required question'

      it "requires specify field to be entered if question is required (RadioQuestion)", ->
        answer = {value: 'c3', specify: null}
        question = {_type: 'RadioQuestion', choices: [{id: 'c1'}, {id: 'c2'}, {id: 'c3', specify: true}], required: true}

        result = await @answerValidator.validate(question, answer)
        assert.equal true, result, 'Required specify question requires specify entered'

        answer = {value: 'c3', specify: {c3: 'coz bla bla'}}

        result = await @answerValidator.validate(question, answer)
        assert.equal null, result, 'Validates if specify text is set on required question'

      it "requires specify field to be entered if question is required (MulticheckQuestion)", ->
        answer = {value: ['c3', 'c4', 'c5'], specify: null}
        question = {_type: 'MulticheckQuestion', choices: [{id: 'c1'}, {id: 'c2'}, {id: 'c3', specify: true}, {id: 'c4', specify: true}, {id: 'c5', specify: true}], required: true}

        result = await @answerValidator.validate(question, answer)
        assert.equal true, result, 'Required specify question requires specify entered'

        answer = {value: ['c3', 'c4', 'c5'], specify: {c3: 'bla 1'}}
        result = await @answerValidator.validate(question, answer)
        assert.equal true, result, 'all specifys in multi check question should be provided'

        answer = {value: ['c3', 'c4', 'c5'], specify: {c3: 'bla 1', c4: 'bla 1', c5: 'bla 4'}}
        result = await @answerValidator.validate(question, answer)
        assert.equal null, result, 'Validates if all specifys in required multi check question are provided'

      it "validates true advanced validations", ->
        question = { advancedValidations: [
          { expr: { type: "literal", valueType: "boolean", value: true }, message: { en: "message" } }
        ]}

        answer = { value: 'value' }
        result = await @answerValidator.validate(question, answer)
        assert.equal result, null

      it "validates false advanced validations", ->
        question = { advancedValidations: [
          { expr: { type: "literal", valueType: "boolean", value: false }, message: { en: "message" } }
        ]}

        answer = { value: 'value' }
        result = await @answerValidator.validate(question, answer)
        assert.equal result, "message"

      it "blank message is true advanced validations", ->
        question = { advancedValidations: [
          { expr: { type: "literal", valueType: "boolean", value: false }, message: { en: "" } }
        ]}

        answer = { value: 'value' }
        result = await @answerValidator.validate(question, answer)
        assert.equal result, true


  describe 'validateTextQuestion', ->
    describe 'url', ->
      it "returns null for empty value", ->
        answer = {value: null}
        question = {format: 'url'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns null for well formed url", ->
        answer = {value: 'http://api.mwater.co'}
        question = {format: 'url'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns error on malformed url", ->
        answer = {value: 'test'}
        question = {format: 'url'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert result?

    describe 'email', ->
      it "returns null for empty value", ->
        answer = {value: null}
        question = {format: 'email'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns null for well formed email", ->
        answer = {value: 'test@hotmail.com'}
        question = {format: 'email'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns error on malformed url", ->
        answer = {value: 'test'}
        question = {format: 'email'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert result?

    describe 'multiline', ->
      it "returns null", ->
        answer = {value: 'patate@@$#@%!@%'}
        question = {format: 'multiline'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

    describe 'singleline', ->
      it "returns null", ->
        answer = {value: 'patate@@$#@%!@%'}
        question = {format: 'singleline'}

        result = await @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

    it "allows non-valid blank answer if not required", ->
      question = {
        validations: [
          {
            op: "lengthRange"
            rhs: {literal: {min: 4, max: 6}}
            message: {_base: "en", en: "message"}
          }
        ]
      }
      answer = {value: ''}

      result = await @answerValidator.validate(question, answer)
      assert.equal result, null, 'Should be allowed'

  describe 'validateUnitsQuestion', ->
    it "returns true for empty value if required", ->
      answer = {value: null}
      question = {_type: "UnitsQuestion"}

      # Okay if not required
      result = await @answerValidator.validate(question, answer)
      assert.equal null, result

      question.required = true

      # The unit answer is still valid in itself
      result = await @answerValidator.validateUnitsQuestion(question, answer)
      assert.equal null, result

      # But not if required
      result = await @answerValidator.validate(question, answer)
      assert.equal true, result

    it "enforces required on blank answer", ->
      answer = {value: {quantity: '', unit: 'a'}}
      question = {_type: "UnitsQuestion"}

      # Okay if not required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null, 'Should be valid'

      question.required = true
      # Not Okay if required
      result = await @answerValidator.validate(question, answer)
      assert result, "Shouldn't be valid"

    it "allows 0 on required", ->
      answer = {value: {quantity: '0', units: 'a'}}
      question = {_type: "UnitsQuestion"}
      question.required = true
      # Okay if not required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null, 'Should be valid'

      # Also Okay if required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null, "Should also be valid"

    it "requires units to be specified if a quantity is set", ->
      answer = {value: {quantity: '0'}}
      question = {_type: "UnitsQuestion"}

      # Not Okay if unit is undefined
      result = await @answerValidator.validate(question, answer)
      assert result, "Shouldn't be valid"

      # Not Okay if unit is null
      answer.value.units = null
      result = await @answerValidator.validate(question, answer)
      assert result, "Shouldn't be valid either"

      # Okay if quantity is undefined or nul or empty string
      answer.value.quantity = ''
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null
      answer.value.quantity = null
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null
      delete answer.value['quantity']
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

      answer.value.quantity = 0
      answer.value.units = 'a'
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

    it "validates range", ->
      question = {
        validations: [
          {
            op: "range"
            rhs: {literal: {max: 6}}
            message: {_base: "en", en: "message"}
          }
        ]
      }
      answer = {value: {quantity: 7}, unit: 'a'}
      result = await @answerValidator.validate(question, answer)
      assert.equal result, "message"

  describe 'validateNumberQuestion', ->
    it "enforces required", ->
      answer = {value: null}
      question = {_type: "NumberQuestion"}

      # Okay if not required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

      question.required = true

      # The unit answer is still valid in itself
      result = @answerValidator.validateNumberQuestion(question, answer)
      assert.equal result, null

      # But not if required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, true

    it "enforces required on blank answer", ->
      answer = {value: ''}
      question = {_type: "NumberQuestion"}
      question.isRequired = false

      # Okay if not required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

    it "allows 0 on required", ->
      answer = {value: 0}
      question = {_type: "NumberQuestion"}
      question.isRequired = false

      # Okay if not required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

    it "validates range", ->
      question = {
        validations: [
          {
            op: "range"
            rhs: {literal: {max: 6}}
            message: {_base: "en", en: "message"}
          }
        ]
      }
      answer = {value: 7}

      result = await @answerValidator.validate(question, answer)
      assert.equal result, "message"

  describe 'validateLikertQuestion', ->
    it "enforces required", ->
      answer = {value: null}
      question = {
        _type: "LikertQuestion"
        items: [{id: 'itemAId'}, {id: 'itemBId'}]
        choices: [{id: 'choiceId'}]
      }

      # Okay if not required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

      question.required = true

      # The unit answer is still valid in itself
      result = @answerValidator.validateLikertQuestion(question, answer)
      assert.equal result, null

      # But not if required
      result = await @answerValidator.validate(question, answer)
      assert.equal result, true

      # Even if one of the items has been answered
      answer = {'itemAId': 'choiceId'}
      result = await @answerValidator.validate(question, answer)
      assert.equal result, true

      # But it's validate if all items have been answered
      answer = {value: {'itemAId': 'choiceId', 'itemBId': 'choiceId'}}
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

    it "enforces that all the answered items of values are available choices", ->
      answer = {value: {'itemAId': 'choiceId', 'itemBId': 'choiceId'}}
      question = {
        _type: "LikertQuestion"
        items: [{id: 'itemAId'}, {id: 'itemBId'}]
        choices: [{id: 'choiceId'}]
      }

      assert.equal null, @answerValidator.validateLikertQuestion(question, answer)

      # Setting an invalid choice value
      answer = {value: {'itemAId': 'choiceId', 'itemBId': 'anotherChoiceId'}}
      assert.equal 'Invalid choice', @answerValidator.validateLikertQuestion(question, answer)


  describe "validateSiteQuestion", ->
    it "Does not require a site code if question not required", ->
      answer = {}
      question = {
        _type: "SiteQuestion"
        required: false
      }

      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

    it "does not allow sites with code null", ->
      answer = {"value": {"code": null}}
      question = {
        _type: "SiteQuestion"
        required: true
      }

      result = await @answerValidator.validate(question, answer)
      assert.equal result, true
    
    it "allows a valid site code", ->
      answer = {"value": {"code": "4287759"}}
      question = {
        _type: "SiteQuestion"
        required: true
      }

      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

  describe "validateMatrixQuestion", ->
    it "allows non-valid blank answer if not required", ->
      question = {
        "_id": "q1",
        "_type": "MatrixQuestion",
        "columns": [
          { "_id": "c1", "_type": "TextColumnQuestion", "required": false},
          {
            "_id": "c2",
            "_type": "NumberColumnQuestion",
            "decimal": false,
            "required": false,
            "validations": [ {"message": { "undefined": "Wrong" }, "op": "range", "rhs": { "literal": { "max": "10", "min": "0"}}}]
          },
          {
            "_id": "c3",
            "_type": "NumberColumnQuestion",
            "decimal": false,
            "required": false,
            "validations": [ { "message": { "undefined": "Wrong" }, "op": "range", "rhs": { "literal": { "max": "100", "min": "10" }}}]
          }
        ],
        "items": [ { "id": "ts39QF6" }, { "id": "dWY5r5E" }],
        "required": true,
      }

      answer = {
        value: {
          "ts39QF6": {
            "c1": {value: "as"}
            "c2": {value: null}
            "c3": {value: null}
          }
        }
      }
      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

    it "passes if ok", ->
      question = {
        _type: "MatrixQuestion"
        items: [{id: 'itemAId'}]
        columns: [{ _id: "c1", _type: "TextColumnQuestion", required: true }]
      }

      answer = {
        value: {
          "itemAId": {
            "c1": { value: "xyz" }
          }
        }
      }

      result = await @answerValidator.validate(question, answer)
      assert.equal result, null

    it "validates required text question column", ->
      question = {
        _type: "MatrixQuestion"
        items: [{id: 'itemAId'}]
        columns: [{ _id: "c1", _type: "TextColumnQuestion", required: true }]
      }

      answer = {
        value: {
          "itemAId": {
            "c1": { value: "" }
          }
        }
      }

      result = await @answerValidator.validate(question, answer)
      assert.equal result, true

    it "validates text question column", ->
      question = {
        _type: "MatrixQuestion"
        items: [{id: 'itemAId'}]
        columns: [{ 
          _id: "c1"
          _type: "TextColumnQuestion"
          validations: [
            {
              op: "lengthRange"
              rhs: { literal: { max: 6 } }
              message: { _base: "en", en: "message" }
            }
          ]
        }]
      }

      answer = {
        value: {
          "itemAId": {
            "c1": { value: "toolong" }
          }
        }
      }

      result = await @answerValidator.validate(question, answer)
      assert.equal result, "message"