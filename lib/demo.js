var DemoComponent, FormComponent, H, ItemListComponent, R, React, ReactDOM, ResponseAnswersComponent, ResponseDisplayComponent, canada, formCtx, manitoba, matrixFormDesign, ontario, rosterFormDesign, sampleForm2, sampleFormDesign, testStickyStorage,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

ReactDOM = require('react-dom');

R = React.createElement;

H = React.DOM;

FormComponent = require('./FormComponent');

sampleFormDesign = require('./sampleFormDesign');

sampleForm2 = require('./sampleForm2');

ItemListComponent = require('./ItemListComponent');

ResponseDisplayComponent = require('./ResponseDisplayComponent');

ResponseAnswersComponent = require('./ResponseAnswersComponent');

global.T = function(str) {
  var i, index, len, ref, subValue, tag;
  if (arguments.length > 1) {
    ref = Array.from(arguments).slice(1);
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      subValue = ref[index];
      tag = "{" + index + "}";
      str = str.replace(tag, subValue);
    }
  }
  return str;
};

canada = {
  id: "canada",
  level: 0,
  name: "Canada",
  type: "Country"
};

manitoba = {
  id: "manitoba",
  level: 1,
  name: "Manitoba",
  type: "Province"
};

ontario = {
  id: "ontario",
  level: 1,
  name: "Ontario",
  type: "Province"
};

testStickyStorage = {
  'd0dcfce3a697453ba16cc8baa8e384e7': "Testing sticky value"
};

formCtx = {
  locale: "en",
  getAdminRegionPath: function(id, callback) {
    if (id === 'manitoba') {
      return callback(null, [canada, manitoba]);
    } else if (id === 'ontario') {
      return callback(null, [canada, ontario]);
    } else if (id === "canada") {
      return callback(null, [canada]);
    } else {
      return callback(null, []);
    }
  },
  getSubAdminRegions: function(id, level, callback) {
    if (id == null) {
      return callback(null, [canada]);
    } else if (id === "canada") {
      return callback(null, [manitoba, ontario]);
    } else {
      return callback(null, []);
    }
  },
  renderEntitySummaryView: function(entityType, entity) {
    return JSON.stringify(entity);
  },
  findAdminRegionByLatLng: function(lat, lng, callback) {
    return callback("Not implemented");
  },
  imageManager: {
    getImageUrl: function(id, success, error) {
      return error("Not implemented");
    },
    getThumbnailImageUrl: function(id, success, error) {
      return error("Not implemented");
    }
  },
  stickyStorage: {
    get: function(questionId) {
      return testStickyStorage[questionId];
    },
    set: function(questionId, value) {
      return testStickyStorage[questionId] = value;
    }
  },
  selectEntity: (function(_this) {
    return function(options) {
      return options.callback("1234");
    };
  })(this),
  getEntityById: (function(_this) {
    return function(entityType, entityId, callback) {
      if (entityId === "1234") {
        return callback({
          _id: "1234",
          code: "10007",
          name: "Test"
        });
      } else {
        return callback(null);
      }
    };
  })(this),
  getEntityByCode: (function(_this) {
    return function(entityType, entityCode, callback) {
      if (entityCode === "10007") {
        return callback({
          _id: "1234",
          code: "10007",
          name: "Test"
        });
      } else {
        return callback(null);
      }
    };
  })(this)
};

DemoComponent = (function(superClass) {
  extend(DemoComponent, superClass);

  function DemoComponent() {
    this.handleDataChange = bind(this.handleDataChange, this);
    var data;
    DemoComponent.__super__.constructor.apply(this, arguments);
    data = {};
    this.state = {
      data: data
    };
  }

  DemoComponent.prototype.handleDataChange = function(data) {
    console.log(data);
    return this.setState({
      data: data
    });
  };

  DemoComponent.prototype.render = function() {
    return H.div({
      className: "row"
    }, H.div({
      className: "col-md-6"
    }, R(FormComponent, {
      formCtx: formCtx,
      design: sampleForm2.design,
      data: this.state.data,
      onDataChange: this.handleDataChange,
      onSubmit: (function(_this) {
        return function() {
          return alert("Submit");
        };
      })(this),
      onSaveLater: (function(_this) {
        return function() {
          return alert("SaveLater");
        };
      })(this),
      onDiscard: (function(_this) {
        return function() {
          return alert("Discard");
        };
      })(this)
    })), H.div({
      className: "col-md-6"
    }, R(ResponseDisplayComponent, {
      form: sampleForm2,
      response: {
        data: this.state.data
      },
      formCtx: formCtx,
      T: T
    })));
  };

  return DemoComponent;

})(React.Component);

