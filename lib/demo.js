'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DemoComponent,
    FormComponent,
    FormSchemaBuilder,
    H,
    ImageUploaderModalComponent,
    ItemListComponent,
    PropTypes,
    R,
    React,
    ReactDOM,
    ResponseDisplayComponent,
    Schema,
    canada,
    formCtx,
    manitoba,
    matrixFormDesign,
    ontario,
    randomAskFormDesign,
    rosterFormDesign,
    sampleForm2,
    sampleFormDesign,
    testStickyStorage,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

ReactDOM = require('react-dom');

R = React.createElement;

H = React.DOM;

FormComponent = require('./FormComponent');

sampleFormDesign = require('./sampleFormDesign');

sampleForm2 = require('./sampleForm2');

//bigsampleForm2 = require './bigsampleForm2'
ItemListComponent = require('./ItemListComponent');

ResponseDisplayComponent = require('./ResponseDisplayComponent');

Schema = require('mwater-expressions').Schema;

FormSchemaBuilder = require('./FormSchemaBuilder');

ImageUploaderModalComponent = require('./ImageUploaderModalComponent');

// Setup mock localizer
global.T = function (str) {
  var i, index, len, ref, subValue, tag;
  if (arguments.length > 1) {
    ref = Array.from(arguments).slice(1);
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      subValue = ref[index];
      tag = '{' + index + '}';
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
  getAdminRegionPath: function getAdminRegionPath(id, callback) {
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
  getSubAdminRegions: function getSubAdminRegions(id, level, callback) {
    if (id == null) {
      return callback(null, [canada]);
    } else if (id === "canada") {
      return callback(null, [manitoba, ontario]);
    } else {
      return callback(null, []);
    }
  },
  renderEntitySummaryView: function renderEntitySummaryView(entityType, entity) {
    return JSON.stringify(entity);
  },
  renderEntityListItemView: function renderEntityListItemView(entityType, entity) {
    return JSON.stringify(entity);
  },
  findAdminRegionByLatLng: function findAdminRegionByLatLng(lat, lng, callback) {
    return callback("Not implemented");
  },
  imageManager: {
    getImageUrl: function getImageUrl(id, success, error) {
      return error("Not implemented");
    },
    getThumbnailImageUrl: function getThumbnailImageUrl(id, success, error) {
      return error("Not implemented");
    }
  },
  stickyStorage: {
    get: function get(questionId) {
      return testStickyStorage[questionId];
    },
    set: function set(questionId, value) {
      return testStickyStorage[questionId] = value;
    }
  },
  selectEntity: function selectEntity(options) {
    return options.callback("1234");
  },
  getEntityById: function getEntityById(entityType, entityId, callback) {
    if (entityId === "1234") {
      return callback({
        _id: "1234",
        code: "10007",
        name: "Test"
      });
    } else {
      return callback(null);
    }
  },
  getEntityByCode: function getEntityByCode(entityType, entityCode, callback) {
    if (entityCode === "10007") {
      return callback({
        _id: "1234",
        code: "10007",
        name: "Test"
      });
    } else {
      return callback(null);
    }
  }
};

DemoComponent = function (_React$Component) {
  _inherits(DemoComponent, _React$Component);

  function DemoComponent(props) {
    _classCallCheck(this, DemoComponent);

    var data;

    var _this = _possibleConstructorReturn(this, (DemoComponent.__proto__ || Object.getPrototypeOf(DemoComponent)).call(this, props));

    _this.handleDataChange = _this.handleDataChange.bind(_this);
    data = {
      site01: {
        value: {
          code: "10007"
        }
      }
    };
    _this.state = {
      data: data
    };
    return _this;
  }

  _createClass(DemoComponent, [{
    key: 'handleDataChange',
    value: function handleDataChange(data) {
      boundMethodCheck(this, DemoComponent);
      console.log(data);
      return this.setState({
        data: data
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var design, schema;
      // R ItemListComponent, 
      //   contents: sampleFormDesign.contents[0].contents
      //   data: @state.data
      //   onDataChange: (data) => @setState(data: data)
      schema = new Schema();
      // design = rosterFormDesign
      // design = matrixFormDesign
      // design = rosterFormDesign
      design = sampleForm2.design;
      // design = randomAskFormDesign
      schema = new FormSchemaBuilder({
        user: "bob"
      }).addForm(schema, {
        _id: "form1",
        design: design
      });
      return H.div({
        className: "row"
      }, H.div({
        className: "col-md-6"
      }, R(FormComponent, {
        formCtx: formCtx,
        // locale: PropTypes.string            # Locale. Defaults to English (en)
        design: design,
        data: this.state.data,
        schema: schema,
        onDataChange: this.handleDataChange,
        onSubmit: function onSubmit() {
          return alert("Submit");
        },
        onSaveLater: function onSaveLater() {
          return alert("SaveLater");
        },
        onDiscard: function onDiscard() {
          return alert("Discard");
        }
        // submitLabel: PropTypes.string           # Label for submit button
        // discardLabel: PropTypes.string           # Label for discard button
        // entity: PropTypes.object            # Form-level entity to load
        // entityType: PropTypes.string        # Type of form-level entity to load      getAdminRegionPath: getAdminRegionPath
        //   getSubAdminRegions: getSubAdminRegions
        //   onChange: onChange
        //   value: value
        // })
      })), H.div({
        className: "col-md-6"
      }, R(ResponseDisplayComponent, {
        form: {
          design: design
        },
        response: {
          data: this.state.data
        },
        formCtx: formCtx,
        T: T
      })));
    }
  }]);

  return DemoComponent;
}(React.Component);

// class ImageUploaderTestComponent extends React.Component
//   render: ->
//     R ImageUploaderModalComponent, 
//       T: window.T
//       apiUrl: "http://localhost:1234/v3/"
//       onSuccess: (id) => console.log(id)
//       onCancel: => console.log "Cancel"
$(function () {
  return ReactDOM.render(R(DemoComponent), document.getElementById("main"));
});

// ImageUploaderModalComponent.show("http://localhost:1234/v3/", null, window.T, (id) -> alert(id))
// ReactDOM.render(R(ImageUploaderTestComponent), document.getElementById("main"))
rosterFormDesign = {
  "_type": "Form",
  _id: "form123",
  "_schema": 11,
  "name": {
    "_base": "en",
    "en": "Sample Form"
  },
  localizedStrings: [],
  "contents": [{
    _id: "site01",
    _type: "SiteQuestion",
    "text": {
      "_base": "en",
      "en": "Site?"
    },
    siteTypes: ['Water point']
  }, {
    _id: "text01",
    _type: "TextQuestion",
    "text": {
      "_base": "en",
      "en": "Text {0}"
    },
    textExprs: [{
      type: "scalar",
      table: "responses:form123",
      joins: ["data:site01:value"],
      expr: {
        type: "field",
        table: "entities.water_point",
        column: "code"
      }
    }],
    siteTypes: ['Water point'],
    conditionExpr: {
      type: "op",
      table: "responses:form123",
      op: "is not null",
      exprs: [{
        type: "scalar",
        table: "responses:form123",
        joins: ["data:site01:value"],
        expr: {
          type: "field",
          table: "entities.water_point",
          column: "code"
        }
      }]
    }
  }, {
    _id: "matrix01",
    _type: "RosterMatrix",
    "name": {
      "_base": "en",
      "en": "Roster Matrix"
    },
    allowAdd: true,
    allowRemove: true,
    contents: [{
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
      choices: [{
        label: {
          en: "Male"
        },
        id: "male"
      }, {
        label: {
          en: "Female"
        },
        id: "female"
      }]
    }, {
      _id: "e",
      _type: "DateColumnQuestion",
      text: {
        en: "Date"
      },
      format: "YYYY-MM-DD",
      required: false
    }]
  }, {
    _id: "matrix02",
    _type: "RosterMatrix",
    "name": {
      "_base": "en",
      "en": "Roster Matrix 2"
    },
    rosterId: "matrix01",
    contents: [{
      _id: "a2",
      _type: "TextColumn",
      text: {
        en: "Text Column"
      },
      cellText: {
        en: "Cell Text {0}"
      },
      "cellTextExprs": [{
        "type": "field",
        "table": "responses:form123:roster:matrix01",
        "column": "data:a:value"
      }]
    }, {
      _id: "b2",
      _type: "UnitsColumnQuestion",
      text: {
        en: "Units"
      },
      "decimal": true,
      "defaultUnits": "wtdAQZ3",
      units: [{
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
      }]
    }]
  }]
};

matrixFormDesign = {
  "_type": "Form",
  _id: "form123",
  "_schema": 11,
  "name": {
    "_base": "en",
    "en": "Sample Form"
  },
  "contents": [{
    _id: "matrix01",
    _type: "MatrixQuestion",
    "name": {
      "_base": "en",
      "en": "Matrix"
    },
    items: [{
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
    }],
    columns: [{
      _id: "a",
      _type: "TextColumnQuestion",
      text: {
        en: "Name"
      },
      required: true,
      validations: [{
        "op": "lengthRange",
        "rhs": {
          "literal": {
            "max": 10
          }
        },
        "message": {
          "en": "String is too long",
          "_base": "en"
        }
      }]
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
      choices: [{
        label: {
          en: "Male"
        },
        id: "male"
      }, {
        label: {
          en: "Female"
        },
        id: "female"
      }]
    }, {
      _id: "e",
      _type: "UnitsColumnQuestion",
      text: {
        en: "Unit"
      },
      decimal: true,
      units: [{
        label: {
          en: "CM"
        },
        id: "cm"
      }, {
        label: {
          en: "INCH"
        },
        id: "inch"
      }]
    }],
    alternates: {
      na: 1
    }
  }]
};

randomAskFormDesign = {
  "name": {
    "en": "Visualization Test",
    "_base": "en"
  },
  "_type": "Form",
  "locales": [{
    "code": "en",
    "name": "English"
  }],
  "contents": [{
    "_id": "textid",
    "text": {
      "en": "Random Question",
      "_base": "en"
    },
    "_type": "TextQuestion",
    "randomAskProbability": 0.2
  }]
};