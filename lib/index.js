"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTheme = exports.templates = exports.widgets = exports.fields = exports.Form = undefined;

var _Form = require("./components/Form");

var _Form2 = _interopRequireDefault(_Form);

var _fields = require("./components/fields");

var _fields2 = _interopRequireDefault(_fields);

var _widgets = require("./components/widgets");

var _widgets2 = _interopRequireDefault(_widgets);

var _templates = require("./components/templates");

var _templates2 = _interopRequireDefault(_templates);

var _withTheme = require("./components/withTheme");

var _withTheme2 = _interopRequireDefault(_withTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Form = _Form2.default;
exports.fields = _fields2.default;
exports.widgets = _widgets2.default;
exports.templates = _templates2.default;
exports.withTheme = _withTheme2.default;
exports.default = (0, _withTheme2.default)("Bootstrap", { widgets: _widgets2.default, templates: _templates2.default });