$(function() {
  return ReactDOM.render(R(DemoComponent), document.getElementById("main"));
});

rosterFormDesign = {
  "_type": "Form",
  _id: "form123",
  "_schema": 11,
  "name": {
    "_base": "en",
    "en": "Sample Form"
  },
  "contents": [
    {
      _id: "matrix01",
      _type: "RosterMatrix",
      "name": {
        "_base": "en",
        "en": "Roster Matrix"
      },
      allowAdd: true,
      allowRemove: true,
      contents: [
        {
          _id: "a",
          _type: "TextColumnQuestion",
          text: {
            en: "Name"
          },
          required: true
        }, {
          _id: "b",
          _type: "NumberColumnQuestion",
          text: {
            en: "Age"
          },
          decimal: false
        }, {
          _id: "c",
          _type: "CheckColumnQuestion",
          text: {
            en: "Present"
          }
        }, {
          _id: "d",
          _type: "DropdownColumnQuestion",
          text: {
            en: "Gender"
          },
          choices: [
            {
              label: {
                en: "Male"
              },
              id: "male"
            }, {
              label: {
                en: "Female"
              },
              id: "female"
            }
          ]
        }
      ]
    }, {
      _id: "matrix02",
      _type: "RosterMatrix",
      "name": {
        "_base": "en",
        "en": "Roster Matrix 2"
      },
      rosterId: "matrix01",
      contents: [
        {
          _id: "a2",
          _type: "TextColumn",
          text: {
            en: "Text Column"
          },
          cellText: {
            en: "Cell Text {0}"
          },
          "cellTextExprs": [
            {
              "type": "field",
              "table": "responses:form123:roster:matrix01",
              "column": "data:a:value"
            }
          ]
        }, {
          id: "b2",
          _type: "UnitsColumnQuestion",
          text: {
            en: "Units"
          },
          "decimal": true,
          "defaultUnits": "wtdAQZ3",
          units: [
            {
              "id": "gVQSSfG",
              "label": {
                "en": "cm",
                "_base": "en"
              }
            }, {
              "id": "wtdAQZ3",
              "label": {
                "en": "inch",
                "_base": "en"
              }
            }
          ]
        }
      ]
    }
  ]
};

matrixFormDesign = {
  "_type": "Form",
  _id: "form123",
  "_schema": 11,
  "name": {
    "_base": "en",
    "en": "Sample Form"
  },
  "contents": [
    {
      _id: "matrix01",
      _type: "MatrixQuestion",
      "name": {
        "_base": "en",
        "en": "Matrix"
      },
      items: [
        {
          "id": "item1",
          "label": {
            "en": "First",
            "_base": "en"
          }
        }, {
          "id": "item2",
          "label": {
            "en": "Second",
            "_base": "en"
          }
        }, {
          "id": "item3",
          "label": {
            "en": "Third",
            "_base": "en"
          },
          hint: {
            en: "Some hint"
          }
        }
      ],
      contents: [
        {
          _id: "a",
          _type: "TextColumnQuestion",
          text: {
            en: "Name"
          },
          required: true
        }, {
          _id: "b",
          _type: "NumberColumnQuestion",
          text: {
            en: "Age"
          },
          decimal: false
        }, {
          _id: "c",
          _type: "CheckColumnQuestion",
          text: {
            en: "Present"
          }
        }, {
          _id: "d",
          _type: "DropdownColumnQuestion",
          text: {
            en: "Gender"
          },
          choices: [
            {
              label: {
                en: "Male"
              },
              id: "male"
            }, {
              label: {
                en: "Female"
              },
              id: "female"
            }
          ]
        }
      ]
    }
  ]
};
