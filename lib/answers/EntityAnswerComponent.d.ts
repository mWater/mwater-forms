import PropTypes from "prop-types";
import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
interface EntityAnswerComponentProps {
    value?: string;
    entityType: string;
    onValueChange: any;
}
export default class EntityAnswerComponent extends AsyncLoadComponent<EntityAnswerComponentProps> {
    static contextTypes: {
        selectEntity: PropTypes.Requireable<(...args: any[]) => any>;
        editEntity: PropTypes.Requireable<(...args: any[]) => any>;
        renderEntitySummaryView: PropTypes.Validator<(...args: any[]) => any>;
        getEntityById: PropTypes.Validator<(...args: any[]) => any>;
        canEditEntity: PropTypes.Requireable<(...args: any[]) => any>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    focus(): boolean;
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): any;
    handleSelectEntity: () => any;
    handleClearEntity: () => any;
    handleEditEntity: () => any;
    renderEntityButtons(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
export {};
