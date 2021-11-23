import PropTypes from "prop-types";
import React from "react";
import { default as LocationEditorComponent } from "../LocationEditorComponent";
export interface LocationAnswerComponentProps {
    value?: any;
    onValueChange: any;
    disableSetByMap?: boolean;
    disableManualLatLng?: boolean;
}
export default class LocationAnswerComponent extends React.Component<LocationAnswerComponentProps> {
    static contextTypes: {
        displayMap: PropTypes.Requireable<(...args: any[]) => any>;
        T: PropTypes.Validator<(...args: any[]) => any>;
        locationFinder: PropTypes.Requireable<object>;
    };
    focus(): null;
    handleUseMap: () => any;
    render(): React.CElement<import("../LocationEditorComponent").Props, LocationEditorComponent>;
}
