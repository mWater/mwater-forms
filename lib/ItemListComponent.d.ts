import React from "react";
export interface ItemListComponentProps {
    contents: any;
    /** Current data of response (for roster entry if in roster) */
    data?: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: any;
    onDataChange: any;
    onNext?: any;
    /** (id) tells if an item is visible or not */
    isVisible: any;
    schema: any;
}
export default class ItemListComponent extends React.Component<ItemListComponentProps> {
    constructor(props: any);
    validate(scrollToFirstInvalid: any): Promise<boolean>;
    handleNext(index: any): any;
    renderItem: (item: any, index: any) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
