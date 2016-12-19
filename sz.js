const ini = require("ini");
const fs = require("fs");
const parseCSVSync = require('csv-parse/lib/sync');
const execFileSync = require('child_process').execFileSync;

const szWorkPath = "/Users/hguo/workspace/projects/sz-1.4.6-beta/web";
const szConfigFile = "sz.config";
const szCompDecompExecutable = "testfloat_CompDecomp";

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

}
