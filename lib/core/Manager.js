'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

var _utils = require('./utils');

var _constants = require('./constants');

var _output = require('./output');

var _dbMigrations = require('./dbMigrations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
	function Manager(cfg) {
		_classCallCheck(this, Manager);

		this.repositories = ['tasks', 'config'];

		this.cfg = cfg;
		this.tasks = cfg.all.tasks;
		this.config = cfg.all.config ? cfg.all.config : {};
	}

	_createClass(Manager, [{
		key: 'getTask',
		value: function getTask(key) {
			var task = this.tasks[key] ? this.tasks[key] : null;
			return new _Task2.default(task);
		}
	}, {
		key: 'getAllTasks',
		value: function getAllTasks(props) {
			var _this = this;

			var myTasks = [];
			if (!props) props = {};
			Object.keys(this.tasks).forEach(function (key) {
				if (props.filter) {
					var _st = _this.tasks[key].status;
					if (props.filter === 'unfinished') {
						if (_st === _constants.FINISHED) return;
					} else if (props.filter === 'running') {
						if (_st === _constants.FINISHED || _st === _constants.PAUSED) return;
					} else if (props.filter === 'paused') {
						if (_st !== _constants.PAUSED) return;
					}
				}
				if (props.only_key) {
					myTasks.push(key);
					return;
				}
				var _task = { key: key };
				if (props.status) _task.status = _this.tasks[key].status;
				if (props.lastLog) _task.lastLog = _this.tasks[key].log[_this.tasks[key].log.length - 1];
				myTasks.push(_task);
			});
			return myTasks;
		}
	}, {
		key: 'storeTask',
		value: function storeTask(key, task) {
			var update = {};
			update[key] = task.get();
			this.tasks = Object.assign({}, this.tasks, update);
			this.cfg.set('tasks', this.tasks);
		}
	}, {
		key: 'startTask',
		value: function startTask(key, description) {
			var _this2 = this;

			var t = this.getTask(key);
			t.start(description).then(function () {
				_this2.storeTask(key, t);
				console.log((0, _output.outputVertical)('Task:', key, _constants.STARTED, (0, _moment2.default)().toISOString()));
			}, _output.cliError).catch(_output.cliError);
		}
	}, {
		key: 'pauseTasks',
		value: function pauseTasks(key) {
			var _this3 = this;

			if (key) {
				this.pauseTask(key);
				return;
			}
			var running_tasks = this.getAllTasks({ filter: 'running', only_key: true });
			running_tasks.forEach(function (el) {
				return _this3.pauseTask(el);
			});
			console.log('Pausing', running_tasks.length, 'Task(s)');
		}
	}, {
		key: 'pauseTask',
		value: function pauseTask(key) {
			var _this4 = this;

			var t = this.getTask(key);
			t.pause().then(function () {
				_this4.storeTask(key, t);
				console.log((0, _output.outputVertical)('Task:', key, _constants.PAUSED, (0, _moment2.default)().toISOString()));
			}, _output.cliError).catch(_output.cliError);
		}
	}, {
		key: 'unpauseTasks',
		value: function unpauseTasks(key) {
			var _this5 = this;

			if (key) {
				this.unpauseTask(key);
				return;
			}
			var paused_tasks = this.getAllTasks({ filter: 'paused', only_key: true });
			paused_tasks.forEach(function (el) {
				return _this5.unpauseTask(el);
			});
			console.log('Unpausing', paused_tasks.length, 'Task(s)');
		}
	}, {
		key: 'unpauseTask',
		value: function unpauseTask(key) {
			var _this6 = this;

			var t = this.getTask(key);
			t.unpause().then(function () {
				_this6.storeTask(key, t);
				console.log((0, _output.outputVertical)('Task:', key, _constants.UNPAUSED, (0, _moment2.default)().toISOString()));
			}, _output.cliError).catch(_output.cliError);
		}
	}, {
		key: 'stopTask',
		value: function stopTask(key, description) {
			var _this7 = this;

			var t = this.getTask(key);
			t.stop(description).then(function () {
				_this7.storeTask(key, t);
				console.log((0, _output.outputVertical)('Task:', key, _constants.FINISHED, (0, _moment2.default)().toISOString()));
			}, _output.cliError).catch(_output.cliError);
		}
	}, {
		key: 'addDescription',
		value: function addDescription(key, text) {
			var t = this.getTask(key);
			t.setDescription(text);
			this.storeTask(key, t);
		}
	}, {
		key: 'getTime',
		value: function getTime(name) {
			var t = this.getTask(name);
			return t.getSeconds();
		}
	}, {
		key: 'modifyTask',
		value: function modifyTask(operation, name, stringTime) {
			var _this8 = this;

			var t = this.getTask(name);
			t.makeOperationOverTime(operation, stringTime).then(function () {
				_this8.storeTask(name, t);
			}, _output.cliError).catch(_output.cliError);
		}
	}, {
		key: 'search',
		value: function search(string) {
			var _this9 = this;

			var keys = Object.keys(this.tasks);
			var tasks = [];
			keys.forEach(function (key) {
				if (string === 'all' || key.indexOf(string) > -1) {
					tasks.push({
						name: key,
						task: new _Task2.default(_this9.tasks[key])
					});
				}
			});
			return tasks;
		}
	}, {
		key: 'delete',
		value: function _delete(string) {
			var _this10 = this;

			var tasks = this.search(string);
			console.log(tasks.map(function (k) {
				return k.name + ' \n';
			}).join(''));
			if (tasks.length === 0) {
				(0, _output.cliSuccess)('No tasks found to delete.');
				return;
			}
			_inquirer2.default.prompt([{
				type: 'confirm',
				name: 'cls',
				message: 'Are you sure you want to delete this tasks?',
				default: false
			}]).then(function (answers) {
				if (answers.cls) {
					tasks.forEach(function (k) {
						delete _this10.tasks[k.name];
						_this10.cfg.set('tasks', _this10.tasks);
					});
					(0, _output.cliSuccess)('Tasks deleted.');
				}
			}).catch(_output.cliError);
		}
	}, {
		key: 'getTasksJson',
		value: function getTasksJson() {
			return _flat2.default.unflatten(this.tasks);
		}
	}, {
		key: 'getConfig',
		value: function getConfig() {
			return this.config;
		}
	}, {
		key: 'configure',
		value: function configure(element, value) {
			if (_constants.configElements.indexOf(element) < 0) return (0, _output.cliError)('Config key (' + element + ') not allowed, allowed keys: ' + this.configElements.toString() + ' ');
			var newCfg = _defineProperty({}, element, value);
			this.config = Object.assign({}, this.config, newCfg);
			this.cfg.set('config', this.config);
			return this.config;
		}
	}, {
		key: 'update',
		value: function update() {
			var _this11 = this;

			if (!this.config || this.config && this.config['config.version'] !== '2') {
				console.log('DB: Need to be updated');
				(0, _dbMigrations.migrateToV2)(this.tasks).then(function (tasks) {
					var newTasks = {};
					tasks.forEach(function (t) {
						return newTasks[t.key] = t.task;
					});
					return newTasks;
				}).then(function (migratedTasks) {
					_this11.cfg.set('tasks', migratedTasks);
					_this11.cfg.set('config', Object.assign(_this11.config, {
						'config.version': '2'
					}));
					(0, _output.cliSuccess)('Configuration migrated to version 2.');
				}, _output.cliError).catch(_output.cliError);
			} else {
				(0, _output.cliSuccess)('No need to update the DB.');
			}
		}
	}, {
		key: 'summarize',
		value: function summarize(args) {
			if (typeof args.full === 'undefined') args.full = true;
			(0, _output.summarize)({
				search: args.key,
				tasks: this.search(args.key),
				rate: args.rate,
				full: args.full,
				timespan: args.timespan,
				format: this.config['format.output']
			});
		}
	}, {
		key: 'getStatus',
		value: function getStatus() {
			var keys = this.getAllTasks({ view: 'list', status: true, lastLog: true });
			keys.forEach(function (el) {
				console.log(el.key, el.status, el.lastLog);
			});
		}
	}]);

	return Manager;
}();

exports.default = Manager;
//# sourceMappingURL=Manager.js.map