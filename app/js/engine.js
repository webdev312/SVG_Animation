function createCircle(id, x, y){
    let pathDotOutter = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        pathDotOutter.setAttribute('class', 'circle_' + id);
        pathDotOutter.setAttribute('id', 'circle_' + id);
        pathDotOutter.setAttribute('cx', x);
        pathDotOutter.setAttribute('cy', y);
        pathDotOutter.setAttribute('r', 6);
        pathDotOutter.setAttribute('fill', "#455");
        pathDotOutter.setAttribute('opacity', "0.4");

    let pathDot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        pathDot.setAttribute('class', 'circle_' + id);
        pathDot.setAttribute('id', 'circle_' + id);
        pathDot.setAttribute('cx', x);
        pathDot.setAttribute('cy', y);
        pathDot.setAttribute('r', 3);
        pathDot.setAttribute('fill', "green");
        pathDot.setAttribute('stroke', "#FFF");
        pathDot.setAttribute('stroke-width', "1px");

    El('#markers').appendChild(pathDotOutter);
    El('#markers').appendChild(pathDot);
}

// Create Element by ID
function createIcon(data_Term){
    let str_tag = replaceAll(data_Term.command_data["patient_id"], " ", "_");
    let str_icon = "/svg/" + replaceAll(data_Term.command_data.icon, " ", "_");

    let imageIcon = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        imageIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', str_icon);
        imageIcon.setAttribute('id', 'icon_' + str_tag);
        imageIcon.setAttribute('width', '30');
        imageIcon.setAttribute('height', '30');
        imageIcon.setAttribute('opacity', '0');
        imageIcon.setAttribute('x', parseInt(data_Term.command_data.from_x) - 15);
        imageIcon.setAttribute('y', parseInt(data_Term.command_data.from_y) - 26);

    let pathLine = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
        pathLine.setAttribute('points', data_Term.command_data.from_x + ', ' + data_Term.command_data.from_y + ', ' + data_Term.command_data.from_x + ', ' + data_Term.command_data.from_y + '');
        pathLine.setAttribute('id', 'path_' + str_tag);
        pathLine.setAttribute('stroke', '#455');
        pathLine.setAttribute('stroke-dasharray', '5,10');
        pathLine.setAttribute('opacity', '0');
        pathLine.setAttribute('stroke-linecap', 'round');
        pathLine.setAttribute('stroke-width', '3');

    El('#icon_path').appendChild(pathLine);
    El('#icon_location').appendChild(imageIcon);
}

function createAlert(strid, x, y, time, text){
    let alertRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    alertRect.setAttribute('x', x);
    alertRect.setAttribute('y', y);
    alertRect.setAttribute('width', 80);
    alertRect.setAttribute('height', 25);
    alertRect.setAttribute('rx', 4);
    alertRect.setAttribute('ry', 4);
    alertRect.setAttribute('stroke-width', 1);
    alertRect.setAttribute('fill', 'white');
    alertRect.setAttribute('stroke', 'green');
    alertRect.setAttribute('class', 'point_rect');
    alertRect.setAttribute('id', strid);
    alertRect.setAttribute('opacity', 0);

    El('#alerts').appendChild(alertRect);

    let desc_text = text.split(",")[0];
    let time_text = text.split(",")[1];
    
    let alerts = d3.select("#alerts");
    let alertText = alerts.append('text')
    .attr('id', strid + "_desc")
    .attr('opacity', 0)
    .attr('font-size', '6px')
    .attr('letter-spacing', '0.5px')
    .attr('x', x + 5)
    .attr('y', y + 5)
    .attr('width', '70px')
    .attr('height', '20px')
    .text(desc_text);

    let alertTime = alerts.append('text')
    .attr('id', strid + "_time")
    .attr('opacity', 0)
    .attr('font-size', '6px')
    .attr('letter-spacing', '0.5px')
    .attr('x', x + 5)
    .attr('y', y + 5)
    .attr('width', '70px')
    .attr('height', '20px')
    .text(time_text);
}

