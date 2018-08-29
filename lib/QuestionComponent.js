'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdminRegionAnswerComponent,
    AnswerValidator,
    AquagenxCBTAnswerComponent,
    BarcodeAnswerComponent,
    CheckAnswerComponent,
    CurrentPositionFinder,
    DateAnswerComponent,
    DropdownAnswerComponent,
    EntityAnswerComponent,
    H,
    ImageAnswerComponent,
    ImagesAnswerComponent,
    LikertAnswerComponent,
    LocationAnswerComponent,
    LocationFinder,
    MatrixAnswerComponent,
    MulticheckAnswerComponent,
    NumberAnswerComponent,
    PropTypes,
    QuestionComponent,
    R,
    RadioAnswerComponent,
    React,
    SiteAnswerComponent,
    StopwatchAnswerComponent,
    TextAnswerComponent,
    TextExprsComponent,
    TextListAnswerComponent,
    UnitsAnswerComponent,
    _,
    formUtils,
    markdown,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

markdown = require("markdown").markdown;

TextExprsComponent = require('./TextExprsComponent');

LocationFinder = require('./LocationFinder');

CurrentPositionFinder = require('./legacy/CurrentPositionFinder');

AnswerValidator = require('./answers/AnswerValidator');

AdminRegionAnswerComponent = require('./answers/AdminRegionAnswerComponent');

AquagenxCBTAnswerComponent = require('./answers/AquagenxCBTAnswerComponent');

BarcodeAnswerComponent = require('./answers/BarcodeAnswerComponent');

CheckAnswerComponent = require('./answers/CheckAnswerComponent');

DateAnswerComponent = require('./answers/DateAnswerComponent');

DropdownAnswerComponent = require('./answers/DropdownAnswerComponent');

EntityAnswerComponent = require('./answers/EntityAnswerComponent');

ImageAnswerComponent = require('./answers/ImageAnswerComponent');

ImagesAnswerComponent = require('./answers/ImagesAnswerComponent');

LikertAnswerComponent = require('./answers/LikertAnswerComponent');

LocationAnswerComponent = require('./answers/LocationAnswerComponent');

MatrixAnswerComponent = require('./answers/MatrixAnswerComponent');

MulticheckAnswerComponent = require('./answers/MulticheckAnswerComponent');

NumberAnswerComponent = require('./answers/NumberAnswerComponent');

RadioAnswerComponent = require('./answers/RadioAnswerComponent');

SiteAnswerComponent = require('./answers/SiteAnswerComponent');

StopwatchAnswerComponent = require('./answers/StopwatchAnswerComponent');

TextAnswerComponent = require('./answers/TextAnswerComponent');

TextListAnswerComponent = require('./answers/TextListAnswerComponent');

UnitsAnswerComponent = require('./answers/UnitsAnswerComponent');

