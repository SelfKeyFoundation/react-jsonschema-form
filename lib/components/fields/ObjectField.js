"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require("babel-runtime/helpers/extends");

var _extends5 = _interopRequireDefault(_extends4);

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

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectField = function (_Component) {
  (0, _inherits3.default)(ObjectField, _Component);

  function ObjectField() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ObjectField);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ObjectField.__proto__ || (0, _getPrototypeOf2.default)(ObjectField)).call.apply(_ref, [this].concat(args))), _this), _this.onPropertyChange = function (name) {
      return function (value, errorSchema) {
        var newFormData = (0, _extends5.default)({}, _this.props.formData, (0, _defineProperty3.default)({}, name, value));
        _this.props.onChange(newFormData, errorSchema && _this.props.errorSchema && (0, _extends5.default)({}, _this.props.errorSchema, (0, _defineProperty3.default)({}, name, errorSchema)));
      };
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ObjectField, [{
    key: "isRequired",
    value: function isRequired(name) {
      var schema = this.props.schema;
      return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          uiSchema = _props.uiSchema,
          formData = _props.formData,
          errorSchema = _props.errorSchema,
          idSchema = _props.idSchema,
          name = _props.name,
          required = _props.required,
          disabled = _props.disabled,
          readonly = _props.readonly,
          idPrefix = _props.idPrefix,
          onBlur = _props.onBlur,
          onFocus = _props.onFocus,
          registry = _props.registry,
          autofocus = _props.autofocus,
          onChange = _props.onChange,
          errors = _props.errors;
      var definitions = registry.definitions,
          fields = registry.fields,
          templates = registry.templates,
          formContext = registry.formContext,
          widgets = registry.widgets;

      var schema = (0, _utils.retrieveSchema)(this.props.schema, definitions, formData);
      var title = schema.title === undefined ? name : schema.title;
      var defaultWidget = schema.format || null;

      var _getUiOptions = (0, _utils.getUiOptions)(uiSchema),
          _getUiOptions$widget = _getUiOptions.widget,
          widget = _getUiOptions$widget === undefined ? defaultWidget : _getUiOptions$widget,
          options = (0, _objectWithoutProperties3.default)(_getUiOptions, ["widget"]);

      try {
        var Widget = widget ? (0, _utils.getWidget)(schema, widget, widgets) : null;
        if (Widget) {
          return _react2.default.createElement(Widget, {
            name: name,
            formData: formData,
            options: options,
            schema: schema,
            uiSchema: uiSchema,
            id: idSchema && idSchema.$id,
            label: title === undefined ? name : title,
            onChange: onChange,
            onBlur: onBlur,
            onFocus: onFocus,
            required: required,
            disabled: disabled,
            readonly: readonly,
            formContext: formContext,
            autofocus: autofocus,
            registry: registry,
            errors: errors
          });
        }
      } catch (error) {
        console.warn(error);
      }

      var SchemaField = fields.SchemaField;
      var ObjectFieldTemplate = templates.ObjectFieldTemplate;


      var description = uiSchema["ui:description"] || schema.description;
      var orderedProperties = void 0;

      try {
        var properties = (0, _keys2.default)(schema.properties);
        orderedProperties = (0, _utils.orderProperties)(properties, uiSchema["ui:order"]);
      } catch (err) {
        return _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(
            "p",
            { className: "config-error", style: { color: "red" } },
            "Invalid ",
            name || "root",
            " object field configuration:",
            _react2.default.createElement(
              "em",
              null,
              err.message
            ),
            "."
          ),
          _react2.default.createElement(
            "pre",
            null,
            (0, _stringify2.default)(schema)
          )
        );
      }

      var templateProps = {
        title: uiSchema["ui:title"] || title,
        description: description,
        properties: orderedProperties.map(function (name) {
          return {
            content: _react2.default.createElement(SchemaField, {
              key: name,
              name: name,
              required: _this2.isRequired(name),
              schema: schema.properties[name],
              uiSchema: uiSchema[name],
              errorSchema: errorSchema[name],
              idSchema: idSchema[name],
              idPrefix: idPrefix,
              formData: formData[name],
              onChange: _this2.onPropertyChange(name),
              onBlur: onBlur,
              onFocus: onFocus,
              registry: registry,
              disabled: disabled,
              readonly: readonly
            }),
            name: name,
            readonly: readonly,
            disabled: disabled,
            required: required
          };
        }),
        required: required,
        idSchema: idSchema,
        uiSchema: uiSchema,
        schema: schema,
        formData: formData,
        formContext: formContext,
        registry: registry
      };
      return _react2.default.createElement(ObjectFieldTemplate, templateProps);
    }
  }]);
  return ObjectField;
}(_react.Component);

ObjectField.defaultProps = {
  uiSchema: {},
  formData: {},
  errorSchema: {},
  idSchema: {},
  required: false,
  disabled: false,
  readonly: false
};


if (process.env.NODE_ENV !== "production") {
  ObjectField.propTypes = {
    schema: _propTypes2.default.object.isRequired,
    uiSchema: _propTypes2.default.object,
    errorSchema: _propTypes2.default.object,
    idSchema: _propTypes2.default.object,
    onChange: _propTypes2.default.func.isRequired,
    formData: _propTypes2.default.object,
    required: _propTypes2.default.bool,
    disabled: _propTypes2.default.bool,
    readonly: _propTypes2.default.bool,
    registry: _propTypes2.default.shape({
      widgets: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object])).isRequired,
      templates: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object])).isRequired,
      fields: _propTypes2.default.objectOf(_propTypes2.default.func).isRequired,
      definitions: _propTypes2.default.object.isRequired,
      formContext: _propTypes2.default.object.isRequired
    })
  };
}

exports.default = ObjectField;