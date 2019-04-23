(function(){
    var data = {
        "tagStats": {
            "number_of_patients": [{
                    "stat_type": "No of patients",
                    "number of Patients": 100,
                    "time": "01/01/2019 10:00",
                    "stat_level": "Normal"
                },
                {
                    "stat_type": "No of patients",
                    "number of Patients": 120,
                    "time": "01/01/2019 11:00",
                    "stat_level": "Normal"
                },
                {
                    "stat_type": "No of patients",
                    "number of Patients": 150,
                    "time": "01/01/2019 12:00",
                    "stat_level": "Normal"
                }
            ],
            "bed_turn_over": [{
                    "stat_type": "Bed Turn over",
                    "bed_turn_over": 22,
                    "time": "01/01/2019 10:00",
                    "stat_level": "Normal"
                },
                {
                    "stat_type": "Bed Turn over",
                    "bed_turn_over": 32,
                    "time": "01/01/2019 11:00",
                    "stat_level": "High"
                },
                {
                    "stat_type": "Bed Turn over",
                    "bed_turn_over": 43,
                    "time": "01/01/2019 12:00",
                    "stat_level": "High"
                }
            ],
            "length_of_stay": [{
                    "stat_type": "Length of stay",
                    "length_of_stay": 321,
                    "time": "01/01/2019 10:00",
                    "stat_level": "Normal"
                },
                {
                    "stat_type": "Length of stay",
                    "length_of_stay": 352,
                    "time": "01/01/2019 11:00",
                    "stat_level": "High"
                },
                {
                    "stat_type": "Length of stay",
                    "length_of_stay": 43,
                    "time": "01/01/2019 12:00",
                    "stat_level": "High"
                }
            ]
        }
    };
    console.log(data.tagStats);
    // 2. Use the margin convention practice 
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = window.innerWidth - margin.left - margin.right - 10 // Use the window's width 
    , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

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

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } });
    var dataset1 = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } });

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select("#chart").append("svg")
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
})();