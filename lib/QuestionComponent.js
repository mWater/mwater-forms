var AdminRegionAnswerComponent, AnswerValidator, BarcodeAnswerComponent, CheckAnswerComponent, DateAnswerComponent, DropdownAnswerComponent, EntityAnswerComponent, FormExprEvaluator, H, ImageAnswerComponent, ImagesAnswerComponent, LocationAnswerComponent, LocationFinder, MulticheckAnswerComponent, NumberAnswerComponent, QuestionComponent, R, RadioAnswerComponent, React, SiteAnswerComponent, TextAnswerComponent, TextListAnswerComponent, UnitsAnswerComponent, _, formUtils, markdown,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

markdown = require("markdown").markdown;

FormExprEvaluator = require('./FormExprEvaluator');

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
    onAnswerChange: React.PropTypes.func.isRequired,
    displayMissingRequired: React.PropTypes.bool,
    onNext: React.PropTypes.func,
    formExprEvaluator: React.PropTypes.object.isRequired
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

  QuestionComponent.prototype.getAnswer = function() {
    var answer;
    answer = this.props.data[this.props.question._id];
    if (answer != null) {
      return answer;
    }
    return {};
  };

  QuestionComponent.prototype.validate = function(scrollToFirstInvalid) {
    var validationError;
    validationError = new AnswerValidator().validate(this.props.question, this.getAnswer());
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
    return this.handleAnswerChange(_.extend({}, this.getAnswer(), {
      value: value
    }, {
      alternate: null
    }));
  };

  QuestionComponent.prototype.handleAnswerChange = function(newAnswer) {
    var locationFinder, oldAnswer;
    oldAnswer = this.getAnswer();
    if (this.props.question.sticky && (this.context.stickyStorage != null) && (newAnswer.value != null)) {
      this.context.stickyStorage.set(this.props.question._id, newAnswer.value);
    }
    if (this.props.question.recordTimestamp && (oldAnswer.timestamp == null)) {
      newAnswer.timestamp = new Date().toISOString();
    }
    if (this.props.question.recordLocation && (oldAnswer.location == null)) {
      locationFinder = this.context.locationFinder || new LocationFinder();
      locationFinder.getLocation((function(_this) {
        return function(loc) {
          if (loc != null) {
            newAnswer = _.clone(oldAnswer);
            newAnswer.location = _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy");
            return _this.props.onAnswerChange(newAnswer);
          }
        };
      })(this), function() {
        return console.log("Location not found for recordLocation in Question");
      });
    }
    return this.props.onAnswerChange(newAnswer);
  };

  QuestionComponent.prototype.handleAlternate = function(alternate) {
    var answer;
    answer = this.getAnswer();
    if (answer.alternate !== alternate) {
      if (answer.alternate == null) {
        this.setState({
          savedValue: _.clone(answer.value, {
            savedSpecify: _.clone(answer.specify)
          })
        });
      }
      return this.handleAnswerChange(_.extend({}, answer, {
        value: null,
        specify: null,
        alternate: alternate
      }));
    } else {
      this.handleAnswerChange(_.extend({}, answer, {
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
    return this.handleAnswerChange(_.extend({}, this.getAnswer(), {
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
    var promptDiv;
    promptDiv = H.div({
      className: "prompt",
      ref: 'prompt'
    }, this.props.question.code ? H.span({
      className: "question-code"
    }, this.props.question.code + ": ") : void 0, this.props.formExprEvaluator.renderString(this.props.question.text, this.props.question.textExprs, this.props.data, this.context.locale), this.props.question.required ? H.span({
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
        value: this.getAnswer().value,
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
        className: "touch-checkbox alternate " + (this.getAnswer().alternate === 'dontknow' ? 'checked' : void 0),
        onClick: this.handleAlternate.bind(null, 'dontknow')
      }, T("Don't Know")) : void 0, this.props.question.alternates.na ? H.div({
        id: 'na',
        className: "touch-checkbox alternate " + (this.getAnswer().alternate === 'na' ? 'checked' : void 0),
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
        value: this.getAnswer().comments,
        onChange: this.handleCommentsChange
      });
    }
  };

  QuestionComponent.prototype.renderAnswer = function() {
    var answer;
    answer = this.getAnswer();
    switch (this.props.question._type) {
      case "TextQuestion":
        return R(TextAnswerComponent, {
          ref: "answer",
          value: answer.value,
          format: this.props.question.format,
          onValueChange: this.handleValueChange,
          onNextOrComments: this.handleNextOrComments
        });
      case "NumberQuestion":
        return R(NumberAnswerComponent, {
          ref: "answer",
          value: answer.value,
          onChange: this.handleValueChange,
          decimal: this.props.question.decimal
        });
      case "DropdownQuestion":
        return R(DropdownAnswerComponent, {
          ref: "answer",
          choices: this.props.question.choices,
          answer: answer,
          onAnswerChange: this.handleAnswerChange
        });
      case "RadioQuestion":
        return R(RadioAnswerComponent, {
          ref: "answer",
          choices: this.props.question.choices,
          answer: answer,
          onAnswerChange: this.handleAnswerChange
        });
      case "MulticheckQuestion":
        return R(MulticheckAnswerComponent, {
          ref: "answer",
          choices: this.props.question.choices,
          answer: answer,
          onAnswerChange: this.handleAnswerChange
        });
      case "DateQuestion":
        return R(DateAnswerComponent, {
          ref: "answer",
          value: answer.value,
          onValueChange: this.handleValueChange,
          format: this.props.question.format,
          placeholder: this.props.question.placeholder
        });
      case "UnitsQuestion":
        return R(UnitsAnswerComponent, {
          ref: "answer",
          answer: answer,
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
          value: answer.value,
          onValueChange: this.handleValueChange
        });
      case "ImageQuestion":
        return R(ImageAnswerComponent, {
          image: answer.value,
          onImageChange: this.handleValueChange
        });
      case "ImagesQuestion":
        return R(ImagesAnswerComponent, {
          ref: "answer",
          imagelist: answer.value,
          onImagelistChange: this.handleValueChange
        });
      case "TextListQuestion":
        return R(TextListAnswerComponent, {
          ref: "answer",
          value: answer.value,
          onValueChange: this.handleValueChange
        });
      case "SiteQuestion":
        return R(SiteAnswerComponent, {
          ref: "answer",
          value: answer.value,
          onValueChange: this.handleValueChange
        });
      case "BarcodeQuestion":
        return R(BarcodeAnswerComponent, {
          ref: "answer",
          value: answer.value,
          onValueChange: this.handleValueChange
        });
      case "EntityQuestion":
        return R(EntityAnswerComponent, {
          ref: "answer",
          value: answer.value,
          entityType: this.props.question.entityType,
          onValueChange: this.handleValueChange
        });
      case "AdminRegionQuestion":
        return R(AdminRegionAnswerComponent, {
          ref: "answer",
          value: answer.value,
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
