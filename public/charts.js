$("#requestProperties").on("click", function() {
  d3.json("/query", function(d) {
    console.log(d);
    updateProperties(d.properties);
    updateFFTAmp(d.fftAmp);
    updateAutoCorr(d.autoCorr);
  });
});

function updateProperties(data) {
  $("#dataProperties").html("<table id='dataPropertyTable'><thead><th>Property</th><th>Value</th></thead></table>");
  var table = $("#dataPropertyTable");
  for (var key in data) {
    table.append("<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>");
  }
}

function updateFFTAmp(data) {
  const W = 800, H = 150;
  const margin = {top: 10, right: 20, bottom: 25, left: 50},
        width = W - margin.left - margin.right,
        height = H - margin.top - margin.bottom;

  $("#fftAmpChart").html("");
  var svg = d3.select("#fftAmpChart")
    .append("svg")
    .attr("class", "svg")
    .attr("width", W)
    .attr("height", H)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain(d3.extent(data, function(d) {return d[0];}));
  var yLog = d3.scaleLog()
    .clamp(true)
    .rangeRound([height, 0])
    .nice()
    .domain([0.000001, d3.max(data, function(d) {return d[1];})]);
  var yLinear = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain(d3.extent(data, function(d) {return d[1];}));

  var useLogScale = true;
  var y = useLogScale ? yLog : yLinear;

  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);

  svg.append("g")
    .attr("class", "axis-x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "axis-y")
    .call(yAxis)
    .append("text")
    .attr("x", 60)
    .attr("dy", "0.71em")
    .style("text-anchor", "begin")
    .text("fftAmp");

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "steelblue")
    .attr("class", "bar")
    .attr("x", function(d) {return x(d[0]);})
    .attr("y", function(d) {return y(d[1]);})
    .attr("width", 4)
    .attr("height", function(d) {return height - y(d[1]);});

  svg.on("click", function() {
    toggleLogScale();
  });
 
  function toggleLogScale() {
    var y = useLogScale ? yLog : yLinear;
    svg.selectAll(".bar")
      .data(data)
      .transition().delay(100).duration(100)
      .attr("y", function(d) {return y(d[1]);})
      .attr("height", function(d) {return height - y(d[1]);});
    svg.select(".axis-y")
      .transition().delay(100).duration(100)
      .call(yAxis.scale(y));
    useLogScale = !useLogScale;
  }
}

function updateAutoCorr(data) {
  const W = 800, H = 150;
  const margin = {top: 10, right: 20, bottom: 25, left: 50},
        width = W - margin.left - margin.right,
        height = H - margin.top - margin.bottom;

  $("#autoCorrChart").html("");
  var svg = d3.select("#autoCorrChart")
    .append("svg")
    .attr("class", "svg")
    .attr("width", W)
    .attr("height", H)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .rangeRound([0, width])
    .domain(d3.extent(data, function(d) {return d[0];}));
  var y = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain(d3.extent(data, function(d) {return d[1];}));

  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);
  
  svg.append("g")
    .attr("class", "axis x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "axis y")
    .call(yAxis)
    .append("text")
    .attr("x", 60)
    .attr("dy", "0.71em")
    .style("text-anchor", "begin")
    .text("autocoor");

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "steelblue")
    .attr("class", "bar")
    .attr("x", function(d) {return x(d[0]);})
    .attr("y", function(d) {return y(d[1]);})
    .attr("width", 4)
    .attr("height", function(d) {return height - y(d[1]);});
}
