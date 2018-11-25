var mysql = require('mysql');
var nureApi = require('./../modules/nure_api');

var INSERT_AUDITORIES = 'INSERT INTO auditory (idauditory, shortName, fullName, type, floor, number) VALUES ?';
var INSERT_FACULTIES = 'INSERT INTO faculty (idfaculty, shortName, fullName) VALUES ?';
var INSERT_DEPARTMENTS = "INSERT INTO department (iddepartment, shortName, fullName, faculty_idfaculty) VALUES ?";
var INSERT_TEACHERS = "INSERT INTO teacher (idteacher, shortName, fullName, department_iddepartment, subject_idsubject) VALUES ?";
var INSERT_SUBJECTS = "INSERT INTO subject (idsubject, name, quantityLecture, quantityPractice, quantityCons) VALUES ?";
var INSERT_EVENT_GROPS = "INSERT INTO event_grops (event_idclass, event_idgroup) VALUES ?";
var INSERT_EVENTS = "INSERT INTO events (typeOfClass, startTime, endTime, subject_idsubject, auditory_idauditory) VALEUS ?";
var INSERT_GROUPS = "INSERT INTO group (idgroup, name, department_iddepartment) VALUES ?";

function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "yourusername",
        password: "yourpassword",
        database: "mydb"
      });
}

exports.cloneGroups = function() {
    let con = getConnection();
    con.connect(function(err) {
        if (err) throw err;
        nureApi.getStructureWithGroups()
                .then(function(data) {
                    var groups = {};
                    let i = 0;
                    data.university.faculties.forEach(faculty => {
                        faculty.directions.forEach(direction => {
                            if (direction.groups) {
                                direction.groups.forEach(group => {
                                    groups[group.id] = [group.id, group.name, direction.id];
                                });
                            }
                            direction.specialities.forEach(spec => {
                                spec.groups.forEach(group => {
                                    groups[group.id] = [group.id, group.name, direction.id];
                                });
                            });
                        });
                    });
                    var groupArr = [];
                    Object.keys(groups).forEach(key => {
                        groupArr.push(groups[key]);
                    });
                    console.log(groupArr);
                    con.query(INSERT_GROUPS, groupArr, function (err, result) {
                        if (err) throw err;
                    });
                }, function(err) {
                    console.log(err);
                });
      });
}

exports.cloneAuditories = function() {
    let con = getConnection();
    con.connect(function(err) {
        if (err) throw err;
        nureApi.getAuditories()
                .then(function(data) {
                    var auditories = [];
                    data.university.buildings.forEach(b => {
                        b.auditories.forEach(a => auditories.push(a));
                    });
                    var arr = [];
                    auditories.forEach(el => {
                        let auditory = [];
                        auditory.push(el.id);
                        auditory.push(el.short_name);
                        auditory.push(el.short_name);
                        auditory.push(el.auditory_types.map(type => type.short_name));
                        auditory.push(el.floor);
                        auditory.push(el.short_name);
                        arr.push(auditory);
                    });
                    console.log(arr);
                    con.query(INSERT_AUDITORIES, arr, function (err, result) {
                        if (err) throw err;
                    });
                }, function(err) {
                    console.log(err);
                });
      });
}

exports.cloneStructure = function() {
    let con = getConnection();
    con.connect(function(err) {
        if (err) throw err;
        nureApi.getStructure()
                .then(function(data) {
                    var faculties = [];
                    var teachers = [];
                    var departments = [];
                    let i = 0;
                    data.university.faculties.forEach(f => {
                        faculties.push([f.id, f.short_name, f.full_name]);
                        f.departments.forEach(d => {
                            departments.push([d.id, d.short_name, d.full_name, f.id]);
                            d.teachers.forEach(t => {
                                teachers.push([t.id, t.short_name, t.full_name, d.id, 'gospade' + i++]);
                            });
                        });
                    });
                    con.query(INSERT_FACULTIES, faculties, function (err, result) {
                        if (err) throw err;
                    });
                    con.query(INSERT_DEPARTMENTS, departments, function (err, result) {
                        if (err) throw err;
                    });
                    con.query(INSERT_TEACHERS, teachers, function (err, result) {
                        if (err) throw err;
                    });
                });
      });
}

exports.cloneEventsWithSubjects = function() {
    var groupIds //= getGroupIds();
    let con = getConnection();
    con.connect(function(err) {
        if (err) throw err;
        groupIds.forEach(groupId => {
            nureApi.getSchedule(groupId)
                .then(data => {

                });
        });
    });
}