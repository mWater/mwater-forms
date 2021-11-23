import PropTypes from "prop-types";
import React from "react";
export interface AquagenxCBTDisplayComponentProps {
    value?: any;
    questionId: string;
    onEdit?: any;
    imageManager?: any;
}
export default class AquagenxCBTDisplayComponent extends React.Component<AquagenxCBTDisplayComponentProps> {
    static contextTypes: {
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    handleClick: () => any;
    renderStyle(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderInfo(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderPhoto(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | undefined;
    render(): React.DetailedReactHTMLElement<{
        id: string;
    }, HTMLElement> | null;
}
