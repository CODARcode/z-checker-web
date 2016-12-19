const fs = require("fs");
const ini = require("ini");

fs.readFile(process.argv[2], "utf-8", function(err, data) {
  console.log(ini.decode(data));
});
