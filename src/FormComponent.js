// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let FormComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import SectionsComponent from './SectionsComponent';
import ItemListComponent from './ItemListComponent';
import ezlocalize from 'ez-localize';
import ResponseCleaner from './ResponseCleaner';
import { default as ResponseRow } from './ResponseRow';
import DefaultValueApplier from './DefaultValueApplier';
import VisibilityCalculator from './VisibilityCalculator';
import RandomAskedCalculator from './RandomAskedCalculator';

// Displays a form that can be filled out
export default FormComponent = (function() {
  FormComponent = class FormComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        formCtx: PropTypes.object.isRequired,   // Context to use for form. See docs/FormsContext.md
        design: PropTypes.object.isRequired, // Form design. See schema.coffee
    
        data: PropTypes.object.isRequired, // Form response data. See docs/Answer Formats.md
        onDataChange: PropTypes.func.isRequired, // Called when response data changes
  
        schema: PropTypes.object.isRequired,  // Schema to use, including form
  
        deployment: PropTypes.string.isRequired,  // The current deployment
        locale: PropTypes.string,          // e.g. "fr"
      
        onSubmit: PropTypes.func,                // Called when submit is pressed
        onSaveLater: PropTypes.func,             // Optional save for later
        onDiscard: PropTypes.func,               // Called when discard is pressed
  
        submitLabel: PropTypes.string,           // To override submit label
        saveLaterLabel: PropTypes.string,        // To override Save For Later label
        discardLabel: PropTypes.string,          // To override Discard label
  
        entity: PropTypes.object,            // Form-level entity to load
        entityType: PropTypes.string,        // Type of form-level entity to load
  
        singlePageMode: PropTypes.bool,      // True to render as a single page, not divided into sections
        disableConfidentialFields: PropTypes.bool, // True to disable the confidential fields, used during editing responses with confidential data
  
        forceAllVisible: PropTypes.bool     // Force all questions to be visible
      };
  
      this.childContextTypes = _.extend({}, require('./formContextTypes'), {
        T: PropTypes.func.isRequired,
        locale: PropTypes.string,          // e.g. "fr"
        disableConfidentialFields: PropTypes.bool
      });
    }

    constructor(props) {
      super(props);

      this.state = {
        visibilityStructure: {},
        T: this.createLocalizer(this.props.design, this.props.locale)
      };

      // Save which data visibility structure applies to
      this.currentData = null;
    }

    getChildContext() { 
      return _.extend({}, this.props.formCtx, {
        T: this.state.T,
        locale: this.props.locale,
        disableConfidentialFields: this.props.disableConfidentialFields
      });
    }

    componentWillReceiveProps(nextProps) {
      if ((this.props.design !== nextProps.design) || (this.props.locale !== nextProps.locale)) {
        return this.setState({T: this.createLocalizer(nextProps.design, nextProps.locale)});
      }
    }

    componentDidUpdate(prevProps) {
      // When data change is external, process it to set visibility, etc.
      if ((prevProps.data !== this.props.data) && !_.isEqual(this.props.data, this.currentData)) {
        return this.handleDataChange(this.props.data);
      }
    }

    // This will clean the data that has been passed at creation
    // It will also initialize the visibilityStructure
    // And set the sticky data
    componentWillMount() {
      return this.handleDataChange(this.props.data);
    }

    // Creates a localizer for the form design
    createLocalizer(design, locale) {
      // Create localizer
      const localizedStrings = design.localizedStrings || [];
      const localizerData = {
        locales: design.locales,
        strings: localizedStrings
      };
      const {
        T
      } = new ezlocalize.Localizer(localizerData, locale);
      return T;
    }

    handleSubmit = async () => {
      // Cannot submit if at least one item is invalid
      const result = await this.itemListComponent.validate(true);
      if (!result) {
        return this.props.onSubmit();
      }
    };

    isVisible = itemId => {
      return this.props.forceAllVisible || this.state.visibilityStructure[itemId];
    };

    createResponseRow = data => {
      return new ResponseRow({
        responseData: data,
        formDesign: this.props.design,
        schema: this.props.schema,
        getEntityById: this.props.formCtx.getEntityById,
        getEntityByCode: this.props.formCtx.getEntityByCode,
        getCustomTableRow: this.props.formCtx.getCustomTableRow,
        deployment: this.props.deployment
      });
    };

    handleDataChange = data => {
      const visibilityCalculator = new VisibilityCalculator(this.props.design, this.props.schema);
      const defaultValueApplier = new DefaultValueApplier(this.props.design, this.props.formCtx.stickyStorage, this.props.entity, this.props.entityType);
      const randomAskedCalculator = new RandomAskedCalculator(this.props.design);
      const responseCleaner = new ResponseCleaner();

      // Immediately update data, as another answer might be clicked on (e.g. blur from a number input and clicking on a radio answer)
      this.currentData = data;
      this.props.onDataChange(data);

      // Clean response data, remembering which data object is being cleaned
      this.cleanInProgress = data;

      return responseCleaner.cleanData(this.props.design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, this.createResponseRow, this.state.visibilityStructure, (error, results) => {
        if (error) {
          alert(T("Error saving data") + `: ${error.message}`);
          return;
        }

        // Ignore if from a previous clean
        if (data !== this.cleanInProgress) { 
          console.log("Ignoring stale handleDataChange data");
          return;
        }

        this.setState({visibilityStructure: results.visibilityStructure});
        // Ignore if unchanged
        if (!_.isEqual(data, results.data)) {
          this.currentData = results.data;
          return this.props.onDataChange(results.data);
        }
      });
    };

    handleNext = () => {
      return this.submit.focus();
    };

    render() {
      if (this.props.design.contents[0] && (this.props.design.contents[0]._type === "Section") && !this.props.singlePageMode) {
        return R(SectionsComponent, {
          contents: this.props.design.contents,
          data: this.props.data,
          onDataChange: this.handleDataChange,
          responseRow: this.createResponseRow(this.props.data),
          schema: this.props.schema,
          onSubmit: this.props.onSubmit,
          onSaveLater: this.props.onSaveLater,
          onDiscard: this.props.onDiscard,
          isVisible: this.isVisible
        }
        );
      } else {
        return R('div', null,
          R(ItemListComponent, {
            ref: (c => { return this.itemListComponent = c; }),
            contents: this.props.design.contents,
            data: this.props.data,
            onDataChange: this.handleDataChange,
            responseRow: this.createResponseRow(this.props.data),
            schema: this.props.schema,
            isVisible: this.isVisible, 
            onNext: this.handleNext
          }
          ),

          this.props.onSubmit ?
            R('button', {type: "button", key: 'submitButton', className: "btn btn-primary", ref: (c => { return this.submit = c; }), onClick: this.handleSubmit},
              this.props.submitLabel ?
                this.props.submitLabel
              :
                this.state.T("Submit")
            ) : undefined,

          "\u00A0",

          this.props.onSaveLater ?
            [
              R('button', {type: "button", key: 'saveLaterButton', className: "btn btn-default", onClick: this.props.onSaveLater},
                this.props.saveLaterLabel ?
                  this.props.saveLaterLabel
                :
                  this.state.T("Save for Later")
              ),
              "\u00A0"
            ] : undefined,

          this.props.onDiscard ?
            R('button', {type:"button", key: 'discardButton', className: "btn btn-default", onClick: this.props.onDiscard},
              this.props.discardLabel ?
                this.props.discardLabel
              :
                [
                  R('span', {className: "glyphicon glyphicon-trash"}),
                  " " + this.state.T("Discard")
                ]) : undefined);
      }
    }
  };
  FormComponent.initClass();
  return FormComponent;
})();
