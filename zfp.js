const ini = require("ini");
const fs = require("fs");
const execFileSync = require('child_process').execFileSync;
const ec = require("./ec");
const parse = require("./parse");

const zfpWorkPath = "/Users/hguo/workspace/projects/zfp-0.5.0-ec/examples";
const zfpCompDecompExecutable = "zfp";
const zfpCompDecompOutputPrefix = "compareResults/ZFP(1E-5):CLDHGH.";
const zfpErrorBound = "1E-5";
const zfpDataDims = [3600, 1800];
const zfpInputData = "CESM-ACME/CLDHGH_1_1800_3600.dat";
const zfpCompressedData = "CESM-ACME/CLDHGH_1_1800_3600.dat.zfp";
const zfpUncompressedData = "CESM-ACME/CLDHGH_1_1800_3600.dat.zfp.out";
const zfpKey = "ZFP(" + zfpErrorBound + ")";
const zfpVal = "CLDHGH";

const zfpOutputDict = {
  cmp: "cmp",
  dis: "dis"
};

//////
function executeZFPAnalysis() {
  fs.writeFileSync(zfpWorkPath + "/" + ec.ecConfigFile, ini.encode(ec.defaultEcConfig));
  execFileSync(
      zfpWorkPath + "/" + zfpCompDecompExecutable,
      [
        "-f", "-a", zfpErrorBound,
        "-2", zfpDataDims[0], zfpDataDims[1],
        "-i", zfpInputData, 
        "-z", zfpCompressedData,
        "-o", zfpUncompressedData, 
        "-k", zfpKey, 
        "-v", zfpVal
      ],
      {cwd: zfpWorkPath, stdio: [0, 1, 2]});

  const outCompareFile = zfpWorkPath + "/" + zfpCompDecompOutputPrefix + zfpOutputDict["cmp"];
  const outDisFile = zfpWorkPath + "/" + zfpCompDecompOutputPrefix + zfpOutputDict["dis"];

  var results = {};
  results.compare = parse.parseCompare(fs.readFileSync(outCompareFile).toString());
  results.dis = parse.parseDistribution(fs.readFileSync(outDisFile).toString());
 
  return results;
}

module.exports = {
  execute: executeZFPAnalysis
};
