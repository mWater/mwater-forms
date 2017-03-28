var FormComponent, H, R, React, ResponseDisplayComponent, ResponseModel, ResponseViewEditComponent, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

FormComponent = './FormComponent';

ResponseModel = './ResponseModel';

ResponseDisplayComponent = require('./ResponseDisplayComponent');

module.exports = ResponseViewEditComponent = (function(superClass) {
  extend(ResponseViewEditComponent, superClass);

  ResponseViewEditComponent.propTypes = {
    form: React.PropTypes.object.isRequired,
    formCtx: React.PropTypes.object.isRequired,
    response: React.PropTypes.object.isRequired,
    login: React.PropTypes.object,
    apiUrl: React.PropTypes.string.isRequired,
    onUpdateResponse: React.PropTypes.func.isRequired,
    onDeleteResponse: React.PropTypes.func.isRequired,
    schema: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string
  };

  function ResponseViewEditComponent(props) {
    this.handleSubmit = bind(this.handleSubmit, this);
    this.handleLocaleChange = bind(this.handleLocaleChange, this);
    this.handleEdit = bind(this.handleEdit, this);
    this.handleSaveLater = bind(this.handleSaveLater, this);
    this.handleDiscard = bind(this.handleDiscard, this);
    this.handleDataChange = bind(this.handleDataChange, this);
    this.handleDelete = bind(this.handleDelete, this);
    this.handleUnreject = bind(this.handleUnreject, this);
    this.handleReject = bind(this.handleReject, this);
    this.handleApprove = bind(this.handleApprove, this);
    var ref;
    ResponseViewEditComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      editMode: false,
      unsavedData: null
    };
    this.state.locale = props.locale || ((ref = props.form.design.locales[0]) != null ? ref.code : void 0) || "en";
  }

  ResponseViewEditComponent.prototype.createResponseModel = function(response) {
    var responseModel;
    return responseModel = new ResponseModel({
      response: response,
      form: this.props.form,
      user: this.props.login.user,
      username: this.props.login.username,
      groups: this.props.login.groups
    });
  };

  ResponseViewEditComponent.prototype.handleApprove = function() {
    var response, responseModel;
    response = _.cloneDeep(response);
    responseModel = this.createResponseModel(response);
    if (!responseModel.canApprove()) {
      return alert("Cannot approve");
    }
    responseModel.approve();
    return this.props.onUpdateResponse(response);
  };

  ResponseViewEditComponent.prototype.handleReject = function() {
    var message, response, responseModel;
    response = _.cloneDeep(response);
    responseModel = this.createResponseModel(response);
    if (!responseModel.canReject()) {
      return alert("Cannot reject");
    }
    message = prompt("Reason for rejection?");
    if (message == null) {
      return;
    }
    responseModel.reject(message);
    return this.props.onUpdateResponse(response);
  };

  ResponseViewEditComponent.prototype.handleUnreject = function() {
    var response, responseModel;
    response = _.cloneDeep(response);
    responseModel = this.createResponseModel(response);
    if (!responseModel.canSubmit(this.props.response)) {
      return alert("Cannot unreject");
    }
    responseModel.submit();
    return this.props.onUpdateResponse(response);
  };

  ResponseViewEditComponent.prototype.handleDelete = function() {
    if (!confirm("Permanently delete response?")) {
      return;
    }
    return this.props.onDeleteResponse();
  };

  ResponseViewEditComponent.prototype.handleDataChange = function(data) {
    return this.setState({
      unsavedData: data
    });
  };

  ResponseViewEditComponent.prototype.handleDiscard = function() {
    return this.setState({
      editMode: false,
      unsavedData: null
    });
  };

  ResponseViewEditComponent.prototype.handleSaveLater = function() {
    return alert("Drafts cannot be saved in this mode. Discard or submit to keep changes");
  };

  ResponseViewEditComponent.prototype.handleEdit = function() {
    return this.setState({
      editMode: true,
      unsavedData: null
    });
  };

  ResponseViewEditComponent.prototype.handleLocaleChange = function(ev) {
    return this.setState({
      locale: ev.target.value
    });
  };

  ResponseViewEditComponent.prototype.handleSubmit = function() {
    var ref, response, responseModel;
    response = _.cloneDeep(response);
    responseModel = this.createResponseModel(response);
    if (responseModel.canRedraft()) {
      responseModel.redraft();
    } else {
      responseModel.recordEdit();
    }
    response.data = this.state.unsavedData || response.data;
    if ((ref = response.status) === "draft" || ref === "rejected") {
      responseModel.submit();
    }
    this.setState({
      editMode: false,
      unsavedData: null
    });
    return this.props.onUpdateResponse(response);
  };

  ResponseViewEditComponent.prototype.renderLocales = function() {
    if (this.props.form.design.locales.length < 2) {
      return null;
    }
    return H.select({
      className: "form-control input-sm",
      style: {
        width: "auto",
        float: "right",
        margin: 5
      },
      onChange: this.handleLocaleChange,
      value: this.state.locale
    }, _.map(this.props.form.design.locales, (function(_this) {
      return function(l) {
        return H.option({
          value: l.code
        }, l.name);
      };
    })(this)));
  };

  ResponseViewEditComponent.prototype.renderOperations = function() {
    var responseModel;
    responseModel = this.createResponseModel(this.props.response);
    return H.div({
      className: "btn-group table-hover-controls"
    }, responseModel.canApprove() ? H.button({
      key: "approve",
      className: "btn btn-success btn-sm approve-response",
      onClick: this.handleApprove
    }, "Approve") : void 0, responseModel.canReject() ? H.button({
      key: "reject",
      className: "btn btn-warning btn-sm reject-response",
      onClick: this.handleReject
    }, "Reject") : void 0, responseModel.canSubmit() && this.props.response.status === "rejected" ? H.button({
      key: "unreject",
      className: "btn btn-success btn-sm unreject-response",
      onClick: this.handleUnreject
    }, "Unreject") : void 0, responseModel.canDelete() ? H.button({
      key: "delete",
      className: "btn btn-danger btn-sm delete-response",
      onClick: this.handleDelete
    }, "Delete") : void 0);
  };

  ResponseViewEditComponent.prototype.render = function() {
    var actions, elem, responseModel;
    if (this.state.editMode) {
      elem = R(FormComponent, {
        formCtx: this.props.formCtx,
        schema: this.props.schema,
        design: this.props.form.design,
        locale: this.state.locale,
        data: this.state.unsavedData || this.props.response.data,
        onDataChange: this.handleDataChange,
        singlePageMode: true,
        onSubmit: this.handleSubmit,
        onSaveLater: this.handleSaveLater,
        onDiscard: this.handleDiscard
      });
    } else {
      responseModel = new ResponseModel({
        response: this.props.response,
        form: this.props.form,
        user: this.props.login.user,
        username: this.props.login.username,
        groups: this.props.login.groups
      });
      actions = H.div({
        style: {
          width: "auto",
          float: "right",
          margin: 5
        }
      }, this.renderOperations(), responseModel.canRedraft() || responseModel.canEdit() ? H.button({
        type: "button",
        className: "btn btn-sm btn-default",
        onClick: this.handleEdit,
        style: {
          marginLeft: '10px'
        }
      }, H.span({
        className: "glyphicon glyphicon-edit"
      }), "Edit Response") : void 0);
      elem = H.div(null, actions, R(ResponseDisplayComponent, {
        form: this.props.form,
        response: this.props.response,
        formCtx: this.props.formCtx,
        schema: this.props.schema,
        apiUrl: this.props.apiUrl,
        locale: this.state.locale,
        T: T
      }));
    }
    return H.div(null, this.renderLocales(), elem);
  };

  return ResponseViewEditComponent;

})(React.Component);
