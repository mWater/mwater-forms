import React from "react";
interface AquagenxCBTDisplayComponentProps {
    value?: any;
    questionId: string;
    onEdit?: any;
    imageManager?: any;
}
export default class AquagenxCBTDisplayComponent extends React.Component<AquagenxCBTDisplayComponentProps> {
    static initClass(): void;
    handleClick: () => any;
    renderStyle(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderInfo(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderPhoto(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | undefined;
    render(): React.DetailedReactHTMLElement<{
        id: string;
    }, HTMLElement> | null;
}
export {};
