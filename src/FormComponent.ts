import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
import { FormContext } from "./formContext"
import { FormDesign } from "./formDesign"
import { ResponseData } from "./response"
import { Schema } from "mwater-expressions"
const R = React.createElement

import SectionsComponent from "./SectionsComponent"
import ItemListComponent from "./ItemListComponent"
import ezlocalize from "ez-localize"
import ResponseCleaner from "./ResponseCleaner"
import { default as ResponseRow } from "./ResponseRow"
import DefaultValueApplier from "./DefaultValueApplier"
import VisibilityCalculator from "./VisibilityCalculator"
import RandomAskedCalculator from "./RandomAskedCalculator"
import * as formContextTypes from "./formContextTypes"

export interface FormComponentProps {
  /** Context to use for form. See docs/FormsContext.md */
  formCtx: FormContext

  /** Form design. See schema.coffee */
  design: FormDesign

  /** Form response data. See docs/Answer Formats.md */
  data: ResponseData

  /** Called when response data changes */
  onDataChange: (data: ResponseData) => void

  /** Schema to use, including form */
  schema: Schema

  /** The current deployment */
  deployment: string

  /** e.g. "fr" */
  locale?: string

  /** Called when submit is pressed */
  onSubmit?: () => void

  /** Optional save for later */
  onSaveLater?: () => void

  /** Called when discard is pressed */
  onDiscard?: () => void

  /** To override submit label */
  submitLabel?: string

  /** To override Save For Later label */
  saveLaterLabel?: string

  /** To override Discard label */
  discardLabel?: string

  /** Form-level entity to load */
  entity?: any

  /** Type of form-level entity to load */
  entityType?: string

  /** True to render as a single page, not divided into sections */
  singlePageMode?: boolean

  /** True to disable the confidential fields, used during editing responses with confidential data */
  disableConfidentialFields?: boolean

  /** Force all questions to be visible */
  forceAllVisible?: boolean
}

interface FormComponentState {
  T: any
  visibilityStructure: any
}

/** Displays a form that can be filled out */
export default class FormComponent extends React.Component<FormComponentProps, FormComponentState> {
  currentData: ResponseData | null

  static childContextTypes = _.extend({}, formContextTypes, {
    T: PropTypes.func.isRequired,
    locale: PropTypes.string, // e.g. "fr"
    disableConfidentialFields: PropTypes.bool
  })
  cleanInProgress: any
  itemListComponent: ItemListComponent | null
  submit: HTMLButtonElement | null

  constructor(props: FormComponentProps) {
    super(props)

    this.state = {
      visibilityStructure: {},
      T: this.createLocalizer(this.props.design, this.props.locale)
    }

    // Save which data visibility structure applies to
    this.currentData = null
  }

