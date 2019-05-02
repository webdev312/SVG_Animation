function losChart(strID){
    // 2. Use the margin convention practice 
    var margin = {top: 50, right: 70, bottom: 50, left: 70}
    , width = window.innerWidth / 100 * 40 - margin.left - margin.right - 20 // Use the window's width 
    , height = window.innerWidth / 100 * 20 - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    var n = 21;

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
    .domain([0, 1]) // input 
    .range([height, 0]); // output 

    // 7. d3's line generator
    var line1 = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line2 = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .ticks(4)
    }

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } });
    var dataset1 = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } });

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select("#" + strID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line1); // 11. Calls the line generator 

    svg.append("path")
    .datum(dataset1) // 10. Binds data to the line 
    .attr("class", "line1") // Assign a class for styling 
    .attr("d", line2); // 11. Calls the line generator 

    svg.append("text")
    .attr("x", width / 2 - 100)
    .attr("y", -20)
    .text("ROOM TURNOVER TIME")

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
  		.style("stroke-dasharray",("3,3"))
  		.call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )
}

function drawChartLos(data){
    var timeframe = [];
    var dataframe = [];
    for (var i = 0; i < data.length; i ++){
        timeframe[i] = data[i].hour;
        dataframe[i] = data[i].length_of_stay;
    }
    
    // 2. Use the margin convention practice 
    var margin = {top: 50, right: 70, bottom: 50, left: 70}
    , width = window.innerWidth / 100 * 40 - margin.left - margin.right - 20 // Use the window's width 
    , height = window.innerWidth / 100 * 20 - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    var n = data.length;

    // 5. X scale will use the index of our data
    var xScale = d3.scalePoint()
    .domain(timeframe) // input
    .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(dataframe) / 100) * 100]) // input 
    .range([height, 0]); // output

    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .ticks(4)
    }

    // 7. d3's line generator
    var line1 = d3.line()
    .x(function(d, i) { return xScale(d.x); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var dataset = d3.range(n).map(function(d, i) { return {"x": timeframe[i], "y": dataframe[i] } });

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
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale).ticks(4)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line1); // 11. Calls the line generator 

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
  		.style("stroke-dasharray",("3,3"))
  		.call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )
}

(function(){
    losChart("turn_time");
})();