// Question component that displays a question of any type.
// Displays question text and hint
// Displays toggleable help 
// Displays required (*)
// Displays comments field
// Does NOT fill in when sticky and visible for first time. This is done by data cleaning
// Does NOT remove answer when invisible. This is done by data cleaning
// Does NOT check conditions and make self invisible. This is done by parent (ItemListComponent)
// Displays alternates and makes exclusive with answer
module.exports = QuestionComponent = function () {
  var QuestionComponent = function (_React$Component) {
    _inherits(QuestionComponent, _React$Component);

    function QuestionComponent(props) {
      _classCallCheck(this, QuestionComponent);

      var _this = _possibleConstructorReturn(this, (QuestionComponent.__proto__ || Object.getPrototypeOf(QuestionComponent)).call(this, props));

      _this.handleToggleHelp = _this.handleToggleHelp.bind(_this);
      _this.handleValueChange = _this.handleValueChange.bind(_this);
      // Record a position found
      _this.handleCurrentPositionFound = _this.handleCurrentPositionFound.bind(_this);
      _this.handleCurrentPositionStatus = _this.handleCurrentPositionStatus.bind(_this);
      _this.handleAnswerChange = _this.handleAnswerChange.bind(_this);
      _this.handleAlternate = _this.handleAlternate.bind(_this);
      _this.handleCommentsChange = _this.handleCommentsChange.bind(_this);
      // Either jump to next question or select the comments box
      _this.handleNextOrComments = _this.handleNextOrComments.bind(_this);
      _this.state = {
        helpVisible: false, // True to display help
        validationError: null,
        // savedValue and savedSpecify are used to save the value when selecting an alternate answer
        savedValue: null,
        savedSpecify: null
      };
      return _this;
    }

    _createClass(QuestionComponent, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.unmounted = true;
        // Stop position finder
        if (this.currentPositionFinder) {
          return this.currentPositionFinder.stop();
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var choice, i, len, newAnswer, oldAnswer, ref;
        if (this.context.locale !== nextContext.locale) {
          return true;
        }
        if (nextProps.question.textExprs != null && nextProps.question.textExprs.length > 0) {
          return true;
        }
        if (nextProps.question.choices != null) {
          ref = nextProps.question.choices;
          for (i = 0, len = ref.length; i < len; i++) {
            choice = ref[i];
            if (choice.conditions != null && choice.conditions.length > 0) {
              return true;
            }
          }
        }
        if (nextProps.question !== this.props.question) {
          return true;
        }
        oldAnswer = this.props.data[this.props.question._id];
        newAnswer = nextProps.data[this.props.question._id];
        if (newAnswer !== oldAnswer) {
          return true;
        }
        if (!_.isEqual(this.state, nextState)) {
          return true;
        }
        return false;
      }
    }, {
      key: 'focus',
      value: function focus() {
        var answer;
        answer = this.refs.answer;
        if (answer != null && answer.focus != null) {
          return answer.focus();
        }
      }
    }, {
      key: 'getAnswer',
      value: function getAnswer() {
        var answer;
        // The answer to this question
        answer = this.props.data[this.props.question._id];
        if (answer != null) {
          return answer;
        }
        return {};
      }

      // Returns true if validation error

    }, {
      key: 'validate',
      value: function validate(scrollToFirstInvalid) {
        var answerInvalid, ref, ref1, ref2, ref3, validationError;
        // If we are disabling confidential data return true
        if (this.context.disableConfidentialFields && this.props.question.confidential) {
          return false;
        }
        // If answer has custom validation, use that
        if ((ref = this.refs.answer) != null ? ref.validate : void 0) {
          answerInvalid = (ref1 = this.refs.answer) != null ? ref1.validate() : void 0;
          if (answerInvalid && scrollToFirstInvalid) {
            this.refs.prompt.scrollIntoView();
          }
          if (answerInvalid) {
            return answerInvalid;
          }
        }
        validationError = new AnswerValidator().validate(this.props.question, this.getAnswer());
        // Check for isValid function in answer component, as some answer components don't store invalid answers
        // like the number answer.
        if (!validationError && ((ref2 = this.refs.answer) != null ? ref2.isValid : void 0) && !((ref3 = this.refs.answer) != null ? ref3.isValid() : void 0)) {
          validationError = true;
        }
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
      }
    }, {
      key: 'handleToggleHelp',
      value: function handleToggleHelp() {
        boundMethodCheck(this, QuestionComponent);
        return this.setState({
          helpVisible: !this.state.helpVisible
        });
      }
    }, {
      key: 'handleValueChange',
      value: function handleValueChange(value) {
        boundMethodCheck(this, QuestionComponent);
        return this.handleAnswerChange(_.extend({}, this.getAnswer(), {
          value: value
        }, {
          alternate: null
        }));
      }
    }, {
      key: 'handleCurrentPositionFound',
      value: function handleCurrentPositionFound(loc) {
        var newAnswer;
        boundMethodCheck(this, QuestionComponent);
        if (!this.unmounted) {
          newAnswer = _.clone(this.getAnswer());
          newAnswer.location = _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy");
          return this.props.onAnswerChange(newAnswer);
        }
      }
    }, {
      key: 'handleCurrentPositionStatus',
      value: function handleCurrentPositionStatus(status) {
        boundMethodCheck(this, QuestionComponent);
        // Always record useable positions
        if (status.useable) {
          return this.handleCurrentPositionFound(status.pos);
        }
      }
    }, {
      key: 'handleAnswerChange',
      value: function handleAnswerChange(newAnswer) {
        var locationFinder, oldAnswer, readonly;
        boundMethodCheck(this, QuestionComponent);
        readonly = this.context.disableConfidentialFields && this.props.question.confidential;
        if (readonly) {
          return;
        }
        oldAnswer = this.getAnswer();
        if (this.props.question.sticky && this.context.stickyStorage != null && newAnswer.value != null) {
          // TODO: SurveyorPro: What should happen if value is set to null?
          // TODO: SurveyorPro: What should happen if alternate is set? (or anything else that didn't change the value field)
          this.context.stickyStorage.set(this.props.question._id, newAnswer.value);
        }
        if (this.props.question.recordTimestamp && oldAnswer.timestamp == null) {
          newAnswer.timestamp = new Date().toISOString();
        }
        // Record location if no answer and not already getting location
        if (this.props.question.recordLocation && oldAnswer.location == null && !this.currentPositionFinder) {
          // Create location finder
          locationFinder = this.context.locationFinder || new LocationFinder();
          // Create position finder
          this.currentPositionFinder = new CurrentPositionFinder({
            locationFinder: locationFinder
          });
          // Listen to current position events (for setting location)
          this.currentPositionFinder.on('found', this.handleCurrentPositionFound);
          this.currentPositionFinder.on('status', this.handleCurrentPositionStatus);
          this.currentPositionFinder.start();
        }
        return this.props.onAnswerChange(newAnswer);
      }
    }, {
      key: 'handleAlternate',
      value: function handleAlternate(alternate) {
        var answer;
        boundMethodCheck(this, QuestionComponent);
        answer = this.getAnswer();
        // If we are selecting a new alternate
        if (answer.alternate !== alternate) {
          // If old alternate was null (important not to do this when changing from an alternate value to another)
          if (answer.alternate == null) {
            // It saves value and specify
            this.setState({
              savedValue: answer.value,
              savedSpecify: answer.specify
            });
          }
          // Then clear value, specify and set alternate
          return this.handleAnswerChange(_.extend({}, answer, {
            value: null,
            specify: null,
            alternate: alternate
          }));
        } else {
          // Clear alternate and put back saved value and specify
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
      }
    }, {
      key: 'handleCommentsChange',
      value: function handleCommentsChange(ev) {
        boundMethodCheck(this, QuestionComponent);
        return this.handleAnswerChange(_.extend({}, this.getAnswer(), {
          comments: ev.target.value
        }));
      }
    }, {
      key: 'handleNextOrComments',
      value: function handleNextOrComments(ev) {
        var base, comments;
        boundMethodCheck(this, QuestionComponent);
        // If it has a comment box, set the focus on it
        if (this.props.question.commentsField != null) {
          comments = this.refs.comments;
          // For some reason, comments can be null here sometimes
          if (comments != null) {
            comments.focus();
          }
          return comments != null ? comments.select() : void 0;
        } else {
          // Blur the input (remove the focus)
          // Else we lose the focus and go to the next question
          ev.target.blur();
          return typeof (base = this.props).onNext === "function" ? base.onNext() : void 0;
        }
      }
    }, {
      key: 'renderPrompt',
      value: function renderPrompt() {
        var promptDiv;
        promptDiv = H.div({
          className: "prompt",
          ref: 'prompt'
        }, this.props.question.code ? H.span({
          className: "question-code"
        }, this.props.question.code + ": ") : void 0, R(TextExprsComponent, {
          localizedStr: this.props.question.text,
          exprs: this.props.question.textExprs,
          schema: this.props.schema,
          responseRow: this.props.responseRow,
          locale: this.context.locale
          // Required star
        }), this.props.question.required && !(this.context.disableConfidentialFields && this.props.question.confidential) ? H.span({
          className: "required"
        }, "*") : void 0, this.props.question.help ? H.button({
          type: "button",
          id: 'helpbtn',
          className: "btn btn-link btn-sm",
          onClick: this.handleToggleHelp
        }, H.span({
          className: "glyphicon glyphicon-question-sign"
        })) : void 0);
        // Special case!
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
      }
    }, {
      key: 'renderHint',
      value: function renderHint() {
        return H.div(null, this.props.question.hint ? H.div({
          className: "text-muted"
        }, formUtils.localizeString(this.props.question.hint, this.context.locale)) : void 0, this.context.disableConfidentialFields && this.props.question.confidential ? H.div({
          className: "text-muted"
        }, this.context.T("Confidential answers may not be edited.")) : void 0);
      }
    }, {
      key: 'renderHelp',
      value: function renderHelp() {
        if (this.state.helpVisible && this.props.question.help) {
          return H.div({
            className: "help well well-sm",
            dangerouslySetInnerHTML: {
              __html: markdown.toHTML(formUtils.localizeString(this.props.question.help, this.context.locale))
            }
          });
        }
      }
    }, {
      key: 'renderValidationError',
      value: function renderValidationError() {
        if (this.state.validationError != null && typeof this.state.validationError === "string") {
          return H.div({
            className: "validation-message text-danger"
          }, this.state.validationError);
        }
      }
    }, {
      key: 'renderAlternates',
      value: function renderAlternates() {
        if (this.props.question.alternates && (this.props.question.alternates.na || this.props.question.alternates.dontknow)) {
          return H.div(null, this.props.question.alternates.dontknow ? H.div({
            id: 'dn',
            className: 'touch-checkbox alternate ' + (this.getAnswer().alternate === 'dontknow' ? 'checked' : void 0),
            onClick: this.handleAlternate.bind(null, 'dontknow')
          }, this.context.T("Don't Know")) : void 0, this.props.question.alternates.na ? H.div({
            id: 'na',
            className: 'touch-checkbox alternate ' + (this.getAnswer().alternate === 'na' ? 'checked' : void 0),
            onClick: this.handleAlternate.bind(null, 'na')
          }, this.context.T("Not Applicable")) : void 0);
        }
      }
    }, {
      key: 'renderCommentsField',
      value: function renderCommentsField() {
        if (this.props.question.commentsField) {
          return H.textarea({
            className: "form-control question-comments",
            id: "comments",
            ref: "comments",
            placeholder: this.context.T("Comments"),
            value: this.getAnswer().comments,
            onChange: this.handleCommentsChange
          });
        }
      }
    }, {
      key: 'renderAnswer',
      value: function renderAnswer() {
        var answer, readonly;
        answer = this.getAnswer();
        readonly = this.context.disableConfidentialFields && this.props.question.confidential;
        switch (this.props.question._type) {
          case "TextQuestion":
            return R(TextAnswerComponent, {
              ref: "answer",
              value: answer.value,
              format: this.props.question.format,
              readOnly: readonly,
              onValueChange: this.handleValueChange,
              onNextOrComments: this.handleNextOrComments
            });
          case "NumberQuestion":
            return R(NumberAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onChange: !readonly ? this.handleValueChange : void 0,
              decimal: this.props.question.decimal,
              onNextOrComments: this.handleNextOrComments
            });
          case "DropdownQuestion":
            return R(DropdownAnswerComponent, {
              ref: "answer",
              choices: this.props.question.choices,
              answer: answer,
              data: this.props.data,
              onAnswerChange: this.handleAnswerChange
            });
          case "LikertQuestion":
            return R(LikertAnswerComponent, {
              ref: "answer",
              items: this.props.question.items,
              choices: this.props.question.choices,
              answer: answer,
              data: this.props.data,
              onAnswerChange: this.handleAnswerChange
            });
          case "RadioQuestion":
            return R(RadioAnswerComponent, {
              ref: "answer",
              choices: this.props.question.choices,
              answer: answer,
              data: this.props.data,
              onAnswerChange: this.handleAnswerChange
            });
          case "MulticheckQuestion":
            return R(MulticheckAnswerComponent, {
              ref: "answer",
              choices: this.props.question.choices,
              data: this.props.data,
              answer: answer,
              onAnswerChange: this.handleAnswerChange
            });
          case "DateQuestion":
            return R(DateAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onValueChange: this.handleValueChange,
              format: this.props.question.format,
              placeholder: this.props.question.placeholder,
              onNextOrComments: this.handleNextOrComments
            });
          case "UnitsQuestion":
            return R(UnitsAnswerComponent, {
              ref: "answer",
              answer: answer,
              onValueChange: this.handleValueChange,
              units: this.props.question.units,
              defaultUnits: this.props.question.defaultUnits,
              prefix: this.props.question.unitsPosition === 'prefix',
              decimal: this.props.question.decimal,
              onNextOrComments: this.handleNextOrComments
            });
          case "CheckQuestion":
            // Look at renderPrompt special case
            return null;
          case "LocationQuestion":
            return R(LocationAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onValueChange: this.handleValueChange
            });
          case "ImageQuestion":
            return R(ImageAnswerComponent, {
              ref: "answer",
              image: answer.value,
              onImageChange: this.handleValueChange,
              consentPrompt: this.props.question.consentPrompt ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale) : void 0
            });
          case "ImagesQuestion":
            return R(ImagesAnswerComponent, {
              ref: "answer",
              imagelist: answer.value,
              onImagelistChange: this.handleValueChange,
              consentPrompt: this.props.question.consentPrompt ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale) : void 0
            });
          case "TextListQuestion":
            return R(TextListAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onValueChange: this.handleValueChange,
              onNextOrComments: this.handleNextOrComments
            });
          case "SiteQuestion":
            return R(SiteAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onValueChange: this.handleValueChange,
              siteTypes: this.props.question.siteTypes,
              T: this.context.T
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
          case "StopwatchQuestion":
            return R(StopwatchAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onValueChange: this.handleValueChange,
              T: this.context.T
            });
          case "MatrixQuestion":
            return R(MatrixAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onValueChange: this.handleValueChange,
              alternate: answer.alternate,
              items: this.props.question.items,
              columns: this.props.question.columns,
              data: this.props.data,
              responseRow: this.props.responseRow,
              schema: this.props.schema
            });
          case "AquagenxCBTQuestion":
            return R(AquagenxCBTAnswerComponent, {
              ref: "answer",
              value: answer.value,
              onValueChange: this.handleValueChange,
              questionId: this.props.question._id
            });
          default:
            return 'Unknown type ' + this.props.question._type;
        }
        return null;
      }
    }, {
      key: 'render',
      value: function render() {
        var className;
        // Create classname to include invalid if invalid
        className = "question";
        if (this.state.validationError != null) {
          className += " invalid";
        }
        return H.div({
          className: className
        }, this.renderPrompt(), this.renderHint(), this.renderHelp(), H.div({
          className: "answer"
        }, this.renderAnswer()), this.renderAlternates(), this.renderValidationError(), this.renderCommentsField());
      }
    }]);

    return QuestionComponent;
  }(React.Component);

  ;

  QuestionComponent.contextTypes = {
    locale: PropTypes.string,
    stickyStorage: PropTypes.object, // Storage for sticky values
    locationFinder: PropTypes.object,
    T: PropTypes.func.isRequired, // Localizer to use
    disableConfidentialFields: PropTypes.bool
  };

  QuestionComponent.propTypes = {
    question: PropTypes.object.isRequired, // Design of question. See schema
    data: PropTypes.object, // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object, // ResponseRow object (for roster entry if in roster)
    onAnswerChange: PropTypes.func.isRequired,
    displayMissingRequired: PropTypes.bool,
    onNext: PropTypes.func,
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  return QuestionComponent;
}.call(undefined);