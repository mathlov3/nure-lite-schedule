function valet() {
    $.get('/schedule', {
        fromDate: $('.from').val(),
        toDate: $('.to').val()
    }).then(function(data) {
        console.log(data);
    });
}