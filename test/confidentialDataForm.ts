// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
// Minimal form that passes validation
export default () => ({
  _id: "abc123",
  state: "active",

  design: {
    _type: "Form",
    _schema: 3,
    name: {},
    contents: [
      {
        _id: "a1",
        _type: "TextQuestion",
        format: "singleline",
        confidential: true,
        text: {},
        conditions: [],
        validations: []
      },
      {
        _id: "b1",
        _type: "NumberQuestion",
        decimal: true,
        text: {},
        conditions: [],
        validations: []
      },
      {
        _id: "c1",
        _type: "LocationQuestion",
        text: {},
        conditions: [],
        validations: [],
        confidential: true,
        confidentialRadius: 10000
      },
      {
        _id: "r1",
        name: {
          en: "RosterQuestion",
          _base: "en"
        },
        _type: "RosterGroup",
        allowAdd: true,
        contents: [
          {
            _id: "q1",
            text: {
              en: "Sample Roster text question",
              _base: "en"
            },
            _type: "TextQuestion",
            format: "singleline",
            confidential: true,
            textExprs: [],
            conditions: [],
            validations: []
          }
        ],
        conditions: [],
        entryTitle: {
          en: "RosterQuestion",
          _base: "en"
        },
        allowRemove: true,
        entryTitleExprs: []
      }
    ],
    locales: [{ code: "en", name: "English" }]
  },

  roles: [{ id: "user:user1", role: "admin" }],

  created: { on: "2014-08-08", by: "user1" },
  modified: { on: "2014-08-08", by: "user1" }
})
