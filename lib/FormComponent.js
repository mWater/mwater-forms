var FormCompiler, FormComponent, H, React, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

_ = require('lodash');

FormCompiler = require('./FormCompiler');

module.exports = FormComponent = (function(superClass) {
  extend(FormComponent, superClass);

  function FormComponent() {
    this.handleChange = bind(this.handleChange, this);
    return FormComponent.__super__.constructor.apply(this, arguments);
  }

  FormComponent.propTypes = {
    formCtx: React.PropTypes.object.isRequired,
    design: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string,
    data: React.PropTypes.object.isRequired,
    onDataChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onSaveLater: React.PropTypes.func,
    onDiscard: React.PropTypes.func.isRequired,
    submitLabel: React.PropTypes.string,
    entity: React.PropTypes.object,
    entityType: React.PropTypes.string
  };

  FormComponent.prototype.componentDidMount = function() {
    return this.reload(this.props);
  };

  FormComponent.prototype.componentWillReceiveProps = function(nextProps) {
    if (nextProps.design !== this.props.design) {
      throw new Error("Can't change design after mounted");
    }
    if (nextProps.entity !== this.props.entity) {
      throw new Error("Can't change entity after mounted");
    }
    if (!_.isEqual(nextProps.data, this.model.toJSON())) {
      this.model.set(nextProps);
    }
    if (this.props.locale !== nextProps.locale) {
      return this.reload(nextProps);
    }
  };

  FormComponent.prototype.reload = function(props) {
    var compiler;
    if (this.formView) {
      this.formView.remove();
      this.formView = null;
    }
    this.model = new Backbone.Model();
    this.model.on('change', (function(_this) {
      return function() {
        var err, error;
        if (_this.model.has("formCtx")) {
          console.log("formCtx PRESENT!!!");
          try {
            i.dont.exist += 1;
          } catch (error) {
            err = error;
            console.log(err.stack);
          }
          return console.log("========= End of stack");
        }
      };
    })(this));
    this.model.set(_.cloneDeep(props.data));
    compiler = new FormCompiler({
      model: this.model,
      locale: props.locale,
      ctx: props.formCtx
    });
    this.formView = compiler.compileForm(props.design, {
      entityType: props.entityType,
      entity: props.entity,
      allowSaveForLater: props.onSaveLater != null,
      submitLabel: props.submitLabel
    });
    this.formView.render();
    this.formView.on('change', this.handleChange);
    this.formView.on('complete', props.onSubmit);
    if (props.onSaveLater) {
      this.formView.on('close', props.onSaveLater);
    }
    this.formView.on('discard', props.onDiscard);
    return $(this.refs.form).append(this.formView.el);
  };

  FormComponent.prototype.componentWillUnmount = function() {
    return this.formView.remove();
  };

  FormComponent.prototype.handleChange = function() {
    return this.props.onDataChange(this.model.toJSON());
  };

  FormComponent.prototype.render = function() {
    return H.div({
      ref: "form"
    });
  };

  return FormComponent;

})(React.Component);
