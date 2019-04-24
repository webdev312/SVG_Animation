function getMovementData(){
    var ret = {};
    $.ajax({
        url: 'http://184.73.67.205:8080/json/tag_movements.json',
        async: false,
        type: 'GET',
        dataType: 'JSON',
        success: function(resp) {
            ret = resp;
        },
        error: function(err) {
            console.log(err);
        }
    });

    return ret;
}