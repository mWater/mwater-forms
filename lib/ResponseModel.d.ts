declare const _default: {
    new (options: any): {
        draft(deploymentId: any): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        redraft(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        listEnumeratorDeployments(): unknown[];
        saveForLater(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        submit(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        canSubmit(): boolean;
        approve(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        reject(message: any): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        recordEdit(): any;
        _finalize(): string;
        _unfinalize(): void;
        updateEntities(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        fixRoles(): any;
        canApprove(): boolean;
        amApprover(): boolean;
        canDelete(): boolean;
        canEdit(): boolean;
        canRedraft(): any;
        canReject(): boolean | undefined;
        _addEvent(type: any, attrs?: {}): any;
    };
};
export default _default;
