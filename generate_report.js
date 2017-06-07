const ini = require("ini");
const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");
const execFileSync = require('child_process').execFileSync;

const mode = "png"; 

const rpath_dp = "/dataProperties";
const rpath_cp = "/compressionResults";
const rpath_cc = "/compareCompressors/data";

const input_path = process.argv[2] + "/report/figs";
const input_path_dp = input_path + rpath_dp;
const input_path_cp = input_path + rpath_cp;
const input_path_cc = input_path + "/compareCompressors/gnuplot_scripts";
const input_path_cc_data = input_path + rpath_cc;

const dest_path = process.argv[2] + "/report/web";
if (!fs.existsSync(dest_path))
  fs.mkdirSync(dest_path);

var svgFileMap = {}; // key: filename, value: full path

console.log("generating svg files for dataProperties...");
var files_dp = glob.sync(input_path_dp + "/*.p");
files_dp.forEach(function(f) {
  var result = generateSvgForZChecker(f, input_path_dp, rpath_dp);
  svgFileMap[result.key] = result.svg;
});

console.log("generating svg files for compressionResults...");
var files_cp = glob.sync(input_path_cp + "/*.p");
files_cp.forEach(function(f) {
  var result = generateSvgForZChecker(f, input_path_cp, rpath_cp);
  svgFileMap[result.key] = result.svg;
});

console.log("generating svg files for compareCompressors...");
var files_cc = glob.sync(input_path_cc + "/*.p");
files_cc.forEach(function(f) {
  var result = generateSvgForZChecker(f, input_path_cc_data, rpath_cc);
  svgFileMap[result.key] = result.svg;
});

function generateSvgForZChecker(filename, cwd, rpath) { // filename: full path of .p file; cwd: working directory
  var buf = fs.readFileSync(filename).toString();
  var lines = buf.split("\n");
  var script = "";
  var key = path.basename(filename).slice(0, -2);

  lines.forEach(function(str) {
    if (str.startsWith("#") || str.startsWith("set size"))
      return;
    else if (str.startsWith("set term")) {
      if (mode == "png") 
        script += "set terminal png enh\n";
      else
        script += "set terminal svg enh\n";
    } else if (str.startsWith("set output"))
      // script += str.replace(/eps/g, "svg") + "\n"; // could lead to problem if the case name has svg
      script += 'set output "' + key + '.' + mode + '"\n';
    else 
      return script += str + "\n";
  });

  execFileSync("gnuplot", [], // arguments
      {cwd: cwd, stdio: ["pipe", 1, 2], input: script});
  
  const dest = dest_path + "/" + key + "." + mode;
  fs.copySync(path.join(cwd, key+"." + mode), dest);

  return {
    key: key, 
    // svg: path.join(cwd, key + ".svg")
    // svg: path.join(rpath, key + ".svg")
    svg: key + "." + mode
  };
}

///////////////
// console.log(svgFileMap);


const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM("<!DOCTYPE html>");
const $ = require('jQuery')(window);

// $('<h1>Hello</h1>').appendTo('body');
// console.log($('h1').text());

$("body").append('<div class="base"></div>');
for (key in svgFileMap) {
  $(".base").append('<div id="' + key + '"></div>')
    .append("<p>" + key + "</p>")
    .append('<img src="' + svgFileMap[key] + '"/>')
}

// console.log($(":root").html());
fs.writeFileSync(dest_path + "/index.html", $(":root").html());
