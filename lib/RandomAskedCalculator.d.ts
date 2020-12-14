import { FormDesign } from "./formDesign"
import { ResponseData } from "./response"
import { VisibilityStructure } from "./VisibilityCalculator"

/** The RandomAskedCalculator sets the randomAsked property of visible answers, determining if the question will be visible.
 * If question has randomAskProbability, it is visible unless randomAsked is set to false, which this class determines.
 */
export default class RandomAskedCalculator {
  constructor(formDesign: FormDesign)

  calculateRandomAsked(data: ResponseData, visibilityStructure: VisibilityStructure): ResponseData
}