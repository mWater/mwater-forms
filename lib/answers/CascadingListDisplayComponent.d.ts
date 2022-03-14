/// <reference types="react" />
import { CascadingListAnswerValue } from "../response";
import { CascadingListQuestion } from "../formDesign";
/** Displays a cascading list question answer */
export declare const CascadingListDisplayComponent: (props: {
    question: CascadingListQuestion;
    value: CascadingListAnswerValue;
    locale: string;
}) => JSX.Element;
