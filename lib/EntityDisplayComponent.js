var EntityDisplayComponent, H, ImageDisplayComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

ImageDisplayComponent = require('./ImageDisplayComponent');

module.exports = EntityDisplayComponent = (function(superClass) {
  extend(EntityDisplayComponent, superClass);

  function EntityDisplayComponent() {
    return EntityDisplayComponent.__super__.constructor.apply(this, arguments);
  }

  EntityDisplayComponent.propTypes = {
    entity: React.PropTypes.object,
    notFound: React.PropTypes.bool,
    formCtx: React.PropTypes.object.isRequired,
    propertyIds: React.PropTypes.array.isRequired,
    locale: React.PropTypes.string,
    T: React.PropTypes.func
  };

  EntityDisplayComponent.prototype.formatEntityProperties = function(entity) {
    var i, len, localize, name, prop, propId, propUnit, propValue, properties, ref, value;
    localize = (function(_this) {
      return function(str) {
        return str[_this.props.locale] || str.en;
      };
    })(this);
    properties = [];
    ref = this.props.propertyIds;
    for (i = 0, len = ref.length; i < len; i++) {
      propId = ref[i];
      if (_.isObject(propId)) {
        propId = propId._id;
      }
      prop = this.props.formCtx.getProperty(propId);
      name = localize(prop.name);
      value = entity[prop.code];
      if (value == null) {
        properties.push({
          name: name,
          value: H.span({
            className: "text-muted"
          }, "-")
        });
      } else {
        switch (prop.type) {
          case "text":
          case "integer":
          case "decimal":
          case "date":
          case "entity":
            properties.push({
              name: name,
              value: value
            });
            break;
          case "enum":
            propValue = _.findWhere(prop.values, {
              code: value
            });
            if (propValue) {
              properties.push({
                name: name,
                value: localize(propValue.name)
              });
            } else {
              properties.push({
                name: name,
                value: "???"
              });
            }
            break;
          case "boolean":
            properties.push({
              name: name,
              value: value ? "true" : "false"
            });
            break;
          case "geometry":
            if (value.type === "Point") {
              properties.push({
                name: name,
                value: value.coordinates[1] + ", " + value.coordinates[0]
              });
            }
            break;
          case "measurement":
            propUnit = this.props.formCtx.getUnit(value.unit);
            if (propUnit) {
              properties.push({
                name: name,
                value: value.magnitude + " " + propUnit.symbol
              });
            } else {
              properties.push({
                name: name,
                value: value.magnitude + " " + "???"
              });
            }
            break;
          case "image":
            properties.push({
              name: name,
              value: React.createElement(ImageDisplayComponent, {
                formCtx: this.props.formCtx,
                id: value.id
              })
            });
            break;
          case "imagelist":
            properties.push({
              name: name,
              value: _.map(value, (function(_this) {
                return function(img) {
                  return React.createElement(ImageDisplayComponent, {
                    formCtx: _this.props.formCtx,
                    id: img.id
                  });
                };
              })(this))
            });
            break;
          default:
            properties.push({
              name: name,
              value: "???"
            });
        }
      }
    }
    return properties;
  };

  EntityDisplayComponent.prototype.render = function() {
    var propElems;
    if (this.props.entity) {
      propElems = _.map(this.formatEntityProperties(this.props.entity), (function(_this) {
        return function(prop) {
          return H.div({
            key: prop.name
          }, H.span({
            className: "text-muted"
          }, prop.name + ": "), prop.value);
        };
      })(this));
      return H.div(null, propElems);
    } else if (this.props.notFound) {
      return H.div({
        className: "text-warning"
      }, this.props.T("Not found"));
    } else {
      return H.div();
    }
  };

  return EntityDisplayComponent;

})(React.Component);
