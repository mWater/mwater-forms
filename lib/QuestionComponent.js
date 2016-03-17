var AdminRegionAnswerComponent, DropdownAnswerComponent, EntityAnswerComponent, H, ImageEditorComponent, ImagelistEditorComponent, LocationAnswerComponent, LocationEditorComponent, MulticheckAnswerComponent, NumberInputComponent, QuestionComponent, R, RadioAnswerComponent, React, TextAnswerComponent, _, formUtils, markdown,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

markdown = require("markdown").markdown;

ImageEditorComponent = require('./ImageEditorComponent');

ImagelistEditorComponent = require('./ImagelistEditorComponent');

AdminRegionAnswerComponent = require('./AdminRegionAnswerComponent');

EntityAnswerComponent = require('./EntityAnswerComponent');

LocationEditorComponent = require('./LocationEditorComponent');

NumberInputComponent = require('./NumberInputComponent');

module.exports = QuestionComponent = (function(superClass) {
  extend(QuestionComponent, superClass);

  QuestionComponent.contextTypes = require('./formContextTypes');

  QuestionComponent.propTypes = {
    question: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    answer: React.PropTypes.object,
    onAnswerChange: React.PropTypes.func.isRequired
  };

  QuestionComponent.defaultProps = {
    answer: {}
  };

  function QuestionComponent() {
    this.handleSpecifyChange = bind(this.handleSpecifyChange, this);
    this.handleCommentsChange = bind(this.handleCommentsChange, this);
    this.handleAlternate = bind(this.handleAlternate, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    this.handleToggleHelp = bind(this.handleToggleHelp, this);
    QuestionComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      helpVisible: false
    };
  }

  QuestionComponent.prototype.handleToggleHelp = function() {
    return this.setState({
      helpVisible: !this.state.helpVisible
    });
  };

  QuestionComponent.prototype.handleValueChange = function(value) {
    return this.props.onAnswerChange(_.extend({}, this.props.answer, {
      value: value
    }));
  };

  QuestionComponent.prototype.handleAlternate = function(alternate) {
    return this.props.onAnswerChange(_.extend({}, this.props.answer, {
      value: null,
      specify: null,
      alternate: this.props.answer.alternate === alternate ? null : alternate
    }));
  };

  QuestionComponent.prototype.handleCommentsChange = function(ev) {
    return this.props.onAnswerChange(_.extend({}, this.props.answer, {
      comments: ev.target.value
    }));
  };

  QuestionComponent.prototype.handleSpecifyChange = function(specify) {
    return this.props.onAnswerChange(_.extend({}, this.props.answer, {
      specify: specify
    }));
  };

  QuestionComponent.prototype.renderPrompt = function() {
    var prompt;
    prompt = formUtils.localizeString(this.props.question.text, this.context.locale);
    prompt = prompt.replace(/\{(.+?)\}/g, (function(_this) {
      return function(match, expr) {
        var i, len, path, ref, value;
        value = _this.props.data;
        ref = expr.split(":");
        for (i = 0, len = ref.length; i < len; i++) {
          path = ref[i];
          if (value) {
            value = value[path];
          }
        }
        return value || "";
      };
    })(this));
    return H.div({
      className: "prompt"
    }, this.props.question.code ? H.span({
      className: "question-code"
    }, this.props.question.code + ": ") : void 0, prompt, this.props.question.required ? H.span({
      className: "required"
    }, "*") : void 0, this.props.question.help ? H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleToggleHelp
    }, H.span({
      className: "glyphicon glyphicon-question-sign"
    })) : void 0);
  };

  QuestionComponent.prototype.renderHint = function() {
    if (this.props.question.hint) {
      return H.div({
        className: "text-muted"
      }, formUtils.localizeString(this.props.question.hint, this.context.locale));
    }
  };

  QuestionComponent.prototype.renderHelp = function() {
    if (this.state.helpVisible && this.props.question.help) {
      return H.div({
        className: "help well well-sm",
        dangerouslySetInnerHTML: {
          __html: markdown.toHTML(formUtils.localizeString(this.props.question.help, this.context.locale))
        }
      });
    }
  };

  QuestionComponent.prototype.renderAlternates = function() {
    if (this.props.question.alternates && (this.props.question.alternates.na || this.props.question.alternates.dontknow)) {
      return H.div(null, this.props.question.alternates.dontknow ? H.div({
        className: "touch-checkbox alternate " + (this.props.answer.alternate === 'dontknow' ? 'checked' : void 0),
        onClick: this.handleAlternate.bind(null, 'dontknow')
      }, T("Don't Know")) : void 0, this.props.question.alternates.na ? H.div({
        className: "touch-checkbox alternate " + (this.props.answer.alternate === 'na' ? 'checked' : void 0),
        onClick: this.handleAlternate.bind(null, 'na')
      }, T("Not Applicable")) : void 0);
    }
  };

  QuestionComponent.prototype.renderCommentsField = function() {
    if (this.props.question.commentsField) {
      return H.textarea({
        className: "form-control question-comments",
        placeholder: T("Comments"),
        value: this.props.answer.comments,
        onChange: this.handleCommentsChange
      });
    }
  };

  QuestionComponent.prototype.renderAnswer = function() {
    switch (this.props.question._type) {
      case "TextQuestion":
        return R(TextAnswerComponent, {
          value: this.props.answer.value,
          onValueChange: this.handleValueChange
        });
      case "NumberQuestion":
        return R(NumberInputComponent, {
          value: this.props.answer.value,
          onChange: this.handleValueChange,
          decimal: this.props.question.decimal
        });
      case "DropdownQuestion":
        return R(DropdownAnswerComponent, {
          choices: this.props.question.choices,
          value: this.props.answer.value,
          onValueChange: this.handleValueChange,
          specify: this.props.answer.specify,
          onSpecifyChange: this.handleSpecifyChange
        });
      case "RadioQuestion":
        return R(RadioAnswerComponent, {
          choices: this.props.question.choices,
          value: this.props.answer.value,
          onValueChange: this.handleValueChange,
          specify: this.props.answer.specify,
          onSpecifyChange: this.handleSpecifyChange
        });
      case "MulticheckQuestion":
        return R(MulticheckAnswerComponent, {
          choices: this.props.question.choices,
          value: this.props.answer.value,
          onValueChange: this.handleValueChange,
          specify: this.props.answer.specify,
          onSpecifyChange: this.handleSpecifyChange
        });
      case "DateQuestion":
        return "TODO - date";
      case "UnitsQuestion":
        return "TODO - units";
      case "CheckQuestion":
        return "TODO - boolean";
      case "LocationQuestion":
        R(LocationAnswerComponent, {
          value: this.props.answer.value,
          onValueChange: this.handleValueChange,
          displayMap: this.context.displayMap
        });
        break;
      case "ImageQuestion":
        return R(ImageEditorComponent, {
          imageManager: this.context.imageManager,
          imageAcquirer: this.context.imageAcquirer,
          image: this.props.answer.value,
          onImageChange: this.handleValueChange
        });
      case "ImagesQuestion":
        return R(ImageEditorComponent, {
          imageManager: this.context.imageManager,
          imageAcquirer: this.context.imageAcquirer,
          imagelist: this.props.answer.value,
          onImagelistChange: this.handleValueChange
        });
      case "TextListQuestion":
        return "TODO - texts";
      case "SiteQuestion":
        return "TODO - site";
      case "BarcodeQuestion":
        return "TODO - text";
      case "EntityQuestion":
        return R(EntityAnswerComponent, {
          value: this.props.answer.value,
          entityType: this.props.question.entityType,
          onValueChange: this.handleValueChange,
          selectEntity: this.context.selectEntity,
          editEntity: this.context.editEntity,
          renderEntitySummaryView: this.context.renderEntitySummaryView,
          getEntityById: this.context.getEntityById,
          canEditEntity: this.context.canEditEntity
        });
      case "AdminRegionQuestion":
        return R(AdminRegionAnswerComponent, {
          locationFinder: this.context.locationFinder,
          displayMap: this.context.displayMap,
          getAdminRegionPath: this.context.getAdminRegionPath,
          getSubAdminRegions: this.context.getSubAdminRegions,
          findAdminRegionByLatLng: this.context.findAdminRegionByLatLng,
          value: this.props.answer.value,
          onChange: this.handleValueChange
        });
      default:
        return "Unknown type " + this.props.question._type;
    }
    return null;
  };

  QuestionComponent.prototype.render = function() {
    return H.div({
      className: "question"
    }, this.renderPrompt(), this.renderHint(), this.renderHelp(), H.div({
      className: "answer"
    }, this.renderAnswer()), this.renderAlternates(), this.renderCommentsField());
  };

  return QuestionComponent;

})(React.Component);

