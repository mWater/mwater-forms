import { StickyStorage } from "./formContext"
import { FormDesign } from "./formDesign"
import { ResponseData } from "./response"
import { VisibilityStructure } from "./VisibilityCalculator"

/** The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
 * It uses the following logic:
 *    - The question needs to be newly visible
 *    - The question needs to have a default value
 *    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
 */
export default class DefaultValueApplier {
  /** entity is entity to use */
  constructor(formDesign: FormDesign, stickyStorage: StickyStorage, entity?: any, entityType?: string)

  setStickyData(
    data: ResponseData,
    previousVisibilityStructure: VisibilityStructure,
    newVisibilityStructure: VisibilityStructure
  ): ResponseData
}
