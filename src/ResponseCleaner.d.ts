import DefaultValueApplier from "./DefaultValueApplier"
import { FormDesign } from "./formDesign"
import RandomAskedCalculator from "./RandomAskedCalculator"
import { ResponseData } from "./response"
import ResponseRow from "./ResponseRow"
import VisibilityCalculator, { VisibilityStructure } from "./VisibilityCalculator"

/**
ResponseCleaner removes the data entry (answer) of invisible questions and defaults values

The process of cleaning data is an iterative one, as making a question invisible removes its answer, which in turn may make
other questions invisible or visible. 

To further complicate it, when a question becomes visible, it may get a default value, which may in turn trigger other visibility changes

Therefore, it's an iterative process which is also asynchronous, as condition evaluation is asynchronous.
*/
export default class ResponseCleaner {
  /**
   * Cleans data, calling back with { data: cleaned data, visibilityStructure: final visibility structure (since expensive to compute) }
   * The old visibility structure is needed as defaulting of values requires knowledge of how visibility has changed
   * The process of computing visibility, cleaning data and applying stickyData/defaultValue can trigger more changes
   * and should be repeated until the visibilityStructure is stable.
   * A simple case: Question A, B and C with B only visible if A is set and C only visible if B is set and B containing a defaultValue
   * Setting a value to A will make B visible and set to defaultValue, but C will remain invisible until the process is repeated
   * responseRowFactory: returns responseRow when called with data
   */
  cleanData(
    design: FormDesign,
    visibilityCalculator: VisibilityCalculator,
    defaultValueApplier: DefaultValueApplier,
    randomAskedCalculator: RandomAskedCalculator | null,
    data: ResponseData,
    responseRowFactory: (data: ResponseData) => ResponseRow,
    oldVisibilityStructure: VisibilityStructure,
    callback: (err: any, result?: { data: ResponseData; visibilityStructure: VisibilityState }) => void
  ): void

  cleanData(
    design: FormDesign,
    visibilityCalculator: VisibilityCalculator,
    defaultValueApplier: null,
    randomAskedCalculator: RandomAskedCalculator | null,
    data: ResponseData,
    responseRowFactory: (data: ResponseData) => ResponseRow,
    oldVisibilityStructure: null,
    callback: (err: any, result?: { data: ResponseData; visibilityStructure: VisibilityState }) => void
  ): void
}