TextAnswerComponent = (function(superClass) {
  extend(TextAnswerComponent, superClass);

  function TextAnswerComponent() {
    return TextAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  TextAnswerComponent.propTypes = {
    value: React.PropTypes.string,
    onValueChange: React.PropTypes.func.isRequired
  };

  TextAnswerComponent.prototype.render = function() {
    return H.input({
      className: "form-control",
      type: "text",
      value: this.props.value,
      onChange: (function(_this) {
        return function(ev) {
          return _this.props.onValueChange(ev.target.value);
        };
      })(this)
    });
  };

  return TextAnswerComponent;

})(React.Component);

DropdownAnswerComponent = (function(superClass) {
  extend(DropdownAnswerComponent, superClass);

  function DropdownAnswerComponent() {
    this.handleSpecifyChange = bind(this.handleSpecifyChange, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    return DropdownAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  DropdownAnswerComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  DropdownAnswerComponent.propTypes = {
    choices: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      label: React.PropTypes.object.isRequired,
      hint: React.PropTypes.object,
      specify: React.PropTypes.bool
    })).isRequired,
    value: React.PropTypes.string,
    onValueChange: React.PropTypes.func.isRequired,
    specify: React.PropTypes.object,
    onSpecifyChange: React.PropTypes.func.isRequired
  };

  DropdownAnswerComponent.defaultProps = {
    specify: {}
  };

  DropdownAnswerComponent.prototype.handleValueChange = function(ev) {
    if (ev.target.value) {
      return this.props.onValueChange(ev.target.value);
    } else {
      return this.props.onValueChange(null);
    }
  };

  DropdownAnswerComponent.prototype.handleSpecifyChange = function(id, ev) {
    var change, specify;
    change = {};
    change[id] = ev.target.value;
    specify = _.extend({}, this.props.specify, change);
    return this.props.onSpecifyChange(specify);
  };

  DropdownAnswerComponent.prototype.renderSpecify = function() {
    var choice;
    choice = _.findWhere(this.props.choices, {
      id: this.props.value
    });
    if (choice && choice.specify) {
      return H.input({
        className: "form-control specify-input",
        type: "text",
        value: this.props.specify[choice.id],
        onChange: this.handleSpecifyChange.bind(null, choice.id)
      });
    }
  };

  DropdownAnswerComponent.prototype.render = function() {
    return H.div(null, H.select({
      className: "form-control",
      style: {
        width: "auto"
      },
      value: this.props.value,
      onChange: this.handleValueChange
    }, H.option({
      key: "__none__",
      value: ""
    }), _.map(this.props.choices, (function(_this) {
      return function(choice) {
        var text;
        text = formUtils.localizeString(choice.label, _this.context.locale);
        if (choice.hint) {
          text += " (" + formUtils.localizeString(choice.hint, _this.context.locale) + ")";
        }
        return H.option({
          key: choice.id,
          value: choice.id
        }, text);
      };
    })(this))), this.renderSpecify());
  };

  return DropdownAnswerComponent;

})(React.Component);