function createPump(strID, x, y){
    let str_tag = replaceAll(strID, " ", "_");
    let str_icon = "/svg/pump_icon.svg";

    let imageIcon = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        imageIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', str_icon);
        imageIcon.setAttribute('id', 'icon_pump_' + str_tag);
        imageIcon.setAttribute('width', '30');
        imageIcon.setAttribute('height', '30');
        imageIcon.setAttribute('opacity', '1');
        imageIcon.setAttribute('x', x + 6);
        imageIcon.setAttribute('y', y - 26);

    El('#icon_location').appendChild(imageIcon);
}

function createNurse(strID, x, y){
    let str_tag = replaceAll(strID, " ", "_");
    let str_icon = "/svg/nurse.svg";

    let imageIcon = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        imageIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', str_icon);
        imageIcon.setAttribute('id', 'icon_nurse_' + str_tag);
        imageIcon.setAttribute('width', '30');
        imageIcon.setAttribute('height', '30');
        imageIcon.setAttribute('opacity', '1');
        imageIcon.setAttribute('x', x + 6);
        imageIcon.setAttribute('y', y - 26);

    El('#icon_location').appendChild(imageIcon);
}

function createDoctor(strID, x, y){
    let str_tag = replaceAll(strID, " ", "_");
    let str_icon = "/svg/doctor.svg";

    let imageIcon = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        imageIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', str_icon);
        imageIcon.setAttribute('id', 'icon_doctor_' + str_tag);
        imageIcon.setAttribute('width', '30');
        imageIcon.setAttribute('height', '30');
        imageIcon.setAttribute('opacity', '1');
        imageIcon.setAttribute('x', x + 6);
        imageIcon.setAttribute('y', y - 26);

    El('#icon_location').appendChild(imageIcon);
}

function moveIconToTop(strID){
    let topEl = document.getElementById("sec_item");
    topEl.href.baseVal = "#icon_" + strID;
}
function moveAlertToTop(strID){
    let topEl = document.getElementById("top_alert");
    topEl.href.baseVal = strID;

    let topEl_desc = document.getElementById("top_alert_desc");
    topEl_desc.href.baseVal = strID + "_desc";

    let topEl_time = document.getElementById("top_alert_time");
    topEl_time.href.baseVal = strID + "_time";
}

function remove_all_by_id(strid){
    $("#icon_" + strid).remove();
    $(".circle_" + strid).remove();
    $("#path_" + strid).remove();
    $("#alert_" + strid + "_0").remove();
    $("#alert_" + strid + "_0_desc").remove();
    $("#alert_" + strid + "_0_time").remove();
    $("#alert_" + strid + "_1").remove();
    $("#alert_" + strid + "_1_desc").remove();
    $("#alert_" + strid + "_1_time").remove();
    $("#alert_" + strid + "_2").remove();
    $("#alert_" + strid + "_2_desc").remove();
    $("#alert_" + strid + "_2_time").remove();
    $("#alert_" + strid + "_3").remove();
    $("#alert_" + strid + "_3_desc").remove();
    $("#alert_" + strid + "_3_time").remove();
    $("#alert_" + strid + "_4").remove();
    $("#alert_" + strid + "_4_desc").remove();
    $("#alert_" + strid + "_4_time").remove();
    $("#alert_" + strid + "_5").remove();
    $("#alert_" + strid + "_5_desc").remove();
    $("#alert_" + strid + "_5_time").remove();
    $("#alert_" + strid + "_6").remove();
    $("#alert_" + strid + "_6_desc").remove();
    $("#alert_" + strid + "_6_time").remove();
}

function remove_all_circles_id(strid){
    $(".circle_" + strid).remove();
}

function remove_pump_by_id(strid){
    $("#icon_pump_" + strid).remove();
}

function remove_nurse_by_id(strid){
    $("#icon_nurse_" + strid).remove();
}

function remove_doctor_by_id(strid){
    $("#icon_doctor_" + strid).remove();
}