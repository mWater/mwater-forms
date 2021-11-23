import PropTypes from "prop-types"

// Modal that allows upload of an image to the server
import React from "react"

const R = React.createElement

import * as formUtils from "./formUtils"
import ModalPopupComponent from "react-library/lib/ModalPopupComponent"

export interface ImageUploaderModalComponentProps {
  apiUrl: string
  client?: string
  onCancel: any
  /** Called with id of image */
  onSuccess: any
  /** Localizer to use */
  T: any
  forceCamera?: boolean
}

interface ImageUploaderModalComponentState {
  id: any
  xhr: any
  percentComplete: any
}

// Based on http://www.matlus.com/html5-file-upload-with-progress/
export default class ImageUploaderModalComponent extends React.Component<
  ImageUploaderModalComponentProps,
  ImageUploaderModalComponentState
> {
  static show = (apiUrl: any, client: any, T: any, success: any, forceCamera: any) => {
    return ModalPopupComponent.show((onClose: any) => {
      return R(ImageUploaderModalComponent, {
        apiUrl,
        client,
        T,
        forceCamera,
        onCancel: onClose,
        onSuccess: (id: any) => {
          onClose()
          return success(id)
        }
      })
    })
  }

  constructor(props: any) {
    super(props)

    this.state = {
      id: null, // id of image uploaded
      xhr: null, // Upload xhr
      percentComplete: null // Percent upload completed
    }
  }

  handleUploadProgress = (evt: any) => {
    let percentComplete
    if (evt.lengthComputable) {
      percentComplete = Math.round((evt.loaded * 100) / evt.total)
      return this.setState({ percentComplete })
    } else {
      return this.setState({ percentComplete: 100 })
    }
  }

  handleUploadComplete = (evt: any) => {
    // This event is raised when the server send back a response
    if (evt.target.status === 200) {
      return this.props.onSuccess(this.state.id)
    } else {
      alert(this.props.T("Upload failed: {0}", evt.target.responseText))
      return this.props.onCancel()
    }
  }

  handleUploadFailed = (evt: any) => {
    alert(
      this.props.T(
        "Error uploading file. You must be connected to the Internet for image upload to work from a web browser."
      )
    )
    return this.props.onCancel()
  }

  handleUploadCanceled = (evt: any) => {
    alert(this.props.T("Upload cancelled"))
    return this.props.onCancel()
  }

  handleCancel = () => {
    return this.state.xhr?.abort()
  }

  handleFileSelected = (ev: any) => {
    // Get file information
    const file = ev.target.files[0]
    if (!file) {
      return
    }

    if (file.type !== "image/jpeg") {
      alert(T("Image must be a jpeg file"))
      return
    }

    const xhr = new XMLHttpRequest()
    const fd = new FormData()
    fd.append("image", file)

    // Add event listners
    xhr.upload.onprogress = this.handleUploadProgress
    xhr.addEventListener("load", this.handleUploadComplete, false)
    xhr.addEventListener("error", this.handleUploadFailed, false)
    xhr.addEventListener("abort", this.handleUploadCanceled, false)

    // Create id
    const id = formUtils.createUid()

    // Generate url
    let url = this.props.apiUrl + "images/" + id
    if (this.props.client) {
      url += "?client=" + this.props.client
    }

    // Set that uploading (start at 100% in case no updates)
    this.setState({ id, xhr, percentComplete: 100 })

    // Begin upload
    xhr.open("POST", url)
    return xhr.send(fd)
  }

  renderContents() {
    return R(
      "div",
      null,
      R(
        "form",
        { encType: "multipart/form-data", method: "post" },
        R(
          "label",
          { className: "btn btn-secondary btn-lg", style: { display: this.state.xhr ? "none" : undefined } },
          R("span", { className: "fas fa-camera" }),
          " ",
          this.props.T("Select"),
          R("input", {
            type: "file",
            style: { display: "none" },
            accept: "image/*",
            capture: this.props.forceCamera ? "camera" : undefined,
            onChange: this.handleFileSelected
          })
        ),

        R(
          "div",
          { style: { display: !this.state.xhr ? "none" : undefined } },
          R("p", null, R("em", null, this.props.T("Uploading Image..."))),
          R(
            "div",
            { className: "progress progress-bar-striped active" },
            R("div", { className: "progress-bar", style: { width: `${this.state.percentComplete}%` } })
          )
        )
      ),

      this.state.xhr
        ? R(
            "button",
            { type: "button", className: "btn btn-secondary", onClick: this.handleCancel },
            this.props.T("Cancel")
          )
        : undefined
    )
  }

  render() {
    return R(
      ModalPopupComponent,
      {
        header: this.props.T("Upload Image"),
        showCloseX: true,
        onClose: this.props.onCancel
      },
      this.renderContents()
    )
  }
}
