$("#run").on("click", function() {
  $("#menu").html("");
  $("#report").html("");

  d3.text("/static/rate-distortion_CLDLOW.txt", function(text){
    var psv = d3.dsvFormat(" ");
    var data = psv.parse(text);
    var data1 = {sz: [], zfp: []}; // TODO

    data.forEach(function(d) {
      d.ratedistortion = +d.ratedistortion;
      d.sz = +d.sz;
      d.zfp = +d.zfp;

      data1.sz.push([d.ratedistortion, d.sz]);
      data1.zfp.push([d.ratedistortion, d.zfp]);
    });

    updateRateDistortion("Rate Distortion", "rateDistortion", data1);
  });

  /*
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
  */
});
