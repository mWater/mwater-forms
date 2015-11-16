var H, ImageDisplayComponent, React, SiteDisplayComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

ImageDisplayComponent = require('./ImageDisplayComponent');

H = React.DOM;

module.exports = SiteDisplayComponent = (function(superClass) {
  extend(SiteDisplayComponent, superClass);

  SiteDisplayComponent.propTypes = {
    siteCode: React.PropTypes.string,
    formCtx: React.PropTypes.object.isRequired,
    hideCode: React.PropTypes.bool
  };

  function SiteDisplayComponent(props) {
    SiteDisplayComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      site: null
    };
  }

  SiteDisplayComponent.prototype.componentWillReceiveProps = function(newProps) {
    return this.update(newProps);
  };

  SiteDisplayComponent.prototype.componentDidMount = function() {
    return this.update(this.props);
  };

  SiteDisplayComponent.prototype.update = function(props) {
    if (!props.siteCode) {
      return this.setState({
        site: null
      });
    }
    if (props.formCtx.getSite) {
      return props.formCtx.getSite(props.siteCode, (function(_this) {
        return function(site) {
          return _this.setState({
            site: site
          });
        };
      })(this));
    }
  };

  SiteDisplayComponent.prototype.renderNameValue = function(name, value) {
    return H.div({
      key: name
    }, H.span({
      className: "text-muted"
    }, name + ": "), value);
  };

  SiteDisplayComponent.prototype.render = function() {
    if (!this.props.siteCode) {
      return null;
    }
    if (!this.state.site) {
      if (!this.props.hideCode) {
        return this.renderNameValue("Code", this.props.siteCode);
      } else {
        return null;
      }
    }
    return H.div(null, !this.props.hideCode ? this.renderNameValue("Code", this.state.site.code) : void 0, this.renderNameValue("Name", this.state.site.name), this.state.site.desc ? this.renderNameValue("Description", this.state.site.desc) : void 0, this.state.site.type ? this.renderNameValue("Type", this.state.site.type.join(": ")) : void 0, this.state.site.photos && this.state.site.photos.length > 0 ? this.renderNameValue("Photos", _.map(this.state.site.photos, (function(_this) {
      return function(img) {
        return React.createElement(ImageDisplayComponent, {
          formCtx: _this.props.formCtx,
          id: img.id
        });
      };
    })(this))) : void 0);
  };

  return SiteDisplayComponent;

})(React.Component);
