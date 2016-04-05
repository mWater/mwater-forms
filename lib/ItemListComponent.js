var H, ItemComponent, ItemListComponent, R, React, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

ItemComponent = require('./ItemComponent');

module.exports = ItemListComponent = (function(superClass) {
  extend(ItemListComponent, superClass);

  function ItemListComponent() {
    this.renderItem = bind(this.renderItem, this);
    return ItemListComponent.__super__.constructor.apply(this, arguments);
  }

  ItemListComponent.propTypes = {
    contents: React.PropTypes.array.isRequired,
    data: React.PropTypes.object,
    onDataChange: React.PropTypes.func.isRequired,
    onNext: React.PropTypes.func,
    isVisible: React.PropTypes.func.isRequired
  };

  ItemListComponent.prototype.validate = function(scrollToFirstInvalid) {
    var foundInvalid, i, item, itemComponent, len, ref;
    foundInvalid = false;
    ref = this.props.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      itemComponent = this.refs[item._id];
      if ((itemComponent != null ? itemComponent.validate : void 0) != null) {
        if (itemComponent.validate(scrollToFirstInvalid && !foundInvalid)) {
          foundInvalid = true;
        }
      }
    }
    return foundInvalid;
  };

  ItemListComponent.prototype.handleNext = function(index) {
    index++;
    if (index >= this.props.contents.length) {
      return this.props.onNext();
    } else {
      return this.refs[this.props.contents[index]._id].focus();
    }
  };

  ItemListComponent.prototype.renderItem = function(item, index) {
    if (!this.props.isVisible(item._id)) {
      return null;
    }
    return R(ItemComponent, {
      key: item._id,
      ref: item._id,
      item: item,
      data: this.props.data,
      onDataChange: this.props.onDataChange,
      onNext: this.handleNext.bind(this, index),
      isVisible: this.props.isVisible
    });
  };

  ItemListComponent.prototype.render = function() {
    return H.div(null, _.map(this.props.contents, this.renderItem));
  };

  return ItemListComponent;

})(React.Component);
