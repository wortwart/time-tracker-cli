'use strict';

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _Manager = require('./core/Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _utils = require('./core/utils');

var _output = require('./core/output');

var _autocomplete = require('./autocomplete');

var _autocomplete2 = _interopRequireDefault(_autocomplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = new _configstore2.default(_package2.default.name, {
	tasks: {},
	config: { 'format.output': 'DD/MM' }
});

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify();

var manager = new _Manager2.default(config);
(0, _autocomplete2.default)(config);

//Exec
var EXEC = false;

_commander2.default.version(_package2.default.version).description('Tiny time tracker for projects').option('--updateDB', 'Bool to update the db');

_commander2.default.command('start <task_key> [description]').description('Start task with a description.').alias('s').action(function (key, description) {
	description = description ? Array.isArray(description) ? description.join(' ') : description : null;
	manager.startTask(key, description);
	EXEC = true;
});

_commander2.default.command('pause [task_key]').description('Pause task(s)').alias('p').action(function (key) {
	manager.pauseTasks(key);
	EXEC = true;
});

_commander2.default.command('unpause [task_key]').description('Unpause task(s)').alias('up').action(function (key) {
	manager.unpauseTasks(key);
	EXEC = true;
});

_commander2.default.command('finish <task_key> [description]').description('Stop task, you can add a description').alias('f').action(function (key, description) {
	description = description ? Array.isArray(description) ? description.join(' ') : description : null;
	manager.stopTask(key, description);
	EXEC = true;
});

_commander2.default.command('description <task_key> <descriptionText...>').description('Add description to your task.').alias('d').action(function (key, text) {
	text = Array.isArray(text) ? text.join(' ') : text;
	manager.addDescription(key, text);
	EXEC = true;
});

_commander2.default.command('add <task_key> <stringTime>').description('Adds time to a task. Example: "1h2m3s"').action(function (key, stringTime) {
	manager.modifyTask('add', key, stringTime);
	manager.summarize({ key: key, rate: manager.search(key), full: false });
	EXEC = true;
});

_commander2.default.command('subtract <task_key> <stringTime>').description('Subtract time to a task. Example: "1h2m3s"').alias('sub').action(function (key, stringTime) {
	manager.modifyTask('subtract', key, stringTime);
	manager.summarize({ key: key, rate: manager.search(key), full: false });
	EXEC = true;
});

_commander2.default.command('report [task_string] [rate]').description('Report time of the tasks, empty for select all tasks. Can pass a rate (1h).').alias('r').action(function (tasks, rate) {
	tasks = tasks ? tasks : 'all';
	manager.summarize({ key: tasks, rate: rate });
	EXEC = true;
});

_commander2.default.command('summarize [task_string] [timespan]').description('Summarize time of the tasks, empty for select all tasks. Can pass a timespan (1h).').alias('sum').action(function (tasks, timespan) {
	tasks = tasks ? tasks : 'all';
	manager.summarize({ key: tasks, timespan: timespan });
	EXEC = true;
});

_commander2.default.command('log <task_key>').description('Logs the time of the  task').alias('l').action(function (key) {
	setInterval(function () {
		var text = (0, _output.outputVertical)('Task:', key, (0, _utils.humanParseDiff)(manager.getTime(key)));
		process.stdout.write(text);
		process.stdout.moveCursor(0, -2);
	}, 1000);
	EXEC = true;
});

_commander2.default.command('export').description('Export the tasks in a JSON').alias('e').action(function (key) {
	console.log(JSON.stringify(manager.getTasksJson(), null, 4));
	EXEC = true;
});

_commander2.default.command('delete [task_string]').description('Remove tasks from the list. Empty for select all tasks').alias('del').action(function (string) {
	string = string ? string : 'all';
	manager.delete(string);
	EXEC = true;
});

_commander2.default.command('configure <key> <value>').description('Configure the value of the config passing a key').action(function (key, value) {
	manager.configure(key, value);
	EXEC = true;
});

_commander2.default.command('configuration').description('Output configuration').action(function (string) {
	(0, _output.outputConfig)(manager.getConfig());
	EXEC = true;
});

_commander2.default.command('status').description('Display timer status').alias('st').action(function (string) {
	manager.getStatus();
	EXEC = true;
});

_commander2.default.parse(process.argv);

if (_commander2.default.updateDB) {
	manager.update();
	EXEC = true;
}

if (!EXEC) {
	(0, _output.cliError)('You must use a valid command.');
	_commander2.default.outputHelp();
	process.exit(1);
}
//# sourceMappingURL=index.js.map