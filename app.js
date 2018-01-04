var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
var url = "https://raw.githubusercontent.com/jeffreycoen/Data_Journalism/master/Assets/js/data.csv"
d3.csv(url, function(err, data) {
  if (err) throw err;
console.log(data)
  data.forEach(function(data) {
    data.physicalActivity = +data.physicalActivity;
    data.percentPoverty = +data.percentPoverty;
  });


  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([20, d3.max(data, function(data) {
    return +data.physicalActivity;
  })]);
  yLinearScale.domain([0, d3.max(data, function(data) {
    return +data.percentPoverty * 1.2;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var stateName = data.locatDesc;
      var activityLevel = +data.physicalActivity;
      var povertyLevel = +data.percentPoverty;
      return (stateName + "<br> % Exercise: " + activityLevel + "<br> % Poverty: " + povertyLevel);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.physicalActivity);
        return xLinearScale(data.physicalActivity);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.percentPoverty);
      })
      .attr("r", "15")
      .attr("fill", "pink")
      .on("click", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% of Persons Below Poverty Line");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("% of Persons Who Exercised in Previous Month");
});