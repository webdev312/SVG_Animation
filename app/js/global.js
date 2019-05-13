function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

function El(a) { return document.querySelector(a); }

function getTotalMinutes(str_Start, str_End){
    let time_Start = moment(str_Start, "YYYY-MM-DD HH:mm");
    let time_End = moment(str_End, "YYYY-MM-DD HH:mm");
    var duration = time_End - time_Start;
    return duration/1000/60;
}