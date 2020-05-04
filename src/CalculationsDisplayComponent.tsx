import React, { useMemo, useEffect, useState } from "react";
import { FormDesign, Calculation } from "./formDesign";
import { localizeString } from "./formUtils";
import { Schema, PromiseExprEvaluator } from 'mwater-expressions'
import ResponseRow from "./ResponseRow";

/** Displays calculation values for a response. Only displays root level calculations, not roster ones. */
export const CalculationsDisplayComponent = (props: {
  formDesign: FormDesign
  locale: string
  schema: Schema
  responseRow: ResponseRow
}) => {
  const [values, setValues] = useState<Array<number | null>>([])

  // Create evaluator
  const exprEvaluator = useMemo(() => {
    return new PromiseExprEvaluator({
      schema: props.schema,
      locale: props.locale
    })
  }, [props.schema, props.locale])
  
  // Evaluate calculation values
  useEffect(() => {
    (async function performCalcs() {
      const vs: Array<number | null> = []

      for (const calc of props.formDesign.calculations.filter(c => !c.roster)) {
        vs.push(await exprEvaluator.evaluate(calc.expr, { row: props.responseRow }))
      }
      setValues(vs)
    })()
  }, [exprEvaluator, props.formDesign, props.responseRow])

  const renderCalc = (calc: Calculation, index: number) => {
    return <tr key={calc._id}>
      <td style={{ width: "50%" }}>
        { localizeString(calc.name, props.locale) }
        { calc.desc ? <span className="text-muted"> - { localizeString(calc.desc, props.locale) }</span> : null }
      </td>
      <td>{values.length > 0 ? values[index] : null }</td>
    </tr>
  }

  return <table className="table table-bordered table-condensed">
    <thead>
      <tr>
        <th>Calculation</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      { props.formDesign.calculations.filter(calc => !calc.roster).map((calc, index) => renderCalc(calc, index))}
    </tbody>
  </table>
}