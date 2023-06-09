// Constants for the visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 700;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };
const AXIS_MARGINS = { left: 50, top: 50 };
const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom + AXIS_MARGINS.top);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right + AXIS_MARGINS.left);
const BOX_WIDTH = 200;
const CENTER = 250;

d3.csv("data/filtered_marathon_data.csv").then((data) => {
  // Print at least 10 lines of data to the console (here we are printing the entire data set)
  console.log(data);

  // function to draw the box plot with the given inputs
  function drawPlot() {

    // Removing old graphs to show new visualizations
      d3.select('#svg1').remove();
      d3.select('#tooltip1').remove();
      d3.select('#svg2').remove();
      d3.select('#tooltip2').remove();
      d3.select('#warning')
        .html("You can click on the box in the left visualization to highlight the median in the right visualization");

    // --------------------------  CREATING VIS1 -------------------------- //

    // Create new svg in vis1 div
    const FRAME1 = d3.select("#vis1")
      .append("svg")
      .attr("id", "svg1")
      .attr("height", FRAME_HEIGHT)
      .attr("width", FRAME_WIDTH)
      .attr("class", "frame");

    // Get the sex-age-group category from the user input on the page
    let sex = document.getElementById("sex").value;
    let age = document.getElementById("age").value;
    let group = sex + " " + age;

    // filters the data and gets the necessary info to create box plot
    const filteredData = data.filter(record => record.Category == group);
    const filteredMins = filteredData.map(record => record.Time_Mins);
    let min = d3.quantile(filteredMins, 0)/26.2;
    let q1 = d3.quantile(filteredMins, 0.25)/26.2;
    let med = d3.quantile(filteredMins, 0.5)/26.2;
    let q3 = d3.quantile(filteredMins, 0.75)/26.2;
    let max = d3.quantile(filteredMins, 1)/26.2;

    // Y scale
    const Y = d3.scaleLinear()
      .domain([min, max])
      .range([VIS_HEIGHT, 0]);

    // Add Y axis ticks and labels
    let AXISLEFT = d3.axisLeft(Y);
    FRAME1.append("g")
      .attr("transform", "translate(50,0)")
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
      .style("fill", "cyan")
      .attr("class", "box");

    // Median, minimum, and maximum
    FRAME1
      .selectAll("toto")
      .data([min, med, max])
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

    // --------------------------  CREATING VIS2 -------------------------- //

    // Create svg in vis2 div
    const FRAME2 = d3.select("#vis2")
      .append("svg")
      .attr("id", "svg2")
      .attr("height", FRAME_HEIGHT)
      .attr("width", FRAME_WIDTH)
      .attr("class", "frame");

    // Defines the X axis
    const MAX_X = d3.max(data, (d) => { return parseFloat(d.Time_Mins); });
    const X_SCALE = d3.scaleLinear()
      .domain([0, MAX_X])
      .range([0, VIS_WIDTH]);

    // Get the bins from the histogram to get the Y axis
    const histogram = d3.histogram()
      .value(function (d) { return parseFloat(d.Time_Mins); })
      .domain(X_SCALE.domain())
      .thresholds(X_SCALE.ticks(70));
    const bins = histogram(data);

    // Defines the Y axis using the bins
    const MAX_Y = d3.max(bins, function (d) { return d.length; });
    const Y_SCALE = d3.scaleLinear()
      .domain([0, MAX_Y])
      .range([VIS_HEIGHT, 0]);

    // Make x axis
    FRAME2.append("g")
      .attr("transform", "translate(" + (MARGINS.left + AXIS_MARGINS.left) + "," + (VIS_HEIGHT + MARGINS.top) + ")")
      .call(d3.axisBottom(X_SCALE).ticks(10))
      .attr("font-size", "15px");

    // Make y axis
    FRAME2.append("g")
      .attr("transform", "translate(" + (MARGINS.left + AXIS_MARGINS.left) + "," + MARGINS.top + ")")
      .call(d3.axisLeft(Y_SCALE).ticks(10))
      .attr("font-size", "15px");

    // Add X axis label:
    FRAME2.append("text")
      .attr("text-anchor", "end")
      .attr("x", FRAME_WIDTH / 2 + 150)
      .attr("y", FRAME_HEIGHT - 20)
      .text("Finish Time (mins)")
      .attr("font-size", "15px");

    // Add Y axis label:
    FRAME2.append("text")
      .attr("text-anchor", "end")
      .attr("x", -FRAME_HEIGHT / 2 + AXIS_MARGINS.left)
      .attr("y", AXIS_MARGINS.top)
      .attr("transform", "rotate(-90)")
      .text("# Of Participants")
      .attr("font-size", "15px");

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

    // --------------------------  CREATING TOOLTIPS -------------------------- //

    const TOOLTIP1 = d3.select("#vis1")
      .append("div")
      .attr("id", "tooltip1")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const TOOLTIP2 = d3.select("#vis2")
      .append("div")
      .attr("id", "tooltip2")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Shows the tooltip 
    function hoverToolTip1() {
      TOOLTIP1.style("opacity", 1);
    }
    function hoverToolTip2() {
      TOOLTIP2.style("opacity", 1);
    }

    // Hides the tooltip 
    function mouseOutToolTip1() {
      TOOLTIP1.style("opacity", 0);
    }
    function mouseOutToolTip2() {
      TOOLTIP2.style("opacity", 0);
    }

    // Moves the tooltip
    function moveToolTip1(event, d) {
      // Round to 2 decimal places
      TOOLTIP1.html(
        "Min:" + (Math.round(min * 100) / 100) + "<br>" +
        "Lower Quartile:" + (Math.round(q1 * 100) / 100) + "<br>" +
        "Median:" + (Math.round(med * 100) / 100) + "<br>" +
        "Upper Quartile:" + (Math.round(q3 * 100) / 100) + "<br>" +
        "Max:" + (Math.round(max * 100) / 100))
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 50) + "px");
    }
    function moveToolTip2(event, d) {
      TOOLTIP2.html("Minutes " + d.x0 + "<br># of Runners: " + d.length)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 50) + "px");
    }

    // Event listeners for the tooltip
    d3.selectAll(".box")
      .on("mouseover", hoverToolTip1)
      .on("mouseleave", mouseOutToolTip1)
      .on("mousemove", moveToolTip1);
    d3.selectAll(".bar")
      .on("mouseover", hoverToolTip2)
      .on("mouseleave", mouseOutToolTip2)
      .on("mousemove", moveToolTip2);

    // --------------------------  CONNECTING GRAPHS -------------------------- //
    
    // Function to Highlight the median of the Vis1 on Vis2
    function connectGraphs(median) {
      console.log("called");
      let bars = FRAME2.selectAll(".bar");
      let prevMedian = FRAME2.select(".median");
      const finishTime = median*26.2;
      const upperBin = 5*(Math.ceil(Math.abs(finishTime/5)));
      const lowerBin = 5*(Math.floor(Math.abs(finishTime/5)));
      const medianBin = bars.filter(bin => (bin.x0 == lowerBin && bin.x1 == upperBin));
      prevMedian.classed("median", false);
      medianBin.classed("median", true);
    }

    d3.select(".box").on("click", function() {
      connectGraphs(med);});
  }

  // Event listener for changing vis1 upon clicking submit
  d3.selectAll("#submit").on("click", drawPlot);
});