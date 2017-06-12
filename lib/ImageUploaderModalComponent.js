var H, ImageUploaderModalComponent, ModalPopupComponent, PropTypes, R, React, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

module.exports = ImageUploaderModalComponent = (function(superClass) {
  extend(ImageUploaderModalComponent, superClass);

  ImageUploaderModalComponent.propTypes = {
    apiUrl: PropTypes.string.isRequired,
    client: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired
  };

  function ImageUploaderModalComponent(props) {
    this.handleFileSelected = bind(this.handleFileSelected, this);
    this.handleCancel = bind(this.handleCancel, this);
    this.handleUploadCanceled = bind(this.handleUploadCanceled, this);
    this.handleUploadFailed = bind(this.handleUploadFailed, this);
    this.handleUploadComplete = bind(this.handleUploadComplete, this);
    this.handleUploadProgress = bind(this.handleUploadProgress, this);
    ImageUploaderModalComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      id: null,
      xhr: null,
      percentComplete: null
    };
  }

  ImageUploaderModalComponent.show = function(apiUrl, client, T, success) {
    return ModalPopupComponent.show(function(onClose) {
      return R(ImageUploaderModalComponent, {
        apiUrl: apiUrl,
        client: client,
        T: T,
        onCancel: onClose,
        onSuccess: function(id) {
          onClose();
          return success(id);
        }
      });
    });
  };

  ImageUploaderModalComponent.prototype.handleUploadProgress = function(evt) {
    var percentComplete;
    if (evt.lengthComputable) {
      percentComplete = Math.round(evt.loaded * 100 / evt.total);
      return this.setState({
        percentComplete: percentComplete
      });
    } else {
      return this.setState({
        percentComplete: 100
      });
    }
  };

  ImageUploaderModalComponent.prototype.handleUploadComplete = function(evt) {
    if (evt.target.status === 200) {
      return this.props.onSuccess(this.state.id);
    } else {
      alert(this.props.T("Upload failed: {0}", evt.target.responseText));
      return this.props.onCancel();
    }
  };

  ImageUploaderModalComponent.prototype.handleUploadFailed = function(evt) {
    alert(this.props.T("Error uploading file. You must be connected to the Internet for image upload to work from a web browser."));
    return this.props.onCancel();
  };

  ImageUploaderModalComponent.prototype.handleUploadCanceled = function(evt) {
    alert(this.props.T("Upload cancelled"));
    return this.props.onCancel();
  };

  ImageUploaderModalComponent.prototype.handleCancel = function() {
    var ref;
    return (ref = this.state.xhr) != null ? ref.abort() : void 0;
  };

  ImageUploaderModalComponent.prototype.handleFileSelected = function(ev) {
    var fd, file, id, url, xhr;
    file = ev.target.files[0];
    if (!file) {
      return;
    }
    if (file.type !== "image/jpeg") {
      alert(T("Image must be a jpeg file"));
      return;
    }
    xhr = new XMLHttpRequest();
    fd = new FormData();
    fd.append("image", file);
    xhr.upload.onprogress = this.handleUploadProgress;
    xhr.addEventListener("load", this.handleUploadComplete, false);
    xhr.addEventListener("error", this.handleUploadFailed, false);
    xhr.addEventListener("abort", this.handleUploadCanceled, false);
    id = formUtils.createUid();
    url = this.props.apiUrl + "images/" + id;
    if (this.props.client) {
      url += "?client=" + this.props.client;
    }
    this.setState({
      id: id,
      xhr: xhr,
      percentComplete: 100
    });
    xhr.open("POST", url);
    return xhr.send(fd);
  };

  ImageUploaderModalComponent.prototype.renderContents = function() {
    return H.div(null, H.form({
      encType: "multipart/form-data",
      method: "post"
    }, H.label({
      className: "btn btn-default btn-lg",
      style: {
        display: (this.state.xhr ? "none" : void 0)
      }
    }, H.span({
      className: "glyphicon glyphicon-camera"
    }), " ", this.props.T("Select"), H.input({
      type: "file",
      ref: "uploadFile",
      style: {
        display: "none"
      },
      onChange: this.handleFileSelected
    })), H.div({
      style: {
        display: (!this.state.xhr ? "none" : void 0)
      }
    }, H.p(null, H.em(null, this.props.T("Uploading Image..."))), H.div({
      className: "progress progress-striped active"
    }, H.div({
      className: "progress-bar",
      style: {
        width: this.state.percentComplete + "%"
      }
    })))), this.state.xhr ? H.button({
      type: "button",
      className: "btn btn-default",
      onClick: this.handleCancel
    }, this.props.T("Cancel")) : void 0);
  };

  ImageUploaderModalComponent.prototype.render = function() {
    return R(ModalPopupComponent, {
      header: this.props.T("Upload Image"),
      showCloseX: true,
      onClose: this.props.onCancel
    }, this.renderContents());
  };

  return ImageUploaderModalComponent;

})(React.Component);
