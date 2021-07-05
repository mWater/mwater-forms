import PropTypes from "prop-types";
import React from "react";
interface GroupComponentProps {
    /** Design of group. See schema */
    group: any;
    /** Current data of response (for roster entry if in roster) */
    data?: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow?: any;
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
    validate(scrollToFirstInvalid: any): any;
    render(): any;
}
export {};
