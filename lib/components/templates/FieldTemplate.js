"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FieldTemplate;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REQUIRED_FIELD_SYMBOL = "*";

function FieldTemplate(props) {
  var id = props.id,
      label = props.label,
      children = props.children,
      errors = props.errors,
      help = props.help,
      description = props.description,
      hidden = props.hidden,
      required = props.required,
      displayLabel = props.displayLabel,
      formContext = props.formContext,
      DescriptionTemplate = props.registry.templates.DescriptionTemplate;

  var classNames = [props.classNames, "form-group"].join(" ").trim();

  if (hidden) {
    return children;
  }

  return _react2.default.createElement(
    "div",
    { className: classNames },
    displayLabel && _react2.default.createElement(Label, { label: label, required: required, id: id }),
    displayLabel && description ? _react2.default.createElement(DescriptionTemplate, {
      id: id + "__description",
      description: description,
      formContext: formContext
    }) : null,
    children,
    _react2.default.createElement(ErrorList, { errors: errors }),
    _react2.default.createElement(Help, { help: help })
  );
}

FieldTemplate.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true
};

if (process.env.NODE_ENV !== "production") {
  FieldTemplate.propTypes = {
    id: _propTypes2.default.string,
    classNames: _propTypes2.default.string,
    label: _propTypes2.default.string,
    children: _propTypes2.default.node.isRequired,
    errors: _propTypes2.default.arrayOf(_propTypes2.default.string),
    help: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
    description: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
    hidden: _propTypes2.default.bool,
    required: _propTypes2.default.bool,
    readonly: _propTypes2.default.bool,
    displayLabel: _propTypes2.default.bool,
    fields: _propTypes2.default.object,
    formContext: _propTypes2.default.object
  };
}

function Label(props) {
  var label = props.label,
      required = props.required,
      id = props.id;

  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return _react2.default.createElement("div", null);
  }
  return _react2.default.createElement(
    "label",
    { className: "control-label", htmlFor: id },
    label,
    required && _react2.default.createElement(
      "span",
      { className: "required" },
      REQUIRED_FIELD_SYMBOL
    )
  );
}

function Help(props) {
  var help = props.help;

  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return _react2.default.createElement("div", null);
  }
  if (typeof help === "string") {
    return _react2.default.createElement(
      "p",
      { className: "help-block" },
      help
    );
  }
  return _react2.default.createElement(
    "div",
    { className: "help-block" },
    help
  );
}

function ErrorList(props) {
  var _props$errors = props.errors,
      errors = _props$errors === undefined ? [] : _props$errors;

  if (errors.length === 0) {
    return _react2.default.createElement("div", null);
  }
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement("p", null),
    _react2.default.createElement(
      "ul",
      { className: "error-detail bs-callout bs-callout-info" },
      errors.map(function (error, index) {
        return _react2.default.createElement(
          "li",
          { className: "text-danger", key: index },
          error
        );
      })
    )
  );
}