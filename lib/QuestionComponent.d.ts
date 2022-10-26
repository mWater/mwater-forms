import PropTypes from "prop-types";
import React from "react";
import { default as CurrentPositionFinder } from "./CurrentPositionFinder";
import CheckAnswerComponent from "./answers/CheckAnswerComponent";
import ResponseRow from "./ResponseRow";
import { Schema } from "mwater-expressions";
import { Choice, Question } from "./formDesign";
import { Answer, RankedAnswerValue, ResponseData } from "./response";
export interface QuestionComponentProps {
    /** Design of question. See schema */
    question: Question;
    /** Current data of response (for roster entry if in roster) */
    data: ResponseData;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: ResponseRow;
    onAnswerChange: (answer: Answer) => void;
    displayMissingRequired?: boolean;
    onNext?: any;
    schema: Schema;
}
interface QuestionComponentState {
    helpVisible: any;
    savedValue: any;
    savedSpecify: any;
    validationError: any;
}
export default class QuestionComponent extends React.Component<QuestionComponentProps, QuestionComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
        stickyStorage: PropTypes.Requireable<object>;
        locationFinder: PropTypes.Requireable<object>;
        T: PropTypes.Validator<(...args: any[]) => any>;
        disableConfidentialFields: PropTypes.Requireable<boolean>;
        getCustomTableRows: PropTypes.Validator<(...args: any[]) => any>;
        selectAsset: PropTypes.Requireable<(...args: any[]) => any>;
        renderAssetSummaryView: PropTypes.Requireable<(...args: any[]) => any>;
    };
    comments: HTMLTextAreaElement | null;
    answer: any;
    unmounted: boolean;
    prompt: HTMLElement | null;
    currentPositionFinder: CurrentPositionFinder;
    constructor(props: any);
    componentWillUnmount(): void;
    /** Speed up reloading by not updating questions that are simple. */
    shouldComponentUpdate(nextProps: QuestionComponentProps, nextState: QuestionComponentState, nextContext: any): boolean;
    focus(): any;
    getAnswer(): Answer;
    validate(scrollToFirstInvalid: any): Promise<any>;
    handleToggleHelp: () => void;
    handleValueChange: (value: any) => void;
    handleCurrentPositionFound: (loc: GeolocationPosition) => void;
    handleCurrentPositionStatus: (status: any) => void;
    handleAnswerChange: (newAnswer: any) => void;
    handleAlternate: (alternate: any) => void;
    handleCommentsChange: (ev: any) => void;
    handleNextOrComments: (ev?: any) => any;
    renderPrompt(): React.DetailedReactHTMLElement<{
        className: string;
        ref: (c: HTMLElement | null) => void;
    }, HTMLElement> | React.CElement<import("./answers/CheckAnswerComponent").CheckAnswerComponentProps, CheckAnswerComponent>;
    renderHint(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderHelp(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | null;
    renderValidationError(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | null;
    renderAlternates(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    renderCommentsField(): React.DetailedReactHTMLElement<{
        className: string;
        id: string;
        ref: (c: HTMLTextAreaElement | null) => void;
        placeholder: any;
        value: string | undefined;
        onChange: (ev: any) => void;
    }, HTMLTextAreaElement> | null;
    renderAnswer(): string | React.CElement<any, any> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | React.FunctionComponentElement<{
        choices: Choice[];
        answer: RankedAnswerValue;
        locale: string;
        onValueChange: (value?: any) => void;
    }> | React.FunctionComponentElement<{
        question: import("./formDesign").AssetQuestion;
        answer: string | null | undefined;
        onValueChange: (answer: string | null) => void;
        T: import("ez-localize").LocalizeString;
        selectAsset: (assetSystemId: number, filter: any, callback: (assetId: string | null) => void) => void;
        renderAssetSummaryView: (assetSystemId: number, assetId: string) => React.ReactNode;
    }> | null;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        "data-qn-id": string;
    }, HTMLElement>;
}
export {};
