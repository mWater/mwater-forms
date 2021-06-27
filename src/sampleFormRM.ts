module.exports = {
  _id: "1234",
  design: {
    name: {
      en: "Visualization Test",
      _base: "en"
    },
    _type: "Form",
    _schema: 11,
    locales: [
      {
        code: "en",
        name: "English"
      }
    ],
    contents: [
      {
        _id: "matrix01Id",
        _type: "RosterMatrix",
        name: {
          _base: "en",
          en: "Roster Matrix"
        },
        allowAdd: true,
        allowRemove: true,
        contents: [
          { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true },
          { _id: "e", _type: "DateColumnQuestion", text: { en: "Date" }, format: "ll", defaultNow: true }
        ]
      }
    ],
    draftNameRequired: true
  }
}
