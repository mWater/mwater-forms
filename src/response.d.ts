/** Response to a survey form */
export interface Response {
  /** Unique id of response */
  _id: string

  /** Revision of response */
  _rev: number

  /** String code of the response. Unique-ish and short enough for human use */
  code?: string
  
  /** _id of form that this is for */
  form: string

  /** _rev of the form this was based on */
  formRev: number

  /** _id of the deployment that this response is part of */
  deployment: string

  /** Current successful approval list */
  approvals?: ResponseApproval[]
  
  /** User _id who started the response */
  user?: string | null

  /** Username of user (virtual field) */
  username?: string | null

  /** Current status. Can go from draft->final if no approval stages */
  status: "draft" | "pending" | "rejected" | "final"

  /** Rejection message if in rejected state */
  rejectionMessage?: string

  /** Response data. Organized by question id. */
  data: ResponseData

  /** Permissions on response */
  roles: ResponseRole[]

  /** When response was started (ISO8601) */
  startedOn: string

  /** When response was last submitted (to pending or final) */
  submittedOn?: string

  /** Name of draft */
  draftName?: string

  /** Array of entity references in response. */
  entities?: EntityRef[]

  /** Events that have happened to response */
  events?: ResponseEvent[]

  // # Array of pending entity creates
  // pendingEntityCreates: {
  //   type: "array" 
  //   items: {
  //     type: "object" 
  //     properties: {
  //       questionId: { type: "string" }     # Question which is creating the entity
  //       entityType: { type: "string" }     # Type of the entity
  //       entity: { type: "object" }         # Entity object to create. _id and _roles already set.
  //     }
  //     required: ["questionId", "entityType", "entity"]
  //     additionalProperties: false
  //   }          
  // }

  // # Array of pending entity creates
  // pendingEntityUpdates: {
  //   type: "array" 
  //   items: {
  //     type: "object" 
  //     properties: {
  //       questionId: { type: "string" }     # Question which is creating the entity
  //       entityType: { type: "string" }     # Type of the entity
  //       entityId: { type: "string" }       # _id of entity to update
  //       updates: { type: "object" }        # Entity properties to update
  //     }
  //     required: ["questionId", "entityType", "entityId", "updates"]
  //     additionalProperties: false
  //   }          
  // }
    
  created: {
    /** ISO8601 datetime */
    on: string
  
    /** User _id */
    by: string
  }

  modified?: {
    /** ISO8601 datetime */
    on: string

    /** User _id */
    by: string
  }

  removed?: {
    /** ISO8601 datetime */
    on: string
  
    /** User _id */
    by: string
  }

  /** Assignement _id associated to the response */
  assignment?: string
  ipAddress?: string
    
  /** The confidential data if the form has confidential mode true */
  confidentialData?: ConfidentialData
}

interface ResponseApproval {
  /** User id who did approval */
  by: string
  
  /** When (ISO8601) */
  on: string
  
  /** True if was done by an admin, not the normal approver */
  override?: boolean
}

interface EntityRef {
  /** Question _id */
  question: string

  /** e.g. "water_point" */
  entityType: string

  /** property code (e.g "_id" or "code") of entity that is referenced in value e.g. "code" */
  property: { type: "string" } 

  /** Value of entity property that is referenced */
  value: any

  /** _id of roster entry, null if not in roster */
  roster: string | null
}

interface ResponseRole {
  /** Subject (user:xyz or group:abc or "all") */
  id: string

  /** view can view only, admin can do anything */
  role: "view" | "admin"
}

interface ResponseEvent {
  type: "draft" | "submit" | "approve" | "reject" | "edit"

  /** When event took place */
  on: string

  /** Can be anonymous otherwise _id of user */
  by: "string" | "null"
  
  /** True if approve was done by an admin, not the normal approver */
  override?: boolean

  /** Rejection message */
  message?: string
}

/** Data of a response (answers to all questions) */
export interface ResponseData {
  [itemId: string]: Answer | RosterData
}

/** Answer to a question */
export interface Answer {
  /** Value of the answer */
  value?: AnswerValue | null

  /** Alternate value if chosen. "value" will be null */
  alternate?: "na" | "dontknow" | null

  /** Timestamp (for recordTimestamp option) ISO 8601 timestamp */
  timestamp?: string

  /** Location-stamp (for recordLocation option) */
  location?: { accuracy?: number, altitude?: number, altitudeAccuracy?: number, longitude: number, latitude: number }

  /** Specify choices values */
  specify?: { 
    [choiceId: string]: any
  }

  /** True if answer has been redacted and moved to confidentialData */
  confidential?: boolean

