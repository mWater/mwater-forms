import _ from 'lodash'
import React, { ReactNode } from "react";
import { CascadingRefAnswerValue } from "../response";
import { CascadingRefQuestion, CascadingRefSelector } from "../formDesign";
import { Select } from "react-library/lib/bootstrap";
import { localizeString } from "../formUtils";
import { Row, Schema } from 'mwater-expressions';

/** Localizes strings. Must be called as T("some string") or someThing.T("some string") */
type LocalizeString = (str: string, ...args: any[]) => string

interface Props {
  question: CascadingRefQuestion

  value?: CascadingRefAnswerValue
  onValueChange: (value?: CascadingRefAnswerValue) => void

  /** Schema which includes the custom tableset */
  schema: Schema

  /** Localizer to use */
  T: LocalizeString

  /** Locale to use */
  locale: string

  /** Get all rows of a custom table 
   * @param tableId table id e.g. custom.abc.xyz
   */
  getCustomTableRows: (tableId: string) => Promise<Row[]>
}

interface State {
  /** Rows of the table */
  rows?: Row[]

  /** Values of dropdowns as they are selected */
  dropdownValues?: (string | null)[]

  /** True if editing the value. Ignores changes to the value and prevents saving */
  editing: boolean
}

export class CascadingRefAnswerComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editing: false
    }
  }

  componentDidMount() {
    // Load rows
    this.props.getCustomTableRows(this.props.question.tableId).then(rows => {
      // Load current value
      let row: Row | undefined 

      if (this.props.value) {
        // Find row
        row = rows.find(row => row._id == this.props.value)
      }

      // Get dropdown values
      const dropdownValues = this.props.question.dropdowns.map(sel => row ? row[sel.columnId] : null)
      this.setState({ dropdownValues, rows })
    }).catch(err => { throw err })
  }

  /** Validate the component */
  validate(): string | boolean | null {
    return this.state.editing ? this.props.T("Incomplete selection") : null
  }

  /** Handle change to a dropdown */
  handleChange = (index: number, value: string | null) => {
    const dropdowns = this.props.question.dropdowns

    // If first one reset, then reset entire control
    if (index === 0 && !value) {
      this.handleReset()
      return
    }

    const dropdownValues = this.state.dropdownValues!.slice()
    dropdownValues[index] = value

    // For each afterwards, set to null
    let pos = index + 1
    for (; pos < dropdowns.length ; pos ++) {
      dropdownValues[pos] = null
    }
    
    // For each afterwards, set if has single value, or otherwise set to null
    pos = index + 1
    for (; pos < dropdowns.length ; pos ++) {
      const values = this.findValues(pos, dropdownValues)
      if (values.length == 1) {
        dropdownValues[pos] = values[0]
      }
      else {
        break
      }
    }

    // Set rest to null
    for (; pos < this.props.question.dropdowns.length ; pos ++) {
      dropdownValues[pos] = null
    }

    // If all set, change value
    if (dropdownValues[dropdowns.length - 1]) {
      // Find row
      for (const row of this.state.rows!) {
        let exclude = false
        for (let pos = 0 ; pos < dropdowns.length ; pos++) {
          if (row[dropdowns[pos].columnId] !== dropdownValues[pos]) {
            exclude = true
          }
        }
        if (!exclude) {
          // No longer editing
          this.setState({ dropdownValues: dropdownValues, editing: false })
          this.props.onValueChange(row._id)
          return
        }
      }
    }

    this.setState({ dropdownValues: dropdownValues, editing: true })
  }

  /** Reset control */
  handleReset = () => {
    this.setState({ dropdownValues: this.props.question.dropdowns.map(c => null), editing: false })
    this.props.onValueChange()
  }

  /** Find values of a particular dropdown filtering by all previous selections */
  findValues(index: number, dropdownValues: Array<string | null>) {
    let values: string[] = []
    for (const row of this.state.rows!) {
      let exclude = false
      for (let prev = 0 ; prev < index ; prev++) {
        if (row[this.props.question.dropdowns[prev].columnId] !== dropdownValues[prev]) {
          exclude = true
        }
      }
      if (!exclude) {
        values.push(row[this.props.question.dropdowns[index].columnId])
      }
    }

    // Keep unique values
    values = _.uniq(values)

    return values
  }

  renderDropdown(index: number) {
    const dropdown = this.props.question.dropdowns[index]

    // Determine available options
    const options: { label: string, value: string }[] = []

    // Find all possible values, filtering by all previous selections
    const values = this.findValues(index, this.state.dropdownValues!)

    const column = this.props.schema.getColumn(this.props.question.tableId, dropdown.columnId)
    if (!column) {
      // Not localized because should not happen
      return <div className="alert alert-danger">Missing column</div>
    }

    // If enum
    if (column.type == "enum" && column.enumValues) {
      for (const enumValue of column.enumValues!) {
        // Add if in values
        if (values.includes(enumValue.id)) {
          options.push({ value: enumValue.id, label: localizeString(enumValue.name, this.props.locale) })
        }
      }
    }
    else {
      // Text are added as is
      for (const value of values) {
        options.push({ value: value, label: value })
      }
    }

    return <div style={{ paddingBottom: 15 }} key={index}>
      <label className="text-muted">{localizeString(dropdown.name, this.props.locale)}</label>
      <Select 
        value={this.state.dropdownValues![index]}
        options={options}
        nullLabel={this.props.T("Select...")}
        onChange={this.handleChange.bind(null, index)}
      />
      { dropdown.hint ?
        <div className="text-muted">{localizeString(dropdown.hint, this.props.locale)}</div>
      : null }
    </div>
  }

  render() {
    if (!this.state.rows || !this.state.dropdownValues) {
      return <div><i className="fa fa-spinner fa-spin"/></div>
    }

    const dropdowns: ReactNode[] = []

    for (let i = 0; i < this.props.question.dropdowns.length ; i++) {
      dropdowns.push(this.renderDropdown(i))
      // Skip rest if not selected
      if (!this.state.dropdownValues[i]) {
        break
      }
    }

    return <div>
      <button type="button" className="btn btn-link btn-xs" style={{float:"right"}} onClick={this.handleReset}>
        {this.props.T("Reset")}
      </button>
      { dropdowns }
    </div>
  }
}
