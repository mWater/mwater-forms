import React from "react";
import { Choice } from "../formDesign";
import { RankedAnswerValue } from "src";
declare type RankedQuestionProps = {
    choices: Choice[];
    answer: RankedAnswerValue;
    /** Locale to use */
    locale: string;
    onValueChange: (value?: any) => void;
};
declare const RankedQuestion: React.FC<RankedQuestionProps>;
export default RankedQuestion;