  getChildContext() {
    return _.extend({}, this.props.formCtx, {
      T: this.state.T,
      locale: this.props.locale,
      disableConfidentialFields: this.props.disableConfidentialFields
    })
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.design !== nextProps.design || this.props.locale !== nextProps.locale) {
      return this.setState({ T: this.createLocalizer(nextProps.design, nextProps.locale) })
    }
  }

  componentDidUpdate(prevProps: any) {
    // When data change is external, process it to set visibility, etc.
    if (prevProps.data !== this.props.data && !_.isEqual(this.props.data, this.currentData)) {
      return this.handleDataChange(this.props.data)
    }
  }

  // This will clean the data that has been passed at creation
  // It will also initialize the visibilityStructure
  // And set the sticky data
  componentWillMount() {
    return this.handleDataChange(this.props.data)
  }

  // Creates a localizer for the form design
  createLocalizer(design: any, locale: any) {
    // Create localizer
    const localizedStrings = design.localizedStrings || []
    const localizerData = {
      locales: design.locales,
      strings: localizedStrings
    }
    const { T } = new ezlocalize.Localizer(localizerData, locale)
    return T
  }

  handleSubmit = async () => {
    // Cannot submit if at least one item is invalid
    const result = await this.itemListComponent!.validate(true)
    if (!result) {
      return this.props.onSubmit!()
    }
  }

  isVisible = (itemId: any) => {
    return this.props.forceAllVisible || this.state.visibilityStructure[itemId]
  }

  createResponseRow = (data: any) => {
    return new ResponseRow({
      responseData: data,
      formDesign: this.props.design,
      schema: this.props.schema,
      getEntityById: this.props.formCtx.getEntityById,
      getEntityByCode: this.props.formCtx.getEntityByCode,
      getCustomTableRow: this.props.formCtx.getCustomTableRow,
      deployment: this.props.deployment
    })
  }

  handleDataChange = (data: any) => {
    const visibilityCalculator = new VisibilityCalculator(this.props.design, this.props.schema)
    const defaultValueApplier = this.props.formCtx.stickyStorage ? new DefaultValueApplier(
      this.props.design,
      this.props.formCtx.stickyStorage, {
        entityType: this.props.entityType,
        entity: this.props.entity,
      }
    ) : null
    const randomAskedCalculator = new RandomAskedCalculator(this.props.design)
    const responseCleaner = new ResponseCleaner()

    // Immediately update data, as another answer might be clicked on (e.g. blur from a number input and clicking on a radio answer)
    this.currentData = data
    this.props.onDataChange(data)

    // Clean response data, remembering which data object is being cleaned
    this.cleanInProgress = data

    return responseCleaner.cleanData(
      this.props.design,
      visibilityCalculator,
      defaultValueApplier,
      randomAskedCalculator,
      data,
      this.createResponseRow,
      this.state.visibilityStructure,
      (error: any, results: any) => {
        if (error) {
          alert(this.state.T("Error saving data") + `: ${error.message}`)
          return
        }

        // Ignore if from a previous clean
        if (data !== this.cleanInProgress) {
          console.log("Ignoring stale handleDataChange data")
          return
        }

        this.setState({ visibilityStructure: results.visibilityStructure })
        // Ignore if unchanged
        if (!_.isEqual(data, results.data)) {
          this.currentData = results.data
          return this.props.onDataChange(results.data)
        }
      }
    )
  }

  handleNext = () => {
    return this.submit!.focus()
  }

  render() {
    if (
      this.props.design.contents[0] &&
      this.props.design.contents[0]._type === "Section" &&
      !this.props.singlePageMode
    ) {
      return R(SectionsComponent, {
        contents: this.props.design.contents,
        data: this.props.data,
        onDataChange: this.handleDataChange,
        responseRow: this.createResponseRow(this.props.data),
        schema: this.props.schema,
        onSubmit: this.props.onSubmit,
        onSaveLater: this.props.onSaveLater,
        onDiscard: this.props.onDiscard,
        isVisible: this.isVisible
      })
    } else {
      return R(
        "div",
        null,
        R(ItemListComponent, {
          ref: (c: ItemListComponent | null) => {
            this.itemListComponent = c
          },
          contents: this.props.design.contents,
          data: this.props.data,
          onDataChange: this.handleDataChange,
          responseRow: this.createResponseRow(this.props.data),
          schema: this.props.schema,
          isVisible: this.isVisible,
          onNext: this.handleNext
        }),

        this.props.onSubmit
          ? R(
              "button",
              {
                type: "button",
                key: "submitButton",
                className: "btn btn-primary",
                ref: (c: HTMLButtonElement | null) => {
                  this.submit = c
                },
                onClick: this.handleSubmit
              },
              this.props.submitLabel ? this.props.submitLabel : this.state.T("Submit")
            )
          : undefined,

        "\u00A0",

        this.props.onSaveLater
          ? [
              R(
                "button",
                {
                  type: "button",
                  key: "saveLaterButton",
                  className: "btn btn-secondary",
                  onClick: this.props.onSaveLater
                },
                this.props.saveLaterLabel ? this.props.saveLaterLabel : this.state.T("Save for Later")
              ),
              "\u00A0"
            ]
          : undefined,

        this.props.onDiscard
          ? R(
              "button",
              { type: "button", key: "discardButton", className: "btn btn-secondary", onClick: this.props.onDiscard },
              this.props.discardLabel
                ? this.props.discardLabel
                : [R("span", { className: "fas fa-trash-alt" }), " " + this.state.T("Discard")]
            )
          : undefined
      )
    }
  }
}
