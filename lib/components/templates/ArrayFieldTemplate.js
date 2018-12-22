"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = ArrayFieldTemplate;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ArrayFieldTemplate(props) {
  var _props$registry$templ = props.registry.templates,
      TitleTemplate = _props$registry$templ.TitleTemplate,
      DescriptionTemplate = _props$registry$templ.DescriptionTemplate;


  return _react2.default.createElement(
    "fieldset",
    { className: props.className },
    _react2.default.createElement(ArrayFieldTitle, {
      key: "array-field-title-" + props.idSchema.$id,
      TitleTemplate: TitleTemplate,
      idSchema: props.idSchema,
      title: props.uiSchema["ui:title"] || props.title,
      required: props.required
    }),
    (props.uiSchema["ui:description"] || props.schema.description) && _react2.default.createElement(ArrayFieldDescription, {
      key: "array-field-description-" + props.idSchema.$id,
      DescriptionTemplate: DescriptionTemplate,
      idSchema: props.idSchema,
      description: props.uiSchema["ui:description"] || props.schema.description
    }),
    _react2.default.createElement(
      "div",
      {
        className: "row array-item-list",
        key: "array-item-list-" + props.idSchema.$id },
      props.items && props.items.map(function (p) {
        return ArrayItem(p);
      })
    ),
    props.canAdd && _react2.default.createElement(AddButton, {
      onClick: props.onAddClick,
      disabled: props.disabled || props.readonly
    })
  );
}

function ArrayFieldTitle(_ref) {
  var TitleTemplate = _ref.TitleTemplate,
      idSchema = _ref.idSchema,
      title = _ref.title,
      required = _ref.required;

  if (!title) {
    // See #312: Ensure compatibility with old versions of React.
    return _react2.default.createElement("div", null);
  }
  var id = idSchema.$id + "__title";
  return _react2.default.createElement(TitleTemplate, { id: id, title: title, required: required });
}

function ArrayFieldDescription(_ref2) {
  var DescriptionTemplate = _ref2.DescriptionTemplate,
      idSchema = _ref2.idSchema,
      description = _ref2.description,
      formContext = _ref2.formContext;

  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return _react2.default.createElement("div", null);
  }
  var id = idSchema.$id + "__description";
  return _react2.default.createElement(DescriptionTemplate, {
    id: id,
    description: description,
    formContext: formContext
  });
}

function IconBtn(props) {
  var _props$type = props.type,
      type = _props$type === undefined ? "default" : _props$type,
      icon = props.icon,
      className = props.className,
      otherProps = (0, _objectWithoutProperties3.default)(props, ["type", "icon", "className"]);

  return _react2.default.createElement(
    "button",
    (0, _extends3.default)({
      type: "button",
      className: "btn btn-" + type + " " + className
    }, otherProps),
    _react2.default.createElement("i", { className: "glyphicon glyphicon-" + icon })
  );
}

// Used in the two templates
function ArrayItem(props) {
  var btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold"
  };
  return _react2.default.createElement(
    "div",
    { key: props.index, className: props.className },
    _react2.default.createElement(
      "div",
      { className: props.hasToolbar ? "col-xs-9" : "col-xs-12" },
      props.children
    ),
    props.hasToolbar && _react2.default.createElement(
      "div",
      { className: "col-xs-3 array-item-toolbox" },
      _react2.default.createElement(
        "div",
        {
          className: "btn-group",
          style: {
            display: "flex",
            justifyContent: "space-around"
          } },
        (props.hasMoveUp || props.hasMoveDown) && _react2.default.createElement(IconBtn, {
          icon: "arrow-up",
          className: "array-item-move-up",
          tabIndex: "-1",
          style: btnStyle,
          disabled: props.disabled || props.readonly || !props.hasMoveUp,
          onClick: props.onReorderClick(props.index, props.index - 1)
        }),
        (props.hasMoveUp || props.hasMoveDown) && _react2.default.createElement(IconBtn, {
          icon: "arrow-down",
          className: "array-item-move-down",
          tabIndex: "-1",
          style: btnStyle,
          disabled: props.disabled || props.readonly || !props.hasMoveDown,
          onClick: props.onReorderClick(props.index, props.index + 1)
        }),
        props.hasRemove && _react2.default.createElement(IconBtn, {
          type: "danger",
          icon: "remove",
          className: "array-item-remove",
          tabIndex: "-1",
          style: btnStyle,
          disabled: props.disabled || props.readonly,
          onClick: props.onDropIndexClick(props.index)
        })
      )
    )
  );
}

function AddButton(_ref3) {
  var onClick = _ref3.onClick,
      disabled = _ref3.disabled;

  return _react2.default.createElement(
    "div",
    { className: "row" },
    _react2.default.createElement(
      "p",
      { className: "col-xs-3 col-xs-offset-9 array-item-add text-right" },
      _react2.default.createElement(IconBtn, {
        type: "info",
        icon: "plus",
        className: "btn-add col-xs-12",
        tabIndex: "0",
        onClick: onClick,
        disabled: disabled
      })
    )
  );
}