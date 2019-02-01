"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectFileWidget = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectFileWidget = exports.ObjectFileWidget = function (_Component) {
  (0, _inherits3.default)(ObjectFileWidget, _Component);

  function ObjectFileWidget(props) {
    (0, _classCallCheck3.default)(this, ObjectFileWidget);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ObjectFileWidget.__proto__ || (0, _getPrototypeOf2.default)(ObjectFileWidget)).call(this, props));

    var _props$formData = props.formData,
        formData = _props$formData === undefined ? {} : _props$formData;

    var state = { formData: formData };
    if (!formData.file && formData.content) {
      var _dataURItoBlob = (0, _utils.dataURItoBlob)(formData.content),
          blob = _dataURItoBlob.blob,
          _dataURItoBlob$name = _dataURItoBlob.name,
          name = _dataURItoBlob$name === undefined ? formData.name : _dataURItoBlob$name;

      state.file = new File(blob, name);
    }

    if (state.file) {
      state.url = URL.createObjectURL(state.file);
    }

    _this.state = (0, _extends3.default)({}, _this.state, { formData: formData });
    return _this;
  }

  (0, _createClass3.default)(ObjectFileWidget, [{
    key: "clearState",
    value: function clearState() {
      var _this2 = this;

      return function (event) {
        if (_this2.state.url) {
          URL.revokeObjectURL(_this2.state.url);
        }
        _this2.setState({ url: null, file: null, formData: {} }, function () {
          return _this2.props.onChange({});
        });
      };
    }
  }, {
    key: "onChange",
    value: function onChange() {
      var _this3 = this;

      return function (event) {
        var files = event.target.files;
        var f = files[0];
        var data = {
          mimeType: f.type,
          name: f.name,
          size: f.size,
          content: ""
        };
        var url = URL.createObjectURL(f);
        // eslint-disable-next-line
        var reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = function () {
          data.content = reader.result;
          _this3.setState({ file: f, url: url, formData: data }, function () {
            return _this3.props.onChange(data);
          });
        };
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          id = _props.id,
          label = _props.label,
          uiSchema = _props.uiSchema,
          formData = _props.formData,
          errors = _props.errors,
          idSchema = _props.idSchema,
          name = _props.name,
          required = _props.required,
          disabled = _props.disabled,
          readonly = _props.readonly,
          idPrefix = _props.idPrefix,
          onBlur = _props.onBlur,
          onFocus = _props.onFocus,
          registry = _props.registry;
      var definitions = registry.definitions,
          templates = registry.templates,
          formContext = registry.formContext;
      var FieldTemplate = templates.FieldTemplate;

      var schema = (0, _utils.retrieveSchema)(this.props.schema, definitions, formData);
      var description = uiSchema["ui:description"] || schema.description;

      var templateProps = {
        label: label,
        description: description,
        idSchema: idSchema,
        uiSchema: uiSchema,
        schema: schema,
        formData: formData,
        formContext: formContext,
        registry: registry,
        errors: errors,
        idPrefix: idPrefix
      };
      var accept = (((schema.properties || {}).mimeType || {}).enum || []).join(",");
      return _react2.default.createElement(
        FieldTemplate,
        templateProps,
        !this.state.formData || !this.state.formData.name ? _react2.default.createElement("input", {
          id: id,
          type: "file",
          name: name,
          required: required,
          disabled: readonly || disabled,
          onChange: this.onChange(),
          onBlur: onBlur && function (event) {
            return onBlur(_this4.state);
          },
          onFocus: onFocus && function (event) {
            return onFocus(_this4.state);
          },
          accept: accept
        }) : _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(
            "a",
            { href: this.state.url, target: "_blank" },
            this.state.formData.name
          ),
          " ",
          _react2.default.createElement(
            "button",
            { onClick: this.clearState() },
            "X"
          )
        )
      );
    }
  }]);
  return ObjectFileWidget;
}(_react.Component);

exports.default = ObjectFileWidget;