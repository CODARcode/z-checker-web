function updateProperties(data) {
  $("#dataProperties").html("<table class='table table-striped table-bordered table-hover table-condensed' id='dataPropertyTable'><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody></tbody></table>");
  var table = $("#dataPropertyTable tbody");
  for (var key in data) {
    table.append("<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>");
  }
}

function updateComparison(data) {
  $("#comparison").html("<table class='table table-striped table-bordered table-hover table-condensed' id='dataPropertyTable'><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody></tbody></table>");
  var table = $("#comparison tbody");
  for (var key in data) {
    table.append("<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>");
  }
}

function updateFFTAmp(data) {
  data.forEach(function(d) {
    if (d[1] < 0.0001) d[1] = 0.0001;
  });

  var json = {
    title: {text: "FFT Amplitude"},
    xAxis: {
      tickInterval: 1
    },
    yAxis: {
      title: { text: "amplitude" },
      min: 0.0001, // avoid zero
      type: "logarithmic",
    },
    series: [{
      name: "FFTAmp",
      data: data
    }],
    credits: {enabled: false}
  }
  
  $("#fftAmpChart").highcharts(json);
}

function updateAutoCorr(data) {
  var json = {
    title: {text: "Autocorrelation"},
    xAxis: { 
    },
    yAxis: {
      title: { text: "amplitude" }
    },
    series: [{
      name: "autocorr",
      data: data
    }],
    credits: {enabled: false}
  }
  
  $("#autoCorrChart").highcharts(json);
}

function updateDis(data) {
  var d0 = [], d1 = [];
  data.forEach(function(d) {
    d0.push(d[0]);
    d1.push(d[1]);
  });

  var json = {
    title: {text: "Dis"},
    xAxis: { 
    },
    yAxis: {
      title: { text: "dis" }
    },
    series: [
      {name: "d0", data: d0}, 
      {name: "d1", data: d1}
    ],
    credits: {enabled: false}
  }
  
  $("#disChart").highcharts(json);
}
