$(document).ready(function() {
// $("#requestProperties").on("click", function() {
  d3.json("/ec", function(d) {
    console.log(d);
    updateProperties(d.properties);
    // var fftChart = new chart("fft");
    // var autoCorr = new chart("autocorr");
    updateFFTAmp(d.fftAmp);
    updateAutoCorr(d.autoCorr);
  });
});

