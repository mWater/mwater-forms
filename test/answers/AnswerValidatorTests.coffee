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



