import PropTypes from "prop-types";
import React from "react";
import TextExprsComponent from "./TextExprsComponent";
import { ResponseData, RosterData } from "./response";
import ResponseRow from "./ResponseRow";
import { Schema } from "mwater-expressions";
import { RosterGroup } from "./formDesign";
export interface RosterGroupComponentProps {
    /** Design of roster group. See schema */
    rosterGroup: RosterGroup;
    /** Current data of response. */
    data: ResponseData;
    /** Called when data changes */
    onDataChange: (data: ResponseData) => void;
    /** (id) tells if an item is visible or not */
    isVisible: (id: string) => boolean;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: ResponseRow;
    schema: Schema;
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
    getAnswerId(): string;
    getAnswer(): RosterData;
    handleAnswerChange: (answer: any) => void;
    handleEntryDataChange: (index: any, data: any) => void;
    handleAdd: () => void;
    handleRemove: (index: any) => void;
    validate(scrollToFirstInvalid: any): Promise<boolean>;
    isChildVisible: (index: any, id: any) => boolean;
    handleToggle: (index: number) => void;
    renderName(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderEntryTitle(entry: any, index: any): React.CElement<import("./TextExprsComponent").TextExprsComponentProps, TextExprsComponent>;
    renderEntry(entry: any, index: any): React.DetailedReactHTMLElement<{
        key: any;
        className: string;
    }, HTMLElement>;
    renderAdd(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
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
