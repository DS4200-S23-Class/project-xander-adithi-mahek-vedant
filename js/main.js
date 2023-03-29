// Constants for the visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 700;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };
const AXIS_MARGINS = { left: 50, top: 50 };
const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom + AXIS_MARGINS.top);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right + AXIS_MARGINS.left);


// Reading a csv with a table of summary statistics for each sex-age-group category calculated
d3.csv("data/box_plot_data_updated.csv").then((data) => {

  // Create first instance of an svg in vis1 div
  const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

  const BOX_WIDTH = 200;
  const CENTER = 250;

  // function to add new point to the scatter
  function drawPlot() {
    // Removes existing visualization in #vis1
    d3.select('svg').remove();

    // Create new svg in vis1 div
    const FRAME1 = d3.select("#vis1")
      .append("svg")
      .attr("height", FRAME_HEIGHT)
      .attr("width", FRAME_WIDTH)
      .attr("class", "frame");

    // Get the sex-age-group category from the user input on the page
    let sex = document.getElementById("sex").value;
    let age = document.getElementById("age").value;
    let group = sex + " " + age;
    // Iterate through the table to retrieve all of the needed values
    for (let i = 0; i < data.length; i++) {
      if (data[i].Group == group) {
        min = data[i].Min;
        max = data[i].Max;
        median = data[i].Median;
        // upper quartile
        q3 = data[i].Upper_Quartile;
        // lower quartile
        q1 = data[i].Lower_Quartile;
      }
    }

    // Y scale
    const Y = d3.scaleLinear()
      .domain([min, max])
      .range([VIS_HEIGHT, 0]);

    // Add Y axis ticks and labels
    let AXIS = FRAME1.append("g")
      .attr("transform", "translate(50,0)");
    let AXISLEFT = d3.axisLeft(Y);
    AXIS.append("g")
      .call(AXISLEFT);

    // Vertical line
    FRAME1
      .append("line")
      .attr("x1", CENTER)
      .attr("x2", CENTER)
      .attr("y1", Y(min))
      .attr("y2", Y(max))
      .attr("stroke", "black");

    // Box with the quartiles
    FRAME1
      .append("rect")
      .attr("x", CENTER - BOX_WIDTH / 2)
      .attr("y", Y(q3))
      .attr("height", (Y(q1) - Y(q3)))
      .attr("width", BOX_WIDTH)
      .attr("stroke", "black")
      .style("fill", "#90eeec")
      .attr("class", "box");

    // Median, minimum, and maximum
    FRAME1
      .selectAll("toto")
      .data([min, median, max])
      .enter()
      .append("line")
      .attr("x1", CENTER - BOX_WIDTH / 2)
      .attr("x2", CENTER + BOX_WIDTH / 2)
      .attr("y1", function (d) { return (Y(d)) })
      .attr("y2", function (d) { return (Y(d)) })
      .attr("stroke", "black");

    // Add Y axis label
    FRAME1.append("text")
      .attr("text-anchor", "end")
      .attr("x", -FRAME_HEIGHT / 2 + AXIS_MARGINS.left + 70)
      .attr("y", AXIS_MARGINS.top - 40)
      .attr("transform", "rotate(-90)")
      .text("Average pace (mins)")
      .attr("font-size", "15px");

    // ToolTip
    const TOOLTIP = d3.select("#vis1")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Shows the tooltip 
    function hoverToolTip() {
      TOOLTIP.style("opacity", 1);
    }

    // Hides the tooltip 
    function mouseOutToolTip() {
      TOOLTIP.style("opacity", 0);
    }

    // Moves the tooltip
    function moveToolTip(event, d) {
      // Round to 2 decimal places
      TOOLTIP.html("Median:" + (Math.round(median * 100) / 100) + "  " +
        "Min:" + (Math.round(min * 100) / 100) + "  " +
        "Max:" + (Math.round(max * 100) / 100) + "  " +
        "Lower Quartile:" + (Math.round(q1 * 100) / 100) + "  " +
        "Upper Quartile:" + (Math.round(q3 * 100) / 100))
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 50) + "px");
    }

    // Event listeners for the tooltip
    d3.selectAll(".box")
      .on("mouseover", hoverToolTip)
      .on("mouseleave", mouseOutToolTip)
      .on("mousemove", moveToolTip);
  }

  // Event listener for adding and clicking the points in vis1
  d3.selectAll("#submit").on("click", drawPlot);

});


