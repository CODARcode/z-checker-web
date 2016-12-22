$("#run").on("click", function() {
  $("#menu").html("");
  $("#report").html("");
  
  d3.text("/static-hacc/rate-distortion_zz.txt", function(text){
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
});
