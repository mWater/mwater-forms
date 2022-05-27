"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    _type: "Form",
    _schema: 11,
    name: {
        _base: "en",
        en: "Sample Form"
    },
    contents: [
        {
            _id: "02",
            _type: "Section",
            name: {
                _base: "en",
                en: "Introduction and informed consent"
            },
            contents: [
                {
                    _type: "EntityQuestion",
                    _id: "c62713deb30543478f925988cf0d5059",
                    text: {
                        _base: "en",
                        en: "Entity Question"
                    },
                    conditions: [],
                    validations: [],
                    propertyLinks: [
                        {
                            questionId: "febdcbd89bed40799f92951729b6d360",
                            propertyId: null,
                            direction: "load",
                            type: null
                        }
                    ],
                    required: true,
                    entityType: "surface_water"
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "d9711b421f73446489ade6ef1de02e9b",
                    text: {
                        _base: "en",
                        en: "q"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "a"
                            },
                            id: "b7WDtcm"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "b"
                            },
                            id: "HGXhDxQ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "WxYNPVw",
                            specify: true
                        }
                    ]
                },
                {
                    _id: "e0d0108079ce44c98c90f053db7a814a",
                    _type: "Instructions",
                    text: {
                        _base: "en",
                        en: "My name is ______ and I am working with Water.org, a non-governmental organization from the United States, and we are conducting a study of loans issued by [name of partner organization] for water and sanitation."
                    },
                    conditions: []
                },
                {
                    _type: "DropdownQuestion",
                    _id: "febdcbd89bed40799f92951729b6d360",
                    text: {
                        _base: "en",
                        en: "Have you taken a loan with [name of partner organization]?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "He8psmv"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "XX52gjb"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other"
                            },
                            specify: true,
                            id: "8X52gj3"
                        }
                    ]
                },
                {
                    _type: "RadioQuestion",
                    _id: "dd7ffa2f8cf9423fbf814d710a3e55a4",
                    text: {
                        _base: "en",
                        en: "Are you the head of the household?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "ChFvwt8"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "AK51bEJ"
                        }
                    ]
                },
                {
                    _id: "d282a1abe0a443cc8a703328df59ae1d",
                    _type: "Instructions",
                    text: {
                        _base: "en",
                        en: "We would like to ask you to participate in our study. The information you give us will be kept confidential, and we will not share it with anyone outside of Water.org without your permission.\n\nThe purpose of this study is to better understand the effects of our partnership with [name of partner organization] and to make improvements in future programs. We would like to talk with you about your experiences with your loan.\n\nWe will ask you some questions and mark the answers down on a questionnaire form. This will take about 15-20 minutes.\n\nWe have spoken with [name of organization] and they are happy to speak to you about this study at any time."
                    },
                    conditions: []
                },
                {
                    _type: "TextListQuestion",
                    _id: "f01f693d48ab40aaaf8e391ec2a5c4c3",
                    text: {
                        _base: "en",
                        en: "Do you have any questions about this study?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    hint: {
                        _base: "en",
                        en: "make note of and answer any questions"
                    },
                    help: {
                        _base: "en",
                        en: "This type of question is a text list. Once you enter one response, another blank will appear in case there are more responses given. Leave the last one blank and move on when you are done."
                    },
                    alternates: {
                        na: true
                    }
                },
                {
                    _type: "RadioQuestion",
                    _id: "e5a20d5e994548d587fc2ce337a66a47",
                    text: {
                        _base: "en",
                        en: "Are you willing to participate in our study?"
                    },
                    conditions: [],
                    validations: [],
                    required: true,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "f74jcRn"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "lp82Hmq"
                        }
                    ]
                }
            ],
            conditions: []
        },
        {
            _id: "ff263f18510f4d1fb3157c7011fd7bce",
            _type: "Section",
            name: {
                _base: "en",
                en: "Basic Information"
            },
            contents: [
                {
                    _type: "TextQuestion",
                    _id: "c11d1865674d4498a2adbeddc440230f",
                    text: {
                        _base: "en",
                        en: "Name of partner organization"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "TextQuestion",
                    _id: "fd620bf420a54dcd99dbae7b7c67a67c",
                    text: {
                        _base: "en",
                        en: "Program Number"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "TextQuestion",
                    _id: "fd9d11792d20463eb66f2f84e73e89ce",
                    text: {
                        _base: "en",
                        en: "Community Name"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "RadioQuestion",
                    _id: "dd3e368b55d74e1cb91e9ecfe108a521",
                    text: {
                        _base: "en",
                        en: "Community Type"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Rural"
                            },
                            id: "G3eCbdA"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Urban"
                            },
                            id: "fR1Aez8"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Peri-urban"
                            },
                            id: "JkPKPFd"
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "fb2aa62eee3b4df7bee1b7ddf49846c9",
                    text: {
                        _base: "en",
                        en: "District Name"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "TextQuestion",
                    _id: "e8879403f45b426483bbb4946cf43bce",
                    text: {
                        _base: "en",
                        en: "State Name"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "TextQuestion",
                    _id: "dc9e436604bf4cea8f4b85ac25699b34",
                    text: {
                        _base: "en",
                        en: "Borrower Name"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "TextQuestion",
                    _id: "d607ad59f6b743d59d4c7438a1f927da",
                    text: {
                        _base: "en",
                        en: "Survey Respondent Name"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "DropdownQuestion",
                    _id: "f1f3a97ec2994c2a89538aa777096433",
                    text: {
                        _base: "en",
                        en: "Loan Category"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "SHG"
                            },
                            id: "Gx4Vrz9"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "JLG"
                            },
                            id: "x38NGmS"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Individual"
                            },
                            id: "5cJCVjJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "CBO"
                            },
                            id: "mBbhz6Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "5wQ34mW",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "LocationQuestion",
                    _id: "f4b2d7f77a1743a398fd3952f63978f2",
                    text: {
                        _base: "en",
                        en: "Set your current location"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    hint: {
                        _base: "en",
                        en: 'Note: future versions could use the new mWater site type "Household," allowing the surveyor to revisit the same location and add new surveys.'
                    }
                },
                {
                    _type: "TextQuestion",
                    _id: "ef201d2105364a53a8939b475671e00b",
                    text: {
                        _base: "en",
                        en: "Interviewer Name"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "DateQuestion",
                    _id: "c8813152fa044c39beeeb31a8871633e",
                    text: {
                        _base: "en",
                        en: "Date"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "YYYY-MM-DD"
                },
                {
                    _type: "TextQuestion",
                    _id: "cfa7a895786f4ebf85f11e68339b9b07",
                    text: {
                        _base: "en",
                        en: "Comments on this section"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                }
            ],
            conditions: [
                {
                    lhs: {
                        question: "e5a20d5e994548d587fc2ce337a66a47"
                    },
                    op: "is",
                    rhs: {
                        literal: "f74jcRn"
                    }
                }
            ]
        },
        {
            _id: "e82c08c1ca7748be983aa828c15ff7a7",
            _type: "Section",
            name: {
                _base: "en",
                en: "Borrower Profile"
            },
            contents: [
                {
                    _type: "RadioQuestion",
                    _id: "c12206a314d7463b979e67d782d9df3b",
                    text: {
                        _base: "en",
                        en: "Gender"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Male"
                            },
                            id: "N8u8f9w"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Female"
                            },
                            id: "PQlfvYC"
                        }
                    ]
                },
                {
                    _type: "NumberQuestion",
                    _id: "c33c0ae91651405399ed679478e04269",
                    text: {
                        _base: "en",
                        en: "Age"
                    },
                    conditions: [],
                    validations: [
                        {
                            message: {
                                _base: "en",
                                en: "Age must be between 0 and 129"
                            },
                            op: "range",
                            rhs: {
                                literal: {
                                    min: 0,
                                    max: 129
                                }
                            }
                        }
                    ],
                    required: false,
                    decimal: false
                },
                {
                    _type: "DropdownQuestion",
                    _id: "de02cb37a5e1490b890bd8603c9c2501",
                    text: {
                        _base: "en",
                        en: "Marital Status"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Single"
                            },
                            id: "tXzHJ7Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Married"
                            },
                            id: "54A5rH2"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Widowed"
                            },
                            id: "exeqNYZ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Divorced"
                            },
                            id: "1jnB1jY"
                        }
                    ]
                },
                {
                    _id: "f8c8d739e44e423da9cfdcb434a35f9e",
                    _type: "Instructions",
                    text: {
                        _base: "en",
                        en: "Including yourself, how many of the following live in your household?"
                    },
                    conditions: []
                },
                {
                    _type: "NumberQuestion",
                    _id: "caf3c3d164b348f8b46ef2df74ac5bf0",
                    text: {
                        _base: "en",
                        en: "Adult Female (18 and older)"
                    },
                    conditions: [],
                    validations: [
                        {
                            message: {
                                _base: "en",
                                en: "Must be between 0 and 20!"
                            },
                            op: "range",
                            rhs: {
                                literal: {
                                    min: 0,
                                    max: 20
                                }
                            }
                        }
                    ],
                    required: false,
                    decimal: false
                },
                {
                    _type: "NumberQuestion",
                    _id: "f69dda4c16364c0b9aa4bf97cef54558",
                    text: {
                        _base: "en",
                        en: "Girls (under 18)"
                    },
                    conditions: [],
                    validations: [
                        {
                            message: {
                                _base: "en",
                                en: "Must be between 0 and 20!"
                            },
                            op: "range",
                            rhs: {
                                literal: {
                                    min: 0,
                                    max: 20
                                }
                            }
                        }
                    ],
                    required: false,
                    decimal: false
                },
                {
                    _type: "NumberQuestion",
                    _id: "e6a5ce853f5c439fb082589d2ad306a7",
                    text: {
                        _base: "en",
                        en: "Adult Male (18 and older)"
                    },
                    conditions: [],
                    validations: [
                        {
                            message: {
                                _base: "en",
                                en: "Must be between 0 and 20!"
                            },
                            op: "range",
                            rhs: {
                                literal: {
                                    min: 0,
                                    max: 20
                                }
                            }
                        }
                    ],
                    required: false,
                    decimal: false
                },
                {
                    _type: "NumberQuestion",
                    _id: "e198b88259e64f30ab9a32ffe83bd72a",
                    text: {
                        _base: "en",
                        en: "Boys (under 18)"
                    },
                    conditions: [],
                    validations: [
                        {
                            message: {
                                _base: "en",
                                en: "Must be between 0 and 20!"
                            },
                            op: "range",
                            rhs: {
                                literal: {
                                    min: 0,
                                    max: 20
                                }
                            }
                        }
                    ],
                    required: false,
                    decimal: false
                },
                {
                    _type: "NumberQuestion",
                    _id: "e63a18731c7442be91856ef4b2fc3096",
                    text: {
                        _base: "en",
                        en: "Number of people using the loan product"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    decimal: false
                },
                {
                    _type: "RadioQuestion",
                    _id: "fdae9e45bc944946a82f56f8116fbc19",
                    text: {
                        _base: "en",
                        en: "Is this your first loan with the partner organization?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "5tPu6y9"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "fcAayxx"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "EjKa2w3"
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "f86282d6be514d05bd5ce84cdb42eb75",
                    text: {
                        _base: "en",
                        en: "Comments on this section"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                }
            ],
            conditions: [
                {
                    lhs: {
                        question: "e5a20d5e994548d587fc2ce337a66a47"
                    },
                    op: "is",
                    rhs: {
                        literal: "f74jcRn"
                    }
                }
            ]
        },
        {
            _id: "c1e4f9f82ffb4b10bf94e15d1a8079fc",
            _type: "Section",
            name: {
                _base: "en",
                en: "General Questions"
            },
            contents: [
                {
                    _type: "RadioQuestion",
                    _id: "c3fec3edb3db44369d9e3b60de5d1fc3",
                    text: {
                        _base: "en",
                        en: "For what purpose did you take this loan?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Water Connection"
                            },
                            id: "ABjqKHE"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Toilet"
                            },
                            id: "NTZJz6y"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Water and Sanitation"
                            },
                            id: "WwkaB4j"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "wbCVg89",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "d868991b0759480baf3cf010a8199dba",
                    text: {
                        _base: "en",
                        en: "Why did you construct this product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "f4272504af424ce38853ad482505c68d",
                    text: {
                        _base: "en",
                        en: "Who in your family made the final decision to take out a loan for the construction of your water or sanitation product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Myself"
                            },
                            id: "QgQfZXh"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Husband"
                            },
                            id: "KmKRkPu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Wife"
                            },
                            id: "QMB3NNt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Child"
                            },
                            id: "5hVj8bP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Parent"
                            },
                            id: "WdNBGKC"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "In-laws"
                            },
                            id: "E66wp9B"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other family members"
                            },
                            id: "QNNRpqJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "S3GKS4Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "WFbX3Jd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "wD5SApk",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "RadioQuestion",
                    _id: "dc962057c1644afc9c452eb2bd9acfc2",
                    text: {
                        _base: "en",
                        en: "How easy was it for you to get a water or sanitation loan?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Very Easy"
                            },
                            id: "nwY5RT2"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Somewhat Easy"
                            },
                            id: "WUQVsqs"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Not Very Easy"
                            },
                            id: "MxulPZt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Difficult"
                            },
                            id: "KychhEw"
                        }
                    ]
                },
                {
                    _type: "DateQuestion",
                    _id: "c356188afabb4685ad6260e1fa87b20a",
                    text: {
                        _base: "en",
                        en: "When did you take out the loan?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "YYYY-MM-DD"
                },
                {
                    _type: "UnitsQuestion",
                    _id: "e171f9dd877549d399f0c9f9eaa63078",
                    text: {
                        _base: "en",
                        en: "What was the total value of your loan?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    units: [
                        {
                            label: {
                                _base: "en",
                                en: "USD"
                            },
                            id: "AtA291e",
                            hint: {
                                _base: "en",
                                en: "US Dollars"
                            }
                        },
                        {
                            label: {
                                _base: "en",
                                en: "INR"
                            },
                            id: "PQBE8jh",
                            hint: {
                                _base: "en",
                                en: "Indian Rupees"
                            }
                        }
                    ],
                    defaultUnits: "AtA291e",
                    unitsPosition: "prefix",
                    decimal: true
                },
                {
                    _type: "UnitsQuestion",
                    _id: "f353139bc0ff4b0d981e0d86396cf539",
                    text: {
                        _base: "en",
                        en: "What was the interest rate on your loan?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    units: [
                        {
                            label: {
                                _base: "en",
                                en: "%"
                            },
                            id: "fDNFt3p"
                        }
                    ],
                    defaultUnits: "fDNFt3p",
                    unitsPosition: "suffix",
                    decimal: true
                },
                {
                    _type: "RadioQuestion",
                    _id: "df578e8d74704852b1490d6bfacd92d7",
                    text: {
                        _base: "en",
                        en: "Are you still making loan payments?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "AwWqxGt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "h2bGB9K"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "bZbhZUl"
                        }
                    ]
                },
                {
                    _type: "UnitsQuestion",
                    _id: "fc8fbae5fb314541a33928d1dd948e09",
                    text: {
                        _base: "en",
                        en: "How much is your total loan payment?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    units: [
                        {
                            label: {
                                _base: "en",
                                en: "USD"
                            },
                            id: "waAFjmU",
                            hint: {
                                _base: "en",
                                en: "US Dollars"
                            }
                        },
                        {
                            label: {
                                _base: "en",
                                en: "INR"
                            },
                            id: "Mb6jxms",
                            hint: {
                                _base: "en",
                                en: "Indian Rupees"
                            }
                        }
                    ],
                    defaultUnits: "waAFjmU",
                    unitsPosition: "prefix",
                    decimal: true,
                    hint: {
                        _base: "en",
                        en: "note to interviewer: includes payment and interest (P+I)"
                    }
                },
                {
                    _type: "UnitsQuestion",
                    _id: "c7145ca0dc4e41f1a831d5c578bd9c60",
                    text: {
                        _base: "en",
                        en: "What was the total cost of the product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    units: [
                        {
                            label: {
                                _base: "en",
                                en: "USD"
                            },
                            id: "waAFjmU",
                            hint: {
                                _base: "en",
                                en: "US Dollars"
                            }
                        },
                        {
                            label: {
                                _base: "en",
                                en: "INR"
                            },
                            id: "Mb6jxms",
                            hint: {
                                _base: "en",
                                en: "Indian Rupees"
                            }
                        }
                    ],
                    defaultUnits: "waAFjmU",
                    unitsPosition: "prefix",
                    decimal: true
                },
                {
                    _type: "RadioQuestion",
                    _id: "e420d12c1ed54056994139a98939f44d",
                    text: {
                        _base: "en",
                        en: "Did the loan cover the entire cost of construction?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "VADGJjr"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "dRn6UC6"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "ZuxYwGY"
                        }
                    ]
                },
                {
                    _type: "UnitsQuestion",
                    _id: "f81beac190fc492684ddc507e72e2131",
                    text: {
                        _base: "en",
                        en: "How much more did you pay above the loan amount?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "e420d12c1ed54056994139a98939f44d"
                            },
                            op: "is",
                            rhs: {
                                literal: "dRn6UC6"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    units: [
                        {
                            label: {
                                _base: "en",
                                en: "USD"
                            },
                            id: "PbwGQwU"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "INR"
                            },
                            id: "eaTAMT7"
                        }
                    ],
                    defaultUnits: "PbwGQwU",
                    unitsPosition: "prefix",
                    decimal: true
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "fec0ec4f49f342be8180a9fdc3cc45af",
                    text: {
                        _base: "en",
                        en: "How did you pay for the additional amount?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "e420d12c1ed54056994139a98939f44d"
                            },
                            op: "is",
                            rhs: {
                                literal: "dRn6UC6"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Current income"
                            },
                            id: "YGTtWvg"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Savings"
                            },
                            id: "kAuXFDe"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Took on additional work"
                            },
                            id: "MYUvfTN"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Borrowed from relative/friend"
                            },
                            id: "EXfPpHu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Money lender"
                            },
                            id: "ZBmk8yK"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Additional formal loan"
                            },
                            id: "wZGC8qS"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "KPSzYpz",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "RadioQuestion",
                    _id: "cf6f718f7f064fb1af55f13ecfe17c7b",
                    text: {
                        _base: "en",
                        en: "Do you have a source of income?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "VADGJjr"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "dRn6UC6"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "ZuxYwGY"
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "c77b5bd6e5b841c6aeb37c00ccd78e0a",
                    text: {
                        _base: "en",
                        en: "What is your occupation?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "cf6f718f7f064fb1af55f13ecfe17c7b"
                            },
                            op: "is",
                            rhs: {
                                literal: "VADGJjr"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    format: "singleline",
                    commentsField: false
                },
                {
                    _type: "RadioQuestion",
                    _id: "dd0e2ba379384c7d9b184db6d9c1cecf",
                    text: {
                        _base: "en",
                        en: "Does your spouse have a source of income?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "VADGJjr"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "dRn6UC6"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "ZuxYwGY"
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "c1d1ea9cc3a549468ed88d7db4de3a1e",
                    text: {
                        _base: "en",
                        en: "What is your spouse's occupation?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "dd0e2ba379384c7d9b184db6d9c1cecf"
                            },
                            op: "is",
                            rhs: {
                                literal: "VADGJjr"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "UnitsQuestion",
                    _id: "fe4279f6f59c4930842ac1bdc3909539",
                    text: {
                        _base: "en",
                        en: "Total amount of monthly income?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    units: [
                        {
                            label: {
                                _base: "en",
                                en: "USD"
                            },
                            id: "23UG7Nw",
                            hint: {
                                _base: "en",
                                en: "US Dollars"
                            }
                        },
                        {
                            label: {
                                _base: "en",
                                en: "INR"
                            },
                            id: "jlpD7dR",
                            hint: {
                                _base: "en",
                                en: "Indian Rupees"
                            }
                        }
                    ],
                    defaultUnits: "23UG7Nw",
                    unitsPosition: "prefix",
                    decimal: true
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "c4023ab7941e45c5bb285303b61d3670",
                    text: {
                        _base: "en",
                        en: "Who earns the income in your family from which the loan is paid?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Myself"
                            },
                            id: "QgQfZXh"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Husband"
                            },
                            id: "KmKRkPu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Wife"
                            },
                            id: "QMB3NNt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Child"
                            },
                            id: "5hVj8bP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Parent"
                            },
                            id: "WdNBGKC"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "In-laws"
                            },
                            id: "E66wp9B"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other family members"
                            },
                            id: "QNNRpqJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "S3GKS4Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "WFbX3Jd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "wD5SApk",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "c4a46b9d93284c7abb44e01dda98bef4",
                    text: {
                        _base: "en",
                        en: "Who is responsible for managing your household's income?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Myself"
                            },
                            id: "QgQfZXh"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Husband"
                            },
                            id: "KmKRkPu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Wife"
                            },
                            id: "QMB3NNt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Child"
                            },
                            id: "5hVj8bP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Parent"
                            },
                            id: "WdNBGKC"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "In-laws"
                            },
                            id: "E66wp9B"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other family members"
                            },
                            id: "QNNRpqJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "S3GKS4Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "WFbX3Jd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "wD5SApk",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "f98037ac67a34878bcb2d41c4d0dd8f9",
                    text: {
                        _base: "en",
                        en: "Who manages the WASH loan in your family?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Myself"
                            },
                            id: "QgQfZXh"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Husband"
                            },
                            id: "KmKRkPu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Wife"
                            },
                            id: "QMB3NNt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Child"
                            },
                            id: "5hVj8bP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Parent"
                            },
                            id: "WdNBGKC"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "In-laws"
                            },
                            id: "E66wp9B"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other family members"
                            },
                            id: "QNNRpqJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "S3GKS4Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "WFbX3Jd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "wD5SApk",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "dcc909bb936945f1855dd836faf900e0",
                    text: {
                        _base: "en",
                        en: "Who legally owns the property on which the improvement is or will be located?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Myself"
                            },
                            id: "QgQfZXh"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Husband"
                            },
                            id: "KmKRkPu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Wife"
                            },
                            id: "QMB3NNt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Child"
                            },
                            id: "5hVj8bP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Parent"
                            },
                            id: "WdNBGKC"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "In-laws"
                            },
                            id: "E66wp9B"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other family members"
                            },
                            id: "QNNRpqJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "S3GKS4Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "WFbX3Jd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "wD5SApk",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "RadioQuestion",
                    _id: "c148531908c347299d0e17a18e746ceb",
                    text: {
                        _base: "en",
                        en: "Has the construction of the product been completed?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "4R9Cz6L"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "pNMRZQz"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "NXhqQFM"
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "c3780daae10e42f88ddce387cb390a9f",
                    text: {
                        _base: "en",
                        en: "Who constructed the product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Construction worker"
                            },
                            id: "QgQfZXh"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Utility"
                            },
                            id: "KmKRkPu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Myself"
                            },
                            id: "QMB3NNt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Husband"
                            },
                            id: "5hVj8bP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Wife"
                            },
                            id: "WdNBGKC"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Child"
                            },
                            id: "E66wp9B"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Parent"
                            },
                            id: "QNNRpqJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "In-laws"
                            },
                            id: "S3GKS4Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other family members"
                            },
                            id: "WFbX3Jd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "uFLbHAP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "qTsgwp6"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "B2FEj61",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "cd4c8f0e309c49eb8c4f060d7a7f7c24",
                    text: {
                        _base: "en",
                        en: "Who in your household was responsible for overseeing the construction of the product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Construction worker"
                            },
                            id: "QgQfZXh"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Utility"
                            },
                            id: "KmKRkPu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Myself"
                            },
                            id: "QMB3NNt"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Husband"
                            },
                            id: "5hVj8bP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Wife"
                            },
                            id: "WdNBGKC"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Child"
                            },
                            id: "E66wp9B"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Parent"
                            },
                            id: "QNNRpqJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "In-laws"
                            },
                            id: "S3GKS4Z"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other family members"
                            },
                            id: "WFbX3Jd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "uFLbHAP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "qTsgwp6"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "B2FEj61",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "RadioQuestion",
                    _id: "dbda7199d9434dafb6e69eeff18c5017",
                    text: {
                        _base: "en",
                        en: "Did you family receive any technical assistance prior to or during the construction of the product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "Z77xGf9"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "8pka8XB"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "zTJUkdY"
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "c1f972ee11214a3db96be6cbce6001a3",
                    text: {
                        _base: "en",
                        en: "Who provided technical assistance?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "dbda7199d9434dafb6e69eeff18c5017"
                            },
                            op: "is",
                            rhs: {
                                literal: "Z77xGf9"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Construction worker"
                            },
                            id: "cACuf6q"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Utility"
                            },
                            id: "x8hgGDm"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Family members"
                            },
                            id: "ASKHDYs"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Friends"
                            },
                            id: "usyu4hJ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Partner organization"
                            },
                            id: "xCSrzZq"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "bfKqgKf",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "DateQuestion",
                    _id: "e376855cd8a04ec0b01387b9ef957b59",
                    text: {
                        _base: "en",
                        en: "When did the household begin using the product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "YYYY-MM-DD"
                },
                {
                    _type: "RadioQuestion",
                    _id: "c64ae71cfb9f4b87837bec6405196121",
                    text: {
                        _base: "en",
                        en: "Is the product functioning?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "tLbASjM"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "dX5VTMP"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "f3Hd3jw"
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "ca3ada0340c945228b7ed6d5d0b50bb0",
                    text: {
                        _base: "en",
                        en: "What is needed for it to function?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "c64ae71cfb9f4b87837bec6405196121"
                            },
                            op: "is",
                            rhs: {
                                literal: "dX5VTMP"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "More money"
                            },
                            id: "lGdel6g"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Technical support"
                            },
                            id: "ut5p4wl"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Construction workers"
                            },
                            id: "ge5A5LV"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "YNpkDL1",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "DateQuestion",
                    _id: "fc48504f35494151951bacd5d8c3326e",
                    text: {
                        _base: "en",
                        en: "When will this be completed?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "c64ae71cfb9f4b87837bec6405196121"
                            },
                            op: "is",
                            rhs: {
                                literal: "dX5VTMP"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    format: "YYYY-MM-DD"
                },
                {
                    _type: "RadioQuestion",
                    _id: "dd3a5e84feb64b27aa844c5b93fd91f5",
                    text: {
                        _base: "en",
                        en: "Are you satisfied with the product?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "zlhWY1F"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "QnPl8pv"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "3b9DWTM"
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "f53fac5bd6fa4c879a28b96eea82aec3",
                    text: {
                        _base: "en",
                        en: "Why are you not satisfied with the product?"
                    },
                    conditions: [
                        {
                            lhs: {
                                question: "dd3a5e84feb64b27aa844c5b93fd91f5"
                            },
                            op: "is",
                            rhs: {
                                literal: "QnPl8pv"
                            }
                        }
                    ],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "RadioQuestion",
                    _id: "fdfa80606bf04233b12afa7c70a733e1",
                    text: {
                        _base: "en",
                        en: "Would you recommend the product to others?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "BNcJvmQ"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "baVQAjS"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "I don't know"
                            },
                            id: "n5TxTs5"
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "f589e22d9b5044e283a93d38128055ee",
                    text: {
                        _base: "en",
                        en: "Why?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "dac79ea65ba44e48a6c1e4f4a21c4ca9",
                    text: {
                        _base: "en",
                        en: "What activities were you involved in through the partner before you decided to take out a loan?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Borrower meetings"
                            },
                            id: "ul1UwRd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Community meetings"
                            },
                            id: "mNETvYr"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Government meetings"
                            },
                            id: "RPZr7bE"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Technical training"
                            },
                            id: "rEqDzkT"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Education"
                            },
                            id: "eln2Jxu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "Y2tkX8E",
                            specify: true
                        }
                    ]
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "eea26d7b37534051b112a0e668180fa3",
                    text: {
                        _base: "en",
                        en: "Which of these activities were most helpful?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Borrower meetings"
                            },
                            id: "ul1UwRd"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Community meetings"
                            },
                            id: "mNETvYr"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Government meetings"
                            },
                            id: "RPZr7bE"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Technical training"
                            },
                            id: "rEqDzkT"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Education"
                            },
                            id: "eln2Jxu"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "Other (please specify)"
                            },
                            id: "Y2tkX8E",
                            specify: true
                        }
                    ]
                },
                {
                    _id: "d40f460352ff42dd82322eed09708a6c",
                    _type: "Instructions",
                    text: {
                        _base: "en",
                        en: "The rest of this section is for staff only. Staff instructions: Ask to see the passbook, repayment receipts, signed loan agreement, or letter of offer and note the following:"
                    },
                    conditions: []
                },
                {
                    _type: "MulticheckQuestion",
                    _id: "de3a220137314f999633188b335cf14a",
                    text: {
                        _base: "en",
                        en: "Does the information provided by the borrower match the partner MIS?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "DMecnnl"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "P4Eh17E"
                        }
                    ]
                },
                {
                    _type: "UnitsQuestion",
                    _id: "caef6b8465344415bdc9f50d91c72a03",
                    text: {
                        _base: "en",
                        en: "What is the interest rate?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    units: [
                        {
                            label: {
                                _base: "en",
                                en: "%"
                            },
                            id: "qGDwkj1"
                        }
                    ],
                    defaultUnits: "qGDwkj1",
                    unitsPosition: "suffix",
                    decimal: true
                },
                {
                    _type: "RadioQuestion",
                    _id: "f359f99671b34fcab55380a9d553fd66",
                    text: {
                        _base: "en",
                        en: "Is the payment information up to date?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    choices: [
                        {
                            label: {
                                _base: "en",
                                en: "Yes"
                            },
                            id: "malTJU8"
                        },
                        {
                            label: {
                                _base: "en",
                                en: "No"
                            },
                            id: "summ2Vp"
                        }
                    ]
                },
                {
                    _type: "TextQuestion",
                    _id: "e3c5930bea694ea0902db1bf4d3e796b",
                    text: {
                        _base: "en",
                        en: "Comments on this section?"
                    },
                    conditions: [],
                    validations: [],
                    required: false,
                    format: "singleline"
                }
            ],
            conditions: [
                {
                    lhs: {
                        question: "e5a20d5e994548d587fc2ce337a66a47"
                    },
                    op: "is",
                    rhs: {
                        literal: "f74jcRn"
                    }
                }
            ]
        }
    ],
    locales: [
        {
            code: "en",
            name: "English"
        }
    ]
};
