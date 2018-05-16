var DefaultValueApplier, FormComponent, H, ItemListComponent, PropTypes, R, RandomAskedCalculator, React, ResponseCleaner, ResponseRow, SectionsComponent, VisibilityCalculator, _, ezlocalize,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

SectionsComponent = require('./SectionsComponent');

ItemListComponent = require('./ItemListComponent');

ezlocalize = require('ez-localize');

ResponseCleaner = require('./ResponseCleaner');

ResponseRow = require('./ResponseRow');

DefaultValueApplier = require('./DefaultValueApplier');

VisibilityCalculator = require('./VisibilityCalculator');

RandomAskedCalculator = require('./RandomAskedCalculator');

module.exports = FormComponent = (function(superClass) {
  extend(FormComponent, superClass);

  FormComponent.propTypes = {
    formCtx: PropTypes.object.isRequired,
    design: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onDataChange: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    deployment: PropTypes.string.isRequired,
    locale: PropTypes.string,
    onSubmit: PropTypes.func,
    onSaveLater: PropTypes.func,
    onDiscard: PropTypes.func,
    submitLabel: PropTypes.string,
    saveLaterLabel: PropTypes.string,
    discardLabel: PropTypes.string,
    entity: PropTypes.object,
    entityType: PropTypes.string,
    singlePageMode: PropTypes.bool,
    disableConfidentialFields: PropTypes.bool
  };

  FormComponent.childContextTypes = _.extend({}, require('./formContextTypes'), {
    T: PropTypes.func.isRequired,
    locale: PropTypes.string,
    disableConfidentialFields: PropTypes.bool
  });

  function FormComponent(props) {
    this.handleNext = bind(this.handleNext, this);
    this.handleDataChange = bind(this.handleDataChange, this);
    this.createResponseRow = bind(this.createResponseRow, this);
    this.isVisible = bind(this.isVisible, this);
    this.handleSubmit = bind(this.handleSubmit, this);
    FormComponent.__super__.constructor.call(this, props);
    this.state = {
      visibilityStructure: {},
      T: this.createLocalizer(this.props.design, this.props.locale)
    };
  }

  FormComponent.prototype.getChildContext = function() {
    return _.extend({}, this.props.formCtx, {
      T: this.state.T,
      locale: this.props.locale,
      disableConfidentialFields: this.props.disableConfidentialFields
    });
  };

  FormComponent.prototype.componentWillReceiveProps = function(nextProps) {
    if (this.props.design !== nextProps.design || this.props.locale !== nextProps.locale) {
      return this.setState({
        T: this.createLocalizer(nextProps.design, nextProps.locale)
      });
    }
  };

  FormComponent.prototype.componentWillMount = function() {
    return this.handleDataChange(this.props.data);
  };

  FormComponent.prototype.createLocalizer = function(design, locale) {
    var T, localizedStrings, localizerData;
    localizedStrings = design.localizedStrings || [];
    localizerData = {
      locales: design.locales,
      strings: localizedStrings
    };
    T = new ezlocalize.Localizer(localizerData, locale).T;
    return T;
  };

  FormComponent.prototype.handleSubmit = function() {
    if (!this.refs.itemListComponent.validate(true)) {
      return this.props.onSubmit();
    }
  };

  FormComponent.prototype.isVisible = function(itemId) {
    return this.state.visibilityStructure[itemId];
  };

  FormComponent.prototype.createResponseRow = function(data) {
    return new ResponseRow({
      responseData: data,
      formDesign: this.props.design,
      schema: this.props.schema,
      getEntityById: this.props.formCtx.getEntityById,
      getEntityByCode: this.props.formCtx.getEntityByCodes,
      deployment: this.props.deployment
    });
  };

  FormComponent.prototype.handleDataChange = function(data) {
    var defaultValueApplier, randomAskedCalculator, responseCleaner, visibilityCalculator;
    visibilityCalculator = new VisibilityCalculator(this.props.design);
    defaultValueApplier = new DefaultValueApplier(this.props.design, this.props.formCtx.stickyStorage, this.props.entity, this.props.entityType);
    randomAskedCalculator = new RandomAskedCalculator(this.props.design);
    responseCleaner = new ResponseCleaner();
    this.props.onDataChange(data);
    this.cleanInProgress = data;
    return responseCleaner.cleanData(this.props.design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, this.createResponseRow, this.state.visibilityStructure, (function(_this) {
      return function(error, results) {
        if (error) {
          alert(T("Error saving data") + (": " + error.message));
          return;
        }
        if (data !== _this.cleanInProgress) {
          console.log("Ignoring stale handleDataChange data");
          return;
        }
        _this.setState({
          visibilityStructure: results.visibilityStructure
        });
        if (!_.isEqual(data, results.data)) {
          return _this.props.onDataChange(results.data);
        }
      };
    })(this));
  };

  FormComponent.prototype.handleNext = function() {
    return this.refs.submit.focus();
  };

  FormComponent.prototype.render = function() {
    if (this.props.design.contents[0] && this.props.design.contents[0]._type === "Section" && !this.props.singlePageMode) {
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
      });
    } else {
      return H.div(null, R(ItemListComponent, {
        ref: 'itemListComponent',
        contents: this.props.design.contents,
        data: this.props.data,
        onDataChange: this.handleDataChange,
        responseRow: this.createResponseRow(this.props.data),
        schema: this.props.schema,
        isVisible: this.isVisible,
        onNext: this.handleNext
      }), this.props.onSubmit ? H.button({
        type: "button",
        key: 'submitButton',
        className: "btn btn-primary",
        ref: 'submit',
        onClick: this.handleSubmit
      }, this.props.submitLabel ? this.props.submitLabel : this.state.T("Submit")) : void 0, "\u00A0", this.props.onSaveLater ? [
        H.button({
          type: "button",
          key: 'saveLaterButton',
          className: "btn btn-default",
          onClick: this.props.onSaveLater
        }, this.props.saveLaterLabel ? this.props.saveLaterLabel : this.state.T("Save for Later")), "\u00A0"
      ] : void 0, this.props.onDiscard ? H.button({
        type: "button",
        key: 'discardButton',
        className: "btn btn-default",
        onClick: this.props.onDiscard
      }, this.props.discardLabel ? this.props.discardLabel : [
        H.span({
          className: "glyphicon glyphicon-trash"
        }), " " + this.state.T("Discard")
      ]) : void 0);
    }
  };

  return FormComponent;

})(React.Component);
