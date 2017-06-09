const ini = require("ini");
const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");
const execFileSync = require('child_process').execFileSync;

// var cheerio = require('cheerio');
// var $ = cheerio.load(fs.readFileSync('./template/index.html')); // TODO

// const mode = "png"; 
const mode = "svg"; 

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

generateDataPropertiesTab();
generateCompressionResultsTab();
generateComparisonResultsTab();

function generateDataPropertiesTab() {
  console.log("generating image files for dataProperties...");

  var outputs = [];
  var files_dp = glob.sync(input_path_dp + "/*.p");
  files_dp.forEach(function(f) {
    var result = generateFigureForZChecker(f, input_path_dp, rpath_dp);
    const key = result.key;
    var varname = "";
    var property = "";

    if (key.endsWith("-autocorr")) {
      varname = key.substring(0, key.lastIndexOf("-autocorr"));
      property = "autocorr";
    } else if (key.endsWith("-fft-amp")) {
      varname = key.substring(0, key.lastIndexOf("-fft-amp"));
      property = "fft-amp";
    } else {
      assert.fail("unknown property");
    }

    outputs.push({
      key: key, 
      filename: result.filename,
      varname: varname,
      property: property
    });
  });

  fs.writeFileSync(dest_path + "/dataProperties.json", JSON.stringify(outputs));
}

function generateCompressionResultsTab() {
  console.log("generating files for compressionResults...");

  var outputs = [];

  var files_cp = glob.sync(input_path_cp + "/*.p");
  files_cp.forEach(function(f) {
    var result = generateFigureForZChecker(f, input_path_cp, rpath_cp);
    const key = result.key;
  
    // nasty code
    var strs = key.split(":");

    var regExp = /\(([^)]+)\)/;
    var regResult = regExp.exec(strs[0]);
    var bound = regResult[1];

    var compressor = strs[0].slice(0, regResult.index);
    
    var varname = "";
    var property = "";

    const key1 = strs[1];

    if (key1.endsWith("-autocorr")) {
      varname = key1.substring(0, key1.lastIndexOf("-autocorr"));
      property = "autocorr";
    } else if (key1.endsWith("-dis")) {
      varname = key1.substring(0, key1.lastIndexOf("-dis"));
      property = "dis";
    } else if (key1.endsWith("-fft-amp")) {
      varname = key1.substring(0, key1.lastIndexOf("-fft-amp"));
      property = "fft-amp";
    } else {
      assert.fail("unknown property");
    }
    // end nasty code

    outputs.push({
      key: key.replace(/\(|\)\:/g, "_"),
      filename: result.filename, 
      compressor: compressor, 
      bound: bound,
      varname: varname,
      property: property
    });
  });

  fs.writeFileSync(dest_path + "/compressionResults.json", JSON.stringify(outputs));
}

function generateComparisonResultsTab() {
  console.log("generating files for compareCompressors...");
  
  var outputs = [];
  var files_cc = glob.sync(input_path_cc + "/*.p");
  files_cc.forEach(function(f) {
    var result = generateFigureForZChecker(f, input_path_cc_data, rpath_cc);
    const key = result.key;

    outputs.push({
      key: key,
      filename: result.filename
    });
  });
  
  fs.writeFileSync(dest_path + "/compareCompressors.json", JSON.stringify(outputs));
}


function generateFigureForZChecker(filename, cwd, rpath) { // filename: full path of .p file; cwd: working directory
  var buf = fs.readFileSync(filename).toString();
  var lines = buf.split("\n");
  var script = "";
  var key = path.basename(filename).slice(0, -2).replace(/\./g, '_');

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

  try {
  execFileSync("gnuplot", [], // arguments
      {cwd: cwd, stdio: ["pipe", 1, 2], input: script});
  } catch (ex) {
  }
      // {cwd: cwd, stdio: ["pipe", 1, "null"], input: script});
  
  const dest = dest_path + "/" + key + "." + mode;
  fs.copySync(path.join(cwd, key+"." + mode), dest);

  return {
    key, 
    filename: key + "." + mode
  };
}


fs.copySync("./template/index.html", dest_path + "/index.html");
fs.copySync("./template/jquery-3.1.1.min.js", dest_path + "/jquery-3.1.1.min.js");
fs.copySync("./template/crossfilter.js", dest_path + "/crossfilter.js");
fs.copySync("./template/bootstrap.min.css", dest_path + "/bootstrap.min.css");
fs.copySync("./template/bootstrap.min.js", dest_path + "/bootstrap.min.js");
