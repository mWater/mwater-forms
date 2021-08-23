import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import * as formUtils from "./formUtils"
import Markdown from "markdown-it"
import TextExprsComponent from "./TextExprsComponent"
import LocationFinder from "./LocationFinder"
import { default as CurrentPositionFinder } from "./CurrentPositionFinder"
import AnswerValidator from "./answers/AnswerValidator"
import AdminRegionAnswerComponent from "./answers/AdminRegionAnswerComponent"
import AquagenxCBTAnswerComponent from "./answers/AquagenxCBTAnswerComponent"
import BarcodeAnswerComponent from "./answers/BarcodeAnswerComponent"
import CheckAnswerComponent from "./answers/CheckAnswerComponent"
import DateAnswerComponent from "./answers/DateAnswerComponent"
import DropdownAnswerComponent from "./answers/DropdownAnswerComponent"
import EntityAnswerComponent from "./answers/EntityAnswerComponent"
import ImageAnswerComponent from "./answers/ImageAnswerComponent"
import ImagesAnswerComponent from "./answers/ImagesAnswerComponent"
import LikertAnswerComponent from "./answers/LikertAnswerComponent"
import LocationAnswerComponent from "./answers/LocationAnswerComponent"
import MatrixAnswerComponent from "./answers/MatrixAnswerComponent"
import MulticheckAnswerComponent from "./answers/MulticheckAnswerComponent"
import NumberAnswerComponent from "./answers/NumberAnswerComponent"
import RadioAnswerComponent from "./answers/RadioAnswerComponent"
import SiteAnswerComponent from "./answers/SiteAnswerComponent"
import StopwatchAnswerComponent from "./answers/StopwatchAnswerComponent"
import TextAnswerComponent from "./answers/TextAnswerComponent"
import TextListAnswerComponent from "./answers/TextListAnswerComponent"
import UnitsAnswerComponent from "./answers/UnitsAnswerComponent"
import { CascadingListAnswerComponent } from "./answers/CascadingListAnswerComponent"
import { CascadingRefAnswerComponent } from "./answers/CascadingRefAnswerComponent"

interface QuestionComponentProps {
  /** Design of question. See schema */
  question: any
  /** Current data of response (for roster entry if in roster) */
  data?: any
  /** ResponseRow object (for roster entry if in roster) */
  responseRow?: any
  onAnswerChange: any
  displayMissingRequired?: boolean
  onNext?: any
  schema: any
}

interface QuestionComponentState {
  helpVisible: any
  savedValue: any
  savedSpecify: any
  validationError: any
}

// Question component that displays a question of any type.
// Displays question text and hint
// Displays toggleable help
// Displays required (*)
// Displays comments field
// Does NOT fill in when sticky and visible for first time. This is done by data cleaning
// Does NOT remove answer when invisible. This is done by data cleaning
// Does NOT check conditions and make self invisible. This is done by parent (ItemListComponent)
// Displays alternates and makes exclusive with answer
export default class QuestionComponent extends React.Component<QuestionComponentProps, QuestionComponentState> {
  static contextTypes = {
    locale: PropTypes.string,
    stickyStorage: PropTypes.object, // Storage for sticky values
    locationFinder: PropTypes.object,
    T: PropTypes.func.isRequired, // Localizer to use
    disableConfidentialFields: PropTypes.bool,
    getCustomTableRows: PropTypes.func.isRequired
  }
  comments: HTMLTextAreaElement | null

  constructor(props: any) {
    super(props)

    this.state = {
      helpVisible: false, // True to display help
      validationError: null,
      // savedValue and savedSpecify are used to save the value when selecting an alternate answer
      savedValue: null,
      savedSpecify: null
    }
  }

