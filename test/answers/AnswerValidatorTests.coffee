assert = require('chai').assert
AnswerValidator = require '../../src/answers/AnswerValidator'

describe 'AnswerValidator', ->
  before ->
    @answerValidator = new AnswerValidator()

  describe 'validate', ->
    describe 'TestQuestion', ->
      it "returns null for non required value that are null or empty", ->
        answer = {value: null}
        question = {format: 'url', required: false}

        result = @answerValidator.validate(question, answer)
        assert.equal null, result

        answer = {value: ''}
        result = @answerValidator.validate(question, answer)
        assert.equal null, result

      it "returns an error for required value that are null or empty", ->
        answer = {value: null}
        question = {format: 'url', required: true}

        result = @answerValidator.validate(question, answer)
        assert result

        answer = {value: ''}
        result = @answerValidator.validate(question, answer)
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
        assert.equal @answerValidator.validate(question, answer), "message"

      it "allows alternate for required", ->
        answer = {alternate: 'na'}
        question = {required: true, alternates: {na: true}}

        result = @answerValidator.validate(question, answer)
        assert.equal null, result, 'alternate is valid for a required question'

  describe 'validateTextQuestion', ->
    describe 'url', ->
      it "returns null for empty value", ->
        answer = {value: null}
        question = {format: 'url'}

        result = @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns null for well formed url", ->
        answer = {value: 'http://api.mwater.co'}
        question = {format: 'url'}

        result = @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns error on malformed url", ->
        answer = {value: 'test'}
        question = {format: 'url'}

        result = @answerValidator.validateTextQuestion(question, answer)
        assert result?

    describe 'email', ->
      it "returns null for empty value", ->
        answer = {value: null}
        question = {format: 'email'}

        result = @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns null for well formed email", ->
        answer = {value: 'test@hotmail.com'}
        question = {format: 'email'}

        result = @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

      it "returns error on malformed url", ->
        answer = {value: 'test'}
        question = {format: 'email'}

        result = @answerValidator.validateTextQuestion(question, answer)
        assert result?

    describe 'multiline', ->
      it "returns null", ->
        answer = {value: 'patate@@$#@%!@%'}
        question = {format: 'multiline'}

        result = @answerValidator.validateTextQuestion(question, answer)
        assert.equal null, result

    describe 'singleline', ->
      it "returns null", ->
        answer = {value: 'patate@@$#@%!@%'}
        question = {format: 'singleline'}

        result = @answerValidator.validateTextQuestion(question, answer)
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

      assert.equal null, @answerValidator.validate(question, answer), 'Should be allowed'

  describe 'validateUnitsQuestion', ->
    it "returns true for empty value if required", ->
      answer = {value: null}
      question = {_type: "UnitsQuestion"}

      # Okay if not required
      result = @answerValidator.validate(question, answer)
      assert.equal null, result

      question.required = true

      # The unit answer is still valid in itself
      result = @answerValidator.validateUnitsQuestion(question, answer)
      assert.equal null, result

      # But not if required
      result = @answerValidator.validate(question, answer)
      assert.equal true, result

    it "enforces required on blank answer", ->
      answer = {value: {quantity: '', unit: 'a'}}
      question = {_type: "UnitsQuestion"}

      # Okay if not required
      assert.equal null, @answerValidator.validate(question, answer), 'Should be valid'

      question.required = true
      # Not Okay if required
      assert @answerValidator.validate(question, answer), "Shouldn't be valid"

    it "allows 0 on required", ->
      answer = {value: {quantity: '0', units: 'a'}}
      question = {_type: "UnitsQuestion"}
      question.required = true
      # Okay if not required
      assert.equal null, @answerValidator.validate(question, answer), 'Should be valid'
      # Also Okay if required
      assert.equal null, @answerValidator.validate(question, answer), "Should also be valid"

    it "requires units to be specified if a quantity is set", ->
      answer = {value: {quantity: '0'}}
      question = {_type: "UnitsQuestion"}

      # Not Okay if unit is undefined
      assert @answerValidator.validate(question, answer), "Shouldn't be valid"

      # Not Okay if unit is null
      answer.value.units = null
      assert @answerValidator.validate(question, answer), "Shouldn't be valid either"

      # Okay if quantity is undefined or nul or empty string
      answer.value.quantity = ''
      assert.equal null, @answerValidator.validate(question, answer)
      answer.value.quantity = null
      assert.equal null, @answerValidator.validate(question, answer)
      delete answer.value['quantity']
      assert.equal null, @answerValidator.validate(question, answer)

      answer.value.quantity = 0
      answer.value.units = 'a'
      assert.equal null, @answerValidator.validate(question, answer)

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
      assert.equal @answerValidator.validate(question, answer), "message"

  describe 'validateNumberQuestion', ->
    it "enforces required", ->
      answer = {value: null}
      question = {_type: "NumberQuestion"}

      # Okay if not required
      assert.equal null, @answerValidator.validate(question, answer)

      question.required = true

      # The unit answer is still valid in itself
      assert.equal null, @answerValidator.validateNumberQuestion(question, answer)

      # But not if required
      assert.equal true, @answerValidator.validate(question, answer)

    it "enforces required on blank answer", ->
      answer = {value: ''}
      question = {_type: "NumberQuestion"}
      question.isRequired = false

      # Okay if not required
      assert.equal @answerValidator.validate(question, answer)

    it "allows 0 on required", ->
      answer = {value: 0}
      question = {_type: "NumberQuestion"}
      question.isRequired = false

      # Okay if not required
      assert.equal null, @answerValidator.validate(question, answer)

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

      assert.equal "message", @answerValidator.validate(question, answer)

  describe.only 'validateLikertQuestion', ->
    it "enforces required", ->
      answer = {value: null}
      question = {
        _type: "LikertQuestion"
        items: [{id: 'itemAId'}, {id: 'itemBId'}]
        choices: [{id: 'choiceId'}]
      }

      # Okay if not required
      assert.equal null, @answerValidator.validate(question, answer)

      question.required = true

      # The unit answer is still valid in itself
      assert.equal null, @answerValidator.validateLikertQuestion(question, answer)

      # But not if required
      assert.equal true, @answerValidator.validate(question, answer)

      # Even if one of the items has been answered
      answer = {'itemAId': 'choiceId'}
      assert.equal true, @answerValidator.validate(question, answer)

      # But it's validate if all items have been answered
      answer = {value: {'itemAId': 'choiceId', 'itemBId': 'choiceId'}}
      assert.equal null, @answerValidator.validate(question, answer)

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
