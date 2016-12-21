$(document).ready(function() {
});

$("#run").on("click", function() {
  $("#menu").html("");
  $("#report").html("");

  d3.json("/ec", function(d) {
    createTable("Data Properties", "dp", d.properties);
    updateFFTAmp("Data FFT", "fft", d.fftAmp);
    updateAutoCorr("Data Autocorrelation", "autocorr", d.autoCorr);
  });

  d3.json("/sz", function(d) {
    createTable("SZ Report", "sz", d.compare);
    updateDistribution("SZ Distribution", "sz-dis", d.dis);
  });
  
  d3.json("/zfp", function(d) {
    createTable("ZFP Report", "sz", d.compare);
    updateDistribution("ZFP Distribution", "sz-dis", d.dis);
  });
});
