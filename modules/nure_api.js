const http = require('http');
const iconv = require('iconv-lite')

const API_ROOT = 'http://cist.nure.ua/ias/app/tt/';
const AUDITORIES = 'P_API_AUDITORIES_JSON';
const SCHEDULE_FOR_GROUP = 'P_API_EVENTS_GROUP_JSON';

function sendRequest(proc, parameters) {
	let query = API_ROOT + proc + '?';
	query += Object.keys(parameters)
		.map((key) => key + '=' + parameters[key])
		.join('&');
	return new Promise((resolve, reject) => {
		http.get(query, res => {			
			let chunks = [];
			res.on('data', (chunk) => {
				chunks.push(chunk);
			});
			res.on('end', () => {
				let body = iconv.decode(Buffer.concat(chunks), "win1251");
				resolve(JSON.parse(body));
			});
		});
	});
}

exports.getAuditories = async function () {
	return await sendRequest(AUDITORIES, {});
};

exports.getSchedule = async function (groupId, fromDate, toDate) {
	let json = await sendRequest(SCHEDULE_FOR_GROUP, {
		p_id_group: groupId,
		time_from: ~~(fromDate.valueOf() / 1000),
		time_to: ~~(toDate.valueOf() / 1000)
	});
	json.events.forEach(event => {
		event.subject = json.subjects.filter(sub => sub.id == event.subject_id)[0];
		event.type = json.types.filter(type => type.id == event.type)[0];
		event.groups = json.groups.filter(group => event.groups.some(group_id => group_id == group.id));
		event.teachers = json.teachers.filter(teachers => event.teachers.some(teachers_id => teachers_id == teachers.id));

		delete event.subject_id;

		let startDate = new Date(0);
		let endDate = new Date(0);
		startDate.setUTCSeconds(event.start_time);
		endDate.setUTCSeconds(event.end_time);
		event.start_time = startDate;
		event.end_time = endDate;
	});

	return json.events;
}

exports.getFaculties = () => {
	return [{id: 1, name: 'Faculty 1'}, {id: 2, name: 'Faculty 2'}];
};

exports.getDepartments = (facultyId) => {
	return [{id: 1, name: 'Department 1'}, {id: 2, name: 'Department 2'}];
};

exports.getGroups = (departmentId, course) => {
	return [{id: 1, name: 'Group 1'}, {id: 2, name: 'Group 2'}];
};
