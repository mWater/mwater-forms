import React from "react"
import { FormContext } from "./formContext"
import { FormDesign } from "./formDesign"
import { ResponseData } from "./response"
import { Schema } from "mwater-expressions"

/** Displays a form that can be filled out */
export default class FormComponent extends React.Component<{
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
}> {}