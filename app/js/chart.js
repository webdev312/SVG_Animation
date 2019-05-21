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

function drawChartTurnover(data){
    $("#turn_time").empty();

    var timeframe = [];
    var dataframe = [];
    var averageframe = [];
    for (var i = 0; i < data.length; i ++){
        let time_chart = moment(data[i]["time"], "YYYY-MM-DD hh:mm:ss");
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

    // 2. Use the margin convention practice 
    var margin = {top: 50, right: 70, bottom: 50, left: 70}
    , width = window.innerWidth / 100 * 40 - margin.left - margin.right - 20
    , height = window.innerWidth / 100 * 20 - margin.top - margin.bottom;

    // The number of datapoints
    var n = data.length;

    // 5. X scale will use the index of our data
    xScale_Tov = d3.scaleTime()
    .domain(d3.extent(timeframe, function(d) { return d; })) // input
    .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    yScale_Tov = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(dataframe) / 100) * 100]) // input 
    .range([height, 0]); // output

    // 7. d3's line generator
    var line1 = d3.line()
    .x(function(d, i) { return xScale_Tov(d.x); }) // set the x values for the line generator
    .y(function(d) { return yScale_Tov(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line2 = d3.line()
    .x(function(d, i) { return xScale_Tov(d.x); }) // set the x values for the line generator
    .y(function(d) { return yScale_Tov(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    function make_y_gridlines() {
        return d3.axisLeft(yScale_Tov)
            .ticks(4)
    }

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    dataset1_Tov = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": dataframe[i] } });
    dataset2_Tov = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": averageframe[i] } });

    bisect_Tov = d3.bisector(function(d) { return d.x}).left;

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select("#turn_time").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_Tov)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale_Tov)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
    .datum(dataset1_Tov) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line1); // 11. Calls the line generator 

    svg.append("path")
    .datum(dataset2_Tov) // 10. Binds data to the line 
    .attr("class", "line1") // Assign a class for styling 
    .attr("d", line2); // 11. Calls the line generator 

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

    svg.append("line")
    .style("stroke", "black")
    .attr("id", "turnover_line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height)
    .attr("opacity", 0.8);

    svg.append("circle")
    .attr("id", "tov_circle_green")
    .attr("r", 7)
    .style("stroke", "rgb(44, 160, 44)")
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "1");


    svg.append("circle")
    .attr("id", "tov_circle_blue")
    .attr("r", 7)
    .style("stroke", "rgb(31, 119, 180)")
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "1");
}

function drawChartLos(data){
    $("#len_stay").empty();

    var timeframe = [];
    var dataframe = [];
    var averageframe = [];
    for (var i = 0; i < data.length; i ++){
        let time_chart = moment(data[i]["time"], "YYYY-MM-DD hh:mm:ss");
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
    var n = data.length;

    // 5. X scale will use the index of our data
    xScale_Los = d3.scaleTime()
    .domain(d3.extent(timeframe, function(d) { return d; })) // input
    .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    yScale_Los = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(dataframe) / 100) * 100]) // input 
    .range([height, 0]); // output

    function make_y_gridlines() {
        return d3.axisLeft(yScale_Los)
            .ticks(4)
    }

    // 7. d3's line generator
    var line1 = d3.line()
    .x(function(d, i) { return xScale_Los(d.x); }) // set the x values for the line generator
    .y(function(d) { return yScale_Los(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line2 = d3.line()
    .x(function(d, i) { return xScale_Los(d.x); }) // set the x values for the line generator
    .y(function(d) { return yScale_Los(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    dataset1_Los = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": dataframe[i] } });
    dataset2_Los = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": averageframe[i] } });

    bisect_Los = d3.bisector(function(d) { return d.x}).left;

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select("#len_stay").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_Los)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale_Los).ticks(4)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
    .datum(dataset1_Los) // 10. Binds data to the line 
    .attr("class", "line1") // Assign a class for styling 
    .attr("d", line1); // 11. Calls the line generator

    svg.append("path")
    .datum(dataset2_Los) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line2); // 11. Calls the line generator

    svg.append("text")
    .attr("x", width / 2 - 100)
    .attr("y", -20)
    .text("LENGTH OF STAY (HOURS)")

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

    svg.append("line")
    .style("stroke", "black")
    .attr("id", "los_line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height)
    .attr("opacity", 0.8);

    svg.append("circle")
    .attr("id", "los_circle_green")
    .attr("r", 7)
    .style("stroke", "rgb(44, 160, 44)")
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "1");


    svg.append("circle")
    .attr("id", "los_circle_blue")
    .attr("r", 7)
    .style("stroke", "rgb(31, 119, 180)")
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "1");
}