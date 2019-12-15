  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var z = d3.scale.category10();

var svg = d3.select("#scatter_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("mobile_10mins_valueonly.csv", function(error, data) {
  if (error) throw error;

  // Compute the series names ("y1", "y2", etc.) from the loaded CSV.
  var seriesNames = d3.keys(data[0])
      .filter(function(d) { return d !== "x"; })
      .sort();

  // Map the data to an array of arrays of {x, y} tuples.
  var series = seriesNames.map(function(series) {
    return data.map(function(d) {
      return {x: +d.x, y: +d[series]};
    });
  });

  // Compute the scales’ domains.
  x.domain(d3.extent(d3.merge(series), function(d) { return d.x; })).nice();
  y.domain(d3.extent(d3.merge(series), function(d) { return d.y; })).nice();

  // Add the x-axis.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));

  // Add the y-axis.
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));

  // Add the points!
  svg.selectAll(".series")
      .data(series)
    .enter().append("g")
      .attr("class", "series")
      .style("fill", function(d, i) { return z(i); })
    .selectAll(".point")
      .data(function(d) { return d; })
    .enter().append("circle")
      .attr("class", "point")
      .attr("r", 4.5)
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); });
});