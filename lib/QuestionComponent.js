var AdminRegionAnswerComponent, AnswerValidator, BarcodeAnswerComponent, CheckAnswerComponent, DateAnswerComponent, DropdownAnswerComponent, EntityAnswerComponent, H, ImageAnswerComponent, ImagesAnswerComponent, LocationAnswerComponent, LocationEditorComponent, LocationFinder, MulticheckAnswerComponent, NumberAnswerComponent, QuestionComponent, R, RadioAnswerComponent, React, SiteAnswerComponent, TextAnswerComponent, TextListAnswerComponent, UnitsAnswerComponent, _, formUtils, markdown,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

markdown = require("markdown").markdown;

LocationEditorComponent = require('./LocationEditorComponent');

LocationFinder = require('./LocationFinder');

AnswerValidator = require('./answers/AnswerValidator');

AdminRegionAnswerComponent = require('./answers/AdminRegionAnswerComponent');

BarcodeAnswerComponent = require('./answers/BarcodeAnswerComponent');

CheckAnswerComponent = require('./answers/CheckAnswerComponent');

DateAnswerComponent = require('./answers/DateAnswerComponent');

DropdownAnswerComponent = require('./answers/DropdownAnswerComponent');

EntityAnswerComponent = require('./answers/EntityAnswerComponent');

ImageAnswerComponent = require('./answers/ImageAnswerComponent');

ImagesAnswerComponent = require('./answers/ImagesAnswerComponent');

LocationAnswerComponent = require('./answers/LocationAnswerComponent');

MulticheckAnswerComponent = require('./answers/MulticheckAnswerComponent');

NumberAnswerComponent = require('./answers/NumberAnswerComponent');

RadioAnswerComponent = require('./answers/RadioAnswerComponent');

SiteAnswerComponent = require('./answers/SiteAnswerComponent');

TextAnswerComponent = require('./answers/TextAnswerComponent');

TextListAnswerComponent = require('./answers/TextListAnswerComponent');

UnitsAnswerComponent = require('./answers/UnitsAnswerComponent');

