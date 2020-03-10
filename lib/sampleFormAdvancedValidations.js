module.exports = {
  "_id": "1234",
  "design": {
    "name": {
      "en": "Validation Expr Test",
      "_base": "en"
    },
    "_type": "Form",
    "_schema": 21,
    "locales": [
      {
        "code": "en",
        "name": "English"
      }
    ],
    "contents": [
      {
        "_id": "fc6f23bd07cb4f05b8508b9a5d9e6107",
        "name": {
          "en": "Main Section",
          "_base": "en"
        },
        "_type": "Section",
        "contents": [
          {
            "_id": "d0dcfce3a697453ba16cc8baa8e384e7",
            "text": {
              "en": "Password",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "sticky": false,
            "commentsField": true,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [
              {
                "op": "lengthRange",
                "rhs": {
                  "literal": {
                    "max": 50
                  }
                },
                "message": {
                  "en": "String is too long",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "9429d931dcbf4110846074c25f9dc226",
            "text": {
              "en": "Password again",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "sticky": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [
              {
                "op": "lengthRange",
                "rhs": {
                  "literal": {
                    "max": 50
                  }
                },
                "message": {
                  "en": "String is too long",
                  "_base": "en"
                }
              }
            ],
            "advancedValidations": [
              {
                expr: { type: "op", table: "responses:1234", op: "=", exprs: [
                  { type: "field", table: "responses:1234", column: "data:9429d931dcbf4110846074c25f9dc226:value" },
                  { type: "field", table: "responses:1234", column: "data:d0dcfce3a697453ba16cc8baa8e384e7:value" }
                ] },
                message: { _base: "en", en: "Must match" }
              }
            ]
          },
        ],
        "conditions": []
      },
      {
        "_id": "secondSectionId",
        "name": {
          "en": "Second Section",
          "_base": "en"
        },
        "_type": "Section",
        contents: [],
        conditions: [
          {
            "op": "true",
            "lhs": {
              "question": "ef40dba8338d4ebdbbc5808e78969e95"
            }
          }
        ]
      },
      {
        "_id": "thridSectionId",
        "name": {
          "en": "Third Section",
          "_base": "en"
        },
        "_type": "Section",
        contents: [],
        conditions: []
      }
    ],
    "draftNameRequired": true
  }
}