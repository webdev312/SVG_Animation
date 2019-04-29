function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

function El(a) { return document.querySelector(a); }

function getTotalMinutes(str_Start, str_End){
    let time_Start = moment(str_Start, "MM/DD/YYYY hh:mm A");
    let time_End = moment(str_End, "MM/DD/YYYY hh:mm A");
    var duration = time_End - time_Start;
    return duration/1000/60;
}