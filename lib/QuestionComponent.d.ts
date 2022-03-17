import PropTypes from "prop-types";
import React from "react";
import { default as CurrentPositionFinder } from "./CurrentPositionFinder";
import CheckAnswerComponent from "./answers/CheckAnswerComponent";
import ResponseRow from "./ResponseRow";
import { Schema } from "mwater-expressions";
import { Choice, Question } from "./formDesign";
export interface QuestionComponentProps {
    /** Design of question. See schema */
    question: Question;
    /** Current data of response (for roster entry if in roster) */
    data?: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: ResponseRow;
    onAnswerChange: any;
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
    getAnswer(): any;
    validate(scrollToFirstInvalid: any): Promise<any>;
    handleToggleHelp: () => void;
    handleValueChange: (value: any) => any;
    handleCurrentPositionFound: (loc: any) => any;
    handleCurrentPositionStatus: (status: any) => any;
    handleAnswerChange: (newAnswer: any) => any;
    handleAlternate: (alternate: any) => any;
    handleCommentsChange: (ev: any) => any;
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
    renderCommentsField(): React.DOMElement<{
        className: string;
        id: string;
        ref: (c: Element | null) => void;
        placeholder: any;
        value: any;
        onChange: (ev: any) => any;
    }, Element> | null;
    renderAnswer(): string | React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | React.CElement<any, any> | React.FunctionComponentElement<{
        choices: Choice[];
        answer: import("./response").RankedAnswerValue;
        locale: string;
        onValueChange: (value?: any) => void;
    }> | null;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        "data-qn-id": string;
    }, HTMLElement>;
}
export {};
