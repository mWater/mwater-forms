
questions1 = [
  {
    _id: "0001"
    _type: "TextQuestion"
    text: { _base: "en", en: "Section1q1" } 
    hint: { _base: "en", en: "Benji? Bingo?" } 
    conditions: []
  },
  {
    _id: "0002"
    _type: "RadioQuestion"
    text: { _base: "en", en: "Does your pet live indoors?" } 
    hint: {}
    choices: [
      { id: "yes", label: { _base:"en", en: "Yes"}}
      { id: "no", label: { _base:"en", en: "No"}}
    ]
    conditions: []
  },
  {
    _id: "0003"
    _type: "RadioQuestion"
    text: { _base: "en", en: "What type of animal is it?" } 
    hint: {}
    choices: [
      { id: "dog", label: { _base:"en", en: "Dog"}}
      { id: "cat", label: { _base:"en", en: "Cat"}}
      { id: "fish", label: { _base:"en", en: "Fish"}}
    ]
    conditions: []
  },
  {
    _id: "0004"
    _type: "TextQuestion"
    text: { _base: "en", en: "Any comments?" } 
    hint: {}
    conditions: []
  }
]

section1 = {
  _id: "1"
  _type: "Section"
  name: { _base: "en", en: "Section1" } 
  contents: questions1
}


questions2 = [
  {
    _id: "0005"
    _type: "TextQuestion"
    text: { _base: "en", en: "Section2q1" } 
    conditions: []
  }
]

section2 = {
  _id: "2"
  _type: "Section"
  name: { _base: "en", en: "Section2" } 
  contents: questions2
}

questions3 = [
  {
    _id: "0006"
    _type: "TextQuestion"
    text: { _base: "en", en: "Section3q1" } 
    conditions: []
  }
]

section3 = {
  _id: "3"
  _type: "Section"
  name: { _base: "en", en: "Section3" } 
  contents: questions3
}

module.exports = {
  _id: "theformid"
  _type: "Form"
  name: { _base: "en", en: "Form" } 
  contents: [section1, section2, section3]
}