RadioAnswerComponent = (function(superClass) {
  extend(RadioAnswerComponent, superClass);

  function RadioAnswerComponent() {
    this.handleSpecifyChange = bind(this.handleSpecifyChange, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    return RadioAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  RadioAnswerComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  RadioAnswerComponent.propTypes = {
    choices: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      label: React.PropTypes.object.isRequired,
      hint: React.PropTypes.object,
      specify: React.PropTypes.bool
    })).isRequired,
    value: React.PropTypes.string,
    onValueChange: React.PropTypes.func.isRequired,
    specify: React.PropTypes.object,
    onSpecifyChange: React.PropTypes.func.isRequired
  };

  RadioAnswerComponent.defaultProps = {
    specify: {}
  };

  RadioAnswerComponent.prototype.handleValueChange = function(choice) {
    if (choice.id === this.props.value) {
      return this.props.onValueChange(null);
    } else {
      return this.props.onValueChange(choice.id);
    }
  };

  RadioAnswerComponent.prototype.handleSpecifyChange = function(id, ev) {
    var change, specify;
    change = {};
    change[id] = ev.target.value;
    specify = _.extend({}, this.props.specify, change);
    return this.props.onSpecifyChange(specify);
  };

  RadioAnswerComponent.prototype.renderSpecify = function(choice) {
    return H.input({
      className: "form-control specify-input",
      type: "text",
      value: this.props.specify[choice.id],
      onChange: this.handleSpecifyChange.bind(null, choice.id)
    });
  };

  RadioAnswerComponent.prototype.renderChoice = function(choice) {
    return H.div({
      key: choice.id
    }, H.div({
      className: "touch-radio " + (this.props.value === choice.id ? "checked" : ""),
      onClick: this.handleValueChange.bind(null, choice)
    }, formUtils.localizeString(choice.label, this.context.locale), choice.hint ? H.span({
      className: "radio-choice-hint"
    }, formUtils.localizeString(choice.hint, this.context.locale)) : void 0), choice.specify && this.props.value === choice.id ? this.renderSpecify(choice) : void 0);
  };

  RadioAnswerComponent.prototype.render = function() {
    return H.div({
      className: "touch-radio-group"
    }, _.map(this.props.choices, (function(_this) {
      return function(choice) {
        return _this.renderChoice(choice);
      };
    })(this)));
  };

  return RadioAnswerComponent;

})(React.Component);

