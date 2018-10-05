PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

FormComponent = require './FormComponent'
ResponseModel = require './ResponseModel'
ResponseDisplayComponent = require './ResponseDisplayComponent'

# Displays a view of a response that can be edited, rejected, etc. 
# When editing, shows in single-page mode.
module.exports = class ResponseViewEditComponent extends React.Component
  @propTypes:
    form: PropTypes.object.isRequired  # Form to use
    formCtx: PropTypes.object.isRequired # FormContext
    response: PropTypes.object.isRequired  # Response object
  
    login: PropTypes.object  # Current login (contains user, username, groups)
    apiUrl: PropTypes.string.isRequired  # api url to use e.g. https://api.mwater.co/v3/

    onUpdateResponse: PropTypes.func.isRequired # Called when response is updated with new response
    onDeleteResponse: PropTypes.func.isRequired # Called when response is removed

    schema: PropTypes.object.isRequired # Schema, including the form
    locale: PropTypes.string # The locale to display the response in

  constructor: (props) ->
    super(props)
    @state = {
      editMode: false  # True if in edit mode
      unsavedData: null  # Present if unsaved changes have been made
    }

    # Set locale to first locale of form
    @state.locale = props.locale or props.form.design.locales[0]?.code or "en"

  # Create a response model
  createResponseModel: (response) ->
    responseModel = new ResponseModel(response: response, form: @props.form, user: @props.login?.user, username: @props.login?.username, groups: @props.login?.groups)

  handleApprove: =>
    # TODO no longer needed if response model becomes immutable
    response = _.cloneDeep(@props.response)
    responseModel = @createResponseModel(response)

    if not responseModel.canApprove()
      return alert("Cannot approve")

    responseModel.approve()
    @props.onUpdateResponse(response)

  handleReject: =>
    # TODO no longer needed if response model becomes immutable
    response = _.cloneDeep(@props.response)
    responseModel = @createResponseModel(response)

    if not responseModel.canReject()
      return alert("Cannot reject")

    message = prompt("Reason for rejection?")
    if not message?
      return

    responseModel.reject(message)
    @props.onUpdateResponse(response)

  handleUnreject: =>
    # TODO no longer needed if response model becomes immutable
    response = _.cloneDeep(@props.response)
    responseModel = @createResponseModel(response)

    if not responseModel.canSubmit(@props.response)
      return alert("Cannot unreject")

    responseModel.submit()
    @props.onUpdateResponse(response)

  handleDelete: () =>
    if not confirm("Permanently delete response?")
      return

    @props.onDeleteResponse()

  handleDataChange: (data) => @setState(unsavedData: data)
  handleDiscard: => @setState(editMode: false, unsavedData: null)
  handleSaveLater: => alert("Drafts cannot be saved in this mode. Discard or submit to keep changes")
  handleEdit: => @setState(editMode: true, unsavedData: null)
  handleLocaleChange: (ev) => @setState(locale: ev.target.value)

  handleSubmit: =>
    # TODO no longer needed if response model becomes immutable
    response = _.cloneDeep(@props.response)
    responseModel = @createResponseModel(response)

    # Draft if done by enumerator
    if responseModel.canRedraft()
      responseModel.redraft()
    else
      # Record edit
      responseModel.recordEdit()

    # Update response 
    response.data = @state.unsavedData or response.data

    # Submit if in draft mode
    if response.status in ["draft", "rejected"]
      responseModel.submit()

    # Stop editing
    @setState(editMode: false, unsavedData: null)

    @props.onUpdateResponse(response)

  # Render locales
  renderLocales: ->
    if @props.form.design.locales.length < 2
      return null

    R 'select', className: "form-control input-sm", style: { width: "auto", float: "right", margin: 5 }, onChange: @handleLocaleChange, value: @state.locale,
      _.map @props.form.design.locales, (l) =>
        R 'option', value: l.code, l.name

  renderOperations: () ->
    responseModel = @createResponseModel(@props.response)

    R 'div', className: "btn-group table-hover-controls",
      if responseModel.canApprove()
        R 'button', key: "approve", className: "btn btn-success btn-sm approve-response", onClick: @handleApprove,
          "Approve"
      if responseModel.canReject()
        R 'button', key: "reject", className: "btn btn-warning btn-sm reject-response", onClick: @handleReject,
          "Reject"
      if responseModel.canSubmit() and @props.response.status == "rejected"
        R 'button', key: "unreject", className: "btn btn-success btn-sm unreject-response", onClick: @handleUnreject,
          "Unreject"
      if responseModel.canDelete()
        R 'button', key: "delete", className: "btn btn-danger btn-sm delete-response", onClick: @handleDelete,
          "Delete"

  render: ->
    # If editing
    if @state.editMode
      elem = R(FormComponent, 
        formCtx: @props.formCtx
        schema: @props.schema
        design: @props.form.design
        locale: @state.locale
        data: @state.unsavedData or @props.response.data # Use our version if changed
        onDataChange: @handleDataChange
        singlePageMode: true
        disableConfidentialFields: @props.response.status not in ["draft", "rejected"]

        onSubmit: @handleSubmit
        onSaveLater: @handleSaveLater
        onDiscard: @handleDiscard)
    else
      # Determine if can edit
      responseModel = new ResponseModel(response: @props.response, form: @props.form, user: @props.login?.user, username: @props.login?.username, groups: @props.login?.groups)

      actions = R 'div', style: { width: "auto", float: "right", margin: 5 },
        @renderOperations()
        if responseModel.canRedraft() or responseModel.canEdit()
          R 'button', type: "button", className: "btn btn-sm btn-default", onClick: @handleEdit, style: {marginLeft: '10px'},
            R 'span', className: "glyphicon glyphicon-edit"
            "Edit Response"

      elem = 
        R 'div', null,
          actions
          R(ResponseDisplayComponent, 
            form: @props.form
            response: @props.response
            formCtx: @props.formCtx
            schema: @props.schema
            apiUrl: @props.apiUrl
            locale: @state.locale
            login: @props.login
            T: T)

    return R 'div', null,
      @renderLocales()
      elem
