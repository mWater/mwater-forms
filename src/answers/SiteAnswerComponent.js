let SiteAnswerComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import formUtils from '../formUtils';
import EntityDisplayComponent from '../EntityDisplayComponent';

export default SiteAnswerComponent = (function() {
  SiteAnswerComponent = class SiteAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes = {
        selectEntity: PropTypes.func,
        getEntityById: PropTypes.func.isRequired,
        getEntityByCode: PropTypes.func.isRequired,
        renderEntitySummaryView: PropTypes.func.isRequired,
        T: PropTypes.func.isRequired  // Localizer to use
      };
  
      this.propTypes = {
        value: PropTypes.object,
        onValueChange: PropTypes.func.isRequired,
        siteTypes: PropTypes.array
      };
    }

    constructor(props) {
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleSelectClick = this.handleSelectClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      super(props);
    
      this.state = {text: props.value?.code || ""};
    }

    componentWillReceiveProps(nextProps) {
      // If different, override text
      if (nextProps.value?.code !== this.props.value?.code) {
        return this.setState({text: nextProps.value?.code ? nextProps.value?.code : ""});
      }
    }

    focus() {
      return this.input.focus();
    }

    handleKeyDown(ev) {
      if (this.props.onNextOrComments != null) {
        // When pressing ENTER or TAB
        if ((ev.keyCode === 13) || (ev.keyCode === 9)) {
          this.props.onNextOrComments(ev);
          // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
          return ev.preventDefault();
        }
      }
    }

    getEntityType() {
      // Convert to new entity type (legacy sometimes had capital letter and spaces)
      const siteType = (this.props.siteTypes ? this.props.siteTypes[0] : undefined) || "water_point";
      const entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
      return entityType;
    }

    handleSelectClick() {
      const entityType = this.getEntityType();

      return this.context.selectEntity({ entityType, callback: entityId => {
        console.log(`Issue584:${new Date().toISOString()}: after selectEntity ${entityType} ${entityId}`);

        // Get entity
        return this.context.getEntityById(entityType, entityId, entity => {
          console.log(`Issue584:${new Date().toISOString()}: after getEntityById ${entityType} ${entityId} ${JSON.stringify(entity)}`);
          if (!entity) {
            throw new Error(`Unable to lookup entity ${entityType}:${entityId}`);
          }
          if (!entity.code) {
            alert(this.props.T("Unable to select that site as it does not have an mWater ID. Please synchronize first with the server."));
            return;
          }
          return this.props.onValueChange({code: entity.code});
        });
      }
      });
    }

    handleChange(ev) { 
      return this.setState({text: ev.target.value});
    }

    handleBlur(ev) {
      if (ev.target.value) {
        return this.props.onValueChange({ code: ev.target.value });
      } else {
        return this.props.onValueChange(null);
      }
    }

    render() {
      return R('div', null,
        R('div', {className:"input-group"},
          R('input', { 
            type: "tel",
            className: "form-control",
            onKeyDown: this.handleKeyDown,
            ref: (c => { return this.input = c; }),
            placeholder: this.context.T("mWater ID of Site"),
            style: { zIndex: "inherit" }, // Workaround for strange bootstrap z-index
            value: this.state.text,
            onBlur: this.handleBlur,
            onChange: this.handleChange
          }
          ),
          R('span', {className: "input-group-btn"},
            R('button', {className: "btn btn-default", disabled: (this.context.selectEntity == null), type: "button", onClick: this.handleSelectClick, style: { zIndex: "inherit" }},
              this.context.T("Select"))
          )
        ),
          
        R('br'),
        R(EntityDisplayComponent, { 
          displayInWell: true,
          entityType: this.getEntityType(),
          entityCode: this.props.value?.code,
          getEntityByCode: this.context.getEntityByCode,
          renderEntityView: this.context.renderEntitySummaryView,
          T: this.context.T
        }
        )
      );
    }
  };
  SiteAnswerComponent.initClass();
  return SiteAnswerComponent;
})();
