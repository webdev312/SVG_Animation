function createCircle(id, x, y){
    let pathDot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        pathDot.setAttribute('class', 'circle_' + id);
        pathDot.setAttribute('cx', x);
        pathDot.setAttribute('cy', y);
        pathDot.setAttribute('r', 4);
        pathDot.setAttribute('fill', "#f98");
        pathDot.setAttribute('stroke', "#455");
        pathDot.setAttribute('stroke-width', 3);

    El('#markers').appendChild(pathDot);
}

function createMoveDesc(x, y, time, zone){
    let alertRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    alertRect.setAttribute('x', x);
    alertRect.setAttribute('y', y);
    alertRect.setAttribute('width', 100);
    alertRect.setAttribute('height', 30);
    alertRect.setAttribute('rx', 4);
    alertRect.setAttribute('ry', 4);
    alertRect.setAttribute('stroke-width', 1);
    alertRect.setAttribute('fill', 'white');
    alertRect.setAttribute('stroke', 'black');
    alertRect.setAttribute('class', 'point_rect');
    alertRect.setAttribute('id', strid);
    alertRect.setAttribute('opacity', 0);

    El('#markers').appendChild(alertRect);

    let alerts = d3.select("#markers");
    let alertText = alerts.append('foreignObject')
    .attr('id', strid + "_foreign")
    .attr('opacity', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', '6px')
    .attr('x', x + 5)
    .attr('y', y + 5)
    .attr('width', '90px')
    .attr('height', '90px');
    let div = alertText.append('xhtml:div')
        .append('div').html(text);
    // let pointText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    // pointText.setAttribute('x', x + 7);
    // pointText.setAttribute('y', y);
    // pointText.setAttribute('class', 'point_text');

    // let textTime = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
    // let textZone = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
    // textTime.setAttribute('dy', 0);
    // textZone.setAttribute('dy', 5);
    // textTime.setAttribute('x', x + 7);
    // textZone.setAttribute('x', x + 7);

    // textTime.textContent = time;
    // textZone.textContent = zone;

    // pointText.appendChild(textTime);
    // pointText.appendChild(textZone);
    // El('#markers').appendChild(pointText);
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
    alertRect.setAttribute('width', 100);
    alertRect.setAttribute('height', 30);
    alertRect.setAttribute('rx', 4);
    alertRect.setAttribute('ry', 4);
    alertRect.setAttribute('stroke-width', 1);
    alertRect.setAttribute('fill', 'white');
    alertRect.setAttribute('stroke', 'black');
    alertRect.setAttribute('class', 'point_rect');
    alertRect.setAttribute('id', strid);
    alertRect.setAttribute('opacity', 0);

    El('#alerts').appendChild(alertRect);

    let alerts = d3.select("#alerts");
    let alertText = alerts.append('foreignObject')
    .attr('id', strid + "_foreign")
    .attr('opacity', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', '6px')
    .attr('x', x + 5)
    .attr('y', y + 5)
    .attr('width', '90px')
    .attr('height', '90px');
    let div = alertText.append('xhtml:div')
        .append('div').html(text);
}

function remove_all_by_id(strid){
    $("#icon_" + strid).remove();
    $(".circle_" + strid).remove();
    $("#path_" + strid).remove();
    $("#alert_" + strid + "_0").remove();
    $("#alert_" + strid + "_0_foreign").remove();
    $("#alert_" + strid + "_1").remove();
    $("#alert_" + strid + "_1_foreign").remove();
    $("#alert_" + strid + "_2").remove();
    $("#alert_" + strid + "_2_foreign").remove();
}