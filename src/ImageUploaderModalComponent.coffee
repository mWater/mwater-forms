PropTypes = require('prop-types')
# Modal that allows upload of an image to the server
React = require 'react'
R = React.createElement

formUtils = require './formUtils'
ModalPopupComponent = require('react-library/lib/ModalPopupComponent')

# Based on http://www.matlus.com/html5-file-upload-with-progress/
module.exports = class ImageUploaderModalComponent extends React.Component
  @propTypes:
    apiUrl: PropTypes.string.isRequired
    client: PropTypes.string
    onCancel: PropTypes.func.isRequired
    onSuccess: PropTypes.func.isRequired # Called with id of image
    T: PropTypes.func.isRequired        # Localizer to use
    forceCamera: PropTypes.bool         # True to force use of camera

  constructor: (props) ->
    super(props)

    @state = { 
      id: null              # id of image uploaded
      xhr: null             # Upload xhr
      percentComplete: null # Percent upload completed
    }

  # Static function to show modal easily
  @show: (apiUrl, client, T, success) =>
    ModalPopupComponent.show (onClose) =>
      R ImageUploaderModalComponent,
        apiUrl: apiUrl
        client: client
        T: T
        onCancel: onClose
        onSuccess: (id) =>
          onClose()
          success(id)

  handleUploadProgress: (evt) =>
    if evt.lengthComputable
      percentComplete = Math.round(evt.loaded * 100 / evt.total)
      @setState(percentComplete: percentComplete)
    else
      @setState(percentComplete: 100)

  handleUploadComplete: (evt) =>
    # This event is raised when the server send back a response 
    if evt.target.status == 200
      @props.onSuccess(@state.id)
    else
      alert(@props.T("Upload failed: {0}", evt.target.responseText))
      @props.onCancel()

  handleUploadFailed: (evt) =>
    alert(@props.T("Error uploading file. You must be connected to the Internet for image upload to work from a web browser."))
    @props.onCancel()

  handleUploadCanceled: (evt) =>
    alert(@props.T("Upload cancelled"))
    @props.onCancel()

  handleCancel: =>
    @state.xhr?.abort()

  handleFileSelected: (ev) =>
    # Get file information
    file = ev.target.files[0]
    if not file
      return

    if file.type != "image/jpeg"
      alert(T("Image must be a jpeg file"))
      return

    xhr = new XMLHttpRequest()
    fd = new FormData()
    fd.append "image", file

    # Add event listners 
    xhr.upload.onprogress = @handleUploadProgress
    xhr.addEventListener "load", @handleUploadComplete, false
    xhr.addEventListener "error", @handleUploadFailed, false
    xhr.addEventListener "abort", @handleUploadCanceled, false

    # Create id
    id = formUtils.createUid()

    # Generate url
    url = @props.apiUrl + "images/" + id
    if @props.client
      url += "?client=" + @props.client

    # Set that uploading (start at 100% in case no updates)
    @setState(id: id, xhr: xhr, percentComplete: 100) 

    # Begin upload
    xhr.open "POST", url
    xhr.send fd

  renderContents: ->
    R 'div', null,
      R 'form', encType: "multipart/form-data", method: "post",
        R 'label', className: "btn btn-default btn-lg", style: { display: (if @state.xhr then "none") },
          R 'span', className: "glyphicon glyphicon-camera"
          " "
          @props.T("Select")
          R 'input', type: "file", style: { display: "none" }, accept: "image/*", capture: (if @props.forceCamera then "camera"), onChange: @handleFileSelected

        R 'div', style: { display: (if not @state.xhr then "none") },
          R 'p', null, 
            R 'em', null, @props.T("Uploading Image...")
          R 'div', className: "progress progress-striped active",
            R 'div', className: "progress-bar", style: { width: "#{@state.percentComplete}%" }

      if @state.xhr
        R 'button', type: "button", className: "btn btn-default", onClick: @handleCancel,
          @props.T("Cancel")

  render: ->
    R ModalPopupComponent, 
      header: @props.T("Upload Image")
      showCloseX: true
      onClose: @props.onCancel,
       @renderContents()
