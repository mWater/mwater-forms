import PropTypes from "prop-types";
import React from "react";
import { Instructions } from "./formDesign";
import { ResponseData } from "./response";
import ResponseRow from "./ResponseRow";
import { Schema } from "mwater-expressions";
export interface InstructionsComponentProps {
    /** Design of instructions. See schema */
    instructions: Instructions;
    /** Current data of response (for roster entry if in roster) */
    data?: ResponseData;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: ResponseRow;
    schema: Schema;
}
export default class InstructionsComponent extends React.Component<InstructionsComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any): boolean;
    render(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
