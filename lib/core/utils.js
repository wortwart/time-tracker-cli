'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var recognizeModifierTiming = exports.recognizeModifierTiming = function recognizeModifierTiming(string) {
	var r = /(\d+)([Mwdhms])/g;
	var arr = void 0;
	var res = [];
	while ((arr = r.exec(string)) !== null) {
		res.push({
			value: parseInt(arr[1]),
			momentKey: arr[2]
		});
	}
	return res;
};

var calcRate = exports.calcRate = function calcRate(rate, total) {
	var amount = void 0;
	var mod = rate.substr(rate.length - 1);
	var value = rate.slice(0, rate.length - 1);
	switch (mod) {
		case 'h':
			amount = total / 60 / 60 / parseFloat(value);
			break;
		case 'm':
			amount = total / 60 / parseFloat(value);
			break;
		case 's':
			amount = total / parseFloat(value);
			break;
	}
	if (!amount) {
		console.error('Invalid rate', rate);
		return;
	}
	return amount.toFixed(2) + (value === '1' ? mod : ' * ' + rate);
};

var humanParseDiff = exports.humanParseDiff = function humanParseDiff(secs, noSecOutput, zeroOutput) {
	if (!secs) return zeroOutput ? '0m' : '';
	var hours = Math.floor(secs / 3600);
	var minutes = Math.floor((secs - hours * 3600) / 60);
	var seconds = secs - hours * 3600 - minutes * 60;
	hours = hours == 0 ? '' : (hours < 10 ? '0' + hours : hours) + 'h';
	minutes = minutes == 0 && hours == '' ? '' : (minutes < 10 ? '0' + minutes : minutes) + 'm';
	if (noSecOutput) return hours + minutes;
	seconds = seconds == 0 ? '' : (seconds < 10 ? '0' + seconds : seconds) + 's';
	return hours + minutes + seconds;
};
//# sourceMappingURL=utils.js.map