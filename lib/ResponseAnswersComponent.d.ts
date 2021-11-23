import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
import TextExprsComponent from "./TextExprsComponent";
import { Schema } from "mwater-expressions";
import { FormDesign } from "./formDesign";
import { ResponseData } from "./response";
export interface ResponseAnswersComponentProps {
    formDesign: FormDesign;
    data: ResponseData;
    /** Schema of the */
    schema: Schema;
    /** Deployment id of the response */
    deployment?: string;
    /** True to hide empty answers */
    hideEmptyAnswers?: boolean;
    /** Defaults to english */
    locale?: string;
    /** Localizer to use */
    T: any;
    /** Form context to use */
    formCtx: any;
    /** Previous data */
    prevData?: any;
    showPrevAnswers?: boolean;
    highlightChanges?: boolean;
    hideUnchangedAnswers?: boolean;
    showChangedLink?: boolean;
    onChangedLinkClick?: any;
    onCompleteHistoryLinkClick?: any;
    hideCalculations?: boolean;
}
interface ResponseAnswersComponentState {
}
export default class ResponseAnswersComponent extends AsyncLoadComponent<ResponseAnswersComponentProps, ResponseAnswersComponentState> {
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: ResponseAnswersComponentProps, prevProps: ResponseAnswersComponentProps, callback: any): void;
    handleLocationClick(location: any): any;
    renderLocation(location: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    renderAnswer(q: any, answer: any): any;
    renderLikertAnswer(q: any, answer: any, prevAnswer: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    renderQuestion(q: any, dataId: any): (React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null)[] | null;
    collectItemsReferencingRoster(items: any, contents: any, rosterId: any): any[];
    renderItem(item: any, visibilityStructure: any, dataId: any): any;
    renderExpression(q: any, dataId: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[];
    renderExpressionAnswer(q: any, dataId: any): React.CElement<import("./TextExprsComponent").TextExprsComponentProps, TextExprsComponent>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
export {};
