const ini = require("ini");
const parseCSVSync = require('csv-parse/lib/sync');

module.exports = {
  parseDataProperties: function(d) {
    var p = ini.decode(d).PROPERTY;
    p.dataType = parseInt(p.dataType);
    p.r1 = parseInt(p.r1);
    p.r2 = parseInt(p.r2);
    p.r3 = parseInt(p.r3);
    p.r4 = parseInt(p.r4);
    p.r5 = parseInt(p.r5);
    p.numOfElem = parseInt(p.numOfElem);
    p.minValue = parseFloat(p.minValue);
    p.maxValue = parseFloat(p.maxValue);
    p.valueRange = parseFloat(p.valueRange);
    p.aveValue = parseFloat(p.avgValue);
    p.entropy = parseFloat(p.entropy);
    p.autocorr = parseFloat(p.autocorr);
    return p;
  },
  parseFFTAmp: function(d) {
    var amp = parseCSVSync(d, {delimiter: ' ', comment: '#'});
    amp.forEach(function(e) {
      var substrs = e[0].split('/');
      e[0] = parseInt(substrs[0]);
      e[1] = parseFloat(e[1]);
    });
    return amp;
  },
  parseFFT: function(d) {
    var fft = parseCSVSync(d, {delimiter: ' ', comment: '#'});
    fft.forEach(function(e) {
      var substrs = e[0].split('/');
      e[0] = parseInt(substrs[0]);
      e[1] = parseFloat(e[1]);
      e[2] = parseFloat(e[2]);
    });
    return fft;
  },
  parseAutoCorr: function(d) {
    var corr = parseCSVSync(d, {delimiter: ' '});
    corr.forEach(function(e) {
      e[0] = parseInt(e[0]);
      e[1] = parseFloat(e[1]);
    });
    return corr;
  },
  parseCompare: function(d) {
    var p = ini.decode(d).COMPARE;
    for (var key in p) {
      if (key != "varName") 
        p[key] = parseFloat(p[key]);
    }
    return p;
  },
  parseDistribution: function(d) {
    var dis = parseCSVSync(d, {delimiter: ' ', comment: '#'});
    dis.forEach(function(e) {
      e[0] = parseFloat(e[0]);
      e[1] = parseFloat(e[1]);
    });
    return dis;
  },
};
