import React from 'react'
import { assert } from 'chai'
import { render, fireEvent, waitForElement, getByDisplayValue } from '@testing-library/react'
import { CascadingListAnswerComponent } from '../../src/answers/CascadingListAnswerComponent'

import { defaultT } from 'ez-localize'
import { spy } from 'sinon'

describe("CascadingListAnswer", () => {
  const rows = [
    { id: "wpg", c0: "manitoba", c1: "winnipeg" },
    { id: "wloo", c0: "ontario", c1: "waterloo" },
    { id: "tor", c0: "ontario", c1: "toronto" }
  ]

  const columns = [
    {
      id: "c0",
      type: "enum" as "enum",
      name: { _base: "en", en: "Province" },
      enumValues: [
        { id: "manitoba", name: { _base: "en", en: "Manitoba" }},
        { id: "ontario", name: { _base: "en", en: "Ontario" }}
      ]
    },
    {
      id: "c1",
      type: "enum" as "enum",
      name: { _base: "en", en: "City" },
      enumValues: [
        { id: "winnipeg", name: { _base: "en", en: "Winnipeg" }},
        { id: "toronto", name: { _base: "en", en: "Toronto" }},
        { id: "waterloo", name: { _base: "en", en: "Waterloo" }}
      ]
    }
  ]

  it("selects simple item", async () => {
    const onValueChange = spy()

    const { getByDisplayValue } = render(<CascadingListAnswerComponent
      columns={columns}
      rows={rows}
      T={defaultT}
      locale="en"
      onValueChange={onValueChange}
    />)
    const level0 = await waitForElement(() => getByDisplayValue("Select...")) as HTMLSelectElement
    fireEvent.change(level0, { target: { value: '"manitoba"'}})
    assert.equal(onValueChange.firstCall.args[0].id, "wpg")
  })

  it("selects cascading item", async () => {
    const onValueChange = spy()

    const { getByDisplayValue } = render(<CascadingListAnswerComponent
      columns={columns}
      rows={rows}
      T={defaultT}
      locale="en"
      onValueChange={onValueChange}
    />)

    const level0 = await waitForElement(() => getByDisplayValue("Select...")) as HTMLSelectElement
    fireEvent.change(level0, { target: { value: '"ontario"'}})

    assert.isTrue(onValueChange.notCalled)

    const level1 = await waitForElement(() => getByDisplayValue("Select...")) as HTMLSelectElement
    fireEvent.change(level1, { target: { value: '"toronto"'}})

    assert.equal(onValueChange.firstCall.args[0].id, "tor")
  })

  it("resets item", async () => {
    const onValueChange = spy()

    const { getByDisplayValue } = render(<CascadingListAnswerComponent
      columns={columns}
      rows={rows}
      T={defaultT}
      locale="en"
      onValueChange={onValueChange}
    />)

    const level0 = await waitForElement(() => getByDisplayValue("Select...")) as HTMLSelectElement
    fireEvent.change(level0, { target: { value: '"manitoba"'}})

    fireEvent.change(level0, { target: { value: 'null'}})

    assert.equal(onValueChange.secondCall.args[0], null)
  })

})