let ImageUploaderModalComponent;
import PropTypes from 'prop-types';

// Modal that allows upload of an image to the server
import React from 'react';

const R = React.createElement;

import formUtils from './formUtils';
import ModalPopupComponent from 'react-library/lib/ModalPopupComponent';

// Based on http://www.matlus.com/html5-file-upload-with-progress/
export default ImageUploaderModalComponent = (function() {
  ImageUploaderModalComponent = class ImageUploaderModalComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        apiUrl: PropTypes.string.isRequired,
        client: PropTypes.string,
        onCancel: PropTypes.func.isRequired,
        onSuccess: PropTypes.func.isRequired, // Called with id of image
        T: PropTypes.func.isRequired,        // Localizer to use
        forceCamera: PropTypes.bool
      };
  
      // Static function to show modal easily
      this.show = (apiUrl, client, T, success, forceCamera) => {
        return ModalPopupComponent.show(onClose => {
          return R(ImageUploaderModalComponent, {
            apiUrl,
            client,
            T,
            forceCamera,
            onCancel: onClose,
            onSuccess: id => {
              onClose();
              return success(id);
            }
          }
          );
        });
      };
               // True to force use of camera
    }

    constructor(props) {
      this.handleUploadProgress = this.handleUploadProgress.bind(this);
      this.handleUploadComplete = this.handleUploadComplete.bind(this);
      this.handleUploadFailed = this.handleUploadFailed.bind(this);
      this.handleUploadCanceled = this.handleUploadCanceled.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleFileSelected = this.handleFileSelected.bind(this);
      super(props);

      this.state = { 
        id: null,              // id of image uploaded
        xhr: null,             // Upload xhr
        percentComplete: null // Percent upload completed
      };
    }

    handleUploadProgress(evt) {
      let percentComplete;
      if (evt.lengthComputable) {
        percentComplete = Math.round((evt.loaded * 100) / evt.total);
        return this.setState({percentComplete});
      } else {
        return this.setState({percentComplete: 100});
      }
    }

    handleUploadComplete(evt) {
      // This event is raised when the server send back a response 
      if (evt.target.status === 200) {
        return this.props.onSuccess(this.state.id);
      } else {
        alert(this.props.T("Upload failed: {0}", evt.target.responseText));
        return this.props.onCancel();
      }
    }

    handleUploadFailed(evt) {
      alert(this.props.T("Error uploading file. You must be connected to the Internet for image upload to work from a web browser."));
      return this.props.onCancel();
    }

    handleUploadCanceled(evt) {
      alert(this.props.T("Upload cancelled"));
      return this.props.onCancel();
    }

    handleCancel() {
      return this.state.xhr?.abort();
    }

    handleFileSelected(ev) {
      // Get file information
      const file = ev.target.files[0];
      if (!file) {
        return;
      }

      if (file.type !== "image/jpeg") {
        alert(T("Image must be a jpeg file"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append("image", file);

      // Add event listners 
      xhr.upload.onprogress = this.handleUploadProgress;
      xhr.addEventListener("load", this.handleUploadComplete, false);
      xhr.addEventListener("error", this.handleUploadFailed, false);
      xhr.addEventListener("abort", this.handleUploadCanceled, false);

      // Create id
      const id = formUtils.createUid();

      // Generate url
      let url = this.props.apiUrl + "images/" + id;
      if (this.props.client) {
        url += "?client=" + this.props.client;
      }

      // Set that uploading (start at 100% in case no updates)
      this.setState({id, xhr, percentComplete: 100}); 

      // Begin upload
      xhr.open("POST", url);
      return xhr.send(fd);
    }

    renderContents() {
      return R('div', null,
        R('form', {encType: "multipart/form-data", method: "post"},
          R('label', {className: "btn btn-default btn-lg", style: { display: (this.state.xhr ? "none" : undefined) }},
            R('span', {className: "glyphicon glyphicon-camera"}),
            " ",
            this.props.T("Select"),
            R('input', {type: "file", style: { display: "none" }, accept: "image/*", capture: (this.props.forceCamera ? "camera" : undefined), onChange: this.handleFileSelected})),

          R('div', {style: { display: (!this.state.xhr ? "none" : undefined) }},
            R('p', null, 
              R('em', null, this.props.T("Uploading Image..."))),
            R('div', {className: "progress progress-striped active"},
              R('div', {className: "progress-bar", style: { width: `${this.state.percentComplete}%` }})))),

        this.state.xhr ?
          R('button', {type: "button", className: "btn btn-default", onClick: this.handleCancel},
            this.props.T("Cancel")) : undefined
      );
    }

    render() {
      return R(ModalPopupComponent, { 
        header: this.props.T("Upload Image"),
        showCloseX: true,
        onClose: this.props.onCancel
      },
         this.renderContents());
    }
  };
  ImageUploaderModalComponent.initClass();
  return ImageUploaderModalComponent;
})();
