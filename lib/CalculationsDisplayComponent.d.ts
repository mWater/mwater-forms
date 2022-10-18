import { FormDesign } from "./formDesign";
import { Schema } from "mwater-expressions";
import ResponseRow from "./ResponseRow";
/** Displays calculation values for a response. Only displays root level calculations, not roster ones. */
export declare const CalculationsDisplayComponent: (props: {
    formDesign: FormDesign;
    locale: string;
    /** Localizer to use */
    T: any;
    schema: Schema;
    responseRow: ResponseRow;
}) => JSX.Element;
