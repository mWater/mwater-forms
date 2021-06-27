
const questions1 = [
  {
    _id: "0002",
    _type: "TextQuestion",
    text: { _base: "en", en: "Section1q1" }, 
    conditions: []
  },
  {
    _id: "0003",
    _type: "EntityQuestion",
    text: {_base: "en", en: "English"},
    entityType: "type1",
    propertyLinks: [
      {propertyId: "propertyId", direction: "both", questionId: "0002", type: "direct"}
    ]
  }
];

const section1 = {
  _id: "1",
  _type: "Section",
  name: { _base: "en", en: "Section1" },
  contents: questions1
};

export let _type = "Form";
export let name = { _base: "en", en: "Form" };
export let contents = [section1];

export let locales = [
  { code: "en", name: "English" }
];