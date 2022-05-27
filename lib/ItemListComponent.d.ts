import { Schema } from "mwater-expressions";
import React from "react";
import { ResponseData } from "./response";
import ResponseRow from "./ResponseRow";
export interface ItemListComponentProps {
    contents: any;
    /** Current data of response (for roster entry if in roster) */
    data?: ResponseData;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: ResponseRow;
    onDataChange: any;
    onNext?: any;
    /** (id) tells if an item is visible or not */
    isVisible: any;
    schema: Schema;
}
export default class ItemListComponent extends React.Component<ItemListComponentProps> {
    itemRefs: {
        [itemId: string]: any;
    };
    constructor(props: any);
    validate(scrollToFirstInvalid: any): Promise<boolean>;
    handleNext(index: any): any;
    renderItem: (item: any, index: any) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
