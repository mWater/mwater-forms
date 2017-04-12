var H, ImagelistEditorComponent, ImagesAnswerComponent, R, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

ImagesAnswerComponent = require('./answers/ImagesAnswerComponent');

module.exports = ImagelistEditorComponent = (function(superClass) {
  extend(ImagelistEditorComponent, superClass);

  function ImagelistEditorComponent() {
    return ImagelistEditorComponent.__super__.constructor.apply(this, arguments);
  }

  ImagelistEditorComponent.propTypes = {
    imageManager: React.PropTypes.object.isRequired,
    imageAcquirer: React.PropTypes.object,
    imagelist: React.PropTypes.array,
    onImagelistChange: React.PropTypes.func,
    T: React.PropTypes.func.isRequired
  };

  ImagelistEditorComponent.childContextTypes = {
    imageManager: React.PropTypes.object.isRequired,
    imageAcquirer: React.PropTypes.object,
    T: React.PropTypes.func.isRequired
  };

  ImagelistEditorComponent.prototype.getChildContext = function() {
    return {
      imageManager: this.props.imageManager,
      imageAcquirer: this.props.imageAcquirer,
      T: this.props.T
    };
  };

  ImagelistEditorComponent.prototype.render = function() {
    return R(ImagesAnswerComponent, {
      imagelist: this.props.imagelist,
      onImagelistChange: this.props.onImagelistChange
    });
  };

  return ImagelistEditorComponent;

})(React.Component);
