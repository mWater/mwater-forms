var H, ImageAnswerComponent, ImageEditorComponent, R, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

ImageAnswerComponent = require('./answers/ImageAnswerComponent');

module.exports = ImageEditorComponent = (function(superClass) {
  extend(ImageEditorComponent, superClass);

  function ImageEditorComponent() {
    return ImageEditorComponent.__super__.constructor.apply(this, arguments);
  }

  ImageEditorComponent.propTypes = {
    imageManager: React.PropTypes.object.isRequired,
    imageAcquirer: React.PropTypes.object,
    image: React.PropTypes.object,
    onImageChange: React.PropTypes.func,
    T: React.PropTypes.func.isRequired
  };

  ImageEditorComponent.childContextTypes = {
    imageManager: React.PropTypes.object.isRequired,
    imageAcquirer: React.PropTypes.object,
    T: React.PropTypes.func.isRequired
  };

  ImageEditorComponent.prototype.getChildContext = function() {
    return {
      imageManager: this.props.imageManager,
      imageAcquirer: this.props.imageAcquirer,
      T: this.props.T
    };
  };

  ImageEditorComponent.prototype.render = function() {
    return R(ImageAnswerComponent, {
      image: this.props.image,
      onImageChange: this.props.onImageChange
    });
  };

  return ImageEditorComponent;

})(React.Component);
