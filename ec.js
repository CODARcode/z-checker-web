const ini = require("ini");
const fs = require("fs");
const execFileSync = require('child_process').execFileSync;
const parse = require("./parse");

const ecWorkPath = "/Users/hguo/workspace/projects/ec-0.1.0/web";
const ecConfigFile = "ec.config";
const ecDataPropertyExecutable = "analyzeDataProperty";
const ecDataPropertyOutputPrefix = "dataProperties/test1.";
const ecDataFile = "testdata/x86/testfloat_8_8_128.dat"
const ecDataDims = [8, 8, 128];

const ecDataPropertyOutputDict = {
  autocorr: "autocorr", 
  fft: "fft",
  fftAmp: "fft.amp",
  prop: "prop"
};

var defaultEcConfig = 
{ ENV: { dataEndianType: 'LITTLE_ENDIAN_DATA' },
  DATA: 
   { minValue: '1',
     maxValue: '1',
     valueRange: '1',
     avgValue: '1',
     entropy: '1',
     autocorr: '1',
     fft: '1' },
  COMPARE: 
   { compressTime: '1',
     decompressTime: '1',
     compressSize: '1',
     minAbsErr: '1',
     avgAbsErr: '1',
     maxAbsErr: '1',
     autoCorrAbsErr: '1',
     absErrPDF: '1',
     minRelErr: '1',
     avgRelErr: '1',
     maxRelErr: '1',
     rmse: '1',
     nrmse: '1',
     psnr: '1',
     pearsonCorr: '1' },
  PLOT: 
   { propertyExtension: 'prop',
     plotAutoCorr: '0',
     plotFFTAmp: '0',
     plotEntropy: '0',
     plotCompressionResults: '0',
     plotAbsErrPDF: '0',
     compressors: 'sz:/home/fti/windows-xp/my-5th-proposal-EZ/sz-1.4.6-beta/example zfp:/home/fti/windows-xp/12th-paper-time-series-compress/other-compressor/zfp/zfp-0.5.0/examples',
     comparisonCases: 'sz(1E-4),zfp(1E-4) sz(1E-5),zfp(1E-5) sz(1E-6),zfp(1E-6) sz(1E-7),zfp(1E-7)',
     cmpResultFileExtension: 'cmp' } };

/////
function executeECAnalysis() {
  fs.writeFileSync(ecWorkPath + "/" + ecConfigFile, ini.encode(defaultEcConfig));
  execFileSync(
      ecWorkPath + "/" + ecDataPropertyExecutable, 
      [ecConfigFile, ecDataFile, ecDataDims[0], ecDataDims[1], ecDataDims[2]], 
      {cwd: ecWorkPath, stdio: [0, 1, 2]});

  const outPropFile = ecWorkPath + "/" + ecDataPropertyOutputPrefix + ecDataPropertyOutputDict["prop"];
  const outFFTFile = ecWorkPath + "/" + ecDataPropertyOutputPrefix + ecDataPropertyOutputDict["fft"];
  const outFFTAmpFile = ecWorkPath + "/" + ecDataPropertyOutputPrefix + ecDataPropertyOutputDict["fftAmp"];
  const outAutoCorrFile = ecWorkPath + "/" + ecDataPropertyOutputPrefix + ecDataPropertyOutputDict["autocorr"];

  var results = {};
  results.properties = parse.parseDataProperties(fs.readFileSync(outPropFile).toString());
  results.fftAmp = parse.parseFFTAmp(fs.readFileSync(outFFTAmpFile).toString());
  results.autoCorr = parse.parseAutoCorr(fs.readFileSync(outAutoCorrFile).toString());

  return results;
}

module.exports = {
  defaultEcConfig: defaultEcConfig,
  ecConfigFile: ecConfigFile,
  execute: executeECAnalysis
};
