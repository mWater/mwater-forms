export declare let title: string;
export declare let type: string;
export declare let properties: {
    _id: {
        type: string;
    };
    _rev: {
        type: string;
    };
    _basedOn: {
        type: string;
    };
    deployments: {
        type: string;
        items: {
            type: string;
            properties: {
                _id: {
                    type: string;
                };
                name: {
                    type: string;
                };
                active: {
                    type: string;
                };
                public: {
                    type: string;
                };
                contactName: {
                    type: string;
                };
                contactEmail: {
                    type: string;
                };
                enumerators: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                viewers: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                admins: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                indicatorCalculationViewers: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                enumeratorAdminFinal: {
                    type: string;
                };
                approvalStages: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            approvers: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            preventEditing: {
                                type: string;
                            };
                        };
                        required: string[];
                        additionalProperties: boolean;
                    };
                };
                entityCreationSettings: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            questionId: {
                                type: string;
                            };
                            conditions: {
                                type: string;
                            };
                            enumeratorRole: {
                                enum: string[];
                            };
                            createdFor: {
                                type: string;
                            };
                            otherRoles: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        to: {
                                            type: string;
                                        };
                                        role: {
                                            enum: string[];
                                        };
                                    };
                                    required: string[];
                                    additionalProperties: boolean;
                                };
                            };
                        };
                        required: string[];
                        additionalProperties: boolean;
                    };
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
    };
    state: {
        enum: string[];
    };
    design: {
        $schema: string;
        type: string;
        properties: {
            _type: {
                enum: string[];
            };
            _schema: {
                enum: number[];
            };
            name: {
                $ref: string;
            };
            draftNameRequired: {
                type: string;
            };
            confidentialMode: {
                type: string;
            };
            contents: {
                oneOf: ({
                    type: string;
                    maxItems: number;
                    minItems?: undefined;
                    items?: undefined;
                } | {
                    type: string;
                    minItems: number;
                    items: {
                        $ref: string;
                    };
                    maxItems?: undefined;
                })[];
            };
            locales: {
                $ref: string;
            };
            localizedStrings: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            calculations: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        _id: {
                            type: string;
                        };
                        name: {
                            $ref: string;
                        };
                        desc: {
                            $ref: string;
                        };
                        roster: {
                            type: string;
                        };
                        expr: {
                            type: string;
                        };
                    };
                    required: string[];
                    additionalProperties: boolean;
                };
            };
            entitySettings: {
                type: string;
                properties: {
                    entityType: {
                        type: string;
                    };
                    propertyLinks: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
                additionalProperties: boolean;
            };
        };
        required: string[];
        additionalProperties: boolean;
        definitions: {
            localizedString: {
                type: string;
                properties: {
                    _base: {
                        type: string;
                    };
                    _unused: {
                        type: string;
                    };
                };
                patternProperties: {
                    "^[a-z]{2,}$": {
                        type: string;
                    };
                };
                additionalProperties: boolean;
            };
            locales: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        code: {
                            type: string;
                        };
                        name: {
                            type: string;
                        };
                        custom: {
                            type: string;
                        };
                    };
                    required: string[];
                    additionalProperties: boolean;
                };
            };
            uuid: {
                type: string;
                pattern: string;
            };
            propertyLink: {
                type: string;
                properties: {
                    type: {
                        type: string;
                    };
                    propertyId: {
                        type: string;
                    };
                    direction: {
                        enum: string[];
                    };
                    questionId: {
                        type: string;
                    };
                    mappings: {};
                    alternate: {
                        type: string;
                    };
                    choice: {
                        type: string;
                    };
                    randomRadius: {
                        type: string;
                    };
                    property: {};
                    question: {};
                };
            };
            propertyId: {};
            section: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        enum: string[];
                    };
                    name: {
                        $ref: string;
                    };
                    contents: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                    conditions: {
                        $ref: string;
                    };
                    conditionExpr: {
                        type: string;
                    };
                    _basedOn: {
                        $ref: string;
                    };
                };
                required: string[];
                additionalProperties: boolean;
            };
            item: {
                type: string;
                anyOf: {
                    $ref: string;
                }[];
            };
            question: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        type: string;
                        pattern: string;
                    };
                    code: {
                        type: string;
                    };
                    text: {
                        $ref: string;
                    };
                    textExprs: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    required: {
                        type: string;
                    };
                    disabled: {
                        type: string;
                    };
                    conditions: {
                        $ref: string;
                    };
                    conditionExpr: {
                        type: string;
                    };
                    hint: {
                        $ref: string;
                    };
                    help: {
                        $ref: string;
                    };
                    sticky: {
                        type: string;
                    };
                    recordLocation: {
                        type: string;
                    };
                    recordTimestamp: {
                        type: string;
                    };
                    commentsField: {
                        type: string;
                    };
                    sensor: {
                        type: string;
                    };
                    exportId: {
                        type: string;
                    };
                    confidential: {
                        type: string;
                    };
                    confidentialRadius: {
                        type: string;
                    };
                    alternates: {
                        type: string;
                        properties: {
                            na: {
                                type: string;
                            };
                            dontknow: {
                                type: string;
                            };
                        };
                        additionalProperties: boolean;
                    };
                    validations: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                    advancedValidations: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                    _basedOn: {
                        $ref: string;
                    };
                    randomAskProbability: {
                        type: string;
                    };
                };
                required: string[];
                oneOf: {
                    $ref: string;
                }[];
            };
            instructions: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        enum: string[];
                    };
                    text: {
                        $ref: string;
                    };
                    textExprs: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    conditions: {
                        $ref: string;
                    };
                    conditionExpr: {
                        type: string;
                    };
                    disabled: {
                        type: string;
                    };
                };
                required: string[];
            };
            timer: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        enum: string[];
                    };
                    text: {
                        $ref: string;
                    };
                    duration: {
                        type: string;
                    };
                    hint: {
                        $ref: string;
                    };
                    conditions: {
                        $ref: string;
                    };
                    conditionExpr: {
                        type: string;
                    };
                };
                required: string[];
            };
            rosterGroup: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        enum: string[];
                    };
                    rosterId: {
                        $ref: string;
                    };
                    name: {
                        $ref: string;
                    };
                    hint: {
                        $ref: string;
                    };
                    conditions: {
                        $ref: string;
                    };
                    conditionExpr: {
                        type: string;
                    };
                    disabled: {
                        type: string;
                    };
                    allowAdd: {
                        type: string;
                    };
                    allowRemove: {
                        type: string;
                    };
                    emptyPrompt: {
                        $ref: string;
                    };
                    entryTitle: {
                        $ref: string;
                    };
                    entryTitleExprs: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    contents: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
            };
            rosterMatrix: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        enum: string[];
                    };
                    rosterId: {
                        $ref: string;
                    };
                    name: {
                        $ref: string;
                    };
                    hint: {
                        $ref: string;
                    };
                    conditions: {
                        $ref: string;
                    };
                    conditionExpr: {
                        type: string;
                    };
                    disabled: {
                        type: string;
                    };
                    allowAdd: {
                        type: string;
                    };
                    allowRemove: {
                        type: string;
                    };
                    emptyPrompt: {
                        $ref: string;
                    };
                    contents: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
            };
            matrixColumn: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        enum: string[];
                    };
                    text: {
                        $ref: string;
                    };
                    code: {
                        type: string;
                    };
                    required: {
                        type: string;
                    };
                    decimal: {
                        type: string;
                    };
                    units: {
                        $ref: string;
                    };
                    unitsPosition: {
                        enum: string[];
                    };
                    defaultUnits: {
                        type: string[];
                    };
                    choices: {
                        $ref: string;
                    };
                    siteType: {
                        type: string;
                    };
                    format: {
                        type: string;
                    };
                    placeholder: {
                        type: string;
                    };
                    confidential: {
                        type: string;
                    };
                    validations: {
                        type: string;
                        items: {
                            oneOf: {
                                $ref: string;
                            }[];
                        };
                    };
                };
                required: string[];
            };
            group: {
                type: string;
                properties: {
                    _id: {
                        $ref: string;
                    };
                    _type: {
                        enum: string[];
                    };
                    name: {
                        $ref: string;
                    };
                    conditions: {
                        $ref: string;
                    };
                    conditionExpr: {
                        type: string;
                    };
                    disabled: {
                        type: string;
                    };
                    contents: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
            };
            conditions: {
                type: string;
                items: {
                    $ref: string;
                };
            };
            condition: {
                type: string;
                properties: {
                    lhs: {
                        type: string;
                        properties: {
                            question: {
                                $ref: string;
                            };
                        };
                        required: string[];
                        additionalProperties: boolean;
                    };
                    op: {
                        type: string;
                    };
                    rhs: {
                        type: string;
                        properties: {
                            literal: {};
                        };
                        required: string[];
                        additionalProperties: boolean;
                    };
                };
                required: string[];
                additionalProperties: boolean;
                oneOf: {
                    $ref: string;
                }[];
            };
            conditionTypes: {
                unary: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        lhs: {};
                    };
                    additionalProperties: boolean;
                };
                text: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                };
                            };
                        };
                    };
                    required: string[];
                };
                number: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                };
                            };
                        };
                    };
                    required: string[];
                };
                choice: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                };
                            };
                        };
                    };
                    required: string[];
                };
                choices: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                    items: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                    required: string[];
                };
                date: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                };
                            };
                        };
                    };
                    required: string[];
                };
            };
            validations: {
                common: {
                    type: string;
                    properties: {
                        op: {
                            type: string;
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {};
                            };
                            additionalProperties: boolean;
                            required: string[];
                        };
                        message: {
                            $ref: string;
                        };
                    };
                    additionalProperties: boolean;
                    required: string[];
                };
                lengthRange: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                    properties: {
                                        min: {
                                            type: string;
                                        };
                                        max: {
                                            type: string;
                                        };
                                    };
                                    additionalProperties: boolean;
                                };
                            };
                        };
                    };
                };
                range: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                    properties: {
                                        min: {
                                            type: string;
                                        };
                                        max: {
                                            type: string;
                                        };
                                    };
                                    additionalProperties: boolean;
                                };
                            };
                        };
                    };
                };
                regex: {
                    type: string;
                    properties: {
                        op: {
                            enum: string[];
                        };
                        rhs: {
                            type: string;
                            properties: {
                                literal: {
                                    type: string;
                                };
                            };
                            required: string[];
                        };
                    };
                };
            };
            TextQuestion: {
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            NumberQuestion: {
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            StopwatchQuestion: {
                properties: {};
                additionalProperties: boolean;
            };
            DropdownQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            RadioQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            LikertQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            MulticheckQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            DateQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            UnitsQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            CheckQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            LocationQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            ImageQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            ImagesQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            TextListQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            SiteQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            BarcodeQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            EntityQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            AdminRegionQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            MatrixQuestion: {
                type: string;
                properties: {};
                required: string[];
                additionalProperties: boolean;
            };
            AquagenxCBTQuestion: {
                type: string;
                properties: {};
                additionalProperties: boolean;
            };
            choices: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        code: {
                            type: string;
                        };
                        label: {
                            $ref: string;
                        };
                        hint: {
                            $ref: string;
                        };
                        specify: {
                            type: string;
                        };
                        conditions: {
                            $ref: string;
                        };
                    };
                    required: string[];
                    additionalProperties: boolean;
                };
            };
            units: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                            code: {
                                type: string;
                            };
                            label: {
                                $ref: string;
                            };
                            hint: {
                                $ref: string;
                            };
                        };
                        required: string[];
                        additionalProperties: boolean;
                    };
                };
            };
            advancedValidation: {
                expr: {
                    type: string;
                };
                message: {
                    $ref: string;
                };
            };
        };
    };
    dashboard: {
        type: string;
    };
    indicatorCalculations: {
        type: string;
        items: {
            type: string;
            properties: {
                _id: {
                    type: string;
                };
                indicator: {
                    type: string;
                };
                roster: {
                    type: string;
                };
                expressions: {
                    type: string;
                };
                condition: {
                    type: string[];
                };
                datetimeExpr: {
                    type: string[];
                };
                viewers: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
    };
    isMaster: {
        type: string;
    };
    masterForm: {
        type: string;
    };
    roles: {
        type: string;
        minItems: number;
        items: {
            type: string;
            properties: {
                id: {
                    type: string;
                };
                role: {
                    enum: string[];
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
    };
    created: {
        type: string;
        properties: {
            by: {
                type: string;
            };
            on: {
                type: string;
                format: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    modified: {
        type: string;
        properties: {
            by: {
                type: string;
            };
            on: {
                type: string;
                format: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    removed: {
        type: string;
        properties: {
            by: {
                type: string;
            };
            on: {
                type: string;
                format: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
};
export declare let required: string[];
export declare let additionalProperties: boolean;
