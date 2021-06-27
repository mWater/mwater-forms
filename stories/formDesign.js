// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
export default {
  "name": {
    "en": "Archives Test Survey",
    "_base": "en"
  },
  "_type": "Form",
  "_schema": 20,
  "locales": [
    {
      "code": "en",
      "name": "English"
    }
  ],
  "contents": [
    {
      "_id": "d4e2a57cde1a41d18b618de17e31177a",
      "name": {
        "en": "Main",
        "_base": "en"
      },
      "_type": "Section",
      "contents": [
        {
          "_id": "92903cdbfd554539ac2bf6063c8a8bcb",
          "text": {
            "en": "What is your age",
            "_base": "en"
          },
          "_type": "NumberQuestion",
          "textExprs": [],
          "conditions": [],
          "validations": []
        },
        {
          "_id": "21c6d1ddc18548e584c085bbc204a5ca",
          "text": {
            "en": "What is your name",
            "_base": "en"
          },
          "_type": "TextQuestion",
          "format": "singleline",
          "required": false,
          "textExprs": [],
          "conditions": [],
          "validations": []
        },
        {
          "_id": "219ec736b2574009a743ff5a0c8b766a",
          "name": {
            "en": "New Roster",
            "_base": "en"
          },
          "_type": "RosterGroup",
          "allowAdd": true,
          "contents": [
            {
              "_id": "df2338324f9a4420b5c1b1c84ee0126e",
              "text": {
                "en": "How much do you make a week?",
                "_base": "en"
              },
              "_type": "NumberQuestion",
              "textExprs": [],
              "conditions": [],
              "validations": []
            },
            {
              "_id": "9db76043becb49868b6b880dc6c232b7",
              "text": {
                "en": "Your name?",
                "_base": "en"
              },
              "_type": "TextQuestion",
              "format": "singleline",
              "required": false,
              "textExprs": [],
              "conditions": [],
              "validations": []
            },
            {
              "_id": "fd8c8dba06fb42ecb70b6bacd3e95b42",
              "text": {
                "en": "Are you married?",
                "_base": "en"
              },
              "_type": "RadioQuestion",
              "choices": [
                {
                  "id": "U5Hbjv9",
                  "code": "yes",
                  "label": {
                    "en": "Yes",
                    "_base": "en"
                  }
                },
                {
                  "id": "ztnPGsu",
                  "code": "no",
                  "label": {
                    "en": "No",
                    "_base": "en"
                  }
                }
              ],
              "required": false,
              "textExprs": [],
              "conditions": [],
              "validations": []
            }
          ],
          "conditions": [],
          "entryTitle": {
            "en": "",
            "_base": "en"
          },
          "allowRemove": true,
          "entryTitleExprs": []
        },
        {
          "_id": "bd1f51cfd93646b9b738a5f7fd063ffb",
          "name": {
            "en": "Roster Matrix",
            "_base": "en"
          },
          "_type": "RosterMatrix",
          "allowAdd": true,
          "contents": [
            {
              "_id": "1c7ab72348574ffdb43be013d1ef334a",
              "text": {
                "en": "bla",
                "_base": "en"
              },
              "_type": "NumberColumnQuestion",
              "decimal": true,
              "required": false,
              "validations": []
            },
            {
              "_id": "20318c6526574a3e808adcc52bafdefc",
              "text": {
                "en": "Name",
                "_base": "en"
              },
              "_type": "TextColumnQuestion",
              "required": false,
              "validations": []
            }
          ],
          "conditions": [],
          "allowRemove": true
        }
      ],
      "conditions": []
    }
  ]
};