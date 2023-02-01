import { StickyStorage } from "./formContext";
import { FormDesign, Item } from "./formDesign";
import { ResponseData } from "./response";
import { VisibilityStructure } from "./VisibilityCalculator";
/** The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
 * It uses the following logic:
 *    - The question needs to be newly visible
 *    - The question needs to have a default value
 *    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
 */
export default class DefaultValueApplier {
    formDesign: FormDesign;
    stickyStorage: StickyStorage;
    entity: any;
    entityType: string | undefined;
    assetSystemId: number | undefined;
    assetType: string | undefined;
    assetId: string | undefined;
    /** entity is entity to use */
    constructor(formDesign: FormDesign, stickyStorage: StickyStorage, options?: {
        entity?: any;
        entityType?: string;
        assetSystemId?: number;
        assetType?: string;
        assetId?: string;
    });
    setStickyData(data: ResponseData, previousVisibilityStructure: VisibilityStructure, newVisibilityStructure: VisibilityStructure): ResponseData;
    /** 2 different sources exist for default values.
     * This function returns the one with highest priority:
     * - entityType/entity
     * - sticky with a stored sticky value
     */
    getHighestPriorityDefaultValue(question: Item): any;
}
