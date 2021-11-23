import PropTypes from "prop-types";
import React from "react";
export interface SectionsComponentProps {
    contents: any;
    /** Current data of response. */
    data?: any;
    onDataChange: any;
    /** Schema to use, including form */
    schema: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: any;
    /** (id) tells if an item is visible or not */
    isVisible: any;
    /** Called when submit is pressed */
    onSubmit?: any;
    /** Optional save for later */
    onSaveLater?: any;
    onDiscard?: any;
}
interface SectionsComponentState {
    sectionNum: any;
}
export default class SectionsComponent extends React.Component<SectionsComponentProps, SectionsComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    constructor(props: any);
    handleSubmit: () => Promise<any>;
    hasPreviousSection(): boolean;
    hasNextSection(): boolean;
    nextVisibleSectionIndex(index: any, increment: any): any;
    handleBackSection: () => any;
    handleNextSection: () => Promise<any>;
    handleBreadcrumbClick: (index: any) => void;
    handleItemListNext: () => any;
    renderBreadcrumbs(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
    renderSection(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderButtons(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
