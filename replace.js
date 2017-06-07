var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(process.argv[2])
});

lineReader.on('line', function (line) {
  if (line.startsWith("#"))
    return;
  else if (line.startsWith("set term")) 
    console.log("set term svg enh");
  else if (line.startsWith("set output"))
    console.log(line.replace(/eps/g, "svg")); // could lead to problem if the case name has svg
  else if (line.startsWith("set size"))
    return;
  else 
    console.log(line);
});
