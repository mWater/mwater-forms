// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.

const questions1 = [
  {
    _id: "0001",
    _type: "TextQuestion",
    text: { _base: "en", en: "Section1q1" },
    hint: { _base: "en", en: "Benji? Bingo?" },
    conditions: []
  },
  {
    _id: "0002",
    _type: "RadioQuestion",
    text: { _base: "en", en: "Does your pet live indoors?" },
    hint: {},
    choices: [
      { id: "yes", label: { _base: "en", en: "Yes" } },
      { id: "no", label: { _base: "en", en: "No" } }
    ],
    conditions: []
  },
  {
    _id: "0003",
    _type: "RadioQuestion",
    text: { _base: "en", en: "What type of animal is it?" },
    hint: {},
    choices: [
      { id: "dog", label: { _base: "en", en: "Dog" } },
      { id: "cat", label: { _base: "en", en: "Cat" } },
      { id: "fish", label: { _base: "en", en: "Fish" } }
    ],
    conditions: [{ lhs: { question: "0002" }, op: "is", rhs: { literal: "yes" } }]
  },
  {
    _id: "0004",
    _type: "TextQuestion",
    text: { _base: "en", en: "Any comments?" },
    hint: {},
    conditions: []
  },
  {
    _id: "N0005",
    _type: "NuberQuestion",
    text: { _base: "en", en: "Any comments?" },
    hint: {},
    conditions: []
  }
]

const section1 = {
  _id: "1",
  _type: "Section",
  name: { _base: "en", en: "Section1" },
  contents: questions1
}

const questions2 = [
  {
    _id: "0005",
    _type: "TextQuestion",
    text: { _base: "en", en: "Section2q1" },
    conditions: [{ lhs: { question: "0003" }, op: "is", rhs: { literal: "dog" } }]
  }
]

const section2 = {
  _id: "2",
  _type: "Section",
  name: { _base: "en", en: "Section2" },
  contents: questions2
}

const questions3 = [
  {
    _id: "0006",
    _type: "TextQuestion",
    text: { _base: "en", en: "Section3q1" },
    conditions: []
  }
]

const section3 = {
  _id: "3",
  _type: "Section",
  name: { _base: "en", en: "Section3" },
  contents: questions3
}

export let _type = "Form"
export let name = { _base: "en", en: "Form" }
export let contents = [section1, section2, section3]

export let locales = [{ code: "en", name: "English" }]
