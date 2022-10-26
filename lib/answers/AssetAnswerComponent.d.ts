import { LocalizeString } from "ez-localize";
import { ReactNode } from "react";
import { AssetQuestion } from "../formDesign";
import { AssetAnswerValue } from "../response";
/** Answer component that allows selecting an asset */
export declare function AssetAnswerComponent(props: {
    question: AssetQuestion;
    answer: AssetAnswerValue | null | undefined;
    onValueChange: (answer: AssetAnswerValue | null) => void;
    T: LocalizeString;
    /** Select an asset with optional filter
    * @param assetSystemId id of the asset system
    * @param filter MongoDB-style filter on assets
    */
    selectAsset: (assetSystemId: number, filter: any) => Promise<string | null>;
    /** Renders an asset as a React element for summary (small box) */
    renderAssetSummaryView: (assetSystemId: number, assetId: string) => ReactNode;
}): JSX.Element;
