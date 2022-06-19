import { assert } from "chai"
import { Answer, Question, UnitsAnswerValue } from "../../src"
import AnswerValidator from "../../src/answers/AnswerValidator"

let answerValidator: AnswerValidator

describe("AnswerValidator", function () {
  before(function () {
    answerValidator = new AnswerValidator({} as any, {} as any, "en")
  })

  describe("validate", () =>
    describe("TestQuestion", function () {
      it("returns null for non required value that are null or empty", async function () {
        let answer: Answer = { value: null }
        const question = { format: "url", required: false } as Question

        let result = await answerValidator.validate(question, answer)
        assert.equal(null, result)

        answer = { value: "" }
        result = await answerValidator.validate(question, answer)
        return assert.equal(null, result)
      })

      it("returns null for required but disabled questions' value that are null or empty", async function () {
        let answer: Answer = { value: null }
        const question = { _type: "TextQuestion", format: "url", disabled: true, required: true } as Question

        let result = await answerValidator.validate(question, answer)
        assert.equal(result, null)

        answer = { value: "" }
        result = await answerValidator.validate(question, answer)
        return assert.equal(result, null)
      })

      it("returns an error for required value that are null or empty", async function () {
        let answer = { value: null } as Answer
        const question = { _type: "TextQuestion", format: "url", required: true } as Question

        let result = await answerValidator.validate(question, answer)
        assert(result)

        answer = { value: "" }
        result = await answerValidator.validate(question, answer)
        return assert(result)
      })

      it("can apply a validator", async function () {
        const answer = { value: "1234567" }
        const question = {
          _type: "TextQuestion", 
          format: "singleline",
          validations: [
            {
              op: "lengthRange",
              rhs: { literal: { max: 6 } },
              message: { _base: "en", en: "message" }
            }
          ]
        } as unknown as Question
        const result = await answerValidator.validate(question, answer)
        return assert.equal(result, "message")
      })

      it("allows alternate for required", async function () {
        const answer = { alternate: "na" } as Answer
        const question = { _type: "TextQuestion", required: true, alternates: { na: true } } as Question

        const result = await answerValidator.validate(question, answer)
        return assert.equal(null, result, "alternate is valid for a required question")
      })

      it("requires specify field to be entered if question is required (RadioQuestion)", async function () {
        let answer = { value: "c3" } as Answer
        const question = {
          _type: "RadioQuestion",
          choices: [{ id: "c1" }, { id: "c2" }, { id: "c3", specify: true }],
          required: true
        } as Question

        let result = await answerValidator.validate(question, answer)
        assert.equal(true, result, "Required specify question requires specify entered")

        answer = { value: "c3", specify: { c3: "coz bla bla" } }

        result = await answerValidator.validate(question, answer)
        return assert.equal(null, result, "Validates if specify text is set on required question")
      })

      it("requires specify field to be entered if question is required (MulticheckQuestion)", async function () {
        let answer = { value: ["c3", "c4", "c5"] } as Answer
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
        } as Question

        let result = await answerValidator.validate(question, answer)
        assert.equal(true, result, "Required specify question requires specify entered")

        answer = { value: ["c3", "c4", "c5"], specify: { c3: "bla 1" } }
        result = await answerValidator.validate(question, answer)
        assert.equal(true, result, "all specifys in multi check question should be provided")

        answer = { value: ["c3", "c4", "c5"], specify: { c3: "bla 1", c4: "bla 1", c5: "bla 4" } }
        result = await answerValidator.validate(question, answer)
        return assert.equal(null, result, "Validates if all specifys in required multi check question are provided")
      })

      it("validates true advanced validations", async function () {
        const question = {
          _type: "TextQuestion", 
          advancedValidations: [
            { expr: { type: "literal", valueType: "boolean", value: true }, message: { en: "message" } }
          ]
        } as unknown as Question

        const answer = { value: "value" }
        const result = await answerValidator.validate(question, answer)
        return assert.equal(result, null)
      })

      it("validates false advanced validations", async function () {
        const question = {
          _type: "TextQuestion", 
          advancedValidations: [
            { expr: { type: "literal", valueType: "boolean", value: false }, message: { en: "message" } }
          ]
        } as unknown as Question

        const answer = { value: "value" }
        const result = await answerValidator.validate(question, answer)
        return assert.equal(result, "message")
      })

      it("blank message is true advanced validations", async function () {
        const question = {
          _type: "TextQuestion", 
          advancedValidations: [{ expr: { type: "literal", valueType: "boolean", value: false }, message: { en: "" } }]
        } as unknown as Question

        const answer = { value: "value" }
        const result = await answerValidator.validate(question, answer)
        return assert.equal(result, true)
      })

      it("validates check questions even if not answered", async function() {
        const question = {
          _type: "CheckQuestion", 
          advancedValidations: [{ expr: { type: "literal", valueType: "boolean", value: false }, message: { en: "message" } }]
        } as unknown as Question

        const answer = {}
        const result = await answerValidator.validate(question, answer)
        return assert.equal(result, "message")
      })
    }))

  describe("validateTextQuestion", function () {
    describe("url", function () {
      it("returns null for empty value", async function () {
        const answer = { value: null }
        const question = { _type: "TextQuestion", format: "url" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      it("returns null for well formed url", async function () {
        const answer = { value: "http://api.mwater.co" }
        const question = { _type: "TextQuestion", format: "url" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      return it("returns error on malformed url", async function () {
        const answer = { value: "test" }
        const question = { _type: "TextQuestion", format: "url" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert(result != null)
      })
    })

    describe("email", function () {
      it("returns null for empty value", async function () {
        const answer = { value: null }
        const question = { _type: "TextQuestion", format: "email" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      it("returns null for well formed email", async function () {
        const answer = { value: "test@hotmail.com" }
        const question = { _type: "TextQuestion", format: "email" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      })

      return it("returns error on malformed url", async function () {
        const answer = { value: "test" }
        const question = { _type: "TextQuestion", format: "email" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert(result != null)
      })
    })

    describe("multiline", () =>
      it("returns null", async function () {
        const answer = { value: "patate@@$#@%!@%" }
        const question = { _type: "TextQuestion", format: "multiline" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      }))

    describe("singleline", () =>
      it("returns null", async function () {
        const answer = { value: "patate@@$#@%!@%" }
        const question = { _type: "TextQuestion", format: "singleline" }

        const result = await answerValidator.validateTextQuestion(question, answer)
        return assert.equal(null, result)
      }))

    return it("allows non-valid blank answer if not required", async function () {
      const question = {
        _type: "TextQuestion", 
        validations: [
          {
            op: "lengthRange",
            rhs: { literal: { min: 4, max: 6 } },
            message: { _base: "en", en: "message" }
          }
        ]
      } as unknown as Question
      const answer = { value: "" }

      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, null, "Should be allowed")
    })
  })

  describe("validateUnitsQuestion", function () {
    it("returns true for empty value if required", async function () {
      const answer = { value: null }
      const question = { _type: "UnitsQuestion" } as unknown as Question

      // Okay if not required
      let result = await answerValidator.validate(question, answer)
      assert.equal(null, result)

      question.required = true

      // The unit answer is still valid in itself
      result = await answerValidator.validateUnitsQuestion(question, answer)
      assert.equal(null, result)

      // But not if required
      result = await answerValidator.validate(question, answer)
      return assert.equal(true, result)
    })

    it("enforces required on blank answer", async function () {
      const answer = { value: { quantity: null, units: "a" } } as Answer
      const question = { _type: "UnitsQuestion" } as unknown as Question

      // Okay if not required
      let result = await answerValidator.validate(question, answer)
      assert.equal(result, null, "Should be valid")

      question.required = true
      // Not Okay if required
      result = await answerValidator.validate(question, answer)
      return assert(result, "Shouldn't be valid")
    })

    it("allows 0 on required", async function () {
      const answer = { value: { quantity: "0", units: "a" } }
      const question = { _type: "UnitsQuestion" } as unknown as Question
      question.required = true
      // Okay if not required
      let result = await answerValidator.validate(question, answer)
      assert.equal(result, null, "Should be valid")

      // Also Okay if required
      result = await answerValidator.validate(question, answer)
      return assert.equal(result, null, "Should also be valid")
    })

    it("requires units to be specified if a quantity is set", async function () {
      const answer = { value: { quantity: "0" } } as any
      const question = { _type: "UnitsQuestion" } as unknown as Question

      // Not Okay if unit is undefined
      let result = await answerValidator.validate(question, answer)
      assert(result, "Shouldn't be valid")

      // Not Okay if unit is null
      answer.value.units = null
      result = await answerValidator.validate(question, answer)
      assert(result, "Shouldn't be valid either")

      // Okay if quantity is undefined or nul or empty string
      answer.value.quantity = ""
      result = await answerValidator.validate(question, answer)
      assert.equal(result, null)
      answer.value.quantity = null
      result = await answerValidator.validate(question, answer)
      assert.equal(result, null)
      delete answer.value["quantity"]
      result = await answerValidator.validate(question, answer)
      assert.equal(result, null)

      answer.value.quantity = 0
      answer.value.units = "a"
      result = await answerValidator.validate(question, answer)
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
      } as unknown as Question
      const answer = { value: { quantity: 7 }, unit: "a" }
      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, "message")
    })
  })

  describe("validateNumberQuestion", function () {
    it("enforces required", async function () {
      const answer = { value: null }
      const question = { _type: "NumberQuestion" } as unknown as Question

      // Okay if not required
      let result = await answerValidator.validate(question, answer)
      assert.equal(result, null)

      question.required = true

      // The unit answer is still valid in itself
      result = answerValidator.validateNumberQuestion(question, answer)
      assert.equal(result, null)

      // But not if required
      result = await answerValidator.validate(question, answer)
      return assert.equal(result, true)
    })

    it("enforces required on blank answer", async function () {
      const answer = { value: "" }
      const question = { _type: "NumberQuestion" } as unknown as Question
      question.required = false

      // Okay if not required
      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    it("allows 0 on required", async function () {
      const answer = { value: 0 }
      const question = { _type: "NumberQuestion" } as unknown as Question
      question.required = false

      // Okay if not required
      const result = await answerValidator.validate(question, answer)
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
      } as unknown as Question
      const answer = { value: 7 }

      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, "message")
    })
  })

  describe("validateLikertQuestion", function () {
    it("enforces required", async function () {
      let answer = { value: null } as any
      const question = {
        _type: "LikertQuestion",
        items: [{ id: "itemAId" }, { id: "itemBId" }],
        choices: [{ id: "choiceId" }]
      } as unknown as Question

      // Okay if not required
      let result = await answerValidator.validate(question, answer)
      assert.equal(result, null)

      question.required = true

      // The unit answer is still valid in itself
      result = answerValidator.validateLikertQuestion(question, answer)
      assert.equal(result, null)

      // But not if required
      result = await answerValidator.validate(question, answer)
      assert.equal(result, true)

      // Even if one of the items has been answered
      answer = { itemAId: "choiceId" }
      result = await answerValidator.validate(question, answer)
      assert.equal(result, true)

      // But it's validate if all items have been answered
      answer = { value: { itemAId: "choiceId", itemBId: "choiceId" } }
      result = await answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    return it("enforces that all the answered items of values are available choices", function () {
      let answer = { value: { itemAId: "choiceId", itemBId: "choiceId" } }
      const question = {
        _type: "LikertQuestion",
        items: [{ id: "itemAId" }, { id: "itemBId" }],
        choices: [{ id: "choiceId" }]
      } as unknown as Question

      assert.equal(null, answerValidator.validateLikertQuestion(question, answer))

      // Setting an invalid choice value
      answer = { value: { itemAId: "choiceId", itemBId: "anotherChoiceId" } }
      return assert.equal("Invalid choice", answerValidator.validateLikertQuestion(question, answer))
    })
  })

  describe("validateSiteQuestion", function () {
    it("Does not require a site code if question not required", async function () {
      const answer = {}
      const question = {
        _type: "SiteQuestion",
        required: false
      } as unknown as Question

      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    it("does not allow sites with code null", async function () {
      const answer = { value: { code: null } } as any
      const question = {
        _type: "SiteQuestion",
        required: true
      } as unknown as Question

      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, true)
    })

    return it("allows a valid site code", async function () {
      const answer = { value: { code: "4287759" } }
      const question = {
        _type: "SiteQuestion",
        required: true
      } as unknown as Question

      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })
  })

  return describe("validateMatrixQuestion", function () {
    it("allows non-valid blank answer if not required", async function () {
      const question = {
        _id: "q1",
        _type: "MatrixQuestion",
        columns: [
          { _id: "c1", _type: "TextColumnQuestion", required: false },
          {
            _id: "c2",
            _type: "NumberColumnQuestion",
            decimal: false,
            required: false,
            validations: [{ message: { undefined: "Wrong" }, op: "range", rhs: { literal: { max: "10", min: "0" } } }]
          },
          {
            _id: "c3",
            _type: "NumberColumnQuestion",
            decimal: false,
            required: false,
            validations: [{ message: { undefined: "Wrong" }, op: "range", rhs: { literal: { max: "100", min: "10" } } }]
          }
        ],
        items: [{ id: "ts39QF6" }, { id: "dWY5r5E" }],
        required: true
      } as unknown as Question

      const answer = {
        value: {
          ts39QF6: {
            c1: { value: "as" },
            c2: { value: null },
            c3: { value: null }
          }
        }
      }
      const result = await answerValidator.validate(question, answer)
      assert.equal(result, null)
    })

    it("passes if ok", async function () {
      const question = {
        _type: "MatrixQuestion",
        items: [{ id: "itemAId" }],
        columns: [{ _id: "c1", _type: "TextColumnQuestion", required: true }]
      } as unknown as Question

      const answer = {
        value: {
          itemAId: {
            c1: { value: "xyz" }
          }
        }
      }

      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, null)
    })

    it("validates required text question column", async function () {
      const question = {
        _type: "MatrixQuestion",
        items: [{ id: "itemAId" }],
        columns: [{ _id: "c1", _type: "TextColumnQuestion", required: true }]
      } as unknown as Question

      const answer = {
        value: {
          itemAId: {
            c1: { value: "" }
          }
        }
      }

      const result = await answerValidator.validate(question, answer)
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
      } as unknown as Question

      const answer = {
        value: {
          itemAId: {
            c1: { value: "toolong" }
          }
        }
      }

      const result = await answerValidator.validate(question, answer)
      return assert.equal(result, "message")
    })
  })
})
