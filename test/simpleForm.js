
const questions = [
  {
    _id: "0001",
    _type: "TextQuestion",
    text: { _base: "en", en: "What is your pet's name" }, 
    hint: { _base: "en", en: "Benji? Bingo?" }, 
    conditions: []
  },
  {
    _id: "0002",
    _type: "RadioQuestion",
    text: { _base: "en", en: "Does your pet live indoors?" }, 
    hint: {},
    choices: [
      { id: "yes", label: { _base:"en", en: "Yes"}},
      { id: "no", label: { _base:"en", en: "No"}}
    ],
    conditions: []
  },
  {
    _id: "0003",
    _type: "RadioQuestion",
    text: { _base: "en", en: "What type of animal is it?" }, 
    hint: {},
    choices: [
      { id: "dog", label: { _base:"en", en: "Dog"}},
      { id: "cat", label: { _base:"en", en: "Cat"}},
      { id: "fish", label: { _base:"en", en: "Fish"}}
    ],
    conditions: []
  },
  {
    _id: "0004",
    _type: "TextQuestion",
    text: { _base: "en", en: "Any comments?" }, 
    hint: {},
    conditions: []
  }
];

export { questions as contents };