d3.csv("data/filtered_marathon_data.csv").then((data) => {

  // Create svg in vis2 div
  const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

  // Print at least 10 lines of data to the console (here we are printing the entire data set)
  console.log(data);

  // Defines the X axis
  const MAX_X = d3.max(data, (d) => { return parseFloat(d.Time_Mins); });
  const X_SCALE = d3.scaleLinear()
    .domain([0, MAX_X])
    .range([0, VIS_WIDTH]);

  // Get the bins from the histogram to get the Y axis
  const histogram = d3.histogram()
    .value(function (d) { return parseFloat(d.Time_Mins); })   // I need to give the vector of value
    .domain(X_SCALE.domain())  // then the domain of the graphic
    .thresholds(X_SCALE.ticks(70)); // then the numbers of bins
  const bins = histogram(data);

  // Defines the Y axis
  const MAX_Y = d3.max(bins, function (d) { return d.length; });
  const Y_SCALE = d3.scaleLinear()
    .domain([0, MAX_Y])
    .range([VIS_HEIGHT, 0]);

  // Make x axis
  FRAME2.append("g")
    .attr("transform", "translate(" + (MARGINS.left + AXIS_MARGINS.left) + "," + (VIS_HEIGHT + MARGINS.top) + ")")
    .call(d3.axisBottom(X_SCALE).ticks(10))
    .attr("font-size", "20px");

  // Make y axis
  FRAME2.append("g")
    .attr("transform", "translate(" + (MARGINS.left + AXIS_MARGINS.left) + "," + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE).ticks(10))
    .attr("font-size", "20px");

  // Add X axis label:
  FRAME2.append("text")
    .attr("text-anchor", "end")
    .attr("x", FRAME_WIDTH / 2 + 150)
    .attr("y", FRAME_HEIGHT - 20)
    .text("Finish Time (mins)")
    .attr("font-size", "20px");

  // Add Y axis label:
  FRAME2.append("text")
    .attr("text-anchor", "end")
    .attr("x", -FRAME_HEIGHT / 2 + AXIS_MARGINS.left)
    .attr("y", AXIS_MARGINS.top)
    .attr("transform", "rotate(-90)")
    .text("# Of Participants")
    .attr("font-size", "20px");

  // Append the bar rectangles to the Graph
  FRAME2.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", d => { return X_SCALE(d.x0) + MARGINS.left; })
    .attr("transform", function (d) { return "translate(" + AXIS_MARGINS.left + "," + (Y_SCALE(d.length) + MARGINS.bottom) + ")"; })
    .attr("width", function (d) { return X_SCALE(d.x1) - X_SCALE(d.x0) - 1; })
    .attr("height", function (d) { return VIS_HEIGHT - Y_SCALE(d.length); })
    .attr("class", "bar");

  // ToolTip
  const TOOLTIP = d3.select("#vis2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Shows the tooltip 
  function hoverToolTip() {
    TOOLTIP.style("opacity", 1);
  }

  // Hides the tooltip 
  function mouseOutToolTip() {
    TOOLTIP.style("opacity", 0);
  }

  // Moves the tooltip
  function moveToolTip(event, d) {
    TOOLTIP.html("Minutes " + d.x0 + "<br># of Runners: " + d.length)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 50) + "px");
  }

  // Event listeners for the tooltip
  d3.selectAll(".bar")
    .on("mouseover", hoverToolTip)
    .on("mouseleave", mouseOutToolTip)
    .on("mousemove", moveToolTip);
});







