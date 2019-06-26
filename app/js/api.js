function getAllData(){
    var ret = {};
    $.ajax({
        url: '/json/data.json',
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