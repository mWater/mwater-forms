import PropTypes from "prop-types";
import React from "react";
export interface InstructionsComponentProps {
    /** Design of instructions. See schema */
    instructions: any;
    /** Current data of response (for roster entry if in roster) */
    data?: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow?: any;
    schema: any;
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
