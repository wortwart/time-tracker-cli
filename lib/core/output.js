'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cliSuccess = exports.cliError = exports.outputVertical = exports.outputConfig = exports.calcTime = exports.summarize = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var summarize = exports.summarize = function summarize(args) {
	var table = new _cliTable2.default({
		head: ['Duration', 'Dates', 'Task'],
		chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
		colAligns: ['right', 'center', 'left'],
		style: { head: ['green'] }
	});
	var total = 0;
	var head = 'Search: ' + args.search + ' \n';

	args.tasks.forEach(function (task, index) {
		var name = task.name;
		task = task.task;
		var duration = task.getSeconds();
		total += duration;
		table.push([(0, _utils.humanParseDiff)(duration), (0, _moment2.default)(task.getStartDate()).format(args.format), name]);
	});

	console.log(table.toString());

	if (args.full) {
		var table2 = new _cliTable2.default();
		table2.push({ 'Search': ['\"' + args.search + '\"'] }, { 'Total time': [(0, _utils.humanParseDiff)(total)] });
		if (args.rate) table2.push({ 'Rate': [(0, _utils.calcRate)(args.rate, total)] });
		if (args.timespan) {
			var obj = {};
			obj['Time (' + args.timespan + ')'] = [calcTime(args.timespan, args.tasks)];
			table2.push(obj);
		}
		console.log(table2.toString());
	}
};

var calcTime = exports.calcTime = function calcTime(timespan, tasks) {
	var results = [];
	var pTimespan = (0, _utils.recognizeModifierTiming)(timespan)[0];
	var limit = (0, _moment2.default)().subtract(pTimespan.value, pTimespan.momentKey);
	var multipleOutput = tasks.length > 1 ? true : false;
	tasks.forEach(function (el) {
		console.log();
		var checkins = el.task.task.timings.reverse();
		var sum = 0;
		var overflow = 0;
		var result = '';
		for (var i = 0; i < checkins.length; i++) {
			if ((0, _moment2.default)(checkins[i].stop).isBefore(limit)) break;
			sum += (0, _moment2.default)(checkins[i].stop).diff(checkins[i].start, 's');
			if ((0, _moment2.default)(checkins[i].start).isBefore(limit)) {
				overflow = (0, _moment2.default)(limit).diff(checkins[i].start, 's');
				break;
			}
		}
		if (multipleOutput) result += el.name + '\n';
		result += (0, _utils.humanParseDiff)(sum, true, true);
		if (overflow) result += '\n- ' + (0, _utils.humanParseDiff)(overflow, true);
		results.push(result);
	});
	return results.join('\n\n');
};

var outputConfig = exports.outputConfig = function outputConfig(config) {
	var table = new _cliTable2.default({
		head: ['Key', 'value'],
		chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
		colAligns: ['center', 'center'],
		style: { head: ['green'] }
	});
	Object.keys(config).map(function (e) {
		return table.push([e, config[e]]);
	});
	console.log(table.toString());
};

var outputVertical = exports.outputVertical = function outputVertical() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var table2 = new _cliTable2.default();
	var key = args.splice(0, 1);
	table2.push(_defineProperty({}, key, args));
	return table2.toString();
};

var cliError = exports.cliError = function cliError(err) {
	console.error(_chalk2.default.red('Error: ' + err));
};

var cliSuccess = exports.cliSuccess = function cliSuccess(err) {
	console.log(_chalk2.default.green(err));
};
//# sourceMappingURL=output.js.map