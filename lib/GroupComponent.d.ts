import PropTypes from "prop-types";
import React from "react";
import ItemListComponent from "./ItemListComponent";
import { ResponseData } from "./response";
import ResponseRow from "./ResponseRow";
export interface GroupComponentProps {
    /** Design of group. See schema */
    group: any;
    /** Current data of response (for roster entry if in roster) */
    data?: ResponseData;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow?: ResponseRow;
    /** Called when data changes */
    onDataChange: any;
    /** (id) tells if an item is visible or not */
    isVisible: any;
    /** Called when moving out of the GroupComponent questions */
    onNext: any;
    schema: any;
}
export default class GroupComponent extends React.Component<GroupComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    itemlist: ItemListComponent | null;
    validate(scrollToFirstInvalid?: boolean): Promise<boolean>;
    render(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
