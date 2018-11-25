var http = require('http');
var iconv = require('iconv-lite');

const API_ROOT = 'http://cist.nure.ua/ias/app/tt/';
const AUDITORIES = 'P_API_AUDITORIES_JSON';
const SCHEDULE_FOR_GROUP = 'P_API_EVENTS_GROUP_JSON';
const STRUCTURE_WITH_TEACHERS = "P_API_PODR_JSON";
const STRUCTURE_WITH_GROUPS = "P_API_GROUP_JSON";

function sendRequest(proc, parameters) {
	let query = API_ROOT + proc + '?';
	query += Object.keys(parameters)
		.map((key) => key + '=' + parameters[key])
		.join('&');
	return new Promise((resolve, reject) => {
		http.get(query, res => {	
			if (res.statusCode != 200) {
				reject("Bad status code: " + res.statusCode);
			}		
			let chunks = [];
			res.on('data', (chunk) => {
				chunks.push(chunk);
			});
			res.on('end', () => {
				let body = iconv.decode(Buffer.concat(chunks), "win1251");
				body = body.replace('[\n}]', '[ ]');// -_-
				try {
					resolve(JSON.parse(body));
				} catch (e) {
					reject("Can not parse json");
				}
			});
		});
	});
}

exports.getAuditories = function () {
	return sendRequest(AUDITORIES, {});
}

exports.getStructure = function () {
	return sendRequest(STRUCTURE_WITH_TEACHERS, {});
}

exports.getStructureWithGroups = function () {
	return sendRequest(STRUCTURE_WITH_GROUPS, {});
}

exports.getSchedule = function (groupId, fromDate, toDate) {
	var parameters = {
		p_id_group: groupId
	};
	if (fromDate && toDate) {
		parameters.time_from = ~~(fromDate.valueOf() / 1000);
		parameters.time_to = ~~(toDate.valueOf() / 1000);
	}
	return sendRequest(SCHEDULE_FOR_GROUP, parameters);
}

