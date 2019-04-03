"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var ImageUploaderModalComponent,
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

PropTypes = require('prop-types'); // Modal that allows upload of an image to the server

React = require('react');
R = React.createElement;
formUtils = require('./formUtils');
ModalPopupComponent = require('react-library/lib/ModalPopupComponent'); // Based on http://www.matlus.com/html5-file-upload-with-progress/

module.exports = ImageUploaderModalComponent = function () {
  var ImageUploaderModalComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(ImageUploaderModalComponent, _React$Component);

    function ImageUploaderModalComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, ImageUploaderModalComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ImageUploaderModalComponent).call(this, props));
      _this.handleUploadProgress = _this.handleUploadProgress.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleUploadComplete = _this.handleUploadComplete.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleUploadFailed = _this.handleUploadFailed.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleUploadCanceled = _this.handleUploadCanceled.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleCancel = _this.handleCancel.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleFileSelected = _this.handleFileSelected.bind((0, _assertThisInitialized2["default"])(_this));
      _this.state = {
        id: null,
        // id of image uploaded
        xhr: null,
        // Upload xhr
        percentComplete: null // Percent upload completed

      };
      return _this;
    } // Static function to show modal easily


    (0, _createClass2["default"])(ImageUploaderModalComponent, [{
      key: "handleUploadProgress",
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
      key: "handleUploadComplete",
      value: function handleUploadComplete(evt) {
        boundMethodCheck(this, ImageUploaderModalComponent); // This event is raised when the server send back a response 

        if (evt.target.status === 200) {
          return this.props.onSuccess(this.state.id);
        } else {
          alert(this.props.T("Upload failed: {0}", evt.target.responseText));
          return this.props.onCancel();
        }
      }
    }, {
      key: "handleUploadFailed",
      value: function handleUploadFailed(evt) {
        boundMethodCheck(this, ImageUploaderModalComponent);
        alert(this.props.T("Error uploading file. You must be connected to the Internet for image upload to work from a web browser."));
        return this.props.onCancel();
      }
    }, {
      key: "handleUploadCanceled",
      value: function handleUploadCanceled(evt) {
        boundMethodCheck(this, ImageUploaderModalComponent);
        alert(this.props.T("Upload cancelled"));
        return this.props.onCancel();
      }
    }, {
      key: "handleCancel",
      value: function handleCancel() {
        var ref;
        boundMethodCheck(this, ImageUploaderModalComponent);
        return (ref = this.state.xhr) != null ? ref.abort() : void 0;
      }
    }, {
      key: "handleFileSelected",
      value: function handleFileSelected(ev) {
        var fd, file, id, url, xhr;
        boundMethodCheck(this, ImageUploaderModalComponent); // Get file information

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
        fd.append("image", file); // Add event listners 

        xhr.upload.onprogress = this.handleUploadProgress;
        xhr.addEventListener("load", this.handleUploadComplete, false);
        xhr.addEventListener("error", this.handleUploadFailed, false);
        xhr.addEventListener("abort", this.handleUploadCanceled, false); // Create id

        id = formUtils.createUid(); // Generate url

        url = this.props.apiUrl + "images/" + id;

        if (this.props.client) {
          url += "?client=" + this.props.client;
        } // Set that uploading (start at 100% in case no updates)


        this.setState({
          id: id,
          xhr: xhr,
          percentComplete: 100
        }); // Begin upload

        xhr.open("POST", url);
        return xhr.send(fd);
      }
    }, {
      key: "renderContents",
      value: function renderContents() {
        return R('div', null, R('form', {
          encType: "multipart/form-data",
          method: "post"
        }, R('label', {
          className: "btn btn-default btn-lg",
          style: {
            display: this.state.xhr ? "none" : void 0
          }
        }, R('span', {
          className: "glyphicon glyphicon-camera"
        }), " ", this.props.T("Select"), R('input', {
          type: "file",
          style: {
            display: "none"
          },
          accept: "image/*",
          capture: this.props.forceCamera ? "camera" : void 0,
          onChange: this.handleFileSelected
        })), R('div', {
          style: {
            display: !this.state.xhr ? "none" : void 0
          }
        }, R('p', null, R('em', null, this.props.T("Uploading Image..."))), R('div', {
          className: "progress progress-striped active"
        }, R('div', {
          className: "progress-bar",
          style: {
            width: "".concat(this.state.percentComplete, "%")
          }
        })))), this.state.xhr ? R('button', {
          type: "button",
          className: "btn btn-default",
          onClick: this.handleCancel
        }, this.props.T("Cancel")) : void 0);
      }
    }, {
      key: "render",
      value: function render() {
        return R(ModalPopupComponent, {
          header: this.props.T("Upload Image"),
          showCloseX: true,
          onClose: this.props.onCancel
        }, this.renderContents());
      }
    }], [{
      key: "show",
      value: function show(apiUrl, client, T, success, forceCamera) {
        return ModalPopupComponent.show(function (onClose) {
          return R(ImageUploaderModalComponent, {
            apiUrl: apiUrl,
            client: client,
            T: T,
            forceCamera: forceCamera,
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
    onSuccess: PropTypes.func.isRequired,
    // Called with id of image
    T: PropTypes.func.isRequired,
    // Localizer to use
    forceCamera: PropTypes.bool // True to force use of camera

  };
  return ImageUploaderModalComponent;
}.call(void 0);