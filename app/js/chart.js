var g_nLength_hour = 0;

var dataset1_Los;
var dataset2_Los;
var xScale_Los;
var yScale_Los;
var bisect_Los;

var dataset1_Tov;
var dataset2_Tov;
var xScale_Tov;
var yScale_Tov;
var bisect_Tov;

function moveChartDesc(cur_mins){
    if (cur_mins % 60 == 0){
        let line1 = d3.select("#los_line");
        let line2 = d3.select("#turnover_line");

        if (line1 != undefined){
            let cur_time = $('#cur_time').text();
            let xVal = xScale_Los(moment(cur_time, "YYYY-MM-DD hh:mm"));

            line1.attr("x1", xVal);
            line1.attr("x2", xVal);
            line2.attr("x1", xVal);
            line2.attr("x2", xVal);

            let yIndex_blue_los = dataset1_Los[bisect_Los(dataset1_Los, moment(cur_time, "YYYY-MM-DD hh:mm"))].y;
            let yIndex_green_los = dataset2_Los[bisect_Los(dataset2_Los, moment(cur_time, "YYYY-MM-DD hh:mm"))].y;
            let y_blue_los = yScale_Los(yIndex_blue_los);
            let y_green_los = yScale_Los(yIndex_green_los);

            let yIndex_blue_tov = dataset1_Tov[bisect_Tov(dataset1_Tov, moment(cur_time, "YYYY-MM-DD hh:mm"))].y;
            let yIndex_green_tov = dataset2_Tov[bisect_Tov(dataset2_Tov, moment(cur_time, "YYYY-MM-DD hh:mm"))].y;
            let y_blue_tov = yScale_Tov(yIndex_blue_tov);
            let y_green_tov = yScale_Tov(yIndex_green_tov);

            let circle_blue_los = d3.select("#los_circle_blue");
            circle_blue_los.attr("transform", "translate(" + xVal + ", " + y_blue_los + ")");
            let circle_green_los = d3.select("#los_circle_green");
            circle_green_los.attr("transform", "translate(" + xVal + ", " + y_green_los + ")");

            let circle_blue_tov = d3.select("#tov_circle_blue");
            circle_blue_tov.attr("transform", "translate(" + xVal + ", " + y_blue_tov + ")");
            let circle_green_tov = d3.select("#tov_circle_green");
            circle_green_tov.attr("transform", "translate(" + xVal + ", " + y_green_tov + ")");
        }
    }
}

function drawChartTurnover(data, cur_time){
    $("#turn_time").empty();

    var timeframe = [];
    var dataframe = [];
    var averageframe = [];
    for (var i = 0; i < data.length; i ++){
        let time_chart = moment(data[i]["time"], "YYYY-MM-DD hh:mm:ss");
        if (time_chart - cur_time > 0) continue;
        timeframe[i] = time_chart;
        dataframe[i] = data[i]["turnover time"];
    }
    for (var i = 0; i < dataframe.length; i ++){
        var sum = 0;
        for (var j = 0; j <= i; j ++){
            sum += dataframe[j];
        }
        averageframe[i] = (i == 0) ? 0 : sum / i;
    }

    // Use the margin convention practice 
    var margin = {top: 50, right: 70, bottom: 50, left: 70}
    , width = window.innerWidth / 100 * 40 - margin.left - margin.right - 20
    , height = window.innerWidth / 100 * 20 - margin.top - margin.bottom;

    // The number of datapoints
    var n = dataframe.length;

    xScale_Tov = d3.scaleTime()
    .domain(d3.extent(timeframe, function(d) { return d; })) 
    .range([0, width]); 

    yScale_Tov = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(dataframe) / 100) * 100])
    .range([height, 0]);

    var line1 = d3.line()
    .x(function(d, i) { return xScale_Tov(d.x); })
    .y(function(d) { return yScale_Tov(d.y); }) 
    .curve(d3.curveMonotoneX) 

    var line2 = d3.line()
    .x(function(d, i) { return xScale_Tov(d.x); })
    .y(function(d) { return yScale_Tov(d.y); })
    .curve(d3.curveMonotoneX) 

    function make_y_gridlines() {
        return d3.axisLeft(yScale_Tov)
            .ticks(4)
    }

    dataset1_Tov = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": dataframe[i] } });
    dataset2_Tov = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": averageframe[i] } });

    bisect_Tov = d3.bisector(function(d) { return d.x}).left;

    var svg = d3.select("#turn_time").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_Tov)); 

    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale_Tov)); 

    svg.append("path")
    .datum(dataset1_Tov) 
    .attr("class", "line1") 
    .attr("d", line1);

    svg.append("path")
    .datum(dataset2_Tov) 
    .attr("class", "line2") 
    .attr("d", line2);

    svg.append("text")
    .attr("x", width / 2 - 100)
    .attr("y", -20)
    .text("ROOM TURNOVER TIME")

    svg.append("text")
    .attr("x", -height / 2 - 80)
    .attr("y", width + 40)
    .attr("font-size", "12px")
    .text("Average Turnover Time (Green)")
    .attr("transform", "rotate(270)")

    svg.append("text")
    .attr("x", -height / 2 - 76)
    .attr("y", -40)
    .attr("font-size", "12px")
    .text("Patient Turnover Time (Blue)")
    .attr("transform", "rotate(270)")

    svg.append("g")
        .attr("class","grid")
        .attr("opacity","0.4")
  		.style("stroke-dasharray",("3,3"))
  		.call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        );
}

