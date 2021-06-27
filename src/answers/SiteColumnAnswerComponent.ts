import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import EntityDisplayComponent from "../EntityDisplayComponent"
import * as formUtils from "../formUtils"

interface SiteColumnAnswerComponentProps {
  value?: any,
  onValueChange: any,
  siteType: string
}

// Displays a site answer in a cell. No direct code entering, but stores answer as a code.
export default class SiteColumnAnswerComponent extends React.Component<SiteColumnAnswerComponentProps> {
  static initClass() {
    this.contextTypes = {
      selectEntity: PropTypes.func,
      getEntityById: PropTypes.func.isRequired,
      getEntityByCode: PropTypes.func.isRequired,
      renderEntityListItemView: PropTypes.func.isRequired,
      T: PropTypes.func.isRequired // Localizer to use
    }
  }

  handleSelectClick = () => {
    return this.context.selectEntity({
      entityType: this.props.siteType,
      callback: (entityId: any) => {
        // Get entity
        return this.context.getEntityById(this.props.siteType, entityId, (entity: any) => {
          return this.props.onValueChange({ code: entity.code })
        });
      }
    });
  }

  handleClearClick = () => {
    return this.props.onValueChange(null)
  }

  render() {
    if (this.props.value?.code) {
      return R(
        "div",
        null,
        R(
          "button",
          { className: "btn btn-link btn-sm pull-right", onClick: this.handleClearClick },
          R("span", { className: "glyphicon glyphicon-remove" })
        ),

        R(EntityDisplayComponent, {
          entityType: this.props.siteType,
          entityCode: this.props.value?.code,
          getEntityByCode: this.context.getEntityByCode,
          renderEntityView: this.context.renderEntityListItemView,
          T: this.context.T
        })
      )
    } else {
      return R("button", { className: "btn btn-link", onClick: this.handleSelectClick }, this.context.T("Select..."))
    }
  }
};


SiteColumnAnswerComponent.initClass()
