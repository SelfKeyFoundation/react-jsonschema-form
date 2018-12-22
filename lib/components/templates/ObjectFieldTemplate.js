"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ObjectFieldTemplate;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ObjectFieldTemplate(props) {
  var _props$registry$templ = props.registry.templates,
      TitleTemplate = _props$registry$templ.TitleTemplate,
      DescriptionTemplate = _props$registry$templ.DescriptionTemplate;

  return _react2.default.createElement(
    "fieldset",
    null,
    (props.uiSchema["ui:title"] || props.title) && _react2.default.createElement(TitleTemplate, {
      id: props.idSchema.$id + "__title",
      title: props.title || props.uiSchema["ui:title"],
      required: props.required,
      formContext: props.formContext
    }),
    props.description && _react2.default.createElement(DescriptionTemplate, {
      id: props.idSchema.$id + "__description",
      description: props.description,
      formContext: props.formContext
    }),
    props.properties.map(function (prop) {
      return prop.content;
    })
  );
}