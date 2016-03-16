var H, ItemComponent, ItemListComponent, R, React, _,
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
    return ItemListComponent.__super__.constructor.apply(this, arguments);
  }

  ItemListComponent.propTypes = {
    contents: React.PropTypes.array.isRequired,
    data: React.PropTypes.object,
    onDataChange: React.PropTypes.func.isRequired
  };

  ItemListComponent.prototype.render = function() {
    return H.div(null, _.map(this.props.contents, (function(_this) {
      return function(item) {
        return R(ItemComponent, {
          item: item,
          data: _this.props.data,
          onDataChange: _this.props.onDataChange
        });
      };
    })(this)));
  };

  return ItemListComponent;

})(React.Component);
