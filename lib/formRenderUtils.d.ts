import { ReactElement } from "react";
import { Item } from "./formDesign";
import { Schema } from "mwater-expressions";
import { default as ResponseRow } from "./ResponseRow";
import { ResponseData } from "./response";
/** Render an item, given its data, visibility function, etc. */
export declare function renderItem(item: Item, data: any, responseRow: ResponseRow, schema: Schema, onDataChange: (data: ResponseData) => void, isVisible: () => boolean, onNext: () => any, ref?: (c: any) => void): ReactElement;
