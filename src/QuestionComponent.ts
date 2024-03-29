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
import RankedQuestion from "./answers/RankedQuestion"
import ResponseRow from "./ResponseRow"
import { Schema } from "mwater-expressions"
import { Choice, Question } from "./formDesign"
import { Answer, AssetAnswerValue, CascadingListAnswerValue, RankedAnswerValue, ResponseData } from "./response"
import { AssetAnswerComponent } from "./answers/AssetAnswerComponent"

export interface QuestionComponentProps {
  /** Design of question. See schema */
  question: Question
  /** Current data of response (for roster entry if in roster) */
  data: ResponseData
  /** ResponseRow object (for roster entry if in roster) */
  responseRow: ResponseRow
  onAnswerChange: (answer: Answer) => void
  displayMissingRequired?: boolean
  onNext?: any
  schema: Schema
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
    getCustomTableRows: PropTypes.func.isRequired,
    selectAsset: PropTypes.func,
    renderAssetSummaryView: PropTypes.func
  }
  comments: HTMLTextAreaElement | null
  answer: any
  unmounted: boolean
  prompt: HTMLElement | null
  currentPositionFinder: CurrentPositionFinder

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

  /** Speed up reloading by not updating questions that are simple. */
  shouldComponentUpdate(nextProps: QuestionComponentProps, nextState: QuestionComponentState, nextContext: any) {
    if (this.context.locale !== nextContext.locale) {
      return true
    }
    if (nextProps.question.textExprs != null && nextProps.question.textExprs.length > 0) {
      return true
    }
    if ((nextProps.question as any).choices != null) {
      for (let choice of (nextProps.question as any).choices as Choice[]) {
        if (choice.conditions != null && choice.conditions.length > 0) {
          return true
        }
        if (choice.conditionExpr != null) {
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

  getAnswer(): Answer {
    // The answer to this question
    const answer = this.props.data[this.props.question._id]
    if (answer != null) {
      return answer as Answer
    }
    return {} as Answer
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
        this.prompt?.scrollIntoView()
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

    if (validationError != null) {
      if (scrollToFirstInvalid) {
        this.prompt?.scrollIntoView()
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
  handleCurrentPositionFound = (loc: GeolocationPosition) => {
    if (!this.unmounted) {
      const newAnswer = _.clone(this.getAnswer())
      newAnswer.location = _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy") as any
      this.props.onAnswerChange(newAnswer)
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
          this.prompt = c
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
            R("span", { className: "fas fa-question-circle" })
          )
        : undefined
    )

    // Special case!
    if (this.props.question._type === "CheckQuestion") {
      return R(
        CheckAnswerComponent,
        {
          ref: (c: CheckAnswerComponent | null) => {
            this.answer = c
          },
          value: this.getAnswer().value as boolean | undefined,
          onValueChange: this.handleValueChange,
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
      return R(
        "div",
        { className: "card bg-light mb-3" },
        R("div", {
          className: "card-body",
          dangerouslySetInnerHTML: {
            __html: new Markdown().render(formUtils.localizeString(this.props.question.help, this.context.locale))
          }
        })
      )
    }
    return null
  }

  renderValidationError() {
    if (this.state.validationError != null && typeof this.state.validationError === "string") {
      return R("div", { className: "validation-message text-danger" }, this.state.validationError)
    }
    return null
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
    return null
  }

  renderCommentsField() {
    if (this.props.question.commentsField) {
      return R("textarea", {
        className: "form-control question-comments",
        id: "comments",
        ref: (c: HTMLTextAreaElement | null) => {
          this.comments = c
        },
        placeholder: this.context.T("Comments"),
        value: this.getAnswer().comments,
        onChange: this.handleCommentsChange
      })
    }
    return null
  }

  renderAnswer() {
    const answer = this.getAnswer() as Answer
    const readonly =
      (this.context.disableConfidentialFields && this.props.question.confidential) || answer?.confidential != null

    switch (this.props.question._type) {
      case "TextQuestion":
        return R(TextAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          value: answer.value,
          format: this.props.question.format,
          readOnly: readonly,
          onValueChange: this.handleValueChange,
          onNextOrComments: this.handleNextOrComments
        })

      case "NumberQuestion":
        return R(NumberAnswerComponent, {
          ref: (c: NumberAnswerComponent | null) => {
            this.answer = c
          },
          value: answer.value as number | undefined,
          onChange: !readonly ? this.handleValueChange : undefined,
          decimal: this.props.question.decimal,
          onNextOrComments: this.handleNextOrComments
        })

      case "DropdownQuestion":
        return R(DropdownAnswerComponent, {
          ref: (c) => {
            this.answer = c
          },
          choices: this.props.question.choices,
          answer,
          data: this.props.data,
          onAnswerChange: this.handleAnswerChange,
          schema: this.props.schema,
          responseRow: this.props.responseRow
        })

      case "LikertQuestion":
        return R(LikertAnswerComponent, {
          ref: (c: LikertAnswerComponent | null) => {
            this.answer = c
          },
          items: this.props.question.items,
          choices: this.props.question.choices,
          answer,
          data: this.props.data,
          onAnswerChange: this.handleAnswerChange
        })

      case "RadioQuestion":
        return R(RadioAnswerComponent, {
          ref: (c: RadioAnswerComponent | null) => {
            this.answer = c
          },
          choices: this.props.question.choices,
          answer,
          data: this.props.data,
          displayMode: this.props.question.displayMode,
          onAnswerChange: this.handleAnswerChange,
          schema: this.props.schema,
          responseRow: this.props.responseRow
        })

      case "MulticheckQuestion":
        return R(MulticheckAnswerComponent, {
          ref: (c) => {
            this.answer = c
          },
          choices: this.props.question.choices,
          data: this.props.data,
          answer,
          onAnswerChange: this.handleAnswerChange,
          schema: this.props.schema,
          responseRow: this.props.responseRow
        })

      case "DateQuestion":
        return R(DateAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          format: this.props.question.format,
          onNextOrComments: this.handleNextOrComments
        })

      case "UnitsQuestion":
        return R(UnitsAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          answer,
          onValueChange: this.handleValueChange,
          units: this.props.question.units,
          defaultUnits: this.props.question.defaultUnits,
          prefix: this.props.question.unitsPosition === "prefix",
          decimal: this.props.question.decimal,
          onNextOrComments: this.handleNextOrComments
        })

      case "CheckQuestion":
        // Look at renderPrompt special case
        return null

      case "LocationQuestion":
        return R(LocationAnswerComponent, {
          ref: (c) => {
            this.answer = c
          },
          disableSetByMap: this.props.question.disableSetByMap,
          disableManualLatLng: this.props.question.disableManualLatLng,
          value: answer.value,
          onValueChange: this.handleValueChange
        })

      case "ImageQuestion":
        return R(ImageAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          image: answer.value,
          onImageChange: this.handleValueChange,
          consentPrompt: this.props.question.consentPrompt
            ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale)
            : undefined
        })

      case "ImagesQuestion":
        return R(ImagesAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          imagelist: answer.value,
          onImagelistChange: this.handleValueChange,
          consentPrompt: this.props.question.consentPrompt
            ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale)
            : undefined
        })

      case "TextListQuestion":
        return R(TextListAnswerComponent, {
          ref: (c) => {
            this.answer = c
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          onNextOrComments: this.handleNextOrComments
        })

      case "SiteQuestion":
        return R(SiteAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          siteTypes: this.props.question.siteTypes,
          T: this.context.T
        })

      case "BarcodeQuestion":
        return R(BarcodeAnswerComponent, {
          ref: (c: BarcodeAnswerComponent | null) => {
            this.answer = c
          },
          value: answer.value as string | undefined,
          onValueChange: this.handleValueChange
        })

      case "EntityQuestion":
        return R(EntityAnswerComponent, {
          ref: (c: EntityAnswerComponent | null) => {
            this.answer = c
          },
          value: answer.value as string | undefined,
          entityType: this.props.question.entityType,
          onValueChange: this.handleValueChange
        })

      case "AdminRegionQuestion":
        return R("div", { className: "alert alert-warning" },
          "Admin region questions are no longer supported"
        )

      case "StopwatchQuestion":
        return R(StopwatchAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          T: this.context.T
        })

      case "MatrixQuestion":
        return R(MatrixAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
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

      case "AquagenxCBTQuestion":
        return R(AquagenxCBTAnswerComponent, {
          ref: (c: any) => {
            this.answer = c
          },
          value: answer.value,
          onValueChange: this.handleValueChange,
          questionId: this.props.question._id
        })

      case "CascadingListQuestion":
        return R(CascadingListAnswerComponent, {
          ref: (c: CascadingListAnswerComponent | null) => {
            this.answer = c
          },
          value: answer.value as CascadingListAnswerValue | undefined,
          onValueChange: this.handleValueChange,
          columns: this.props.question.columns,
          rows: this.props.question.rows,
          sortOptions: this.props.question.sortOptions,
          T: this.context.T,
          locale: this.context.locale,
          alternateSelected: this.getAnswer().alternate != null
        })

      case "CascadingRefQuestion":
        return R(CascadingRefAnswerComponent, {
          ref: (c: CascadingRefAnswerComponent | null) => {
            this.answer = c
          },
          question: this.props.question,
          value: answer.value as string | undefined,
          onValueChange: this.handleValueChange,
          schema: this.props.schema,
          getCustomTableRows: this.context.getCustomTableRows,
          T: this.context.T,
          locale: this.context.locale,
          alternateSelected: this.getAnswer().alternate != null
        })

      case "RankedQuestion":
        return R(RankedQuestion, {
          choices: this.props.question.choices,
          answer: answer.value as RankedAnswerValue,
          locale: this.context.locale,
          onValueChange: this.handleValueChange
        })

      case "AssetQuestion":
        if (this.context.selectAsset && this.context.renderAssetSummaryView) {
          return R(AssetAnswerComponent, {
            question: this.props.question,
            answer: answer.value as AssetAnswerValue,
            onValueChange: this.handleValueChange,
            selectAsset: this.context.selectAsset!,
            renderAssetSummaryView: this.context.renderAssetSummaryView!,
            T: this.context.T
          })
        }
        else {
          return R("div", { className: "text-warning" },
            this.context.T("Asset questions not supported on this platform")
          )
        }
  
      default:
        return `Unknown type ${(this.props.question as any)._type}`
    }
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
        ? R("div", { className: "form-text text-muted" }, this.context.T("Confidential answers may not be edited."))
        : undefined,

      answer.confidential == null ? [this.renderAlternates(), this.renderValidationError()] : undefined,
      this.renderCommentsField()
    )
  }
}
