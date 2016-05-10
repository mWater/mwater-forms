module.exports = {
  "_id": "1234",
  "design": {
    "name": {
      "en": "Visualization Test",
      "_base": "en"
    },
    "_type": "Form",
    "_schema": 11,
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
            "_id": "ef40dba8338d4ebdbbc5808e78969e95",
            "code": "testcode",
            "text": {
              "en": "Checkbox Question?",
              "_base": "en"
            },
            "_type": "CheckQuestion",
            "label": {
              "en": "yes",
              "_base": "en"
            },
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "recordLocation": true
          },
          {
            "_id": "d85b08dbe03e40eab55270c858fa04f5",
            "text": {
              "en": "Dropdown Question?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "j1643Tt",
                "label": {
                  "en": "Blue",
                  "_base": "en"
                }
              },
              {
                "id": "4GJdEFj",
                "label": {
                  "en": "Green",
                  "_base": "en"
                }
              },
              {
                "id": "MLuenLA",
                "label": {
                  "en": "Red",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "sticky": true,
            "conditions": [
              {
                "op": "true",
                "lhs": {
                  "question": "ef40dba8338d4ebdbbc5808e78969e95"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d0dcfce3a697453ba16cc8baa8e384e7",
            "text": {
              "en": "Text Question?",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "sticky": true,
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
            "_id": "fd43a6faa6764490ab82eae19d71af71",
            "text": {
              "en": "Number Question for {0}?",
              "_base": "en"
            },
            "textExprs": [
              { "type": "field", "table": "responses:1234", "column": "data:d0dcfce3a697453ba16cc8baa8e384e7:value" }
            ],
            "_type": "NumberQuestion",
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [
              {
                "op": "present",
                "lhs": {
                  "question": "d0dcfce3a697453ba16cc8baa8e384e7"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d9765b2e0df14418b192cec19d0d2277",
            "text": {
              "en": "A multi check question?",
              "_base": "en"
            },
            "_type": "MulticheckQuestion",
            "choices": [
              {
                "id": "15ktQcc",
                "label": {
                  "en": "a",
                  "_base": "en"
                }
              },
              {
                "id": "rbRntNk",
                "label": {
                  "en": "b",
                  "_base": "en"
                }
              },
              {
                "id": "AZSGxYC",
                "label": {
                  "en": "c",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f12aada1e2fd4ad8af06b3be00f23a93",
            "text": {
              "en": "A date question",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY-MM-DD",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e73674c9957b41a0b9a923cd4dd76af8",
            "text": {
              "en": "American date format",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "MM/DD/YYYY",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1792fe879ce459bb97ec9d5ffff39e1",
            "text": {
              "en": "Units Question?",
              "_base": "en"
            },
            "_type": "UnitsQuestion",
            "units": [
              {
                "id": "gVQSSfG",
                "label": {
                  "en": "cm",
                  "_base": "en"
                }
              },
              {
                "id": "wtdAQZ3",
                "label": {
                  "en": "inch",
                  "_base": "en"
                }
              }
            ],
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "defaultUnits": "gVQSSfG",
            "unitsPosition": "suffix"
          },
          {
            "_id": "e2de1b738e60444abb2c8b8a1707ce1a",
            "text": {
              "en": "Image Question?",
              "_base": "en"
            },
            "_type": "ImageQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c3f07eeec3ab4324a2f2d69949384c8c",
            "text": {
              "en": "Many images",
              "_base": "en"
            },
            "_type": "ImagesQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e506c671a2d34895a6652e39c68722bc",
            "text": {
              "en": "A location question",
              "_base": "en"
            },
            "_type": "LocationQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef584da04c7c44c9bec375aa7cf4b543",
            "text": {
              "en": "Extra text question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f5cfe2ac564c46f9a42e91a327e9c836",
            "text": {
              "en": "a Text List Question",
              "_base": "en"
            },
            "_type": "TextListQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "fbcb00ccb94448d6ade68643b1edbeac",
            "text": {
              "en": "a site question",
              "_base": "en"
            },
            "_type": "SiteQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ea408d056c4b460698e4abc3a36cc737",
            "text": {
              "en": "New question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef0e7495bb25425fad61d26a34cff13d",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ece020f907d94c2593db03439b8a7403",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c07954131db143139465d6fa8a076e6e",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1d8e777e253483883269590639de738",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e69da26172364735afe078bfe0a29c67",
            "text": {
              "en": "Does MongoLabs...",
              "_base": "en"
            },
            "_type": "RadioQuestion",
            "choices": [
              {
                "id": "Tz3JhVg",
                "label": {
                  "en": "Suck",
                  "_base": "en"
                }
              },
              {
                "id": "MERLzae",
                "label": {
                  "en": "Rule",
                  "_base": "en"
                }
              },
              {
                "id": "ahBjM8W",
                "label": {
                  "en": "neither rule nor suck",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "f7d85b74156a4f0c933df332c0247eae",
            "required": true,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c85e1be8e3e942da8ba211b59741fd2c",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c9f49171f0e84db3a4d41652601bfb39",
            "text": {
              "en": "Year only date",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id":"cac9d62677c24c6482ce8ff790b823df",
            "help":{"en":"This is a very long help text aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","_base":"en"},
            "hint":{"en":"This is a hint","_base":"en"},
            "text":{"en":"Multiple lines","_base":"en"},
            "_type":"TextQuestion",
            "format":"multiline",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"urlquestion",
            "text":{"en":"Url text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"url",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"emailquestion",
            "text":{"en":"Email text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"email",
            "required":false,
            "conditions":[],
            "validations":[]
          },
          {
            _id: "firstRosterGroupId",
            name: {"en":"First Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: true,
            required: false,
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "firstRosterQuestion1Id",
                text:{"en":"Question 1","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              },
              {
                _id: "firstRosterQuestion2Id",
                text:{"en":"Question 2","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [
                  {op: "present", lhs: {question: "firstRosterQuestion1Id"}}
                ],
                validations: []
              },
            ]
          },
          {
            _id: "secondRosterGroupId",
            rosterId: "firstRosterGroupId",
            name: {"en":"Second Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: false,
            required: false,
            conditions: [],
            validations: [],
            entryTitle: { en: "This is for {0}" },
            entryTitleExprs: [
              { type: "field", table: "responses:1234:roster:firstRosterGroupId", column: "data:firstRosterQuestion1Id:value" }
            ],
            contents: [
              {
                _id: "secondRosterQuestion3Id",
                text:{"en":"Question 3","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          },
          {
            _id: "matrix01Id",
            _type: "RosterMatrix",
            "name": {
              "_base": "en",
              "en": "Roster Matrix"
            },
            allowAdd: true,
            allowRemove: true,
            contents: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true },
              { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" } },
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
              { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
            ]
          },
          {
            _id: "groupId",
            name: {"en":"Question Group","_base":"en"},
            _type: "Group",
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "groupQuestionId",
                text:{"en":"A group question","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          },
          {
            "_id": "ef40dba8338d4ebdbbc5808e78969e95_2",
            "code": "testcode",
            "text": {
              "en": "Checkbox Question?",
              "_base": "en"
            },
            "_type": "CheckQuestion",
            "label": {
              "en": "yes",
              "_base": "en"
            },
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "recordLocation": true
          },
          {
            "_id": "d85b08dbe03e40eab55270c858fa04f5_2",
            "text": {
              "en": "Dropdown Question?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "j1643Tt",
                "label": {
                  "en": "Blue",
                  "_base": "en"
                }
              },
              {
                "id": "4GJdEFj",
                "label": {
                  "en": "Green",
                  "_base": "en"
                }
              },
              {
                "id": "MLuenLA",
                "label": {
                  "en": "Red",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "sticky": true,
            "conditions": [
              {
                "op": "true",
                "lhs": {
                  "question": "ef40dba8338d4ebdbbc5808e78969e95_2"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d0dcfce3a697453ba16cc8baa8e384e7_2",
            "text": {
              "en": "Text Question?",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "sticky": true,
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
            "_id": "fd43a6faa6764490ab82eae19d71af71_2",
            "text": {
              "en": "Number Question for {0}?",
              "_base": "en"
            },
            "textExprs": [
              { "type": "field", "table": "responses:1234", "column": "data:d0dcfce3a697453ba16cc8baa8e384e7:value" }
            ],
            "_type": "NumberQuestion",
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [
              {
                "op": "present",
                "lhs": {
                  "question": "d0dcfce3a697453ba16cc8baa8e384e7_2"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d9765b2e0df14418b192cec19d0d2277_2",
            "text": {
              "en": "A multi check question?",
              "_base": "en"
            },
            "_type": "MulticheckQuestion",
            "choices": [
              {
                "id": "15ktQcc",
                "label": {
                  "en": "a",
                  "_base": "en"
                }
              },
              {
                "id": "rbRntNk",
                "label": {
                  "en": "b",
                  "_base": "en"
                }
              },
              {
                "id": "AZSGxYC",
                "label": {
                  "en": "c",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f12aada1e2fd4ad8af06b3be00f23a93_2",
            "text": {
              "en": "A date question",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY-MM-DD",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e73674c9957b41a0b9a923cd4dd76af8_2",
            "text": {
              "en": "American date format",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "MM/DD/YYYY",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1792fe879ce459bb97ec9d5ffff39e1_2",
            "text": {
              "en": "Units Question?",
              "_base": "en"
            },
            "_type": "UnitsQuestion",
            "units": [
              {
                "id": "gVQSSfG",
                "label": {
                  "en": "cm",
                  "_base": "en"
                }
              },
              {
                "id": "wtdAQZ3",
                "label": {
                  "en": "inch",
                  "_base": "en"
                }
              }
            ],
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "defaultUnits": "gVQSSfG",
            "unitsPosition": "suffix"
          },
          {
            "_id": "e2de1b738e60444abb2c8b8a1707ce1a_2",
            "text": {
              "en": "Image Question?",
              "_base": "en"
            },
            "_type": "ImageQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c3f07eeec3ab4324a2f2d69949384c8c_2",
            "text": {
              "en": "Many images",
              "_base": "en"
            },
            "_type": "ImagesQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e506c671a2d34895a6652e39c68722bc_2",
            "text": {
              "en": "A location question",
              "_base": "en"
            },
            "_type": "LocationQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef584da04c7c44c9bec375aa7cf4b543_2",
            "text": {
              "en": "Extra text question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f5cfe2ac564c46f9a42e91a327e9c836_2",
            "text": {
              "en": "a Text List Question",
              "_base": "en"
            },
            "_type": "TextListQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "fbcb00ccb94448d6ade68643b1edbeac_2",
            "text": {
              "en": "a site question",
              "_base": "en"
            },
            "_type": "SiteQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ea408d056c4b460698e4abc3a36cc737_2",
            "text": {
              "en": "New question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef0e7495bb25425fad61d26a34cff13d_2",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ece020f907d94c2593db03439b8a7403_2",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c07954131db143139465d6fa8a076e6e_2",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1d8e777e253483883269590639de738_2",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e69da26172364735afe078bfe0a29c67_2",
            "text": {
              "en": "Does MongoLabs...",
              "_base": "en"
            },
            "_type": "RadioQuestion",
            "choices": [
              {
                "id": "Tz3JhVg",
                "label": {
                  "en": "Suck",
                  "_base": "en"
                }
              },
              {
                "id": "MERLzae",
                "label": {
                  "en": "Rule",
                  "_base": "en"
                }
              },
              {
                "id": "ahBjM8W",
                "label": {
                  "en": "neither rule nor suck",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "f7d85b74156a4f0c933df332c0247eae",
            "required": true,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c85e1be8e3e942da8ba211b59741fd2c_2",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c9f49171f0e84db3a4d41652601bfb39_2",
            "text": {
              "en": "Year only date",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id":"cac9d62677c24c6482ce8ff790b823df_2",
            "help":{"en":"This is a very long help text aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","_base":"en"},
            "hint":{"en":"This is a hint","_base":"en"},
            "text":{"en":"Multiple lines","_base":"en"},
            "_type":"TextQuestion",
            "format":"multiline",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"urlquestion_2",
            "text":{"en":"Url text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"url",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"emailquestion_2",
            "text":{"en":"Email text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"email",
            "required":false,
            "conditions":[],
            "validations":[]
          },
          {
            _id: "firstRosterGroupId_2",
            name: {"en":"First Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: true,
            required: false,
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "firstRosterQuestion1Id_2",
                text:{"en":"Question 1","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              },
              {
                _id: "firstRosterQuestion2Id_2",
                text:{"en":"Question 2","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [
                  {op: "present", lhs: {question: "firstRosterQuestion1Id_2"}}
                ],
                validations: []
              },
            ]
          },
          {
            _id: "secondRosterGroupId_2",
            rosterId: "firstRosterGroupId_2",
            name: {"en":"Second Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: false,
            required: false,
            conditions: [],
            validations: [],
            entryTitle: { en: "This is for {0}" },
            entryTitleExprs: [
              { type: "field", table: "responses:1234:roster:firstRosterGroupId_2", column: "data:firstRosterQuestion1Id:value" }
            ],
            contents: [
              {
                _id: "secondRosterQuestion3Id_2",
                text:{"en":"Question 3","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          },
          {
            _id: "matrix01Id_2",
            _type: "RosterMatrix",
            "name": {
              "_base": "en",
              "en": "Roster Matrix"
            },
            allowAdd: true,
            allowRemove: true,
            contents: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true },
              { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" } },
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
              { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
            ]
          },
          {
            _id: "groupId_2",
            name: {"en":"Question Group","_base":"en"},
            _type: "Group",
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "groupQuestionId_2",
                text:{"en":"A group question","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          },
          {
            "_id": "ef40dba8338d4ebdbbc5808e78969e95_3",
            "code": "testcode",
            "text": {
              "en": "Checkbox Question?",
              "_base": "en"
            },
            "_type": "CheckQuestion",
            "label": {
              "en": "yes",
              "_base": "en"
            },
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "recordLocation": true
          },
          {
            "_id": "d85b08dbe03e40eab55270c858fa04f5_3",
            "text": {
              "en": "Dropdown Question?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "j1643Tt",
                "label": {
                  "en": "Blue",
                  "_base": "en"
                }
              },
              {
                "id": "4GJdEFj",
                "label": {
                  "en": "Green",
                  "_base": "en"
                }
              },
              {
                "id": "MLuenLA",
                "label": {
                  "en": "Red",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "sticky": true,
            "conditions": [
              {
                "op": "true",
                "lhs": {
                  "question": "ef40dba8338d4ebdbbc5808e78969e95_3"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d0dcfce3a697453ba16cc8baa8e384e7_3",
            "text": {
              "en": "Text Question?",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "sticky": true,
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
            "_id": "fd43a6faa6764490ab82eae19d71af71_3",
            "text": {
              "en": "Number Question for {0}?",
              "_base": "en"
            },
            "textExprs": [
              { "type": "field", "table": "responses:1234", "column": "data:d0dcfce3a697453ba16cc8baa8e384e7:value" }
            ],
            "_type": "NumberQuestion",
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [
              {
                "op": "present",
                "lhs": {
                  "question": "d0dcfce3a697453ba16cc8baa8e384e7_3"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d9765b2e0df14418b192cec19d0d2277_3",
            "text": {
              "en": "A multi check question?",
              "_base": "en"
            },
            "_type": "MulticheckQuestion",
            "choices": [
              {
                "id": "15ktQcc",
                "label": {
                  "en": "a",
                  "_base": "en"
                }
              },
              {
                "id": "rbRntNk",
                "label": {
                  "en": "b",
                  "_base": "en"
                }
              },
              {
                "id": "AZSGxYC",
                "label": {
                  "en": "c",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f12aada1e2fd4ad8af06b3be00f23a93_3",
            "text": {
              "en": "A date question",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY-MM-DD",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e73674c9957b41a0b9a923cd4dd76af8_3",
            "text": {
              "en": "American date format",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "MM/DD/YYYY",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1792fe879ce459bb97ec9d5ffff39e1_3",
            "text": {
              "en": "Units Question?",
              "_base": "en"
            },
            "_type": "UnitsQuestion",
            "units": [
              {
                "id": "gVQSSfG",
                "label": {
                  "en": "cm",
                  "_base": "en"
                }
              },
              {
                "id": "wtdAQZ3",
                "label": {
                  "en": "inch",
                  "_base": "en"
                }
              }
            ],
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "defaultUnits": "gVQSSfG",
            "unitsPosition": "suffix"
          },
          {
            "_id": "e2de1b738e60444abb2c8b8a1707ce1a_3",
            "text": {
              "en": "Image Question?",
              "_base": "en"
            },
            "_type": "ImageQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c3f07eeec3ab4324a2f2d69949384c8c_3",
            "text": {
              "en": "Many images",
              "_base": "en"
            },
            "_type": "ImagesQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e506c671a2d34895a6652e39c68722bc_3",
            "text": {
              "en": "A location question",
              "_base": "en"
            },
            "_type": "LocationQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef584da04c7c44c9bec375aa7cf4b543_3",
            "text": {
              "en": "Extra text question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f5cfe2ac564c46f9a42e91a327e9c836_3",
            "text": {
              "en": "a Text List Question",
              "_base": "en"
            },
            "_type": "TextListQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "fbcb00ccb94448d6ade68643b1edbeac_3",
            "text": {
              "en": "a site question",
              "_base": "en"
            },
            "_type": "SiteQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ea408d056c4b460698e4abc3a36cc737_3",
            "text": {
              "en": "New question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef0e7495bb25425fad61d26a34cff13d_3",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ece020f907d94c2593db03439b8a7403_3",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c07954131db143139465d6fa8a076e6e_3",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1d8e777e253483883269590639de738_3",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e69da26172364735afe078bfe0a29c67_3",
            "text": {
              "en": "Does MongoLabs...",
              "_base": "en"
            },
            "_type": "RadioQuestion",
            "choices": [
              {
                "id": "Tz3JhVg",
                "label": {
                  "en": "Suck",
                  "_base": "en"
                }
              },
              {
                "id": "MERLzae",
                "label": {
                  "en": "Rule",
                  "_base": "en"
                }
              },
              {
                "id": "ahBjM8W",
                "label": {
                  "en": "neither rule nor suck",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "f7d85b74156a4f0c933df332c0247eae",
            "required": true,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c85e1be8e3e942da8ba211b59741fd2c_3",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c9f49171f0e84db3a4d41652601bfb39_3",
            "text": {
              "en": "Year only date",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id":"cac9d62677c24c6482ce8ff790b823df_3",
            "help":{"en":"This is a very long help text aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","_base":"en"},
            "hint":{"en":"This is a hint","_base":"en"},
            "text":{"en":"Multiple lines","_base":"en"},
            "_type":"TextQuestion",
            "format":"multiline",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"urlquestion_3",
            "text":{"en":"Url text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"url",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"emailquestion_3",
            "text":{"en":"Email text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"email",
            "required":false,
            "conditions":[],
            "validations":[]
          },
          {
            _id: "firstRosterGroupId_3",
            name: {"en":"First Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: true,
            required: false,
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "firstRosterQuestion1Id_3",
                text:{"en":"Question 1","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              },
              {
                _id: "firstRosterQuestion2Id_3",
                text:{"en":"Question 2","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [
                  {op: "present", lhs: {question: "firstRosterQuestion1Id_3"}}
                ],
                validations: []
              },
            ]
          },
          {
            _id: "secondRosterGroupId_3",
            rosterId: "firstRosterGroupId_3",
            name: {"en":"Second Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: false,
            required: false,
            conditions: [],
            validations: [],
            entryTitle: { en: "This is for {0}" },
            entryTitleExprs: [
              { type: "field", table: "responses:1234:roster:firstRosterGroupId_3", column: "data:firstRosterQuestion1Id_3:value" }
            ],
            contents: [
              {
                _id: "secondRosterQuestion3Id_3",
                text:{"en":"Question 3","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          },
          {
            _id: "matrix01Id_3",
            _type: "RosterMatrix",
            "name": {
              "_base": "en",
              "en": "Roster Matrix"
            },
            allowAdd: true,
            allowRemove: true,
            contents: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true },
              { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" } },
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
              { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
            ]
          },
          {
            _id: "groupId_3",
            name: {"en":"Question Group","_base":"en"},
            _type: "Group",
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "groupQuestionId_3",
                text:{"en":"A group question","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          },
          {
            "_id": "ef40dba8338d4ebdbbc5808e78969e95_4",
            "code": "testcode",
            "text": {
              "en": "Checkbox Question?",
              "_base": "en"
            },
            "_type": "CheckQuestion",
            "label": {
              "en": "yes",
              "_base": "en"
            },
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "recordLocation": true
          },
          {
            "_id": "d85b08dbe03e40eab55270c858fa04f5_4",
            "text": {
              "en": "Dropdown Question?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "j1643Tt",
                "label": {
                  "en": "Blue",
                  "_base": "en"
                }
              },
              {
                "id": "4GJdEFj",
                "label": {
                  "en": "Green",
                  "_base": "en"
                }
              },
              {
                "id": "MLuenLA",
                "label": {
                  "en": "Red",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "sticky": true,
            "conditions": [
              {
                "op": "true",
                "lhs": {
                  "question": "ef40dba8338d4ebdbbc5808e78969e95_4"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d0dcfce3a697453ba16cc8baa8e384e7_4",
            "text": {
              "en": "Text Question?",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "sticky": true,
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
            "_id": "fd43a6faa6764490ab82eae19d71af71_4",
            "text": {
              "en": "Number Question for {0}?",
              "_base": "en"
            },
            "textExprs": [
              { "type": "field", "table": "responses:1234", "column": "data:d0dcfce3a697453ba16cc8baa8e384e7:value" }
            ],
            "_type": "NumberQuestion",
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [
              {
                "op": "present",
                "lhs": {
                  "question": "d0dcfce3a697453ba16cc8baa8e384e7_4"
                }
              }
            ],
            "validations": []
          },
          {
            "_id": "d9765b2e0df14418b192cec19d0d2277_4",
            "text": {
              "en": "A multi check question?",
              "_base": "en"
            },
            "_type": "MulticheckQuestion",
            "choices": [
              {
                "id": "15ktQcc",
                "label": {
                  "en": "a",
                  "_base": "en"
                }
              },
              {
                "id": "rbRntNk",
                "label": {
                  "en": "b",
                  "_base": "en"
                }
              },
              {
                "id": "AZSGxYC",
                "label": {
                  "en": "c",
                  "_base": "en"
                }
              }
            ],
            "required": true,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f12aada1e2fd4ad8af06b3be00f23a93_4",
            "text": {
              "en": "A date question",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY-MM-DD",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e73674c9957b41a0b9a923cd4dd76af8_4",
            "text": {
              "en": "American date format",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "MM/DD/YYYY",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1792fe879ce459bb97ec9d5ffff39e1_4",
            "text": {
              "en": "Units Question?",
              "_base": "en"
            },
            "_type": "UnitsQuestion",
            "units": [
              {
                "id": "gVQSSfG",
                "label": {
                  "en": "cm",
                  "_base": "en"
                }
              },
              {
                "id": "wtdAQZ3",
                "label": {
                  "en": "inch",
                  "_base": "en"
                }
              }
            ],
            "decimal": true,
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": [],
            "defaultUnits": "gVQSSfG",
            "unitsPosition": "suffix"
          },
          {
            "_id": "e2de1b738e60444abb2c8b8a1707ce1a_4",
            "text": {
              "en": "Image Question?",
              "_base": "en"
            },
            "_type": "ImageQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c3f07eeec3ab4324a2f2d69949384c8c_4",
            "text": {
              "en": "Many images",
              "_base": "en"
            },
            "_type": "ImagesQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e506c671a2d34895a6652e39c68722bc_4",
            "text": {
              "en": "A location question",
              "_base": "en"
            },
            "_type": "LocationQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef584da04c7c44c9bec375aa7cf4b543_4",
            "text": {
              "en": "Extra text question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f5cfe2ac564c46f9a42e91a327e9c836_4",
            "text": {
              "en": "a Text List Question",
              "_base": "en"
            },
            "_type": "TextListQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "fbcb00ccb94448d6ade68643b1edbeac_4",
            "text": {
              "en": "a site question",
              "_base": "en"
            },
            "_type": "SiteQuestion",
            "required": false,
            "alternates": {
              "na": true,
              "dontknow": true
            },
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ea408d056c4b460698e4abc3a36cc737_4",
            "text": {
              "en": "New question",
              "_base": "en"
            },
            "_type": "TextQuestion",
            "format": "singleline",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ef0e7495bb25425fad61d26a34cff13d_4",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "ece020f907d94c2593db03439b8a7403_4",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c07954131db143139465d6fa8a076e6e_4",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "f1d8e777e253483883269590639de738_4",
            "text": {
              "en": "What type of survey is this?",
              "_base": "en"
            },
            "_type": "DropdownQuestion",
            "choices": [
              {
                "id": "7YDCmmQ",
                "label": {
                  "en": "Baseline",
                  "_base": "en"
                }
              },
              {
                "id": "Yxqwp4F",
                "label": {
                  "en": "Endline",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "c870229c072c460a8e07888397da7696",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "e69da26172364735afe078bfe0a29c67_4",
            "text": {
              "en": "Does MongoLabs...",
              "_base": "en"
            },
            "_type": "RadioQuestion",
            "choices": [
              {
                "id": "Tz3JhVg",
                "label": {
                  "en": "Suck",
                  "_base": "en"
                }
              },
              {
                "id": "MERLzae",
                "label": {
                  "en": "Rule",
                  "_base": "en"
                }
              },
              {
                "id": "ahBjM8W",
                "label": {
                  "en": "neither rule nor suck",
                  "_base": "en"
                }
              }
            ],
            "_basedOn": "f7d85b74156a4f0c933df332c0247eae",
            "required": true,
            "conditions": [],
            "validations": []
          },
          {
            "_id": "c85e1be8e3e942da8ba211b59741fd2c_4",
            "text": {
              "en": "How many fingers am I holding up?",
              "_base": "en"
            },
            "_type": "NumberQuestion",
            "decimal": false,
            "_basedOn": "dd36f82cdbfd4c748f84c68641319e39",
            "required": false,
            "conditions": [],
            "validations": [
              {
                "op": "range",
                "rhs": {
                  "literal": {
                    "max": 5,
                    "min": 0
                  }
                },
                "message": {
                  "en": "I only have one hand!",
                  "_base": "en"
                }
              }
            ]
          },
          {
            "_id": "c9f49171f0e84db3a4d41652601bfb39_4",
            "text": {
              "en": "Year only date",
              "_base": "en"
            },
            "_type": "DateQuestion",
            "format": "YYYY",
            "required": false,
            "conditions": [],
            "validations": []
          },
          {
            "_id":"cac9d62677c24c6482ce8ff790b823df_4",
            "help":{"en":"This is a very long help text aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","_base":"en"},
            "hint":{"en":"This is a hint","_base":"en"},
            "text":{"en":"Multiple lines","_base":"en"},
            "_type":"TextQuestion",
            "format":"multiline",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"urlquestion_4",
            "text":{"en":"Url text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"url",
            "required":false,
            "conditions":[],
            "validations":[],
            "commentsField":true
          },
          {
            "_id":"emailquestion_4",
            "text":{"en":"Email text question","_base":"en"},
            "_type":"TextQuestion",
            "format":"email",
            "required":false,
            "conditions":[],
            "validations":[]
          },
          {
            _id: "firstRosterGroupId_4",
            name: {"en":"First Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: true,
            required: false,
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "firstRosterQuestion1Id_4",
                text:{"en":"Question 1","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              },
              {
                _id: "firstRosterQuestion2Id_4",
                text:{"en":"Question 2","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [
                  {op: "present", lhs: {question: "firstRosterQuestion1Id_4"}}
                ],
                validations: []
              },
            ]
          },
          {
            _id: "secondRosterGroupId_4",
            rosterId: "firstRosterGroupId_4",
            name: {"en":"Second Roster Group","_base":"en"},
            _type: "RosterGroup",
            allowAdd: false,
            required: false,
            conditions: [],
            validations: [],
            entryTitle: { en: "This is for {0}" },
            entryTitleExprs: [
              { type: "field", table: "responses:1234:roster:firstRosterGroupId_4", column: "data:firstRosterQuestion1Id_4:value" }
            ],
            contents: [
              {
                _id: "secondRosterQuestion3Id_4",
                text:{"en":"Question 3","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          },
          {
            _id: "matrix01Id_4",
            _type: "RosterMatrix",
            "name": {
              "_base": "en",
              "en": "Roster Matrix"
            },
            allowAdd: true,
            allowRemove: true,
            contents: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true },
              { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" } },
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
              { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
            ]
          },
          {
            _id: "groupId_4",
            name: {"en":"Question Group","_base":"en"},
            _type: "Group",
            conditions: [],
            validations: [],
            contents: [
              {
                _id: "groupQuestionId_4",
                text:{"en":"A group question","_base":"en"},
                _type: "TextQuestion",
                format: 'singleline',
                required: false,
                alternates: {
                  na: false,
                  dontknow: false
                },
                conditions: [],
                validations: []
              }
            ]
          }
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
      },
    ],
    "draftNameRequired": true
  }
}