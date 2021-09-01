// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import { assert } from "chai"
import AnswerValidator from "../../src/answers/AnswerValidator"

describe("AnswerValidator", function () {
  before(function () {
    return (this.answerValidator = new AnswerValidator({}, {}))
  })

  describe("validate", () =>
    describe("TestQuestion", function () {
      it("returns null for non required value that are null or empty", async function () {
        let answer = { value: null }
        const question = { format: "url", required: false }

        let result = await this.answerValidator.validate(question, answer)
        assert.equal(null, result)

        answer = { value: "" }
        result = await this.answerValidator.validate(question, answer)
        return assert.equal(null, result)
      })

      it("returns null for required but disabled questions' value that are null or empty", async function () {
        let answer = { value: null }
        const question = { format: "url", disabled: true, required: true }

        let result = await this.answerValidator.validate(question, answer)
        assert.equal(null, result)

        answer = { value: "" }
        result = await this.answerValidator.validate(question, answer)
        return assert.equal(null, result)
      })

      it("returns an error for required value that are null or empty", async function () {
        let answer = { value: null }
        const question = { format: "url", required: true }

        let result = await this.answerValidator.validate(question, answer)
        assert(result)

        answer = { value: "" }
        result = await this.answerValidator.validate(question, answer)
        return assert(result)
      })

      it("can apply a validator", async function () {
        const answer = { value: "1234567" }
        const question = {
          format: "singleline",
          validations: [
            {
              op: "lengthRange",
              rhs: { literal: { max: 6 } },
              message: { _base: "en", en: "message" }
            }
          ]
        }
        const result = await this.answerValidator.validate(question, answer)
        return assert.equal(result, "message")
      })

      it("allows alternate for required", async function () {
        const answer = { alternate: "na" }
        const question = { required: true, alternates: { na: true } }

        const result = await this.answerValidator.validate(question, answer)
        return assert.equal(null, result, "alternate is valid for a required question")
      })

      it("requires specify field to be entered if question is required (RadioQuestion)", async function () {
        let answer = { value: "c3", specify: null }
        const question = {
          _type: "RadioQuestion",
          choices: [{ id: "c1" }, { id: "c2" }, { id: "c3", specify: true }],
          required: true
        }

        let result = await this.answerValidator.validate(question, answer)
        assert.equal(true, result, "Required specify question requires specify entered")

        answer = { value: "c3", specify: { c3: "coz bla bla" } }

        result = await this.answerValidator.validate(question, answer)
        return assert.equal(null, result, "Validates if specify text is set on required question")
      })

      it("requires specify field to be entered if question is required (MulticheckQuestion)", async function () {
        let answer = { value: ["c3", "c4", "c5"], specify: null }
        const question = {
          _type: "MulticheckQuestion",
          choices: [
            { id: "c1" },
            { id: "c2" },
            { id: "c3", specify: true },
            { id: "c4", specify: true },
            { id: "c5", specify: true }
          ],
          required: true
        }

        let result = await this.answerValidator.validate(question, answer)
        assert.equal(true, result, "Required specify question requires specify entered")

        answer = { value: ["c3", "c4", "c5"], specify: { c3: "bla 1" } }
        result = await this.answerValidator.validate(question, answer)
        assert.equal(true, result, "all specifys in multi check question should be provided")

        answer = { value: ["c3", "c4", "c5"], specify: { c3: "bla 1", c4: "bla 1", c5: "bla 4" } }
        result = await this.answerValidator.validate(question, answer)
        return assert.equal(null, result, "Validates if all specifys in required multi check question are provided")
      })

      it("validates true advanced validations", async function () {
        const question = {
          advancedValidations: [
            { expr: { type: "literal", valueType: "boolean", value: true }, message: { en: "message" } }
          ]
        }

        const answer = { value: "value" }
        const result = await this.answerValidator.validate(question, answer)
        return assert.equal(result, null)
      })

      it("validates false advanced validations", async function () {
        const question = {
          advancedValidations: [
            { expr: { type: "literal", valueType: "boolean", value: false }, message: { en: "message" } }
          ]
        }

        const answer = { value: "value" }
        const result = await this.answerValidator.validate(question, answer)
        return assert.equal(result, "message")
      })

      return it("blank message is true advanced validations", async function () {
        const question = {
          advancedValidations: [{ expr: { type: "literal", valueType: "boolean", value: false }, message: { en: "" } }]
        }

        const answer = { value: "value" }
        const result = await this.answerValidator.validate(question, answer)
        return assert.equal(result, true)
      })
    }))

  describe("validateTextQuestion", function () {
    describe("url", function () {
      it("returns null for empty value", async function () {
        const answer = { value: null }
        const question = { format: "url" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      it("returns null for well formed url", async function () {
        const answer = { value: "http://api.mwater.co" }
        const question = { format: "url" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      return it("returns error on malformed url", async function () {
        const answer = { value: "test" }
        const question = { format: "url" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert(result != null)
      })
    })

    describe("email", function () {
      it("returns null for empty value", async function () {
        const answer = { value: null }
        const question = { format: "email" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      it("returns null for well formed email", async function () {
        const answer = { value: "test@hotmail.com" }
        const question = { format: "email" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      return it("returns error on malformed url", async function () {
        const answer = { value: "test" }
        const question = { format: "email" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert(result != null)
      })
    })

    describe("multiline", () =>
      it("returns null", async function () {
        const answer = { value: "patate@@$#@%!@%" }
        const question = { format: "multiline" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      }))

    describe("singleline", () =>
      it("returns null", async function () {
        const answer = { value: "patate@@$#@%!@%" }
        const question = { format: "singleline" }

        const result = await this.answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      }))

    return it("allows non-valid blank answer if not required", async function () {
      const question = {
        validations: [
          {
            op: "lengthRange",
            rhs: { literal: { min: 4, max: 6 } },
            message: { _base: "en", en: "message" }
          }
        ]
      }
      const answer = { value: "" }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null, "Should be allowed")
    })
  })

  describe("validateUnitsQuestion", function () {
    it("returns true for empty value if required", async function () {
      const answer = { value: null }
      const question = { _type: "UnitsQuestion" }

      // Okay if not required
      let result = await this.answerValidator.validate(question, answer)
      assert.equal(null, result)

      question.required = true

      // The unit answer is still valid in itself
      result = await this.answerValidator.validateUnitsQuestion(question, answer)
      assert.equal(null, result)

      // But not if required
      result = await this.answerValidator.validate(question, answer)
      return assert.equal(true, result)
    })

    it("enforces required on blank answer", async function () {
      const answer = { value: { quantity: "", unit: "a" } }
      const question = { _type: "UnitsQuestion" }

      // Okay if not required
      let result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null, "Should be valid")

      question.required = true
      // Not Okay if required
      result = await this.answerValidator.validate(question, answer)
      return assert(result, "Shouldn't be valid")
    })

    it("allows 0 on required", async function () {
      const answer = { value: { quantity: "0", units: "a" } }
      const question = { _type: "UnitsQuestion" }
      question.required = true
      // Okay if not required
      let result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null, "Should be valid")

      // Also Okay if required
      result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null, "Should also be valid")
    })

    it("requires units to be specified if a quantity is set", async function () {
      const answer = { value: { quantity: "0" } }
      const question = { _type: "UnitsQuestion" }

      // Not Okay if unit is undefined
      let result = await this.answerValidator.validate(question, answer)
      assert(result, "Shouldn't be valid")

      // Not Okay if unit is null
      answer.value.units = null
      result = await this.answerValidator.validate(question, answer)
      assert(result, "Shouldn't be valid either")

      // Okay if quantity is undefined or nul or empty string
      answer.value.quantity = ""
      result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null)
      answer.value.quantity = null
      result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null)
      delete answer.value["quantity"]
      result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null)

      answer.value.quantity = 0
      answer.value.units = "a"
      result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    return it("validates range", async function () {
      const question = {
        validations: [
          {
            op: "range",
            rhs: { literal: { max: 6 } },
            message: { _base: "en", en: "message" }
          }
        ]
      }
      const answer = { value: { quantity: 7 }, unit: "a" }
      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, "message")
    })
  })

  describe("validateNumberQuestion", function () {
    it("enforces required", async function () {
      const answer = { value: null }
      const question = { _type: "NumberQuestion" }

      // Okay if not required
      let result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null)

      question.required = true

      // The unit answer is still valid in itself
      result = this.answerValidator.validateNumberQuestion(question, answer)
      assert.equal(result, null)

      // But not if required
      result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, true)
    })

    it("enforces required on blank answer", async function () {
      const answer = { value: "" }
      const question = { _type: "NumberQuestion" }
      question.isRequired = false

      // Okay if not required
      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    it("allows 0 on required", async function () {
      const answer = { value: 0 }
      const question = { _type: "NumberQuestion" }
      question.isRequired = false

      // Okay if not required
      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    return it("validates range", async function () {
      const question = {
        validations: [
          {
            op: "range",
            rhs: { literal: { max: 6 } },
            message: { _base: "en", en: "message" }
          }
        ]
      }
      const answer = { value: 7 }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, "message")
    })
  })

  describe("validateLikertQuestion", function () {
    it("enforces required", async function () {
      let answer = { value: null }
      const question = {
        _type: "LikertQuestion",
        items: [{ id: "itemAId" }, { id: "itemBId" }],
        choices: [{ id: "choiceId" }]
      }

      // Okay if not required
      let result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null)

      question.required = true

      // The unit answer is still valid in itself
      result = this.answerValidator.validateLikertQuestion(question, answer)
      assert.equal(result, null)

      // But not if required
      result = await this.answerValidator.validate(question, answer)
      assert.equal(result, true)

      // Even if one of the items has been answered
      answer = { itemAId: "choiceId" }
      result = await this.answerValidator.validate(question, answer)
      assert.equal(result, true)

      // But it's validate if all items have been answered
      answer = { value: { itemAId: "choiceId", itemBId: "choiceId" } }
      result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    return it("enforces that all the answered items of values are available choices", function () {
      let answer = { value: { itemAId: "choiceId", itemBId: "choiceId" } }
      const question = {
        _type: "LikertQuestion",
        items: [{ id: "itemAId" }, { id: "itemBId" }],
        choices: [{ id: "choiceId" }]
      }

      assert.equal(null, this.answerValidator.validateLikertQuestion(question, answer))

      // Setting an invalid choice value
      answer = { value: { itemAId: "choiceId", itemBId: "anotherChoiceId" } }
      return assert.equal("Invalid choice", this.answerValidator.validateLikertQuestion(question, answer))
    })
  })

  describe("validateSiteQuestion", function () {
    it("Does not require a site code if question not required", async function () {
      const answer = {}
      const question = {
        _type: "SiteQuestion",
        required: false
      }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    it("does not allow sites with code null", async function () {
      const answer = { value: { code: null } }
      const question = {
        _type: "SiteQuestion",
        required: true
      }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, true)
    })

    return it("allows a valid site code", async function () {
      const answer = { value: { code: "4287759" } }
      const question = {
        _type: "SiteQuestion",
        required: true
      }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })
  })

  return describe("validateMatrixQuestion", function () {

    it("allows non-valid blank answer if not required", async function () {
      const question = {
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

      const answer = {
        value: {
          "ts39QF6": {
            "c1": {value: "as"},
            "c2": {value: null},
            "c3": {value: null}
          }
        }
      }
      const result = await this.answerValidator.validate(question, answer)
      assert.equal(result, null)
    })

    it("passes if ok", async function () {
      const question = {
        _type: "MatrixQuestion",
        items: [{ id: "itemAId" }],
        columns: [{ _id: "c1", _type: "TextColumnQuestion", required: true }]
      }

      const answer = {
        value: {
          itemAId: {
            c1: { value: "xyz" }
          }
        }
      }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    it("validates required text question column", async function () {
      const question = {
        _type: "MatrixQuestion",
        items: [{ id: "itemAId" }],
        columns: [{ _id: "c1", _type: "TextColumnQuestion", required: true }]
      }

      const answer = {
        value: {
          itemAId: {
            c1: { value: "" }
          }
        }
      }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, true)
    })

    return it("validates text question column", async function () {
      const question = {
        _type: "MatrixQuestion",
        items: [{ id: "itemAId" }],
        columns: [
          {
            _id: "c1",
            _type: "TextColumnQuestion",
            validations: [
              {
                op: "lengthRange",
                rhs: { literal: { max: 6 } },
                message: { _base: "en", en: "message" }
              }
            ]
          }
        ]
      }

      const answer = {
        value: {
          itemAId: {
            c1: { value: "toolong" }
          }
        }
      }

      const result = await this.answerValidator.validate(question, answer)
      return assert.equal(result, "message")
    })
  })
})