module.exports = QuestionComponent = (function(superClass) {
  extend(QuestionComponent, superClass);

  QuestionComponent.contextTypes = {
    locale: React.PropTypes.string,
    stickyStorage: React.PropTypes.object,
    locationFinder: React.PropTypes.object
  };

  QuestionComponent.propTypes = {
    question: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    answer: React.PropTypes.object,
    onAnswerChange: React.PropTypes.func.isRequired,
    displayMissingRequired: React.PropTypes.bool,
    onNext: React.PropTypes.func
  };

  QuestionComponent.defaultProps = {
    answer: {}
  };

  function QuestionComponent() {
    this.handleNextOrComments = bind(this.handleNextOrComments, this);
    this.handleCommentsChange = bind(this.handleCommentsChange, this);
    this.handleAlternate = bind(this.handleAlternate, this);
    this.handleAnswerChange = bind(this.handleAnswerChange, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    this.handleToggleHelp = bind(this.handleToggleHelp, this);
    QuestionComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      helpVisible: false,
      validationError: null,
      savedValue: null,
      savedSpecify: null
    };
  }

  QuestionComponent.prototype.focus = function() {
    var answer;
    answer = this.refs.answer;
    if ((answer != null) && (answer.focus != null)) {
      return answer.focus();
    }
  };

  QuestionComponent.prototype.scrollToInvalid = function(scrollToFirstInvalid) {
    var validationError;
    validationError = new AnswerValidator().validate(this.props.question, this.props.answer);
    if (validationError != null) {
      if (scrollToFirstInvalid) {
        this.refs.prompt.scrollIntoView();
      }
      this.setState({
        validationError: validationError
      });
      return true;
    } else {
      this.setState({
        validationError: null
      });
      return false;
    }
  };

  QuestionComponent.prototype.handleToggleHelp = function() {
    return this.setState({
      helpVisible: !this.state.helpVisible
    });
  };

  QuestionComponent.prototype.handleValueChange = function(value) {
    return this.handleAnswerChange(_.extend({}, this.props.answer, {
      value: value
    }, {
      alternate: null
    }));
  };

  QuestionComponent.prototype.handleAnswerChange = function(answer) {
    var locationFinder;
    if (this.props.question.sticky && (this.context.stickyStorage != null) && (answer.value != null)) {
      this.context.stickyStorage.set(this.props.question._id, answer.value);
    }
    if (this.props.question.recordTimestamp && (this.props.answer.timestamp == null)) {
      answer.timestamp = new Date().toISOString();
    }
    if (this.props.question.recordLocation && (this.props.answer.location == null)) {
      locationFinder = this.context.locationFinder || new LocationFinder();
      locationFinder.getLocation((function(_this) {
        return function(loc) {
          var newAnswer;
          if (loc != null) {
            newAnswer = _.clone(_this.props.answer);
            newAnswer.location = _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy");
            return _this.props.onAnswerChange(newAnswer);
          }
        };
      })(this), function() {
        return console.log("Location not found for recordLocation in Question");
      });
    }
    return this.props.onAnswerChange(answer);
  };

  QuestionComponent.prototype.handleAlternate = function(alternate) {
    if (this.props.answer.alternate !== alternate) {
      if (this.props.answer.alternate == null) {
        this.setState({
          savedValue: _.clone(this.props.answer.value, {
            savedSpecify: _.clone(this.props.answer.specify)
          })
        });
      }
      return this.handleAnswerChange(_.extend({}, this.props.answer, {
        value: null,
        specify: null,
        alternate: alternate
      }));
    } else {
      this.handleAnswerChange(_.extend({}, this.props.answer, {
        value: this.state.savedValue,
        specify: this.state.savedSpecify,
        alternate: null
      }));
      return this.setState({
        savedValue: null,
        savedSpecify: null
      });
    }
  };

  QuestionComponent.prototype.handleCommentsChange = function(ev) {
    return this.handleAnswerChange(_.extend({}, this.props.answer, {
      comments: ev.target.value
    }));
  };

  QuestionComponent.prototype.handleNextOrComments = function(ev) {
    var base, comments;
    if (this.props.question.commentsField != null) {
      comments = this.refs.comments;
      comments.focus();
      return comments.select();
    } else {
      ev.target.blur();
      return typeof (base = this.props).onNext === "function" ? base.onNext() : void 0;
    }
  };

  QuestionComponent.prototype.renderPrompt = function() {
    var prompt, promptDiv;
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
    promptDiv = H.div({
      className: "prompt",
      ref: 'prompt'
    }, this.props.question.code ? H.span({
      className: "question-code"
    }, this.props.question.code + ": ") : void 0, prompt, this.props.question.required ? H.span({
      className: "required"
    }, "*") : void 0, this.props.question.help ? H.button({
      type: "button",
      id: 'helpbtn',
      className: "btn btn-link btn-sm",
      onClick: this.handleToggleHelp
    }, H.span({
      className: "glyphicon glyphicon-question-sign"
    })) : void 0);
    if (this.props.question._type === 'CheckQuestion') {
      return R(CheckAnswerComponent, {
        ref: "answer",
        value: this.props.answer.value,
        onValueChange: this.handleValueChange,
        label: this.props.question.label
      }, promptDiv);
    } else {
      return promptDiv;
    }
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

  QuestionComponent.prototype.renderValidationError = function() {
    if ((this.state.validationError != null) && typeof this.state.validationError === "string") {
      return H.div({
        className: "validation-message text-danger"
      }, this.state.validationError);
    }
  };

  QuestionComponent.prototype.renderAlternates = function() {
    if (this.props.question.alternates && (this.props.question.alternates.na || this.props.question.alternates.dontknow)) {
      return H.div(null, this.props.question.alternates.dontknow ? H.div({
        id: 'dn',
        className: "touch-checkbox alternate " + (this.props.answer.alternate === 'dontknow' ? 'checked' : void 0),
        onClick: this.handleAlternate.bind(null, 'dontknow')
      }, T("Don't Know")) : void 0, this.props.question.alternates.na ? H.div({
        id: 'na',
        className: "touch-checkbox alternate " + (this.props.answer.alternate === 'na' ? 'checked' : void 0),
        onClick: this.handleAlternate.bind(null, 'na')
      }, T("Not Applicable")) : void 0);
    }
  };

  QuestionComponent.prototype.renderCommentsField = function() {
    if (this.props.question.commentsField) {
      return H.textarea({
        className: "form-control question-comments",
        id: "comments",
        ref: "comments",
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
          ref: "answer",
          value: this.props.answer.value,
          format: this.props.question.format,
          onValueChange: this.handleValueChange,
          onNextOrComments: this.handleNextOrComments
        });
      case "NumberQuestion":
        return R(NumberAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          onChange: this.handleValueChange,
          decimal: this.props.question.decimal
        });
      case "DropdownQuestion":
        return R(DropdownAnswerComponent, {
          ref: "answer",
          choices: this.props.question.choices,
          answer: this.props.answer,
          onAnswerChange: this.handleAnswerChange
        });
      case "RadioQuestion":
        return R(RadioAnswerComponent, {
          ref: "answer",
          choices: this.props.question.choices,
          answer: this.props.answer,
          onAnswerChange: this.handleAnswerChange
        });
      case "MulticheckQuestion":
        return R(MulticheckAnswerComponent, {
          ref: "answer",
          choices: this.props.question.choices,
          answer: this.props.answer,
          onAnswerChange: this.handleAnswerChange
        });
      case "DateQuestion":
        return R(DateAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          onValueChange: this.handleValueChange,
          format: this.props.question.format,
          placeholder: this.props.question.placeholder
        });
      case "UnitsQuestion":
        return R(UnitsAnswerComponent, {
          ref: "answer",
          answer: this.props.answer,
          onValueChange: this.handleValueChange,
          units: this.props.question.units,
          defaultUnits: this.props.question.defaultUnits,
          prefix: this.props.question.unitsPosition === 'prefix',
          decimal: this.props.question.decimal
        });
      case "CheckQuestion":
        return null;
      case "LocationQuestion":
        return R(LocationAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          onValueChange: this.handleValueChange
        });
      case "ImageQuestion":
        return R(ImageAnswerComponent, {
          image: this.props.answer.value,
          onImageChange: this.handleValueChange
        });
      case "ImagesQuestion":
        return R(ImagesAnswerComponent, {
          ref: "answer",
          imagelist: this.props.answer.value,
          onImagelistChange: this.handleValueChange
        });
      case "TextListQuestion":
        return R(TextListAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          onValueChange: this.handleValueChange
        });
      case "SiteQuestion":
        return R(SiteAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          onValueChange: this.handleValueChange
        });
      case "BarcodeQuestion":
        return R(BarcodeAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          onValueChange: this.handleValueChange
        });
      case "EntityQuestion":
        return R(EntityAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          entityType: this.props.question.entityType,
          onValueChange: this.handleValueChange
        });
      case "AdminRegionQuestion":
        return R(AdminRegionAnswerComponent, {
          ref: "answer",
          value: this.props.answer.value,
          onChange: this.handleValueChange
        });
      default:
        return "Unknown type " + this.props.question._type;
    }
    return null;
  };

  QuestionComponent.prototype.render = function() {
    var className;
    className = "question";
    if (this.state.validationError != null) {
      className += " invalid";
    }
    return H.div({
      className: className
    }, this.renderPrompt(), this.renderHint(), this.renderHelp(), H.div({
      className: "answer"
    }, this.renderAnswer()), this.renderAlternates(), this.renderValidationError(), this.renderCommentsField());
  };

  return QuestionComponent;

})(React.Component);
