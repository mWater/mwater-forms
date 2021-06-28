import React from "react";
interface AquagenxCBTAnswerComponentProps {
    /** Value contains two entries: image and cbt */
    value?: any;
    onValueChange: any;
    questionId: string;
}
interface AquagenxCBTAnswerComponentState {
    imageModal: any;
    aquagenxModal: any;
}
export default class AquagenxCBTAnswerComponent extends React.Component<AquagenxCBTAnswerComponentProps, AquagenxCBTAnswerComponentState> {
    static initClass(): void;
    constructor(props: any);
    focus(): null;
    handleClickImage: () => void;
    handleAdd: () => any;
    handleEditClick: () => void;
    handleClearClick: () => any;
    renderImage(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderAquagenxCBT(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
