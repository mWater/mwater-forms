import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
interface EntityDisplayComponentProps {
    /** _id of entity */
    entityType: string;
    /** _id of entity */
    entityId?: string;
    /** code of entity if _id not present */
    entityCode?: string;
    /** True to render in well if present */
    displayInWell?: boolean;
    /** Gets an entity by id (entityType, entityId, callback). Required if entityId */
    getEntityById?: any;
    /** Gets an entity by code (entityType, entityCode, callback). Required if entityCode */
    getEntityByCode?: any;
    renderEntityView: any;
    T: any;
}
export default class EntityDisplayComponent extends AsyncLoadComponent<EntityDisplayComponentProps, {
    entity: any;
}> {
    isLoadNeeded(newProps: EntityDisplayComponentProps, oldProps: EntityDisplayComponentProps): boolean;
    load(props: EntityDisplayComponentProps, prevProps: EntityDisplayComponentProps, callback: any): any;
    render(): React.DetailedReactHTMLElement<{
        className: string | undefined;
    }, HTMLElement> | null;
}
export {};
