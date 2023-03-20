// Constants for the visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 800;
const MARGINS = {left:50, right:50, top:50, bottom:50};
const AXIS_MARGINS = {left: 50, top: 50};
const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom + AXIS_MARGINS.top);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right + AXIS_MARGINS.left);

// create svg in vis1 div
const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// create svg in vis2 div
const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

d3.csv("data/filtered_marathon_data.csv").then((data) => {
  // Defines the X axis
  const MAX_X = d3.max(data, (d) => {return parseFloat(d.Time_Mins); });
  const MIN_X = d3.min(data, (d) => {return parseFloat(d.Time_Mins); });
  const X_SCALE = d3.scaleLinear()
    .domain([0, MAX_X])
    .range([0, VIS_WIDTH]);

  // Get the bins from the histogram to get the Y axis
  const histogram = d3.histogram()
  .value(function(d) { return parseFloat(d.Time_Mins); })   // I need to give the vector of value
  .domain(X_SCALE.domain())  // then the domain of the graphic
  .thresholds(X_SCALE.ticks(70)); // then the numbers of bins
  const bins = histogram(data);

  // Defines the Y axis
  const MAX_Y = d3.max(bins, function(d) { return d.length; });
  const Y_SCALE = d3.scaleLinear()
    .domain([0, MAX_Y])
    .range([VIS_HEIGHT, 0]);

  // make x axis
  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
    .call(d3.axisBottom(X_SCALE).ticks(10))
    .attr("font-size", "20px");

  // make y axis
  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE).ticks(8))
    .attr("font-size", "20px");

  // create svg element, respecting margins
FRAME2
.append("svg")
  .attr("width", VIS_WIDTH + MARGINS.left + MARGINS.right)
  .attr("height", VIS_HEIGHT + MARGINS.top + MARGINS.bottom)
.append("g")
  .attr("transform",
        "translate(" + MARGINS.left + "," + MARGINS.top + ")");

// Add X axis label:
FRAME2.append("text")
  .attr("text-anchor", "end")
  .attr("x", FRAME_WIDTH / 2 + 150)
  .attr("y", FRAME_HEIGHT - 20)
  .text("TIME TO COMPLETE THE RACE (in Minutes)");

// // Y axis label:
// FRAME2.append("text")
//   .attr("text-anchor", "end")
//   .attr("x", AXIS_MARGINS.left)
//   .attr("y", AXIS_MARGINS.top)
//   .attr("transform", "rotate(-90)")
//   .text("Y axis title")







  // Append the bar rectangles to the Graph
  FRAME2.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", d => { return X_SCALE(d.x0) + MARGINS.left; })
    .attr("transform", function(d) { return "translate(" + 0 + "," + (Y_SCALE(d.length) + MARGINS.bottom) + ")"; })
    .attr("width", function(d) { return X_SCALE(d.x1) - X_SCALE(d.x0) -1 ; })
    .attr("height", function(d) { return VIS_HEIGHT - Y_SCALE(d.length); })
    .attr("class", "bar");

  // ToolTip
  const TOOLTIP = d3.select("#vis2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Shows the tooltip 
  function hoverToolTip(){
    TOOLTIP.style("opacity", 1);
  }

  // Hides the tooltip 
  function mouseOutToolTip(){
    TOOLTIP.style("opacity", 0);
  }

  // Moves the tooltip
  function moveToolTip(event, d){
    TOOLTIP.html("Minutes " + d.x0 + "<br># of Runners: " + d.length)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 50) + "px");
  }

  // Event listeners for the tooltip
  d3.selectAll(".bar")
    .on("mouseover", hoverToolTip)
    .on("mouseleave", mouseOutToolTip)
    .on("mousemove", moveToolTip);

  // Highlight Mean, Median, Quartiles on Histogram when Selected on Box and Whisker Plot

});  






