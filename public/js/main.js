const CONST = {
    selectedDirection: 'direction',
    selectedCourse: 'course',
    selectedGroup: 'group',
    selectedPeriod: 'period',
    oneWeek: 1,
    twoWeek: 2,
    month: 3
};

$('#faculties').click((event) => {
    if (this.children().length == 0) {
        $.get('/faculties').then((data) => {
            var faculties = JSON.parse(data);
            faculties.forEach(faculty => {
                console.log(this);
            })
        }); 
    }
});

$(function() {
    var direction = readCookie(CONST.selectedDirection);
    var course = readCookie(CONST.course);
    var group = readCookie(CONST.group);
    if (direction) {
        // view.drawDirection
    }
    if (course) {
        // view.drawCourse
    }
    if (group) {
        // view.drawGroup
        var period = readCookie(period);
        period = period || CONST.oneWeek;

        var toDay = new Date();
        var fromDate = (period == CONST.month) 
                            ? new Date(toDay.getFullYear, toDay.getMonth, 1) 
                            : getMonday(toDay);
        var toDate = new Date();
        if (period == CONST.month) {
            toDate.setMonth(fromDate.getMonth() + 1);
        } else {
            toDate.setDate(fromDate.getDate() + 7 * period);
        }
        $.get('/schedule', {
            groupId: group,
            fromDate: fromDate,
            toDate: toDate
        }).then((data) => {
            //view draw schedule
        });
    }
});


function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }