function getMovementData(){
    var ret = {};
    $.ajax({
        url: 'http://localhost:8080/json/tag_movements.json',
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