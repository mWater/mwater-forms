let ResponseViewEditComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import FormComponent from './FormComponent';
import ResponseModel from './ResponseModel';
import ResponseDisplayComponent from './ResponseDisplayComponent';
import ui from 'react-library/lib/bootstrap';

// Displays a view of a response that can be edited, rejected, etc. 
// When editing, shows in single-page mode.
export default ResponseViewEditComponent = (function() {
  ResponseViewEditComponent = class ResponseViewEditComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        form: PropTypes.object.isRequired,  // Form to use
        formCtx: PropTypes.object.isRequired, // FormContext
        response: PropTypes.object.isRequired,  // Response object
    
        login: PropTypes.object,  // Current login (contains user, username, groups)
        apiUrl: PropTypes.string.isRequired,  // api url to use e.g. https://api.mwater.co/v3/
  
        onUpdateResponse: PropTypes.func.isRequired, // Called when response is updated with new response
        onDeleteResponse: PropTypes.func.isRequired, // Called when response is removed
  
        schema: PropTypes.object.isRequired, // Schema, including the form
        locale: PropTypes.string, // The locale to display the response in
        T: PropTypes.object.isRequired
      };
       // Localizer to use
    }

    constructor(props) {
      this.handleApprove = this.handleApprove.bind(this);
      this.handleReject = this.handleReject.bind(this);
      this.handleUnreject = this.handleUnreject.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleDataChange = this.handleDataChange.bind(this);
      this.handleDiscard = this.handleDiscard.bind(this);
      this.handleSaveLater = this.handleSaveLater.bind(this);
      this.handleEdit = this.handleEdit.bind(this);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      super(props);
      this.state = {
        editMode: false,  // True if in edit mode
        unsavedData: null  // Present if unsaved changes have been made
      };

      // Set locale to first locale of form
      this.state.locale = props.locale || props.form.design.locales[0]?.code || "en";
    }

    // Create a response model
    createResponseModel(response) {
      let responseModel;
      return responseModel = new ResponseModel({response, form: this.props.form, user: this.props.login?.user, username: this.props.login?.username, groups: this.props.login?.groups});
    }

    handleApprove() {
      // TODO no longer needed if response model becomes immutable
      const response = _.cloneDeep(this.props.response);
      const responseModel = this.createResponseModel(response);

      if (!responseModel.canApprove()) {
        return alert("Cannot approve");
      }

      responseModel.approve();
      return this.props.onUpdateResponse(response);
    }

    handleReject() {
      // TODO no longer needed if response model becomes immutable
      const response = _.cloneDeep(this.props.response);
      const responseModel = this.createResponseModel(response);

      if (!responseModel.canReject()) {
        return alert("Cannot reject");
      }

      const message = prompt("Reason for rejection?");
      if ((message == null)) {
        return;
      }

      responseModel.reject(message);
      return this.props.onUpdateResponse(response);
    }

    handleUnreject() {
      // TODO no longer needed if response model becomes immutable
      const response = _.cloneDeep(this.props.response);
      const responseModel = this.createResponseModel(response);

      if (!responseModel.canSubmit(this.props.response)) {
        return alert("Cannot unreject");
      }

      responseModel.submit();
      return this.props.onUpdateResponse(response);
    }

    handleDelete() {
      if (!confirm("Permanently delete response?")) {
        return;
      }

      return this.props.onDeleteResponse();
    }

    handleDataChange(data) { return this.setState({unsavedData: data}); }
    handleDiscard() { return this.setState({editMode: false, unsavedData: null}); }
    handleSaveLater() { return alert("Drafts cannot be saved in this mode. Discard or submit to keep changes"); }
    handleEdit() { return this.setState({editMode: true, unsavedData: null}); }
    handleLocaleChange(ev) { return this.setState({locale: ev.target.value}); }

    handleSubmit() {
      // TODO no longer needed if response model becomes immutable
      const response = _.cloneDeep(this.props.response);
      const responseModel = this.createResponseModel(response);

      // Draft if done by enumerator
      if (responseModel.canRedraft()) {
        responseModel.redraft();
      } else {
        // Record edit
        responseModel.recordEdit();
      }

      // Update response 
      response.data = this.state.unsavedData || response.data;

      // Submit if in draft mode
      if (["draft", "rejected"].includes(response.status)) {
        responseModel.submit();
      }

      // Stop editing
      this.setState({editMode: false, unsavedData: null});

      return this.props.onUpdateResponse(response);
    }

    // Render locales
    renderLocales() {
      if (this.props.form.design.locales.length < 2) {
        return null;
      }

      return R('select', {className: "form-control input-sm", style: { width: "auto", float: "right", margin: 5 }, onChange: this.handleLocaleChange, value: this.state.locale},
        _.map(this.props.form.design.locales, l => {
          return R('option', {value: l.code}, l.name);
        })
      );
    }

    renderOperations() {
      const responseModel = this.createResponseModel(this.props.response);

      return R('div', {className: "btn-group table-hover-controls"},
        responseModel.canApprove() ?
          R('button', {key: "approve", className: "btn btn-success btn-sm approve-response", onClick: this.handleApprove},
            "Approve") : undefined,
        responseModel.canReject() ?
          R('button', {key: "reject", className: "btn btn-warning btn-sm reject-response", onClick: this.handleReject},
            "Reject") : undefined,
        responseModel.canSubmit() && (this.props.response.status === "rejected") ?
          R('button', {key: "unreject", className: "btn btn-success btn-sm unreject-response", onClick: this.handleUnreject},
            "Unreject") : undefined,
        responseModel.canDelete() ?
          R('button', {key: "delete", className: "btn btn-danger btn-sm delete-response", onClick: this.handleDelete},
            "Delete") : undefined
      );
    }

    render() {
      let elem;
      const printUrl = (this.props.login != null) ? `${this.props.apiUrl}responses/${this.props.response._id}/print?client=${this.props.login.client}&locale=${this.state.locale}` : null;
    
      // If editing
      if (this.state.editMode) {
        elem = R(FormComponent, { 
          formCtx: this.props.formCtx,
          schema: this.props.schema,
          design: this.props.form.design,
          locale: this.state.locale,
          data: this.state.unsavedData || this.props.response.data, // Use our version if changed
          onDataChange: this.handleDataChange,
          singlePageMode: true,
          disableConfidentialFields: !["draft", "rejected"].includes(this.props.response.status),
          deployment: this.props.response.deployment,
          onSubmit: this.handleSubmit,
          onSaveLater: this.handleSaveLater,
          onDiscard: this.handleDiscard
        });
      } else {
        // Determine if can edit
        const responseModel = new ResponseModel({response: this.props.response, form: this.props.form, user: this.props.login?.user, username: this.props.login?.username, groups: this.props.login?.groups});

        const actions = R('div', {style: { width: "auto", float: "right", margin: 5 }},
          this.renderOperations(),
          responseModel.canRedraft() || responseModel.canEdit() ?
            R('button', {type: "button", className: "btn btn-sm btn-default", onClick: this.handleEdit, style: {marginLeft: '10px'}},
              R('span', {className: "glyphicon glyphicon-edit"}),
              "Edit Response") : undefined
        );

        elem = 
          R('div', null,
            actions,
            R(ResponseDisplayComponent, { 
              form: this.props.form,
              response: this.props.response,
              formCtx: this.props.formCtx,
              schema: this.props.schema,
              apiUrl: this.props.apiUrl,
              locale: this.state.locale,
              login: this.props.login,
              T: this.props.T
            })
          );
      }

      return R('div', null,
        printUrl !== null ?
          R('div', {style: {textAlign: 'right'}},
            R('a', {className: 'btn btn-xs btn-link', target: "_blank", href: printUrl}, 
              R(ui.Icon, {id: "fa-external-link"}),
              " Export as PDF")
          ) : undefined,
        this.renderLocales(),
        elem);
    }
  };
  ResponseViewEditComponent.initClass();
  return ResponseViewEditComponent;
})();
