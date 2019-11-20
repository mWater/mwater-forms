import _ from 'lodash'
import { CascadingListAnswerValue } from "../response";
import React, { ReactNode } from "react";
import { CascadingListRow, CascadingListColumn } from "../formDesign";
import { Select } from "react-library/lib/bootstrap";
import { localizeString } from "../formUtils";

/** Localizes strings. Must be called as T("some string") or someThing.T("some string") */
type LocalizeString = (str: string, ...args: any[]) => string

interface Props {
  /** Rows in the list to choose from */
  rows: CascadingListRow[]

  /** Columns in the table that are displayed also as dropdowns to choose the row */
  columns: CascadingListColumn[]

  value?: CascadingListAnswerValue
  onValueChange: (value?: CascadingListAnswerValue) => void

  /** Localizer to use */
  T: LocalizeString

  /** Locale to use */
  locale: string
}

interface State {
  /** Values of columns as they are selected */
  columnValues: (string | null)[]

  /** True if editing the value. Ignores changes to the value and prevents saving */
  editing: boolean
}

export class CascadingListAnswerComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      columnValues: props.columns.map(c => props.value ? props.value[c.id] : null),
      editing: false
    }
  }

  /** Validate the component */
  validate(): string | boolean | null {
    return this.state.editing ? this.props.T("Incomplete selection") : null
  }

  /** Handle change to a dropdown */
  handleChange = (index: number, value: string | null) => {
    // If first one reset, then reset entire control
    if (index === 0 && !value) {
      this.handleReset()
      return
    }

    const columnValues = this.state.columnValues.slice()
    columnValues[index] = value

    // For each afterwards, set to null
    let pos = index + 1
    for (; pos < this.props.columns.length ; pos ++) {
      columnValues[pos] = null
    }
    
    // For each afterwards, set if has single value, or otherwise set to null
    pos = index + 1
    for (; pos < this.props.columns.length ; pos ++) {
      const values = this.findValues(pos, columnValues)
      if (values.length == 1) {
        columnValues[pos] = values[0]
      }
      else {
        break
      }
    }

    // Set rest to null
    for (; pos < this.props.columns.length ; pos ++) {
      columnValues[pos] = null
    }

    // If all set, change value
    if (columnValues[this.props.columns.length - 1]) {
      // Find row
      for (const row of this.props.rows) {
        let exclude = false
        for (let colIndex = 0 ; colIndex < this.props.columns.length ; colIndex++) {
          if (row[this.props.columns[colIndex].id] !== columnValues[colIndex]) {
            exclude = true
          }
        }
        if (!exclude) {
          // No longer editing
          this.setState({ columnValues: columnValues, editing: false })
          this.props.onValueChange(row)
          return
        }
      }
    }

    this.setState({ columnValues: columnValues, editing: true })
  }

  /** Reset control */
  handleReset = () => {
    this.setState({ columnValues: this.props.columns.map(c => null), editing: false })
    this.props.onValueChange()
  }

  /** Find values of a particular dropdown filtering by all previous selections */
  findValues(index: number, columnValues: Array<string | null>) {
    let values: string[] = []
    for (const row of this.props.rows) {
      let exclude = false
      for (let prev = 0 ; prev < index ; prev++) {
        if (row[this.props.columns[prev].id] !== columnValues[prev]) {
          exclude = true
        }
      }
      if (!exclude) {
        values.push(row[this.props.columns[index].id])
      }
    }

    // Keep unique values
    values = _.uniq(values)

    return values
  }

  renderDropdown(index: number) {
    // Determine available options
    const options: { label: string, value: string }[] = []

    // Find all possible values, filtering by all previous selections
    const values = this.findValues(index, this.state.columnValues)

    for (const enumValue of this.props.columns[index].enumValues) {
      // Add if in values
      if (values.includes(enumValue.id)) {
        options.push({ value: enumValue.id, label: localizeString(enumValue.name, this.props.locale) })
      }
    }

    return <div style={{ paddingBottom: 15 }}>
      <label className="text-muted">{localizeString(this.props.columns[index].name, this.props.locale)}</label>
      <Select 
        value={this.state.columnValues[index]}
        options={options}
        nullLabel={this.props.T("Select...")}
        onChange={this.handleChange.bind(null, index)}
      />
    </div>
  }

  render() {
    const dropdowns: ReactNode[] = []

    for (let i = 0; i < this.props.columns.length ; i++) {
      dropdowns.push(this.renderDropdown(i))
      // Skip rest if not selected
      if (!this.state.columnValues[i]) {
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
