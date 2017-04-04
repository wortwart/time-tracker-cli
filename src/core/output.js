import moment from 'moment'
import Table from 'cli-table'
import chalk from 'chalk'
import {recognizeModifierTiming, humanParseDiff, calcRate} from './utils'

export const summarize = function(args) {
	let table = new Table({
		head: ['Duration', 'Dates', 'Task'],
		chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
		colAligns: ['right', 'center', 'left'],
		style: { head: ['green'] }
	});
	let total = 0
	let head = `Search: ${args.search} \n`

	args.tasks.forEach((task, index) => {
		let name = task.name
		task = task.task
		let duration = task.getSeconds()
		total += duration
		table.push([humanParseDiff(duration), moment(task.getStartDate()).format(args.format), name])
	})

	console.log(table.toString());

	if (args.full) {
		let table2 = new Table()
		table2.push(
			{'Search': ['\"' + args.search + '\"']},
			{'Total time': [humanParseDiff(total)]}
		)
		if (args.rate)
			table2.push({'Rate': [calcRate(args.rate, total)]})
		if (args.timespan) {
			let obj = {}
			obj['Time (' + args.timespan + ')'] = [calcTime(args.timespan, args.tasks)]
			table2.push(obj)
		}
		console.log(table2.toString());
	}
}

export const calcTime = function(timespan, tasks) {
	let results = []
	let pTimespan = recognizeModifierTiming(timespan)[0]
	let limit = moment().subtract(pTimespan.value, pTimespan.momentKey)
	tasks.forEach(el => {
		let checkins = el.task.task.timings.reverse()
		let sum = 0
		let overflow = 0
		for (let i = 0; i < checkins.length; i++) {
			if (moment(checkins[i].stop).isBefore(limit))
				break
			sum += moment(checkins[i].stop).diff(checkins[i].start, 's')
			if (moment(checkins[i].start).isBefore(limit)) {
				overflow = moment(limit).diff(checkins[i].start, 's')
				break
			}
		}
		let result = humanParseDiff(sum, true)
		if (overflow)
			result += '\n- ' + humanParseDiff(overflow, true)
		results.push(result)
	})
	return results
}

export const outputConfig = function (config) {
	let table = new Table({
		head: ['Key', 'value'],
		chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
		colAligns: ['center', 'center'],
		style: { head: ['green'] }
	});
	Object.keys(config).map(e => table.push([e, config[e]]))
	console.log(table.toString());
}

export const outputVertical = function (...args) {
	let table2 = new Table()
		let key = args.splice(0, 1)
		table2.push(
			{ [key]: args },
		)
		return table2.toString()
}

export const cliError = function(err) {
	console.error(chalk.red(`Error: ${err}`))
}

export const cliSuccess = function(err) {
	console.log(chalk.green(err))
}
