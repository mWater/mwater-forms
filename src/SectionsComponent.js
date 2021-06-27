let SectionsComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import ItemListComponent from './ItemListComponent';
import formUtils from './formUtils';
import TextExprsComponent from './TextExprsComponent';

export default SectionsComponent = (function() {
  SectionsComponent = class SectionsComponent extends React.Component {
    static initClass() {
      this.contextTypes = {
        locale: PropTypes.string,
        T: PropTypes.func.isRequired  // Localizer to use
      };
  
      this.propTypes = {
        contents: PropTypes.array.isRequired, 
        data: PropTypes.object,      // Current data of response. 
        onDataChange: PropTypes.func.isRequired,
  
        schema: PropTypes.object.isRequired,  // Schema to use, including form
        responseRow: PropTypes.object.isRequired,    // ResponseRow object (for roster entry if in roster)
  
        isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
  
        onSubmit: PropTypes.func,                // Called when submit is pressed
        onSaveLater: PropTypes.func,             // Optional save for later
        onDiscard: PropTypes.func
      };
                     // Called when discard is pressed
    }

    constructor(props) {
      this.handleBackSection = this.handleBackSection.bind(this);
      this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);
      this.handleItemListNext = this.handleItemListNext.bind(this);
      super(props);

      this.state = {
        sectionNum: 0
      };
    }

    handleSubmit = async () => {
      const result = await this.itemListComponent.validate(true);
      if (!result) {
        return this.props.onSubmit();
      }
    };

    hasPreviousSection() {
      // Returns true if a visible index exist with a higher value
      return this.nextVisibleSectionIndex(this.state.sectionNum - 1, -1) !== -1;
    }

    hasNextSection() {
      // Returns true if a visible index exist with a higher value
      return this.nextVisibleSectionIndex(this.state.sectionNum + 1, 1) !== -1;
    }

    nextVisibleSectionIndex(index, increment) {
      if (index < 0) {
        return -1;
      }
      if (index >= this.props.contents.length) {
        return -1;
      }
      const section = this.props.contents[index];
      const isVisible = this.props.isVisible(section._id);
      if (isVisible) {
        return index;
      } else {
        return this.nextVisibleSectionIndex(index + increment, increment);
      }
    }

    handleBackSection() {
      // Move to previous that is visible
      const previousVisibleIndex = this.nextVisibleSectionIndex(this.state.sectionNum - 1, -1);
      if (previousVisibleIndex !== -1) {
        this.setState({sectionNum: previousVisibleIndex});

        // Scroll to top of section
        return this.sections.scrollIntoView();
      }
    }

      // This should never happen... simply ignore

    handleNextSection = async () => {
      const result = await this.itemListComponent.validate(true);
      if (result) {
        return;
      }

      // Move to next that is visible
      const nextVisibleIndex = this.nextVisibleSectionIndex(this.state.sectionNum + 1, 1);
      if (nextVisibleIndex !== -1) {
        this.setState({sectionNum: nextVisibleIndex});

        // Scroll to top of section
        return this.sections.scrollIntoView();
      }
    };
      
      // This should never happen... simply ignore

    handleBreadcrumbClick(index) {
      return this.setState({sectionNum: index});
    }

    handleItemListNext() {
      return this.nextOrSubmit.focus();
    }

    renderBreadcrumbs() {
      const breadcrumbs = [];
      let index = 0;
      while (index < this.state.sectionNum) {
        const section = this.props.contents[index];
        const visible = this.props.isVisible(section._id);
        breadcrumbs.push(R('li', {key: index},
          R('b', null,
            visible ?
              R('a', {className: "section-crumb", disabled: !visible, onClick: this.handleBreadcrumbClick.bind(this, index)},
                `${index + 1}.`)
            :
              `${index + 1}.`
          )
        )
        );
        index++;
      }

      const currentSectionName = formUtils.localizeString(this.props.contents[this.state.sectionNum].name, this.context.locale);
      breadcrumbs.push(R('li', {key: this.state.sectionNum},
        R('b', null,
          `${this.state.sectionNum + 1}. ${currentSectionName}`)
      )
      );

      return R('ul', {className: "breadcrumb"},
        breadcrumbs);
    }

    renderSection() {
      const section = this.props.contents[this.state.sectionNum];

      return R('div', {key: section._id},
        R('h3', null, formUtils.localizeString(section.name, this.context.locale)),

        R(ItemListComponent, { 
          ref: (c => { return this.itemListComponent = c; }),
          contents: section.contents,
          data: this.props.data,
          onDataChange: this.props.onDataChange,
          isVisible: this.props.isVisible,
          responseRow: this.props.responseRow,
          onNext: this.handleItemListNext,
          schema: this.props.schema
        }
        )
      );
    }

    renderButtons() {
      return R('div', {className: "form-controls"},
        // If can go back
        this.hasPreviousSection() ?
          [
            R('button', {key: "back", type: "button", className: "btn btn-default", onClick: this.handleBackSection},
              R('span', {className: "glyphicon glyphicon-backward"}),
              " " + this.context.T("Back")),
            "\u00A0"
          ] : undefined,

        // Can go forward or submit
        (() => {
        if (this.hasNextSection()) {
          return R('button', {key: "next", type: "button", ref: (c => { return this.nextOrSubmit = c; }), className: "btn btn-primary", onClick: this.handleNextSection},
            this.context.T("Next") + " ", 
            R('span', {className: "glyphicon glyphicon-forward"}));
        } else if (this.props.onSubmit) {
          return R('button', {key: "submit", type: "button", ref: (c => { return this.nextOrSubmit = c; }), className: "btn btn-primary", onClick: this.handleSubmit},
            this.context.T("Submit"));
        }
      })(),

        "\u00A0",

        this.props.onSaveLater ?
          [
            R('button', {key: "saveLater", type: "button", className: "btn btn-default", onClick: this.props.onSaveLater},
              this.context.T("Save for Later")),
            "\u00A0"
          ] : undefined,

        this.props.onDiscard ?
          R('button', {key: "discard", type:"button", className: "btn btn-default", onClick: this.props.onDiscard},
            R('span', {className: "glyphicon glyphicon-trash"}),
            " " + this.context.T("Discard")) : undefined
      );
    }

    render() {
      return R('div', {ref: (c => { return this.sections = c; })},
        this.renderBreadcrumbs(),
        R('div', {className: "sections"},
          this.renderSection()),
        this.renderButtons());
    }
  };
  SectionsComponent.initClass();
  return SectionsComponent;
})();