function drawChartLos(data, cur_time){
    $("#len_stay").empty();

    var timeframe = [];
    var dataframe = [];
    var averageframe = [];
    for (var i = 0; i < data.length; i ++){
        let time_chart = moment(data[i]["time"], "YYYY-MM-DD hh:mm:ss");
        if (time_chart - cur_time > 0) continue;
        timeframe[i] = time_chart;
        dataframe[i] = data[i]["length of stay"];
    }
    for (var i = 0; i < dataframe.length; i ++){
        var sum = 0;
        for (var j = 0; j <= i; j ++){
            sum += dataframe[j];
        }
        averageframe[i] = (i == 0) ? 0 : sum / i;
    }
    
    // 2. Use the margin convention practice
    var margin = {top: 50, right: 70, bottom: 50, left: 70}
    , width = window.innerWidth / 100 * 40 - margin.left - margin.right - 20 // Use the window's width 
    , height = window.innerWidth / 100 * 20 - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    var n = dataframe.length;

    xScale_Los = d3.scaleTime()
    .domain(d3.extent(timeframe, function(d) { return d; }))
    .range([0, width]);

    yScale_Los = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(dataframe) / 100) * 100]) 
    .range([height, 0]); 

    function make_y_gridlines() {
        return d3.axisLeft(yScale_Los)
            .ticks(4)
    }

    var line1 = d3.line()
    .x(function(d, i) { return xScale_Los(d.x); }) 
    .y(function(d) { return yScale_Los(d.y); }) 
    .curve(d3.curveMonotoneX) 

    var line2 = d3.line()
    .x(function(d, i) { return xScale_Los(d.x); }) 
    .y(function(d) { return yScale_Los(d.y); })
    .curve(d3.curveMonotoneX)

    dataset1_Los = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": dataframe[i] } });
    dataset2_Los = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": averageframe[i] } });

    bisect_Los = d3.bisector(function(d) { return d.x}).left;

    var svg = d3.select("#len_stay").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_Los)); 

    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale_Los).ticks(4)); 

    svg.append("path")
    .datum(dataset1_Los)
    .attr("class", "line1") 
    .attr("d", line1);

    svg.append("path")
    .datum(dataset2_Los)
    .attr("class", "line2") 
    .attr("d", line2); 

    svg.append("text")
    .attr("x", width / 2 - 100)
    .attr("y", -20)
    .text("LENGTH OF STAY (MINUTES)")

    svg.append("text")
    .attr("x", -height / 2 - 50)
    .attr("y", width + 40)
    .attr("font-size", "12px")
    .text("Average LOS (Green)")
    .attr("transform", "rotate(270)")

    svg.append("text")
    .attr("x", -height / 2 - 50)
    .attr("y", -40)
    .attr("font-size", "12px")
    .text("Patient LOS (Blue)")
    .attr("transform", "rotate(270)")

    svg.append("g")
        .attr("class","grid")
        .attr("opacity","0.4")
  		.style("stroke-dasharray",("3,3"))
  		.call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )
}