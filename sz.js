const ini = require("ini");
const fs = require("fs");
const parseCSVSync = require('csv-parse/lib/sync');
const execFileSync = require('child_process').execFileSync;
const ec = require("./ec");

const szWorkPath = "/Users/hguo/workspace/projects/sz-1.4.6-beta/web";
const szConfigFile = "sz.config";
const szCompDecompExecutable = "testfloat_CompDecomp";
const szCompDecompOutputPrefix = "compareResults/sz(1E-6):testfloat.";
const szDataDims = [8, 8, 128];
const szDataName = "sz(1E-6)";
const szVarName = "testfloat";
const szDataFile = "testdata/x86/testfloat_8_8_128.dat";

const szOutputDict = {
  cmp: "cmp",
  dis: "dis"
};

var defaultSzConfig = 
{ ENV: { dataEndianType: 'LITTLE_ENDIAN_DATA', sol_name: 'SZ' },
  PARAMETER: 
   { layers: '1',
     sampleDistance: '50',
     quantization_intervals: '0',
     predThreshold: '0.98',
     offset: '0',
     szMode: 'SZ_DEFAULT_COMPRESSION',
     gzipMode: 'Gzip_BEST_SPEED',
     errorBoundMode: 'ABS',
     absErrBound: '1E-6',
     relBoundRatio: '1E-5' } };


//////
function executeSZAnalysis() {
  fs.writeFileSync(szWorkPath + "/" + szConfigFile, ini.encode(defaultSzConfig));
  fs.writeFileSync(szWorkPath + "/" + ec.ecConfigFile, ini.encode(ec.defaultEcConfig));
  execFileSync(
      szWorkPath + "/" + szCompDecompExecutable,
      [szConfigFile, ec.ecConfigFile, szDataName, szVarName, szDataFile, szDataDims[0], szDataDims[1], szDataDims[2]], 
      {cwd: szWorkPath, stdio: [0, 1, 2]});
 
  const outCompareFile = szWorkPath + "/" + szCompDecompOutputPrefix + szOutputDict["cmp"];
  const outDisFile = szWorkPath + "/" + szCompDecompOutputPrefix + szOutputDict["dis"];

  var results = {};
  results.compare = parseCompare(fs.readFileSync(outCompareFile).toString());
  results.dis = parseDis(fs.readFileSync(outDisFile).toString());
 
  return results;

  function parseCompare(d) {
    var p = ini.decode(d).COMPARE;
    for (var key in p) {
      if (key != "varName") 
        p[key] = parseFloat(p[key]);
    }
    return p;
  }

  function parseDis(d) {
    var dis = parseCSVSync(d, {delimiter: ' ', comment: '#'});
    dis.forEach(function(e) {
      e[0] = parseFloat(e[0]);
      e[1] = parseFloat(e[1]);
    });
    return dis;
  }
}

module.exports = {
  execute: executeSZAnalysis
};
