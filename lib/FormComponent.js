var DefaultValueApplier, FormComponent, FormExprEvaluator, H, ItemListComponent, R, React, ResponseCleaner, SectionsComponent, VisibilityCalculator, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

SectionsComponent = require('./SectionsComponent');

ItemListComponent = require('./ItemListComponent');

ResponseCleaner = require('./ResponseCleaner');

DefaultValueApplier = require('./DefaultValueApplier');

VisibilityCalculator = require('./VisibilityCalculator');

FormExprEvaluator = require('./FormExprEvaluator');

module.exports = FormComponent = (function(superClass) {
  extend(FormComponent, superClass);

  FormComponent.propTypes = {
    formCtx: React.PropTypes.object.isRequired,
    design: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    onDataChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onSaveLater: React.PropTypes.func,
    onDiscard: React.PropTypes.func.isRequired,
    entity: React.PropTypes.object,
    entityType: React.PropTypes.string
  };

  FormComponent.childContextTypes = require('./formContextTypes');

  function FormComponent(props) {
    this.handleDataChange = bind(this.handleDataChange, this);
    this.isVisible = bind(this.isVisible, this);
    this.handleSubmit = bind(this.handleSubmit, this);
    FormComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      visibilityStructure: {},
      formExprEvaluator: new FormExprEvaluator(this.props.design)
    };
  }

  FormComponent.prototype.getChildContext = function() {
    return this.props.formCtx;
  };

  FormComponent.prototype.componentWillReceiveProps = function(nextProps) {
    return this.setState({
      formExprEvaluator: new FormExprEvaluator(nextProps.design)
    });
  };

  FormComponent.prototype.componentWillMount = function() {
    return this.handleDataChange(this.props.data);
  };

  FormComponent.prototype.handleSubmit = function() {
    if (!this.refs.itemListComponent.validate(true)) {
      return this.props.onSubmit();
    }
  };

  FormComponent.prototype.isVisible = function(itemId) {
    return this.state.visibilityStructure[itemId];
  };

  FormComponent.prototype.computingVisibilityAndUpdatingData = function(data, oldVisibilityStructure) {
    var newData, newVisibilityStructure;
    oldVisibilityStructure = this.state.visibilityStructure;
    newVisibilityStructure = this.computeVisibility(data);
    newData = this.cleanData(data, newVisibilityStructure);
    newData = this.stickyData(newData, oldVisibilityStructure, newVisibilityStructure);
    return [newData, newVisibilityStructure];
  };

  FormComponent.prototype.handleDataChange = function(data) {
    var nbIterations, newData, newVisibilityStructure, oldVisibilityStructure, ref;
    newData = data;
    oldVisibilityStructure = this.state.visibilityStructure;
    nbIterations = 0;
    while (true) {
      ref = this.computingVisibilityAndUpdatingData(newData, oldVisibilityStructure), newData = ref[0], newVisibilityStructure = ref[1];
      nbIterations++;
      if (_.isEqual(newVisibilityStructure, oldVisibilityStructure)) {
        break;
      }
      if (nbIterations >= 10) {
        throw new Error('Impossible to compute question visibility. The question conditions must be looping');
      }
      oldVisibilityStructure = newVisibilityStructure;
    }
    this.setState({
      visibilityStructure: newVisibilityStructure
    });
    return this.props.onDataChange(newData);
  };

  FormComponent.prototype.computeVisibility = function(data) {
    var visibilityCalculator;
    visibilityCalculator = new VisibilityCalculator(this.props.design);
    return visibilityCalculator.createVisibilityStructure(data);
  };

  FormComponent.prototype.cleanData = function(data, visibilityStructure) {
    var responseCleaner;
    responseCleaner = new ResponseCleaner();
    return responseCleaner.cleanData(data, visibilityStructure);
  };

  FormComponent.prototype.stickyData = function(data, previousVisibilityStructure, newVisibilityStructure) {
    var defaultValueApplier;
    defaultValueApplier = new DefaultValueApplier(this.props.design, this.props.formCtx.stickyStorage, this.props.entity, this.props.entityType);
    return defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure);
  };

  FormComponent.prototype.render = function() {
    if (this.props.design.contents[0] && this.props.design.contents[0]._type === "Section") {
      return R(SectionsComponent, {
        contents: this.props.design.contents,
        data: this.props.data,
        onDataChange: this.handleDataChange,
        onSubmit: this.props.onSubmit,
        onSaveLater: this.props.onSaveLater,
        onDiscard: this.props.onDiscard,
        isVisible: this.isVisible,
        formExprEvaluator: this.state.formExprEvaluator
      });
    } else {
      return H.div(null, R(ItemListComponent, {
        ref: 'itemListComponent',
        contents: this.props.design.contents,
        data: this.props.data,
        onDataChange: this.handleDataChange,
        isVisible: this.isVisible,
        formExprEvaluator: this.state.formExprEvaluator
      }), H.button({
        type: "button",
        className: "btn btn-primary",
        onClick: this.handleSubmit
      }, T("Submit")), "\u00A0", this.props.onSaveLater ? [
        H.button({
          type: "button",
          className: "btn btn-default",
          onClick: this.props.onSaveLater
        }, T("Save for Later")), "\u00A0"
      ] : void 0, H.button({
        type: "button",
        className: "btn btn-default",
        onClick: this.props.onDiscard
      }, H.span({
        className: "glyphicon glyphicon-trash"
      }), " " + T("Discard")));
    }
  };

  return FormComponent;

})(React.Component);