MulticheckAnswerComponent = (function(superClass) {
  extend(MulticheckAnswerComponent, superClass);

  function MulticheckAnswerComponent() {
    this.handleSpecifyChange = bind(this.handleSpecifyChange, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    return MulticheckAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  MulticheckAnswerComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  MulticheckAnswerComponent.propTypes = {
    choices: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      label: React.PropTypes.object.isRequired,
      hint: React.PropTypes.object,
      specify: React.PropTypes.bool
    })).isRequired,
    value: React.PropTypes.arrayOf(React.PropTypes.string.isRequired),
    onValueChange: React.PropTypes.func.isRequired,
    specify: React.PropTypes.object,
    onSpecifyChange: React.PropTypes.func.isRequired
  };

  MulticheckAnswerComponent.defaultProps = {
    specify: {}
  };

  MulticheckAnswerComponent.prototype.handleValueChange = function(choice) {
    var ids, ref;
    ids = this.props.value || [];
    if (ref = choice.id, indexOf.call(ids, ref) >= 0) {
      return this.props.onValueChange(_.difference(ids, [choice.id]));
    } else {
      return this.props.onValueChange(_.union(ids, [choice.id]));
    }
  };

  MulticheckAnswerComponent.prototype.handleSpecifyChange = function(id, ev) {
    var change, specify;
    change = {};
    change[id] = ev.target.value;
    specify = _.extend({}, this.props.specify, change);
    return this.props.onSpecifyChange(specify);
  };

  MulticheckAnswerComponent.prototype.renderSpecify = function(choice) {
    return H.input({
      className: "form-control specify-input",
      type: "text",
      value: this.props.specify[choice.id],
      onChange: this.handleSpecifyChange.bind(null, choice.id)
    });
  };

  MulticheckAnswerComponent.prototype.renderChoice = function(choice) {
    var ref, selected;
    selected = _.isArray(this.props.value) && (ref = choice.id, indexOf.call(this.props.value, ref) >= 0);
    return H.div({
      key: choice.id
    }, H.div({
      className: "choice touch-checkbox " + (selected ? "checked" : ""),
      onClick: this.handleValueChange.bind(null, choice)
    }, formUtils.localizeString(choice.label, this.context.locale), choice.hint ? H.span({
      className: "checkbox-choice-hint"
    }, formUtils.localizeString(choice.hint, this.context.locale)) : void 0), choice.specify && selected ? this.renderSpecify(choice) : void 0);
  };

  MulticheckAnswerComponent.prototype.render = function() {
    return H.div(null, _.map(this.props.choices, (function(_this) {
      return function(choice) {
        return _this.renderChoice(choice);
      };
    })(this)));
  };

  return MulticheckAnswerComponent;

})(React.Component);

LocationAnswerComponent = (function(superClass) {
  extend(LocationAnswerComponent, superClass);

  function LocationAnswerComponent() {
    return LocationAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  LocationAnswerComponent.propTypes = {
    value: React.PropTypes.string,
    onValueChange: React.PropTypes.func.isRequired,
    displayMap: React.PropTypes.func
  };

  LocationAnswerComponent.prototype.handleUseMap = function() {
    if (this.props.displayMap != null) {
      return this.props.displayMap.displayMap(this.props.value, (function(_this) {
        return function(newLoc) {
          while (newLoc.longitude < -180) {
            newLoc.longitude += 360;
          }
          while (newLoc.longitude > 180) {
            newLoc.longitude -= 360;
          }
          if (newLoc.latitude > 85) {
            newLoc.latitude = 85;
          }
          if (newLoc.latitude < -85) {
            newLoc.latitude = -85;
          }
          return _this.props.onValueChange(newLoc);
        };
      })(this));
    }
  };

  LocationAnswerComponent.prototype.render = function() {
    return R(LocationEditorComponent, {
      location: this.props.value,
      onLocationChange: this.props.onValueChange,
      onUseMap: this.handleUseMap,
      T: global.T
    });
  };

  return LocationAnswerComponent;

})(React.Component);
