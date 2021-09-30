import React from "react";
import { Choice } from "../formDesign";
declare type RankedQuestionProps = {
    choices: Choice[];
    answer: any;
    /** Locale to use */
    locale: string;
    onValueChange: (value?: any) => void;
};
declare const RankedQuestion: React.FC<RankedQuestionProps>;
export default RankedQuestion;
