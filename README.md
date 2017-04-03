# Tiny Time tracker

## Project State

This CLI time tracker is based on [danibram's work](https://github.com/danibram/time-tracker-cli) and tries to improve on it.

### Changes:

- Timer status (`status` or `st`): Is there a timer running? Which tasks?
- `p` pauses all tasks unless specified, `up` unpauses them

### Wishlist:

- Respond with overview over running and saved tasks
- Starting a task stops all others unless specified with an option
- Ask if user starts a new task (might be a typo)
- `f` finishes all running tasks unless specified
- Filter report by time range
- Date not in UTC, but local timezone
- Show a task's raw data, optionally filtered by time range
- Autocomplete commands (built-in, but cannot make it work) and tasks
- Can we pause tasks automatically when the computer goes into sleep mode?
- Data clean-up (performance): Calculate sum, label and save it, delete timings
- Data backup
- "del x" finds "x" and "x.y", no way to pick only "x"
- Logging acts weird on the console when no task is running
- Show timer state on desktop or in browser (with an addon)

Okay, I got carried away with the last one.

## Installation

```
npm install -g time-tracker-cli
```
or
```
yarn global add time-tracker-cli
```
Now you can start to call `timer`command

## Usage

[![asciicast](https://asciinema.org/a/100679.png)](https://asciinema.org/a/100679)

```
└┘#! timer

Usage: timer [options] [command]


  Commands:

	start|s <task_key> [description]               Start task with a description.
	pause|p <task_key>                             Pause task
	unpause|up <task_key>                          Unpause task
	finish|f <task_key> [description]              Stop task, you can add a description
	description|d <task_key> <descriptionText...>  Add description to your task.
	add <task_key> <stringTime>                    Adds time to a task. Example: "1h2m3s"
	subtract|sub <task_key> <stringTime>           Subtract time to a task. Example: "1h2m3s"
	report|r [task_string] [rate]                  Report time of the tasks, empty for select all tasks. Can pass a rate (1h).
	log|l <task_key>                               Logs the time of the  task
	export|e                                       Export the tasks in a JSON
	delete|del [task_string]                       Remove tasks from the list. Empty for select all tasks
	configure <key> <value>                        Configure the value of the config passing a key
	configuration                                  Output configuration

  Tiny time tracker for projects

  Options:

	-h, --help     output usage information
	-V, --version  output the version number
	--updateDB     Update the db if its neccesary
```

- To start a task run:
```
$ timer start <key of the task> <description>
```
- To finish a task run:
```
$ timer finish <key of the task> <description>
```
- You can add a description adding:
```
$ timer description <key of the task> <description>
```
- You can also see the timer running:
```
$ timer log <key of the task>
```

## How it works
The data are stored inside ~/.config/time-tracker-cli.json
The config need to be updated if you have the 1.x to the 2.x to do that, to update config run timer --updateDB
If you open you should see:

```javascript
{
	"tasks": {
		"work1.website.design": {
			"description": "If you added one",
			"timings": [{
				"start": "2016-02-19T10:00:36.393Z",
				"stop": "2016-02-19T18:01:50.921Z"
			}],
			"log": [
				"start#2016-02-19T10:00:36.393Z",
				"stop#2016-02-19T18:01:50.921Z"
			]
		},
		"work1.website.deployServer": {
			"timings": [{
				"start": "2016-02-19T10:01:59.116Z",
				"stop": "2016-02-19T10:32:10.687Z"
			}],
			"log": [
				"start#2016-02-19T10:01:59.116Z",
				"stop#2016-02-19T10:32:10.687Z"
			]
		},
		"work2.api.develop.userController": {
			"timings": [{
				"start": "2016-02-19T10:04:23.060Z",
				"stop": "2016-02-19T20:04:36.836Z"
			}],
			"log": [
				"start#2016-02-19T10:04:23.060Z",
				"stop#2016-02-19T20:04:36.836Z"
			]
		},
		"work2.api.develop.loginController": {
			"timings": [{
				"start": "2016-02-19T10:09:41.848Z",
				"stop": "2016-02-19T13:11:54.059Z"
			}],
			"log": [
				"start#2016-02-19T10:09:41.848Z",
				"stop#2016-02-19T13:11:54.059Z"
			]
		}
	},
	"config": {
		"format.output": "DD/MM",
		"config.version": 2
	}
}
```

## Notes
To use the autocomplete run `timer --setupCLI`
If you have the version 1.x and you want to conserve the DB, run `timer --updateDB` to update the DB to version 2.x

## Development

Run ```npm install;npm run dev``` to watch the proyect, and compile the code automatically.
Run ```npm build``` to build the module.

## License
Licensed under the MIT license. 2015
