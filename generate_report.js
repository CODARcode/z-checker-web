const ini = require("ini");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const execFileSync = require('child_process').execFileSync;
const parse = require("./parse");

const input_path = process.argv[2] + "/report/figs";
const input_path_dp = input_path + "/dataProperties";
const input_path_cp = input_path + "/compressionResults";
const input_path_cc = input_path + "/compareCompressors/gnuplot_scripts";
const input_path_cc_data = input_path + "/compareCompressors/data";

var svgFileMap = {}; // key: filename, value: full path

console.log("generating svg files for dataProperties...");
var files_dp = glob.sync(input_path_dp + "/*.p");
files_dp.forEach(function(f) {
  var result = generateSvgForZChecker(f, input_path_dp);
  svgFileMap[result.key] = result.svg;
});

console.log("generating svg files for compressionResults...");
var files_cp = glob.sync(input_path_cp + "/*.p");
files_cp.forEach(function(f) {
  var result = generateSvgForZChecker(f, input_path_cp);
  svgFileMap[result.key] = result.svg;
});

console.log("generating svg files for compareCompressors...");
var files_cc = glob.sync(input_path_cc + "/*.p");
files_cc.forEach(function(f) {
  var result = generateSvgForZChecker(f, input_path_cc_data);
  svgFileMap[result.key] = result.svg;
});

console.log(svgFileMap);

function generateSvgForZChecker(filename, cwd) { // filename: full path of .p file; cwd: working directory
  var buf = fs.readFileSync(filename).toString();
  var lines = buf.split("\n");
  var script = "";
  var key = path.basename(filename).slice(0, -2);

  lines.forEach(function(str) {
    if (str.startsWith("#") || str.startsWith("set size"))
      return;
    else if (str.startsWith("set term")) 
      script += "set term svg enh\n";
    else if (str.startsWith("set output"))
      // script += str.replace(/eps/g, "svg") + "\n"; // could lead to problem if the case name has svg
      script += 'set output "' + key + '.svg"\n';
    else 
      return script += str + "\n";
  });

  execFileSync("gnuplot", [], // arguments
      {cwd: cwd, stdio: ["pipe", 1, 2], input: script});

  return {
    key: key, 
    svg: path.join(cwd, key + ".svg")
  };
}

