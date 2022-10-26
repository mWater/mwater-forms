import { LocalizeString } from "ez-localize"
import React, { ReactNode } from "react"
import { AssetQuestion } from "../formDesign"
import { AssetAnswerValue } from "../response"

/** Answer component that allows selecting an asset */
export function AssetAnswerComponent(props: {
  question: AssetQuestion
  answer: AssetAnswerValue | null | undefined
  onValueChange: (answer: AssetAnswerValue | null) => void

  T: LocalizeString

   /** Select an asset with optional filter 
   * @param assetSystemId id of the asset system
   * @param filter MongoDB-style filter on assets
   */
   selectAsset: (assetSystemId: number, filter: any) => Promise<string | null>

   /** Renders an asset as a React element for summary (small box) */
   renderAssetSummaryView: (assetSystemId: number, assetId: string) => ReactNode
 }) {

  function handleSelect() {
    const filter: any = {}
    if (props.question.assetTypes) {
      filter.type = { $in: [props.question.assetTypes] }
    }

    props.selectAsset(props.question.assetSystemId, filter).then(assetId => {
      props.onValueChange(assetId)
    }).catch(err => {
      alert(props.T(`Error selecting asset: {0}`, err.message))
    })
  }

  function handleClear() {
    props.onValueChange(null)
  }

  return <div>
    { props.answer && props.renderAssetSummaryView(props.question.assetSystemId, props.answer)}

    <div>
      { !props.answer && 
        <button type="button" className="btn btn-secondary" onClick={handleSelect}>
          {props.T("Select Asset")} 
        </button>
      }
      { props.answer && 
        <div>
          <button type="button" className="btn btn-secondary" onClick={handleSelect}>
            {props.T("Change")} 
          </button>
          &nbsp;
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            {props.T("Clear")} 
          </button>
        </div>
    }
    </div>
  </div>
}


