$(document).ready(function() {
// $("#requestProperties").on("click", function() {
  d3.json("/ec", function(d) {
    updateProperties(d.properties);
    updateFFTAmp(d.fftAmp);
    updateAutoCorr(d.autoCorr);
  });

  d3.json("/sz", function(d) {
    updateComparison(d.compare);
    updateDis(d.dis);
  });
});

