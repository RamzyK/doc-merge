"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var input_file_1 = require("./input-ref/input-file");
exports.InputFile = input_file_1.InputFile;
var generator_1 = require("./generator");
exports.Generator = generator_1.Generator;
exports.isIBody = generator_1.isIBody;
exports.OutputType = generator_1.OutputType;
var docx_plugin_1 = require("./docx-plugin");
exports.FilePlugin = docx_plugin_1.FilePlugin;
var docGenerator_1 = require("./plugins/docGenerator");
exports.DocGenerator = docGenerator_1.DocGenerator;
var app_1 = require("./app");
exports.App = app_1.App;
//# sourceMappingURL=index.js.map