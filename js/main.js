// Constants for the visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 800;
const MARGINS = {left:50, right:50, top:50, bottom:50};
const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right);

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

d3.csv("data/full_marathon_2008_2021.csv").then((data) => {

    // box and whisker type visual 

// function to determine the average pace for an age group (go through all people in each age group and avg)
function determineAverage(ageGroup) {   
     for (const row of data) {
        // M 30-34
        row[16]
        if (row[16])

     }


}

// function to determine the min pace for an age group

// function to determine the max pace for an age group

  // Creates the X axis
  const MAX_X = d3.max(data, (d) => {return parseFloat(d.Time_Mins); });
  const X_SCALE = d3.scaleLinear()
    .domain([0, MAX_X])
    .range([0, VIS_WIDTH]);

  // Get the bins from the histogram to get the Y axis
  const histogram = d3.histogram()
  .value(function(d) { return parseFloat(d.Time_Mins); })   // I need to give the vector of value
  .domain(MAX_X.domain())  // then the domain of the graphic
  .thresholds(MAX_X.ticks(70)); // then the numbers of bins
  const bins = histogram(data);

  // Creates the Y axis
  const MAX_Y = d3.max(bins, function(d) { return d.length; });
  const Y_SCALE = d3.scaleLinear()
    .domain([0, MAX_Y])
    .range([VIS_HEIGHT, 0]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(X_SCALE))
    .call(d3.axisLeft(Y_SCALE));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
  .data(bins)
  .enter()
  .append("rect")
    .attr("x", 1)
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    .attr("height", function(d) { return height - y(d.length); })
    .style("fill", "#69b3a2")

})



