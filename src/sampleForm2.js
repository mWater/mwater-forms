module.exports = {
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
          "required": false,
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
            "en": "Number Question?",
            "_base": "en"
          },
          "_type": "NumberQuestion",
          "decimal": true,
          "required": false,
          "conditions": [
            {
              "op": "!present",
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
          "required": false,
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
          "required": false,
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
        }
      ],
      "conditions": []
    }
  ],
  "draftNameRequired": true
}