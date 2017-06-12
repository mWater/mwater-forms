var H, ItemListComponent, PropTypes, R, React, _, formRenderUtils, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

formRenderUtils = require('./formRenderUtils');

module.exports = ItemListComponent = (function(superClass) {
  extend(ItemListComponent, superClass);

  function ItemListComponent() {
    this.renderItem = bind(this.renderItem, this);
    return ItemListComponent.__super__.constructor.apply(this, arguments);
  }

  ItemListComponent.propTypes = {
    contents: PropTypes.array.isRequired,
    data: PropTypes.object,
    responseRow: PropTypes.object.isRequired,
    onDataChange: PropTypes.func.isRequired,
    onNext: PropTypes.func,
    isVisible: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired
  };

  ItemListComponent.prototype.validate = function(scrollToFirstInvalid) {
    var foundInvalid, i, item, len, ref, ref1;
    foundInvalid = false;
    ref = this.props.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if ((ref1 = this.refs[item._id]) != null ? typeof ref1.validate === "function" ? ref1.validate(scrollToFirstInvalid && !foundInvalid) : void 0 : void 0) {
        foundInvalid = true;
      }
    }
    return foundInvalid;
  };

  ItemListComponent.prototype.handleNext = function(index) {
    var base, ref;
    index++;
    if (index >= this.props.contents.length) {
      return typeof (base = this.props).onNext === "function" ? base.onNext() : void 0;
    } else {
      return (ref = this.refs[this.props.contents[index]._id]) != null ? typeof ref.focus === "function" ? ref.focus() : void 0 : void 0;
    }
  };

  ItemListComponent.prototype.renderItem = function(item, index) {
    if (this.props.isVisible(item._id) && !item.disabled) {
      return formRenderUtils.renderItem(item, this.props.data, this.props.responseRow, this.props.schema, this.props.onDataChange, this.props.isVisible, this.handleNext.bind(this, index));
    }
  };

  ItemListComponent.prototype.render = function() {
    return H.div(null, _.map(this.props.contents, this.renderItem));
  };

  return ItemListComponent;

})(React.Component);
