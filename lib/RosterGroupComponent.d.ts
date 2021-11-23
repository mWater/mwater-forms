import PropTypes from "prop-types";
import React from "react";
import TextExprsComponent from "./TextExprsComponent";
export interface RosterGroupComponentProps {
    /** Design of roster group. See schema */
    rosterGroup: any;
    /** Current data of response. */
    data?: any;
    /** Called when data changes */
    onDataChange: any;
    /** (id) tells if an item is visible or not */
    isVisible: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow?: any;
    schema: any;
}
interface RosterGroupComponentState {
    /** The indices that are collapsed */
    collapsedEntries: number[];
}
export default class RosterGroupComponent extends React.Component<RosterGroupComponentProps, RosterGroupComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    constructor(props: RosterGroupComponentProps);
    getAnswerId(): any;
    getAnswer(): any;
    handleAnswerChange: (answer: any) => any;
    handleEntryDataChange: (index: any, data: any) => any;
    handleAdd: () => any;
    handleRemove: (index: any) => any;
    validate(scrollToFirstInvalid: any): Promise<boolean>;
    isChildVisible: (index: any, id: any) => any;
    handleToggle: (index: number) => void;
    renderName(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderEntryTitle(entry: any, index: any): React.CElement<import("./TextExprsComponent").TextExprsComponentProps, TextExprsComponent>;
    renderEntry(entry: any, index: any): React.DetailedReactHTMLElement<{
        key: any;
        className: string;
    }, HTMLElement>;
    renderAdd(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | undefined;
    renderEmptyPrompt(): React.DetailedReactHTMLElement<{
        style: {
            fontStyle: "italic";
        };
    }, HTMLElement>;
    render(): React.DetailedReactHTMLElement<{
        style: {
            padding: number;
            marginBottom: number;
        };
    }, HTMLElement>;
}
export {};
