import React, { ReactNode } from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
import { VisibilityStructure } from "./VisibilityCalculator";
import { default as ResponseRow } from "./ResponseRow";
import TextExprsComponent from "./TextExprsComponent";
import { Schema } from "mwater-expressions";
import { FormDesign, Question, Item, MatrixColumnQuestion } from "./formDesign";
import { Answer, ResponseData } from "./response";
import { FormContext } from "./formContext";
import { LocalizeString } from "ez-localize";
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
    T: LocalizeString;
    /** Form context to use */
    formCtx: FormContext;
    /** Previous data */
    prevData?: ResponseData;
    showPrevAnswers?: boolean;
    highlightChanges?: boolean;
    hideUnchangedAnswers?: boolean;
    showChangedLink?: boolean;
    onChangedLinkClick?: any;
    onCompleteHistoryLinkClick?: any;
    hideCalculations?: boolean;
}
interface ResponseAnswersComponentState {
    loading: boolean;
    error?: any;
    responseRow?: ResponseRow;
    visibilityStructure?: VisibilityStructure;
}
export default class ResponseAnswersComponent extends AsyncLoadComponent<ResponseAnswersComponentProps, ResponseAnswersComponentState> {
    isLoadNeeded(newProps: ResponseAnswersComponentProps, oldProps: ResponseAnswersComponentProps): boolean;
    load(props: ResponseAnswersComponentProps, prevProps: ResponseAnswersComponentProps, callback: any): void;
    handleLocationClick(location: any): void;
    renderLocation(location: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    renderAnswer(q: Question | MatrixColumnQuestion, answer: Answer | null): React.ReactNode;
    renderLikertAnswer(q: Question | MatrixColumnQuestion, answer: Answer, prevAnswer: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    renderQuestion(q: Question | MatrixColumnQuestion, dataId: string): (React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | React.ReactElement<{
        key: string;
    }, string | React.JSXElementConstructor<any>> | null)[] | null;
    collectItemsReferencingRoster(items: any, contents: any, rosterId: any): any[];
    renderItem(item: Item, visibilityStructure: VisibilityStructure, dataId: string): ReactNode;
    renderExpression(q: any, dataId: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[];
    renderExpressionAnswer(q: any, dataId: any): React.CElement<import("./TextExprsComponent").TextExprsComponentProps, TextExprsComponent>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
export {};
