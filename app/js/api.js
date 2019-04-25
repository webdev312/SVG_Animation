function getAllData(){
    var ret = {};
    $.ajax({
        url: 'http://localhost:8080/json/tag_data.json',
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