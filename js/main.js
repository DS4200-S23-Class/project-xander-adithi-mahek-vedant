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
  console.log(data);

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
    .attr("transform", "translate(" + (MARGINS.left + AXIS_MARGINS.left) + "," + (VIS_HEIGHT + MARGINS.top) + ")")
    .call(d3.axisBottom(X_SCALE).ticks(10))
    .attr("font-size", "20px");

  // make y axis
  FRAME2.append("g")
    .attr("transform", "translate(" + (MARGINS.left + AXIS_MARGINS.left) + "," + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE).ticks(10))
    .attr("font-size", "20px");

// Add X axis label:
FRAME2.append("text")
  .attr("text-anchor", "end")
  .attr("x", FRAME_WIDTH / 2 + 150)
  .attr("y", FRAME_HEIGHT - 20)
  .text("Finish Time (in Minutes)")
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
    .attr("transform", function(d) { return "translate(" + AXIS_MARGINS.left + "," + (Y_SCALE(d.length) + MARGINS.bottom) + ")"; })
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

  // Highlight Mean, Median, Quartiles on Histogram when Selected on Box and Whisker Plot as the interaction

});  

d3.csv("data/box_plot_data.csv").then((data) => {
  // var y = d3.scaleLinear()
  // .domain([min,max])
  // .range([height, 0]);

  // // make y axis
  // FRAME1.append("g")
  // .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
  // .call(d3.axisLeft(y).ticks(10))
  // .attr("font-size", "20px");

  var margin = {top: 10, right: 30, bottom: 30, left: 80},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // would be read from the user input button
  const ageGroup = "F 01-19";

  for (var i = 0; i < data.length; i++) {
    if(data[i].Group == ageGroup) {
      min = data[i].Min;
      max = data[i].Max;
      median = data[i].Median;
      q3 = data[i].Upper_Quartile;
      q1 = data[i].Lower_Quartile;
      console.log(min);
    }
  }
  
// Show the Y scale
var y = d3.scaleLinear()
  .domain([0,20])
  .range([height, 0]);
FRAME1.call(d3.axisLeft(y));
console.log(min);
console.log(max);

// a few features for the box
var center = 200
var width = 100

// Show the main vertical line
FRAME1
  .append("line")
  .attr("x1", center)
  .attr("x2", center)
  .attr("y1", y(min))
  .attr("y2", y(max))
  .attr("stroke", "black")

  // Show the box
FRAME1
.append("rect")
  .attr("x", center - width/2)
  .attr("y", y(q3) )
  .attr("height", (y(q1)-y(q3)) )
  .attr("width", width )
  .attr("stroke", "black")
  .style("fill", "#69b3a2")

  // show median, min and max horizontal lines
FRAME1
.selectAll("toto")
.data([min, median, max])
.enter()
.append("line")
  .attr("x1", center-width/2)
  .attr("x2", center+width/2)
  .attr("y1", function(d){ return(y(d))} )
  .attr("y2", function(d){ return(y(d))} )
  .attr("stroke", "black")

  //https://d3-graph-gallery.com/graph/boxplot_horizontal.html

});