  componentWillUnmount() {
    this.unmounted = true

    // Stop position finder
    if (this.currentPositionFinder) {
      return this.currentPositionFinder.stop()
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any) {
    if (this.context.locale !== nextContext.locale) {
      return true
    }
    if (nextProps.question.textExprs != null && nextProps.question.textExprs.length > 0) {
      return true
    }
    if (nextProps.question.choices != null) {
      for (let choice of nextProps.question.choices) {
        if (choice.conditions != null && choice.conditions.length > 0) {
          return true
        }
      }
    }

    if (nextProps.question !== this.props.question) {
      return true
    }

    const oldAnswer = this.props.data[this.props.question._id]
    const newAnswer = nextProps.data[this.props.question._id]
    if (newAnswer !== oldAnswer) {
      return true
    }

    if (!_.isEqual(this.state, nextState)) {
      return true
    }
    return false
  }

  focus() {
    const { answer } = this
    if (answer != null && answer.focus != null) {
      return answer.focus()
    }
  }

  getAnswer() {
    // The answer to this question
    const answer = this.props.data[this.props.question._id]
    if (answer != null) {
      return answer
    }
    return {}
  }

  // Returns true if validation error
  async validate(scrollToFirstInvalid: any) {
    // If we are disabling confidential data return true
    if (this.context.disableConfidentialFields && this.props.question.confidential) {
      return false
    }

    // If answer has custom validation, use that
    if (this.answer?.validate) {
      const answerInvalid = this.answer?.validate()

      if (answerInvalid && scrollToFirstInvalid) {
        this.prompt.scrollIntoView()
      }

      if (answerInvalid) {
        this.setState({ validationError: answerInvalid })
        return answerInvalid
      }
    }

    let validationError = await new AnswerValidator(
      this.props.schema,
      this.props.responseRow,
      this.context.locale
    ).validate(this.props.question, this.getAnswer())

    // Check for isValid function in answer component, as some answer components don't store invalid answers
    // like the number answer.
    if (!validationError && this.answer?.isValid && !this.answer?.isValid()) {
      validationError = true
    }

    if (validationError != null) {
      if (scrollToFirstInvalid) {
        this.prompt.scrollIntoView()
      }
      this.setState({ validationError })
      return true
    } else {
      this.setState({ validationError: null })
      return false
    }
  }

  handleToggleHelp = () => {
    return this.setState({ helpVisible: !this.state.helpVisible })
  }

  handleValueChange = (value: any) => {
    return this.handleAnswerChange(_.extend({}, this.getAnswer(), { value }, { alternate: null }))
  }

  // Record a position found
  handleCurrentPositionFound = (loc: any) => {
    if (!this.unmounted) {
      const newAnswer = _.clone(this.getAnswer())
      newAnswer.location = _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy")
      return this.props.onAnswerChange(newAnswer)
    }
  }

  handleCurrentPositionStatus = (status: any) => {
    // Always record useable positions
    if (status.useable) {
      return this.handleCurrentPositionFound(status.pos)
    }
  }

  handleAnswerChange = (newAnswer: any) => {
    const readonly = this.context.disableConfidentialFields && this.props.question.confidential
    if (readonly) {
      return
    }

    const oldAnswer = this.getAnswer()
    if (this.props.question.sticky && this.context.stickyStorage != null && newAnswer.value != null) {
      // TODO: SurveyorPro: What should happen if value is set to null?
      // TODO: SurveyorPro: What should happen if alternate is set? (or anything else that didn't change the value field)
      this.context.stickyStorage.set(this.props.question._id, newAnswer.value)
    }

    if (this.props.question.recordTimestamp && oldAnswer.timestamp == null) {
      newAnswer.timestamp = new Date().toISOString()
    }

    // Record location if no answer and not already getting location
    if (this.props.question.recordLocation && oldAnswer.location == null && !this.currentPositionFinder) {
      // Create location finder
      const locationFinder = this.context.locationFinder || new LocationFinder()

      // Create position finder
      this.currentPositionFinder = new CurrentPositionFinder({ locationFinder })

      // Listen to current position events (for setting location)
      this.currentPositionFinder.on("found", this.handleCurrentPositionFound)
      this.currentPositionFinder.on("status", this.handleCurrentPositionStatus)
      this.currentPositionFinder.start()
    }

    return this.props.onAnswerChange(newAnswer)
  }

  handleAlternate = (alternate: any) => {
    const answer = this.getAnswer()
    // If we are selecting a new alternate
    if (answer.alternate !== alternate) {
      // If old alternate was null (important not to do this when changing from an alternate value to another)
      if (answer.alternate == null) {
        // It saves value and specify
        this.setState({ savedValue: answer.value, savedSpecify: answer.specify })
      }
      // Then clear value, specify and set alternate
      return this.handleAnswerChange(
        _.extend({}, answer, {
          value: null,
          specify: null,
          alternate
        })
      )
    } else {
      // Clear alternate and put back saved value and specify
      this.handleAnswerChange(
        _.extend({}, answer, {
          value: this.state.savedValue,
          specify: this.state.savedSpecify,
          alternate: null
        })
      )
      return this.setState({ savedValue: null, savedSpecify: null })
    }
  }

  handleCommentsChange = (ev: any) => {
    return this.handleAnswerChange(_.extend({}, this.getAnswer(), { comments: ev.target.value }))
  }

  // Either jump to next question or select the comments box
  handleNextOrComments = (ev?: any) => {
    // If it has a comment box, set the focus on it
    if (this.props.question.commentsField) {
      // For some reason, comments can be null here sometimes
      this.comments?.focus()
      this.comments?.select()
      // Else we lose the focus and go to the next question
    } else {
      // Blur the input (remove the focus)
      if (ev) {
        ev.target.blur()
      }
      return this.props.onNext?.()
    }
  }

  renderPrompt() {
    const promptDiv = R(
      "div",
      {
        className: "prompt",
        ref: (c) => {
          return (this.prompt = c)
        }
      },
      this.props.question.code ? R("span", { className: "question-code" }, this.props.question.code + ": ") : undefined,

      R(TextExprsComponent, {
        localizedStr: this.props.question.text,
        exprs: this.props.question.textExprs,
        schema: this.props.schema,
        responseRow: this.props.responseRow,
        locale: this.context.locale
      }),

      // Required star
      this.props.question.required && !(this.context.disableConfidentialFields && this.props.question.confidential)
        ? R("span", { className: "required" }, "*")
        : undefined,

      this.props.question.help
        ? R(
            "button",
            { type: "button", id: "helpbtn", className: "btn btn-link btn-sm", onClick: this.handleToggleHelp },
            R("span", { className: "glyphicon glyphicon-question-sign" })
          )
        : undefined
    )

    // Special case!
    if (this.props.question._type === "CheckQuestion") {
      return R(
        CheckAnswerComponent,
        {
          ref: (c) => {
            return (this.answer = c)
          },
          value: this.getAnswer().value,
          onValueChange: this.handleValueChange,
          label: this.props.question.label
        },
        promptDiv
      )
    } else {
      return promptDiv
    }
  }

  renderHint() {
    return R(
      "div",
      null,
      this.props.question.hint
        ? R("div", { className: "text-muted" }, formUtils.localizeString(this.props.question.hint, this.context.locale))
        : undefined,
      this.context.disableConfidentialFields && this.props.question.confidential
        ? R("div", { className: "text-muted" }, this.context.T("Confidential answers may not be edited."))
        : undefined
    )
  }

  renderHelp() {
    if (this.state.helpVisible && this.props.question.help) {
      return R("div", {
        className: "help well well-sm",
        dangerouslySetInnerHTML: {
          __html: new Markdown().render(formUtils.localizeString(this.props.question.help, this.context.locale))
        }
      })
    }
  }

  renderValidationError() {
    if (this.state.validationError != null && typeof this.state.validationError === "string") {
      return R("div", { className: "validation-message text-danger" }, this.state.validationError)
    }
  }

  renderAlternates() {
    if (
      this.props.question.alternates &&
      (this.props.question.alternates.na || this.props.question.alternates.dontknow)
    ) {
      return R(
        "div",
        null,
        this.props.question.alternates.dontknow
          ? R(
              "div",
              {
                id: "dn",
                className: `touch-checkbox alternate ${
                  this.getAnswer().alternate === "dontknow" ? "checked" : undefined
                }`,
                onClick: this.handleAlternate.bind(null, "dontknow")
              },
              this.context.T("Don't Know")
            )
          : undefined,
        this.props.question.alternates.na
          ? R(
              "div",
              {
                id: "na",
                className: `touch-checkbox alternate ${this.getAnswer().alternate === "na" ? "checked" : undefined}`,
                onClick: this.handleAlternate.bind(null, "na")
              },
              this.context.T("Not Applicable")
            )
          : undefined
      )
    }
  }

  renderCommentsField() {
    if (this.props.question.commentsField) {
      return R("textarea", {
        className: "form-control question-comments",
        id: "comments",
        ref: (c) => {
          return (this.comments = c)
        },
        placeholder: this.context.T("Comments"),
        value: this.getAnswer().comments,
        onChange: this.handleCommentsChange
      })
    }
  }

  renderAnswer() {
    const answer = this.getAnswer()
    const readonly =
      (this.context.disableConfidentialFields && this.props.question.confidential) || answer?.confidential != null

    switch (this.props.question._type) {
      case "TextQuestion":
        return R(TextAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          value: answer.value,
          format: this.props.question.format,
          readOnly: readonly,
          onValueChange: this.handleValueChange,
          onNextOrComments: this.handleNextOrComments
        })
        break

      case "NumberQuestion":
        return R(NumberAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          value: answer.value,
          onChange: !readonly ? this.handleValueChange : undefined,
          decimal: this.props.question.decimal,
          onNextOrComments: this.handleNextOrComments
        })
        break

      case "DropdownQuestion":
        return R(DropdownAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          choices: this.props.question.choices,
          answer,
          data: this.props.data,
          onAnswerChange: this.handleAnswerChange
        })
        break

