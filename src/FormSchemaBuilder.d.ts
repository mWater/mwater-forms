import { Schema } from "mwater-expressions";
import { Form } from "./form";

/** Adds a form to a mwater-expressions schema */
export default class FormSchemaBuilder {
  /** indicators is at least all indicators referenced in indicator calculations. Can be empty and indicator calculations will be omitted */
  addForm(schema: Schema, form: Form, cloneFormsDeprecated?: boolean, isAdmin?: boolean, indicators?: any): Schema
}
