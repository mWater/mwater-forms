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
      {"_id":"7f138851a31d4c168b1dc16514409d08","code":"HC5E","help":null,"hint":{"en":"If the respondent reports that the television is broken, try to find out how long it has been broken and whether it will be fixed. If the item appears to be out of use only temporarily, record ‘Yes’. Otherwise, record ‘No’. ","sw":"* (2) Ofisi ya Takwimu ya Kitaifa ya Kenya, Mwongozo wa Mahesabu ya Sensa ya Kenya ya Kenya. *","_base":"en"},"text":{"en":"Does your household have:","sw":"Je! Kaya yako ina:","_base":"en"},"_type":"MatrixQuestion","items":[{"id":"eRUpByq","code":"a","label":{"en":"a radio?","sw":"Radio","_base":"en"}},{"id":"mQfxcF7","code":"b","label":{"en":"a television?","sw":"Luninga","_base":"en"}},{"id":"ZTJArGE","code":"c","label":{"en":"a refrigerator?","sw":"Jokofu","_base":"en"}},{"id":"SSbaw7q","code":"d","label":{"en":"an electric mitad?","sw":"Mitadi ya umeme","_base":"en"}},{"id":"Gswrcp8","code":"d","label":{"en":"a table?","sw":"Meza","_base":"en"}},{"id":"TzQYU7l","code":"f","label":{"en":"a chair?","sw":"Kiti","_base":"en"}},{"id":"bpvUqRf","code":"g","label":{"en":"a bed with cotton/sponge/spring mattress?","sw":"Kitanda cha pamba/sponji/godoro la spingi","_base":"en"}}],"columns":[{"_id":"4e445c5d48b34a77b21675319b21ebf0","text":{"en":"Answer","sw":"Jibu","_base":"en"},"_type":"DropdownColumnQuestion","choices":[{"id":"EzNhF1g","label":{"en":"Yes","sw":"Ndio","_base":"en"}},{"id":"zYyZqAx","label":{"en":"No","sw":"Hapana","_base":"en"}}],"required":false,"validations":[]}],"_basedOn":"7f138851a31d4c168b1dc16514409d08","required":false,"textExprs":[],"conditions":[],"validations":[]},
    ],
    "draftNameRequired": true,
    "calculations": [
      {
        "_id": "calc1",
        "name": { "_base": "en", "en": "Calc1" },
        "desc": { "_base": "en", "en": "Desc1" },
        "expr": { "type": "literal", "valueType": "number", "value": 123 }
      }
    ]
  }
}