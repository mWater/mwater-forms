"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var FormComponent,
    PropTypes,
    R,
    React,
    ResponseDisplayComponent,
    ResponseModel,
    ResponseViewEditComponent,
    _,
    ui,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
FormComponent = require('./FormComponent');
ResponseModel = require('./ResponseModel');
ResponseDisplayComponent = require('./ResponseDisplayComponent');
ui = require('react-library/lib/bootstrap'); // Displays a view of a response that can be edited, rejected, etc. 
// When editing, shows in single-page mode.

module.exports = ResponseViewEditComponent = function () {
  var ResponseViewEditComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(ResponseViewEditComponent, _React$Component);

    var _super = _createSuper(ResponseViewEditComponent);

    function ResponseViewEditComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, ResponseViewEditComponent);
      var ref;
      _this = _super.call(this, props);
      _this.handleApprove = _this.handleApprove.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleReject = _this.handleReject.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleUnreject = _this.handleUnreject.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleDelete = _this.handleDelete.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleDataChange = _this.handleDataChange.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleDiscard = _this.handleDiscard.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleSaveLater = _this.handleSaveLater.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleEdit = _this.handleEdit.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleLocaleChange = _this.handleLocaleChange.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleSubmit = _this.handleSubmit.bind((0, _assertThisInitialized2["default"])(_this));
      _this.state = {
        editMode: false,
        // True if in edit mode
        unsavedData: null // Present if unsaved changes have been made

      }; // Set locale to first locale of form

      _this.state.locale = props.locale || ((ref = props.form.design.locales[0]) != null ? ref.code : void 0) || "en";
      return _this;
    } // Create a response model


    (0, _createClass2["default"])(ResponseViewEditComponent, [{
      key: "createResponseModel",
      value: function createResponseModel(response) {
        var ref, ref1, ref2, responseModel;
        return responseModel = new ResponseModel({
          response: response,
          form: this.props.form,
          user: (ref = this.props.login) != null ? ref.user : void 0,
          username: (ref1 = this.props.login) != null ? ref1.username : void 0,
          groups: (ref2 = this.props.login) != null ? ref2.groups : void 0
        });
      }
    }, {
      key: "handleApprove",
      value: function handleApprove() {
        var response, responseModel;
        boundMethodCheck(this, ResponseViewEditComponent); // TODO no longer needed if response model becomes immutable

        response = _.cloneDeep(this.props.response);
        responseModel = this.createResponseModel(response);

        if (!responseModel.canApprove()) {
          return alert("Cannot approve");
        }

        responseModel.approve();
        return this.props.onUpdateResponse(response);
      }
    }, {
      key: "handleReject",
      value: function handleReject() {
        var message, response, responseModel;
        boundMethodCheck(this, ResponseViewEditComponent); // TODO no longer needed if response model becomes immutable

        response = _.cloneDeep(this.props.response);
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
      }
    }, {
      key: "handleUnreject",
      value: function handleUnreject() {
        var response, responseModel;
        boundMethodCheck(this, ResponseViewEditComponent); // TODO no longer needed if response model becomes immutable

        response = _.cloneDeep(this.props.response);
        responseModel = this.createResponseModel(response);

        if (!responseModel.canSubmit(this.props.response)) {
          return alert("Cannot unreject");
        }

        responseModel.submit();
        return this.props.onUpdateResponse(response);
      }
    }, {
      key: "handleDelete",
      value: function handleDelete() {
        boundMethodCheck(this, ResponseViewEditComponent);

        if (!confirm("Permanently delete response?")) {
          return;
        }

        return this.props.onDeleteResponse();
      }
    }, {
      key: "handleDataChange",
      value: function handleDataChange(data) {
        boundMethodCheck(this, ResponseViewEditComponent);
        return this.setState({
          unsavedData: data
        });
      }
    }, {
      key: "handleDiscard",
      value: function handleDiscard() {
        boundMethodCheck(this, ResponseViewEditComponent);
        return this.setState({
          editMode: false,
          unsavedData: null
        });
      }
    }, {
      key: "handleSaveLater",
      value: function handleSaveLater() {
        boundMethodCheck(this, ResponseViewEditComponent);
        return alert("Drafts cannot be saved in this mode. Discard or submit to keep changes");
      }
    }, {
      key: "handleEdit",
      value: function handleEdit() {
        boundMethodCheck(this, ResponseViewEditComponent);
        return this.setState({
          editMode: true,
          unsavedData: null
        });
      }
    }, {
      key: "handleLocaleChange",
      value: function handleLocaleChange(ev) {
        boundMethodCheck(this, ResponseViewEditComponent);
        return this.setState({
          locale: ev.target.value
        });
      }
    }, {
      key: "handleSubmit",
      value: function handleSubmit() {
        var ref, response, responseModel;
        boundMethodCheck(this, ResponseViewEditComponent); // TODO no longer needed if response model becomes immutable

        response = _.cloneDeep(this.props.response);
        responseModel = this.createResponseModel(response); // Draft if done by enumerator

        if (responseModel.canRedraft()) {
          responseModel.redraft();
        } else {
          // Record edit
          responseModel.recordEdit();
        } // Update response 


        response.data = this.state.unsavedData || response.data; // Submit if in draft mode

        if ((ref = response.status) === "draft" || ref === "rejected") {
          responseModel.submit();
        } // Stop editing


        this.setState({
          editMode: false,
          unsavedData: null
        });
        return this.props.onUpdateResponse(response);
      } // Render locales

    }, {
      key: "renderLocales",
      value: function renderLocales() {
        if (this.props.form.design.locales.length < 2) {
          return null;
        }

        return R('select', {
          className: "form-control input-sm",
          style: {
            width: "auto",
            "float": "right",
            margin: 5
          },
          onChange: this.handleLocaleChange,
          value: this.state.locale
        }, _.map(this.props.form.design.locales, function (l) {
          return R('option', {
            value: l.code
          }, l.name);
        }));
      }
    }, {
      key: "renderOperations",
      value: function renderOperations() {
        var responseModel;
        responseModel = this.createResponseModel(this.props.response);
        return R('div', {
          className: "btn-group table-hover-controls"
        }, responseModel.canApprove() ? R('button', {
          key: "approve",
          className: "btn btn-success btn-sm approve-response",
          onClick: this.handleApprove
        }, "Approve") : void 0, responseModel.canReject() ? R('button', {
          key: "reject",
          className: "btn btn-warning btn-sm reject-response",
          onClick: this.handleReject
        }, "Reject") : void 0, responseModel.canSubmit() && this.props.response.status === "rejected" ? R('button', {
          key: "unreject",
          className: "btn btn-success btn-sm unreject-response",
          onClick: this.handleUnreject
        }, "Unreject") : void 0, responseModel.canDelete() ? R('button', {
          key: "delete",
          className: "btn btn-danger btn-sm delete-response",
          onClick: this.handleDelete
        }, "Delete") : void 0);
      }
    }, {
      key: "render",
      value: function render() {
        var actions, elem, printUrl, ref, ref1, ref2, ref3, responseModel;
        printUrl = this.props.login != null ? "".concat(this.props.apiUrl, "responses/").concat(this.props.response._id, "/print?client=").concat(this.props.login.client, "&locale=").concat(this.state.locale) : null; // If editing

        if (this.state.editMode) {
          elem = R(FormComponent, {
            formCtx: this.props.formCtx,
            schema: this.props.schema,
            design: this.props.form.design,
            locale: this.state.locale,
            data: this.state.unsavedData || this.props.response.data,
            // Use our version if changed
            onDataChange: this.handleDataChange,
            singlePageMode: true,
            disableConfidentialFields: (ref = this.props.response.status) !== "draft" && ref !== "rejected",
            deployment: this.props.response.deployment,
            onSubmit: this.handleSubmit,
            onSaveLater: this.handleSaveLater,
            onDiscard: this.handleDiscard
          });
        } else {
          // Determine if can edit
          responseModel = new ResponseModel({
            response: this.props.response,
            form: this.props.form,
            user: (ref1 = this.props.login) != null ? ref1.user : void 0,
            username: (ref2 = this.props.login) != null ? ref2.username : void 0,
            groups: (ref3 = this.props.login) != null ? ref3.groups : void 0
          });
          actions = R('div', {
            style: {
              width: "auto",
              "float": "right",
              margin: 5
            }
          }, this.renderOperations(), responseModel.canRedraft() || responseModel.canEdit() ? R('button', {
            type: "button",
            className: "btn btn-sm btn-default",
            onClick: this.handleEdit,
            style: {
              marginLeft: '10px'
            }
          }, R('span', {
            className: "glyphicon glyphicon-edit"
          }), "Edit Response") : void 0);
          elem = R('div', null, actions, R(ResponseDisplayComponent, {
            form: this.props.form,
            response: this.props.response,
            formCtx: this.props.formCtx,
            schema: this.props.schema,
            apiUrl: this.props.apiUrl,
            locale: this.state.locale,
            login: this.props.login,
            T: this.props.T
          }));
        }

        return R('div', null, printUrl !== null ? R('div', {
          style: {
            textAlign: 'right'
          }
        }, R('a', {
          className: 'btn btn-xs btn-link',
          target: "_blank",
          href: printUrl
        }, R(ui.Icon, {
          id: "fa-external-link"
        }), " Export as PDF")) : void 0, this.renderLocales(), elem);
      }
    }]);
    return ResponseViewEditComponent;
  }(React.Component);

  ;
  ResponseViewEditComponent.propTypes = {
    form: PropTypes.object.isRequired,
    // Form to use
    formCtx: PropTypes.object.isRequired,
    // FormContext
    response: PropTypes.object.isRequired,
    // Response object
    login: PropTypes.object,
    // Current login (contains user, username, groups)
    apiUrl: PropTypes.string.isRequired,
    // api url to use e.g. https://api.mwater.co/v3/
    onUpdateResponse: PropTypes.func.isRequired,
    // Called when response is updated with new response
    onDeleteResponse: PropTypes.func.isRequired,
    // Called when response is removed
    schema: PropTypes.object.isRequired,
    // Schema, including the form
    locale: PropTypes.string,
    // The locale to display the response in
    T: PropTypes.object.isRequired // Localizer to use

  };
  return ResponseViewEditComponent;
}.call(void 0);