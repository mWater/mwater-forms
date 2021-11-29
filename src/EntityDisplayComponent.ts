import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"

export interface EntityDisplayComponentProps {
  /** _id of entity */
  entityType: string
  /** _id of entity */
  entityId?: string
  /** code of entity if _id not present */
  entityCode?: string
  /** True to render in well if present */
  displayInWell?: boolean
  /** Gets an entity by id (entityType, entityId, callback). Required if entityId */
  getEntityById?: any
  /** Gets an entity by code (entityType, entityCode, callback). Required if entityCode */
  getEntityByCode?: any
  renderEntityView: any
  T: any
}

// Loads and displays an entity
export default class EntityDisplayComponent extends AsyncLoadComponent<EntityDisplayComponentProps, { entity: any }> {
  // Override to determine if a load is needed. Not called on mounting
  isLoadNeeded(newProps: EntityDisplayComponentProps, oldProps: EntityDisplayComponentProps) {
    return (
      newProps.entityType !== oldProps.entityType ||
      newProps.entityId !== oldProps.entityId ||
      newProps.entityCode !== oldProps.entityCode
    )
  }

  // Call callback with state changes
  load(props: EntityDisplayComponentProps, prevProps: EntityDisplayComponentProps, callback: any) {
    if (!props.entityId && !props.entityCode) {
      callback({ entity: null })
      return
    }

    if (props.entityId) {
      return this.props.getEntityById(props.entityType, props.entityId, (entity: any) => {
        return callback({ entity })
      })
    } else {
      return this.props.getEntityByCode(props.entityType, props.entityCode, (entity: any) => {
        return callback({ entity })
      })
    }
  }

  render() {
    if (this.state.loading) {
      return R("div", { className: "alert alert-info" }, this.props.T("Loading..."))
    }

    if (!this.props.entityId && !this.props.entityCode) {
      return null
    }

    if (!this.state.entity) {
      return R(
        "div",
        { className: "alert alert-danger" },
        this.props.T("Either site has been deleted or you do not have permission to view it")
      )
    }

    if (this.props.displayInWell) {
      return R(
        "div",
        { className: "card bg-light mb-3" },
        R("div", { className: "card-body" }, this.props.renderEntityView(this.props.entityType, this.state.entity))
      )
    }
    return R("div", {}, this.props.renderEntityView(this.props.entityType, this.state.entity))
  }
}