  /** Comments */
  comments?: string

  /** Randomly asked questions
    Stores value in `randomAsked` as boolean. This is a special value that is computed when the item is shown for the first time
    based on the probability and is not deleted when cleaning the response when the question becomes invisible so it remains stable.
    This also prevents a loop of hiding the question because it was randomly invisible and then making it visible again and recomputing
    the randomness. */
  randomAsked?: boolean
}

/** Data for a roster group/matrix. Array of entries */
export type RosterData = RosterEntry[]

/** Data for a single roster group/matrix entry */
export interface RosterEntry {
  /** Unique id */
  _id: string

  /** Answers indexed by item id */
  data: RosterEntryData
}

/** Answers for a single roster entry */
export interface RosterEntryData {
  [itemId: string]: Answer
}

/** Stores the confidential data */
export interface ConfidentialData {
  [itemId: string]: ConfidentialAnswer | ConfidentialRosterEntry[]
}

/** One confidential answer */
export interface ConfidentialAnswer {
  /** Value of the answer */
  value?: AnswerValue | null

  /** Alternate value if chosen. "value" will be null */
  alternate?: "na" | "dontknow" | null

  /** Specify choices values */
  specify?: { 
    [choiceId: string]: any
  }
}

/** One roster that contains confidential data */
export interface ConfidentialRosterEntry {
  /** Id of roster entry */
  _id: string

  data: ConfidentialRosterEntryData
}

/** Confidential data for a single roster entry */
export interface ConfidentialRosterEntryData
{
  [itemId: string]: ConfidentialAnswer
}

/** All values of answers possible */
export type AnswerValue = TextAnswerValue | NumberAnswerValue | ChoiceAnswerValue | ChoicesAnswerValue 
      | BooleanAnswerValue | DateAnswerValue | UnitsAnswerValue | LocationAnswerValue | ImageAnswerValue | ImagesAnswerValue
      | TextsAnswerValue | SiteAnswerValue | EntityAnswerValue | ItemsChoicesAnswerValue | MatrixAnswerValue | AdminRegionAnswerValue 
      | AquagenxCBTAnswerValue

export type TextAnswerValue = string

export type NumberAnswerValue = number

/** Choice id */
export type ChoiceAnswerValue = string

/** Choice ids */
export type ChoicesAnswerValue = string[]

export type BooleanAnswerValue = boolean

/** YYYY-MM-DD */
export type DateAnswerValue = string

export interface UnitsAnswerValue {
  quantity: number
  /** id of units */
  units: string
}

export interface LocationAnswerValue {
  latitude: number
  longitude: number
  /** Elevation, taking into account mastHeight and depth if present */
  altitude?: number 
  accuracy?: number 
  altitudeAccuracy?: number
  /** Height of mast of GPS device (altitude is GPS altitude - mast height - depth) */
  mastHeight?: number
  /** Depth of pipe or other object (altitude is GPS altitude - mast height - depth) */
  depth?: number
}

export interface ImageAnswerValue {
  /** Id of image (unique) */
  id: string

  /** Optional caption */
  caption?: string
}

export type ImagesAnswerValue = ImageAnswerValue[]

export type TextsAnswerValue = string[]

export interface SiteAnswerValue {
  /** Code of site e.g. "10007" */
  code: string
}

/** Entity id is the string value */
export type EntityAnswerValue = string

export interface ItemsChoicesAnswerValue {
  /** object of key = item id, value: choice id */
  [itemId: string]: string
}

/** { ITEM1ID: { QUESTION1ID: { value: somevalue }, QUESTION2ID: { ...}}, ITEM2ID: ... } */
export interface MatrixAnswerValue {
  [itemId: string]: ({ [questionId: string]: any })
}

/** Admin region (DEPRECATED) _id of admin region */
export type AdminRegionAnswerValue = number

/** Answer for a Aquagenx CBT type question */
export interface AquagenxCBTAnswerValue {
  cbt: {
    /** True if compartment 1 is colored */
    c1: boolean
    /** True if compartment 2 is colored */
    c2: boolean
    /** True if compartment 3 is colored */
    c3: boolean
    /** True if compartment 4 is colored */
    c4: boolean
    /** True if compartment 5 is colored */
    c5: boolean

    /** Rating of safety */
    healthRisk: 'safe' | 'probably_safe' | 'possibly_safe' | 'possibly_unsafe' | 'probably_unsafe' | 'unsafe'
  
    /** Most probable number of E.Coli per 100ml */
    mpn: number

    /** Upper 95% Confidence Interval/100ml */
    confidence: number
  }

  /** Image of bag */
  image: ImageAnswerValue
}
