var EntityLoadingComponent, H, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

module.exports = EntityLoadingComponent = (function(superClass) {
  extend(EntityLoadingComponent, superClass);

  EntityLoadingComponent.propTypes = {
    entityId: React.PropTypes.string,
    entityType: React.PropTypes.string.isRequired,
    formCtx: React.PropTypes.object.isRequired,
    T: React.PropTypes.func
  };

  function EntityLoadingComponent() {
    EntityLoadingComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      loading: true,
      entity: null
    };
  }

  EntityLoadingComponent.prototype.loadEntity = function(props) {
    if (!props.entityId) {
      return this.setState({
        loading: false,
        entity: null,
        notFound: false
      });
    } else {
      this.setState({
        loading: true
      });
      return props.formCtx.getEntity(props.entityType, props.entityId, (function(_this) {
        return function(entity) {
          if (entity) {
            return _this.setState({
              loading: false,
              entity: entity,
              notFound: false
            });
          } else {
            return _this.setState({
              loading: false,
              entity: null,
              notFound: true
            });
          }
        };
      })(this));
    }
  };

  EntityLoadingComponent.prototype.componentDidMount = function() {
    return this.loadEntity(this.props);
  };

  EntityLoadingComponent.prototype.componentWillReceiveProps = function(nextProps) {
    if (nextProps.entityId !== this.props.entityId || nextProps.entityType !== this.props.entityType) {
      return this.loadEntity(nextProps);
    }
  };

  EntityLoadingComponent.prototype.render = function() {
    var child;
    if (this.loading) {
      return H.div(null, H.em(null, this.props.T("Loading...")));
    }
    child = React.Children.only(this.props.children);
    return React.cloneElement(child, {
      entity: this.state.entity,
      notFound: this.state.notFound
    });
  };

  return EntityLoadingComponent;

})(React.Component);
