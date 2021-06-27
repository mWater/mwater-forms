import React from "react"
import { assert } from "chai"
import { render, fireEvent, waitForElement, getByDisplayValue } from "@testing-library/react"
import { CascadingRefAnswerComponent } from "../../src/answers/CascadingRefAnswerComponent"

import { defaultT } from "ez-localize"
import { spy } from "sinon"
import { CascadingRefQuestion } from "../../src/formDesign"
import { CustomTablesetSchemaBuilder } from "../../lib/CustomTablesetSchemaBuilder"
import { Schema, Row } from "mwater-expressions"

describe("CascadingRefAnswer", () => {
  const rows: Row[] = [
    { _id: "wpg", c0: "manitoba", c1: "winnipeg" },
    { _id: "wloo", c0: "ontario", c1: "waterloo" },
    { _id: "tor", c0: "ontario", c1: "toronto" }
  ]

  const tableSet = {
    _id: "1234",
    code: "ts",
    design: {
      name: { _base: "en", en: "TS" },
      tables: [
        {
          id: "cities",
          name: { _base: "en", en: "Cities" },
          properties: [
            {
              id: "c0",
              name: { en: "Province" },
              type: "enum",
              enumValues: [
                { id: "manitoba", name: { en: "Manitoba" } },
                { id: "ontario", name: { en: "Ontario" } }
              ]
            },
            {
              id: "c1",
              name: { en: "City" },
              type: "enum",
              enumValues: [
                { id: "winnipeg", name: { en: "Winnipeg" } },
                { id: "toronto", name: { en: "Toronto" } },
                { id: "waterloo", name: { en: "Waterloo" } }
              ]
            }
          ]
        }
      ]
    }
  }

  const schema = new CustomTablesetSchemaBuilder().addTableset(new Schema(), tableSet)

  const getCustomTableRows = (tableId: string) => Promise.resolve(rows)

  const question: CascadingRefQuestion = {
    _id: "123",
    _type: "CascadingRefQuestion",
    tableId: "custom.ts.cities",
    text: { _base: "en", en: "Question" },
    conditions: [],
    validations: [],
    dropdowns: [
      {
        columnId: "c0",
        name: { _base: "en", en: "Province" }
      },
      {
        columnId: "c1",
        name: { _base: "en", en: "City" }
      }
    ]
  }

  it("selects simple item", async () => {
    const onValueChange = spy()

    const { getByDisplayValue } = render(
      <CascadingRefAnswerComponent
        question={question}
        T={defaultT}
        locale="en"
        onValueChange={onValueChange}
        schema={schema}
        getCustomTableRows={getCustomTableRows}
      />
    )
    const level0 = (await waitForElement(() => getByDisplayValue("Select..."))) as HTMLSelectElement
    fireEvent.change(level0, { target: { value: '"manitoba"' } })
    assert.equal(onValueChange.firstCall.args[0], "wpg")
  })

  it("selects cascading item", async () => {
    const onValueChange = spy()

    const { getByDisplayValue } = render(
      <CascadingRefAnswerComponent
        question={question}
        T={defaultT}
        locale="en"
        onValueChange={onValueChange}
        schema={schema}
        getCustomTableRows={getCustomTableRows}
      />
    )

    const level0 = (await waitForElement(() => getByDisplayValue("Select..."))) as HTMLSelectElement
    fireEvent.change(level0, { target: { value: '"ontario"' } })

    assert.isTrue(onValueChange.notCalled)

    const level1 = (await waitForElement(() => getByDisplayValue("Select..."))) as HTMLSelectElement
    fireEvent.change(level1, { target: { value: '"toronto"' } })

    assert.equal(onValueChange.firstCall.args[0], "tor")
  })

  it("resets item", async () => {
    const onValueChange = spy()

    const { getByDisplayValue } = render(
      <CascadingRefAnswerComponent
        question={question}
        T={defaultT}
        locale="en"
        onValueChange={onValueChange}
        schema={schema}
        getCustomTableRows={getCustomTableRows}
      />
    )

    const level0 = (await waitForElement(() => getByDisplayValue("Select..."))) as HTMLSelectElement
    fireEvent.change(level0, { target: { value: '"manitoba"' } })

    fireEvent.change(level0, { target: { value: "null" } })

    assert.equal(onValueChange.secondCall.args[0], null)
  })
})
