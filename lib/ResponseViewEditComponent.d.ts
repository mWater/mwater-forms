import { Form } from "./form";
import FormContext from "./formContext";
import { Response } from "./response";
import { Schema } from "mwater-expressions";
import { LocalizeString } from 'ez-localize'
import React from "react";

/** Displays a view of a response that can be edited, rejected, etc. 
  When editing, shows in single-page mode. */
export default class ResponseViewEditComponent extends React.Component<{
  /** Form to use */
  form: Form

  /** FormContext */
  formCtx: FormContext

  /** Response object */
  response: Response

  /** Current login (contains user, username, groups) */
  login?: {
    client: string
    user: string
    username: string
    groups: string[]
  }

  /** api url to use e.g. https://api.mwater.co/v3/ */
  apiUrl: string

  /** Called when response is updated with new response */
  onUpdateResponse: (response: Response) => void

  /** Called when response is removed */
  onDeleteResponse: () => void

  /** Schema, including the form */
  schema: Schema

  /** The locale to display the response in */
  locale?: string

  /** Localizer to use */
  T: LocalizeString
}> {}
