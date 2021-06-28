import React from "react";
interface ItemListComponentProps {
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
    renderItem: (item: any, index: any) => any;
    render(): any;
}
export {};
