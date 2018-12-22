"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initWithTheme = undefined;

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

var _Form = require("./Form");

var _Form2 = _interopRequireDefault(_Form);

var _fields = require("./fields");

var _fields2 = _interopRequireDefault(_fields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initWithTheme = exports.initWithTheme = function initWithTheme(WrappedForm, fields) {
  return function (name, theme) {
    var WithTheme = function (_React$Component) {
      (0, _inherits3.default)(WithTheme, _React$Component);

      function WithTheme() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, WithTheme);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = WithTheme.__proto__ || (0, _getPrototypeOf2.default)(WithTheme)).call.apply(_ref, [this].concat(args))), _this), _this.state = mergeComponents(_this.props), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
      }

      (0, _createClass3.default)(WithTheme, [{
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
          if (this.props.fields !== nextProps.fields || this.props.widgets !== nextProps.widgets || this.props.templates !== nextProps.templates) {
            this.setState(mergeComponents(nextProps));
          }
        }
      }, {
        key: "render",
        value: function render() {
          return _react2.default.createElement(WrappedForm, (0, _extends3.default)({}, this.props, {
            fields: this.state.fields,
            widgets: this.state.widgets,
            templates: this.state.templates
          }));
        }
      }]);
      return WithTheme;
    }(_react2.default.Component);

    WithTheme.displayName = "WithTheme(" + name + ")";

    return WithTheme;

    function mergeComponents(props) {
      return {
        fields: (0, _extends3.default)({}, fields, props.fields),
        widgets: (0, _extends3.default)({}, theme.widgets, props.widgets),
        templates: (0, _extends3.default)({}, theme.templates, props.templates)
      };
    }
  };
};

exports.default = initWithTheme(_Form2.default, _fields2.default);