import React from "react";
interface ImagesAnswerComponentProps {
    /** array of { id: someid, caption: caption, cover: true/false } */
    imagelist?: any;
    /** Called when image list changed */
    onImagelistChange?: any;
    consentPrompt?: string;
}
interface ImagesAnswerComponentState {
    modalImageId: any;
}
export default class ImagesAnswerComponent extends React.Component<ImagesAnswerComponentProps, ImagesAnswerComponentState> {
    static initClass(): void;
    constructor(props: any);
    focus(): null;
    handleAdd: () => any;
    handleClickImage: (id: any) => void;
    renderModal(): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