      case "LikertQuestion":
        return R(LikertAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          items: this.props.question.items,
          choices: this.props.question.choices,
          answer,
          data: this.props.data,
          onAnswerChange: this.handleAnswerChange
        })
        break

      case "RadioQuestion":
        return R(RadioAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          choices: this.props.question.choices,
          answer,
          data: this.props.data,
          displayMode: this.props.question.displayMode,
          onAnswerChange: this.handleAnswerChange
        })
        break

      case "MulticheckQuestion":
        return R(MulticheckAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          choices: this.props.question.choices,
          data: this.props.data,
          answer,
          onAnswerChange: this.handleAnswerChange
        })
        break

      case "DateQuestion":
        return R(DateAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          format: this.props.question.format,
          placeholder: this.props.question.placeholder,
          onNextOrComments: this.handleNextOrComments
        })
        break

      case "UnitsQuestion":
        return R(UnitsAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          answer,
          onValueChange: this.handleValueChange,
          units: this.props.question.units,
          defaultUnits: this.props.question.defaultUnits,
          prefix: this.props.question.unitsPosition === "prefix",
          decimal: this.props.question.decimal,
          onNextOrComments: this.handleNextOrComments
        })
        break

      case "CheckQuestion":
        // Look at renderPrompt special case
        return null
        break

      case "LocationQuestion":
        return R(LocationAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          disableSetByMap: this.props.question.disableSetByMap,
          disableManualLatLng: this.props.question.disableManualLatLng,
          value: answer.value,
          onValueChange: this.handleValueChange
        })
        break

      case "ImageQuestion":
        return R(ImageAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          image: answer.value,
          onImageChange: this.handleValueChange,
          consentPrompt: this.props.question.consentPrompt
            ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale)
            : undefined
        })
        break

      case "ImagesQuestion":
        return R(ImagesAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          imagelist: answer.value,
          onImagelistChange: this.handleValueChange,
          consentPrompt: this.props.question.consentPrompt
            ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale)
            : undefined
        })
        break

      case "TextListQuestion":
        return R(TextListAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          onNextOrComments: this.handleNextOrComments
        })
        break

      case "SiteQuestion":
        return R(SiteAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          siteTypes: this.props.question.siteTypes,
          T: this.context.T
        })
        break

      case "BarcodeQuestion":
        return R(BarcodeAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange
        })
        break

      case "EntityQuestion":
        return R(EntityAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          value: answer.value,
          entityType: this.props.question.entityType,
          onValueChange: this.handleValueChange
        })
        break

      case "AdminRegionQuestion":
        return R(AdminRegionAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          value: answer.value,
          onChange: this.handleValueChange
        })
        break

      case "StopwatchQuestion":
        return R(StopwatchAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          T: this.context.T
        })
        break

      case "MatrixQuestion":
        return R(MatrixAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          alternate: answer.alternate,
          items: this.props.question.items,
          columns: this.props.question.columns,
          data: this.props.data,
          responseRow: this.props.responseRow,
          schema: this.props.schema
        })
        break

      case "AquagenxCBTQuestion":
        return R(AquagenxCBTAnswerComponent, {
          ref: (c: any) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          questionId: this.props.question._id
        })
        break

      case "CascadingListQuestion":
        return R(CascadingListAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          columns: this.props.question.columns,
          rows: this.props.question.rows,
          sortOptions: this.props.question.sortOptions,
          T: this.context.T,
          locale: this.context.locale
        })
        break

      case "CascadingRefQuestion":
        return R(CascadingRefAnswerComponent, {
          ref: (c) => {
            return (this.answer = c)
          },
          question: this.props.question,
          value: answer.value,
          onValueChange: this.handleValueChange,
          schema: this.props.schema,
          getCustomTableRows: this.context.getCustomTableRows,
          T: this.context.T,
          locale: this.context.locale
        })
        break

      default:
        return `Unknown type ${this.props.question._type}`
    }
    return null
  }

  render() {
    const answer = this.getAnswer()
    // Create classname to include invalid if invalid
    let className = "question"
    if (this.state.validationError != null) {
      className += " invalid"
    }

    return R(
      "div",
      { className, "data-qn-id": this.props.question._id },
      this.renderPrompt(),
      this.renderHint(),
      this.renderHelp(),

      R("div", { className: "answer" }, this.renderAnswer()),

      answer.confidential != null
        ? R("span", { className: "help-block" }, this.context.T("Confidential answers may not be edited."))
        : undefined,

      answer.confidential == null ? [this.renderAlternates(), this.renderValidationError()] : undefined,
      this.renderCommentsField()
    )
  }
}
