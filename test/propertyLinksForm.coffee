
questions1 = [
  {
    _id: "0002"
    _type: "TextQuestion"
    text: { _base: "en", en: "Section1q1" } 
    conditions: []
  },
  {
    _id: "0003"
    _type: "EntityQuestion"
    text: {_base: "en", en: "English"}
    entityType: "type1"
    propertyLinks: [
      {propertyId: "propertyId", direction: "both", questionId: "0002", type: "direct"}
    ]
  }
]

section1 = {
  _id: "1"
  _type: "Section"
  name: { _base: "en", en: "Section1" }
  contents: questions1
}

module.exports = {
  _id: "theformid"
  _type: "Form"
  name: { _base: "en", en: "Form" } 
  contents: [section1]
  locales: [
    { code: "en", name: "English" }
  ]
}