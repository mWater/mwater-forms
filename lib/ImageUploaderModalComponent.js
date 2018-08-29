'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    ImageUploaderModalComponent,
    ModalPopupComponent,
    PropTypes,
    R,
    React,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

// Modal that allows upload of an image to the server
React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

// Based on http://www.matlus.com/html5-file-upload-with-progress/
module.exports = ImageUploaderModalComponent = function () {
  var ImageUploaderModalComponent = function (_React$Component) {
    _inherits(ImageUploaderModalComponent, _React$Component);

    function ImageUploaderModalComponent(props) {
      _classCallCheck(this, ImageUploaderModalComponent);

      var _this = _possibleConstructorReturn(this, (ImageUploaderModalComponent.__proto__ || Object.getPrototypeOf(ImageUploaderModalComponent)).call(this, props));

      _this.handleUploadProgress = _this.handleUploadProgress.bind(_this);
      _this.handleUploadComplete = _this.handleUploadComplete.bind(_this);
      _this.handleUploadFailed = _this.handleUploadFailed.bind(_this);
      _this.handleUploadCanceled = _this.handleUploadCanceled.bind(_this);
      _this.handleCancel = _this.handleCancel.bind(_this);
      _this.handleFileSelected = _this.handleFileSelected.bind(_this);
      _this.state = {
        id: null, // id of image uploaded
        xhr: null, // Upload xhr
        percentComplete: null // Percent upload completed
      };
      return _this;
    }

    // Static function to show modal easily


    _createClass(ImageUploaderModalComponent, [{
      key: 'handleUploadProgress',
      value: function handleUploadProgress(evt) {
        var percentComplete;
        boundMethodCheck(this, ImageUploaderModalComponent);
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
      }
    }, {
      key: 'handleUploadComplete',
      value: function handleUploadComplete(evt) {
        boundMethodCheck(this, ImageUploaderModalComponent);
        // This event is raised when the server send back a response 
        if (evt.target.status === 200) {
          return this.props.onSuccess(this.state.id);
        } else {
          alert(this.props.T("Upload failed: {0}", evt.target.responseText));
          return this.props.onCancel();
        }
      }
    }, {
      key: 'handleUploadFailed',
      value: function handleUploadFailed(evt) {
        boundMethodCheck(this, ImageUploaderModalComponent);
        alert(this.props.T("Error uploading file. You must be connected to the Internet for image upload to work from a web browser."));
        return this.props.onCancel();
      }
    }, {
      key: 'handleUploadCanceled',
      value: function handleUploadCanceled(evt) {
        boundMethodCheck(this, ImageUploaderModalComponent);
        alert(this.props.T("Upload cancelled"));
        return this.props.onCancel();
      }
    }, {
      key: 'handleCancel',
      value: function handleCancel() {
        var ref;
        boundMethodCheck(this, ImageUploaderModalComponent);
        return (ref = this.state.xhr) != null ? ref.abort() : void 0;
      }
    }, {
      key: 'handleFileSelected',
      value: function handleFileSelected(ev) {
        var fd, file, id, url, xhr;
        boundMethodCheck(this, ImageUploaderModalComponent);
        // Get file information
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
        // Add event listners 
        xhr.upload.onprogress = this.handleUploadProgress;
        xhr.addEventListener("load", this.handleUploadComplete, false);
        xhr.addEventListener("error", this.handleUploadFailed, false);
        xhr.addEventListener("abort", this.handleUploadCanceled, false);
        // Create id
        id = formUtils.createUid();
        // Generate url
        url = this.props.apiUrl + "images/" + id;
        if (this.props.client) {
          url += "?client=" + this.props.client;
        }
        // Set that uploading (start at 100% in case no updates)
        this.setState({
          id: id,
          xhr: xhr,
          percentComplete: 100
        });

        // Begin upload
        xhr.open("POST", url);
        return xhr.send(fd);
      }
    }, {
      key: 'renderContents',
      value: function renderContents() {
        return H.div(null, H.form({
          encType: "multipart/form-data",
          method: "post"
        }, H.label({
          className: "btn btn-default btn-lg",
          style: {
            display: this.state.xhr ? "none" : void 0
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
            display: !this.state.xhr ? "none" : void 0
          }
        }, H.p(null, H.em(null, this.props.T("Uploading Image..."))), H.div({
          className: "progress progress-striped active"
        }, H.div({
          className: "progress-bar",
          style: {
            width: this.state.percentComplete + '%'
          }
        })))), this.state.xhr ? H.button({
          type: "button",
          className: "btn btn-default",
          onClick: this.handleCancel
        }, this.props.T("Cancel")) : void 0);
      }
    }, {
      key: 'render',
      value: function render() {
        return R(ModalPopupComponent, {
          header: this.props.T("Upload Image"),
          showCloseX: true,
          onClose: this.props.onCancel
        }, this.renderContents());
      }
    }], [{
      key: 'show',
      value: function show(apiUrl, client, T, success) {
        return ModalPopupComponent.show(function (onClose) {
          return R(ImageUploaderModalComponent, {
            apiUrl: apiUrl,
            client: client,
            T: T,
            onCancel: onClose,
            onSuccess: function onSuccess(id) {
              onClose();
              return success(id);
            }
          });
        });
      }
    }]);

    return ImageUploaderModalComponent;
  }(React.Component);

  ;

  ImageUploaderModalComponent.propTypes = {
    apiUrl: PropTypes.string.isRequired,
    client: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired, // Called with id of image
    T: PropTypes.func.isRequired // Localizer to use
  };

  return ImageUploaderModalComponent;
}.call(undefined);