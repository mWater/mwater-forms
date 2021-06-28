import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
interface EntityAnswerComponentProps {
    value?: string;
    entityType: string;
    onValueChange: any;
}
export default class EntityAnswerComponent extends AsyncLoadComponent<EntityAnswerComponentProps> {
    static initClass(): void;
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
