"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var AdminRegionAnswerComponent,
    AnswerValidator,
    AquagenxCBTAnswerComponent,
    BarcodeAnswerComponent,
    CascadingListAnswerComponent,
    CheckAnswerComponent,
    CurrentPositionFinder,
    DateAnswerComponent,
    DropdownAnswerComponent,
    EntityAnswerComponent,
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
R = React.createElement;
formUtils = require('./formUtils');
markdown = require("markdown").markdown;
TextExprsComponent = require('./TextExprsComponent');
LocationFinder = require('./LocationFinder');
CurrentPositionFinder = require('./CurrentPositionFinder')["default"];
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
CascadingListAnswerComponent = require('./answers/CascadingListAnswerComponent').CascadingListAnswerComponent; // Question component that displays a question of any type.
// Displays question text and hint
// Displays toggleable help 
// Displays required (*)
// Displays comments field
// Does NOT fill in when sticky and visible for first time. This is done by data cleaning
// Does NOT remove answer when invisible. This is done by data cleaning
// Does NOT check conditions and make self invisible. This is done by parent (ItemListComponent)
// Displays alternates and makes exclusive with answer

module.exports = QuestionComponent = function () {
  var QuestionComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(QuestionComponent, _React$Component);

    function QuestionComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, QuestionComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(QuestionComponent).call(this, props));
      _this.handleToggleHelp = _this.handleToggleHelp.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleValueChange = _this.handleValueChange.bind((0, _assertThisInitialized2["default"])(_this)); // Record a position found

      _this.handleCurrentPositionFound = _this.handleCurrentPositionFound.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleCurrentPositionStatus = _this.handleCurrentPositionStatus.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleAnswerChange = _this.handleAnswerChange.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleAlternate = _this.handleAlternate.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleCommentsChange = _this.handleCommentsChange.bind((0, _assertThisInitialized2["default"])(_this)); // Either jump to next question or select the comments box

      _this.handleNextOrComments = _this.handleNextOrComments.bind((0, _assertThisInitialized2["default"])(_this));
      _this.state = {
        helpVisible: false,
        // True to display help
        validationError: null,
        // savedValue and savedSpecify are used to save the value when selecting an alternate answer
        savedValue: null,
        savedSpecify: null
      };
      return _this;
    }

    (0, _createClass2["default"])(QuestionComponent, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.unmounted = true; // Stop position finder

        if (this.currentPositionFinder) {
          return this.currentPositionFinder.stop();
        }
      }
    }, {
      key: "shouldComponentUpdate",
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
      key: "focus",
      value: function focus() {
        var answer;
        answer = this.answer;

        if (answer != null && answer.focus != null) {
          return answer.focus();
        }
      }
    }, {
      key: "getAnswer",
      value: function getAnswer() {
        var answer; // The answer to this question

        answer = this.props.data[this.props.question._id];

        if (answer != null) {
          return answer;
        }

        return {};
      } // Returns true if validation error

    }, {
      key: "validate",
      value: function validate(scrollToFirstInvalid) {
        var answerInvalid, ref, ref1, ref2, ref3, validationError;
        return _regenerator["default"].async(function validate$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.context.disableConfidentialFields && this.props.question.confidential)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", false);

              case 2:
                if (!((ref = this.answer) != null ? ref.validate : void 0)) {
                  _context.next = 8;
                  break;
                }

                answerInvalid = (ref1 = this.answer) != null ? ref1.validate() : void 0;

                if (answerInvalid && scrollToFirstInvalid) {
                  this.prompt.scrollIntoView();
                }

                if (!answerInvalid) {
                  _context.next = 8;
                  break;
                }

                this.setState({
                  validationError: answerInvalid
                });
                return _context.abrupt("return", answerInvalid);

              case 8:
                _context.next = 10;
                return _regenerator["default"].awrap(new AnswerValidator(this.props.schema, this.props.responseRow).validate(this.props.question, this.getAnswer()));

              case 10:
                validationError = _context.sent;

                // Check for isValid function in answer component, as some answer components don't store invalid answers
                // like the number answer.
                if (!validationError && ((ref2 = this.answer) != null ? ref2.isValid : void 0) && !((ref3 = this.answer) != null ? ref3.isValid() : void 0)) {
                  validationError = true;
                }

                if (!(validationError != null)) {
                  _context.next = 18;
                  break;
                }

                if (scrollToFirstInvalid) {
                  this.prompt.scrollIntoView();
                }

                this.setState({
                  validationError: validationError
                });
                return _context.abrupt("return", true);

              case 18:
                this.setState({
                  validationError: null
                });
                return _context.abrupt("return", false);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, null, this);
      }
    }, {
      key: "handleToggleHelp",
      value: function handleToggleHelp() {
        boundMethodCheck(this, QuestionComponent);
        return this.setState({
          helpVisible: !this.state.helpVisible
        });
      }
    }, {
      key: "handleValueChange",
      value: function handleValueChange(value) {
        boundMethodCheck(this, QuestionComponent);
        return this.handleAnswerChange(_.extend({}, this.getAnswer(), {
          value: value
        }, {
          alternate: null
        }));
      }
    }, {
      key: "handleCurrentPositionFound",
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
      key: "handleCurrentPositionStatus",
      value: function handleCurrentPositionStatus(status) {
        boundMethodCheck(this, QuestionComponent); // Always record useable positions

        if (status.useable) {
          return this.handleCurrentPositionFound(status.pos);
        }
      }
    }, {
      key: "handleAnswerChange",
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
        } // Record location if no answer and not already getting location


        if (this.props.question.recordLocation && oldAnswer.location == null && !this.currentPositionFinder) {
          // Create location finder
          locationFinder = this.context.locationFinder || new LocationFinder(); // Create position finder

          this.currentPositionFinder = new CurrentPositionFinder({
            locationFinder: locationFinder
          }); // Listen to current position events (for setting location)

          this.currentPositionFinder.on('found', this.handleCurrentPositionFound);
          this.currentPositionFinder.on('status', this.handleCurrentPositionStatus);
          this.currentPositionFinder.start();
        }

        return this.props.onAnswerChange(newAnswer);
      }
    }, {
      key: "handleAlternate",
      value: function handleAlternate(alternate) {
        var answer;
        boundMethodCheck(this, QuestionComponent);
        answer = this.getAnswer(); // If we are selecting a new alternate

        if (answer.alternate !== alternate) {
          // If old alternate was null (important not to do this when changing from an alternate value to another)
          if (answer.alternate == null) {
            // It saves value and specify
            this.setState({
              savedValue: answer.value,
              savedSpecify: answer.specify
            });
          } // Then clear value, specify and set alternate


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
      key: "handleCommentsChange",
      value: function handleCommentsChange(ev) {
        boundMethodCheck(this, QuestionComponent);
        return this.handleAnswerChange(_.extend({}, this.getAnswer(), {
          comments: ev.target.value
        }));
      }
    }, {
      key: "handleNextOrComments",
      value: function handleNextOrComments(ev) {
        var base, comments;
        boundMethodCheck(this, QuestionComponent); // If it has a comment box, set the focus on it

        if (this.props.question.commentsField != null) {
          comments = this.comments; // For some reason, comments can be null here sometimes

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
      key: "renderPrompt",
      value: function renderPrompt() {
        var _this2 = this;

        var promptDiv;
        promptDiv = R('div', {
          className: "prompt",
          ref: function ref(c) {
            return _this2.prompt = c;
          }
        }, this.props.question.code ? R('span', {
          className: "question-code"
        }, this.props.question.code + ": ") : void 0, R(TextExprsComponent, {
          localizedStr: this.props.question.text,
          exprs: this.props.question.textExprs,
          schema: this.props.schema,
          responseRow: this.props.responseRow,
          locale: this.context.locale // Required star

        }), this.props.question.required && !(this.context.disableConfidentialFields && this.props.question.confidential) ? R('span', {
          className: "required"
        }, "*") : void 0, this.props.question.help ? R('button', {
          type: "button",
          id: 'helpbtn',
          className: "btn btn-link btn-sm",
          onClick: this.handleToggleHelp
        }, R('span', {
          className: "glyphicon glyphicon-question-sign"
        })) : void 0); // Special case!

        if (this.props.question._type === 'CheckQuestion') {
          return R(CheckAnswerComponent, {
            ref: function ref(c) {
              return _this2.answer = c;
            },
            value: this.getAnswer().value,
            onValueChange: this.handleValueChange,
            label: this.props.question.label
          }, promptDiv);
        } else {
          return promptDiv;
        }
      }
    }, {
      key: "renderHint",
      value: function renderHint() {
        return R('div', null, this.props.question.hint ? R('div', {
          className: "text-muted"
        }, formUtils.localizeString(this.props.question.hint, this.context.locale)) : void 0, this.context.disableConfidentialFields && this.props.question.confidential ? R('div', {
          className: "text-muted"
        }, this.context.T("Confidential answers may not be edited.")) : void 0);
      }
    }, {
      key: "renderHelp",
      value: function renderHelp() {
        if (this.state.helpVisible && this.props.question.help) {
          return R('div', {
            className: "help well well-sm",
            dangerouslySetInnerHTML: {
              __html: markdown.toHTML(formUtils.localizeString(this.props.question.help, this.context.locale))
            }
          });
        }
      }
    }, {
      key: "renderValidationError",
      value: function renderValidationError() {
        if (this.state.validationError != null && typeof this.state.validationError === "string") {
          return R('div', {
            className: "validation-message text-danger"
          }, this.state.validationError);
        }
      }
    }, {
      key: "renderAlternates",
      value: function renderAlternates() {
        if (this.props.question.alternates && (this.props.question.alternates.na || this.props.question.alternates.dontknow)) {
          return R('div', null, this.props.question.alternates.dontknow ? R('div', {
            id: 'dn',
            className: "touch-checkbox alternate ".concat(this.getAnswer().alternate === 'dontknow' ? 'checked' : void 0),
            onClick: this.handleAlternate.bind(null, 'dontknow')
          }, this.context.T("Don't Know")) : void 0, this.props.question.alternates.na ? R('div', {
            id: 'na',
            className: "touch-checkbox alternate ".concat(this.getAnswer().alternate === 'na' ? 'checked' : void 0),
            onClick: this.handleAlternate.bind(null, 'na')
          }, this.context.T("Not Applicable")) : void 0);
        }
      }
    }, {
      key: "renderCommentsField",
      value: function renderCommentsField() {
        var _this3 = this;

        if (this.props.question.commentsField) {
          return R('textarea', {
            className: "form-control question-comments",
            id: "comments",
            ref: function ref(c) {
              return _this3.comments = c;
            },
            placeholder: this.context.T("Comments"),
            value: this.getAnswer().comments,
            onChange: this.handleCommentsChange
          });
        }
      }
    }, {
      key: "renderAnswer",
      value: function renderAnswer() {
        var _this4 = this;

        var answer, readonly;
        answer = this.getAnswer();
        readonly = this.context.disableConfidentialFields && this.props.question.confidential || (answer != null ? answer.confidential : void 0) != null;

        switch (this.props.question._type) {
          case "TextQuestion":
            return R(TextAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              format: this.props.question.format,
              readOnly: readonly,
              onValueChange: this.handleValueChange,
              onNextOrComments: this.handleNextOrComments
            });

          case "NumberQuestion":
            return R(NumberAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onChange: !readonly ? this.handleValueChange : void 0,
              decimal: this.props.question.decimal,
              onNextOrComments: this.handleNextOrComments
            });

          case "DropdownQuestion":
            return R(DropdownAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              choices: this.props.question.choices,
              answer: answer,
              data: this.props.data,
              onAnswerChange: this.handleAnswerChange
            });

          case "LikertQuestion":
            return R(LikertAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              items: this.props.question.items,
              choices: this.props.question.choices,
              answer: answer,
              data: this.props.data,
              onAnswerChange: this.handleAnswerChange
            });

          case "RadioQuestion":
            return R(RadioAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              choices: this.props.question.choices,
              answer: answer,
              data: this.props.data,
              onAnswerChange: this.handleAnswerChange
            });

          case "MulticheckQuestion":
            return R(MulticheckAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              choices: this.props.question.choices,
              data: this.props.data,
              answer: answer,
              onAnswerChange: this.handleAnswerChange
            });

          case "DateQuestion":
            return R(DateAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange,
              format: this.props.question.format,
              placeholder: this.props.question.placeholder,
              onNextOrComments: this.handleNextOrComments
            });

          case "UnitsQuestion":
            return R(UnitsAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
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
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange
            });

          case "ImageQuestion":
            return R(ImageAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              image: answer.value,
              onImageChange: this.handleValueChange,
              consentPrompt: this.props.question.consentPrompt ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale) : void 0
            });

          case "ImagesQuestion":
            return R(ImagesAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              imagelist: answer.value,
              onImagelistChange: this.handleValueChange,
              consentPrompt: this.props.question.consentPrompt ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale) : void 0
            });

          case "TextListQuestion":
            return R(TextListAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange,
              onNextOrComments: this.handleNextOrComments
            });

          case "SiteQuestion":
            return R(SiteAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange,
              siteTypes: this.props.question.siteTypes,
              T: this.context.T
            });

          case "BarcodeQuestion":
            return R(BarcodeAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange
            });

          case "EntityQuestion":
            return R(EntityAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              entityType: this.props.question.entityType,
              onValueChange: this.handleValueChange
            });

          case "AdminRegionQuestion":
            return R(AdminRegionAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onChange: this.handleValueChange
            });

          case "StopwatchQuestion":
            return R(StopwatchAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange,
              T: this.context.T
            });

          case "MatrixQuestion":
            return R(MatrixAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
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
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange,
              questionId: this.props.question._id
            });

          case "CascadingListQuestion":
            return R(CascadingListAnswerComponent, {
              ref: function ref(c) {
                return _this4.answer = c;
              },
              value: answer.value,
              onValueChange: this.handleValueChange,
              columns: this.props.question.columns,
              rows: this.props.question.rows,
              T: this.context.T,
              locale: this.context.locale
            });

          default:
            return "Unknown type ".concat(this.props.question._type);
        }

        return null;
      }
    }, {
      key: "render",
      value: function render() {
        var answer, className;
        answer = this.getAnswer(); // Create classname to include invalid if invalid

        className = "question";

        if (this.state.validationError != null) {
          className += " invalid";
        }

        return R('div', {
          className: className
        }, this.renderPrompt(), this.renderHint(), this.renderHelp(), R('div', {
          className: "answer"
        }, this.renderAnswer()), answer.confidential != null ? R('span', {
          className: 'help-block'
        }, T("Confidential answers may not be edited.")) : void 0, answer.confidential == null ? [this.renderAlternates(), this.renderValidationError()] : void 0, this.renderCommentsField());
      }
    }]);
    return QuestionComponent;
  }(React.Component);

  ;
  QuestionComponent.contextTypes = {
    locale: PropTypes.string,
    stickyStorage: PropTypes.object,
    // Storage for sticky values
    locationFinder: PropTypes.object,
    T: PropTypes.func.isRequired,
    // Localizer to use
    disableConfidentialFields: PropTypes.bool
  };
  QuestionComponent.propTypes = {
    question: PropTypes.object.isRequired,
    // Design of question. See schema
    data: PropTypes.object,
    // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object,
    // ResponseRow object (for roster entry if in roster)
    onAnswerChange: PropTypes.func.isRequired,
    displayMissingRequired: PropTypes.bool,
    onNext: PropTypes.func,
    schema: PropTypes.object.isRequired // Schema to use, including form

  };
  return QuestionComponent;
}.call(void 0);