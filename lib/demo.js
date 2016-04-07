var AdminRegionSelectComponent, DemoComponent, FormComponent, H, ItemListComponent, R, React, ReactDOM, canada, formCtx, manitoba, ontario, rosterFormDesign, sampleForm2, sampleFormDesign, testStickyStorage,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

ReactDOM = require('react-dom');

R = React.createElement;

H = React.DOM;

AdminRegionSelectComponent = require('./AdminRegionSelectComponent');

FormComponent = require('./FormComponent');

sampleFormDesign = require('./sampleFormDesign');

sampleForm2 = require('./sampleForm2');

ItemListComponent = require('./ItemListComponent');

global.T = function(str) {
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
      console.log(questionId);
      return testStickyStorage[questionId];
    },
    set: function(questionId, value) {
      return testStickyStorage[questionId] = value;
    }
  }
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

  DemoComponent.childContextTypes = {
    locale: React.PropTypes.string,
    selectEntity: React.PropTypes.func,
    editEntity: React.PropTypes.func,
    renderEntitySummaryView: React.PropTypes.func.isRequired,
    getEntityById: React.PropTypes.func,
    getEntityByCode: React.PropTypes.func,
    locationFinder: React.PropTypes.object,
    displayMap: React.PropTypes.func,
    stickyStorage: React.PropTypes.object,
    getAdminRegionPath: React.PropTypes.func.isRequired,
    getSubAdminRegions: React.PropTypes.func.isRequired,
    findAdminRegionByLatLng: React.PropTypes.func.isRequired,
    imageManager: React.PropTypes.object.isRequired,
    imageAcquirer: React.PropTypes.object
  };

  DemoComponent.prototype.getChildContext = function() {
    return formCtx;
  };

  DemoComponent.prototype.handleDataChange = function(data) {
    return this.setState({
      data: data
    });
  };

  DemoComponent.prototype.render = function() {
    return R(FormComponent, {
      design: sampleForm2,
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
    });
  };

  return DemoComponent;

})(React.Component);

$(function() {
  return ReactDOM.render(R(DemoComponent), document.getElementById("main"));
});

rosterFormDesign = {
  "_type": "Form",
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
      rosterId: "02",
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
          }
        }, {
          _id: "c",
          _type: "CheckboxColumnQuestion",
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
      "_type": "TextQuestion",
      "_id": "c11d1865674d4498a2adbeddc440230f",
      "text": {
        "_base": "en",
        "en": "Name of partner organization"
      },
      "conditions": [],
      "validations": [],
      "required": false,
      "format": "singleline"
    }, {
      "_type": "TextQuestion",
      "_id": "fd620bf420a54dcd99dbae7b7c67a67c",
      "text": {
        "_base": "en",
        "en": "Program Number"
      },
      "conditions": [],
      "validations": [],
      "required": false,
      "format": "singleline"
    }, {
      "_id": "02",
      "_type": "RosterGroup",
      "name": {
        "_base": "en",
        "en": "Roster Group"
      },
      rosterId: "02",
      allowAdd: true,
      allowRemove: true,
      "contents": [
        {
          "_type": "DropdownQuestion",
          "_id": "febdcbd89bed40799f92951729b6d360",
          "text": {
            "_base": "en",
            "en": "Have you taken a loan with [name of partner organization]?"
          },
          "conditions": [],
          "validations": [],
          "required": false,
          "choices": [
            {
              "label": {
                "_base": "en",
                "en": "Yes"
              },
              "id": "He8psmv"
            }, {
              "label": {
                "_base": "en",
                "en": "No"
              },
              "id": "XX52gjb"
            }, {
              "label": {
                "_base": "en",
                "en": "Other"
              },
              "specify": true,
              "id": "8X52gj3"
            }
          ]
        }, {
          "_type": "RadioQuestion",
          "_id": "dd7ffa2f8cf9423fbf814d710a3e55a4",
          "text": {
            "_base": "en",
            "en": "Are you the head of the household?"
          },
          "conditions": [],
          "validations": [],
          "required": false,
          "choices": [
            {
              "label": {
                "_base": "en",
                "en": "Yes"
              },
              "id": "ChFvwt8"
            }, {
              "label": {
                "_base": "en",
                "en": "No"
              },
              "id": "AK51bEJ"
            }
          ]
        }
      ]
    }
  ]
};
