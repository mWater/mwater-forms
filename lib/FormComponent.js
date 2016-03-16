var FormCompiler, FormComponent, H, ItemListComponent, R, React, SectionsComponent, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

FormCompiler = require('./FormCompiler');

SectionsComponent = require('./SectionsComponent');

ItemListComponent = require('./ItemListComponent');

module.exports = FormComponent = (function(superClass) {
  extend(FormComponent, superClass);

  function FormComponent() {
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
    entity: React.PropTypes.object,
    entityType: React.PropTypes.string
  };

  FormComponent.childContextTypes = require('./formContextTypes');

  FormComponent.prototype.getChildContext = function() {
    return _.extend({}, this.props.formCtx, {
      locale: this.props.locale
    });
  };

  FormComponent.prototype.render = function() {
    if (this.props.design.contents[0] && this.props.design.contents[0]._type === "Section") {
      return R(SectionsComponent, {
        contents: this.props.design.contents,
        data: this.props.data,
        onDataChange: this.props.onDataChange,
        onSubmit: this.props.onSubmit,
        onSaveLater: this.props.onSaveLater,
        onDiscard: this.props.onDiscard
      });
    } else {
      return R(ItemListComponent, {
        contents: this.props.design.contents,
        data: this.props.data,
        onDataChange: this.props.onDataChange
      });
    }
  };

  return FormComponent;

})(React.Component);
