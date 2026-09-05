const { finder } = require("./core_modules/zip/finder");
const { unzip } = require("./core_modules/zip/unzip");
const { reorder } = require("./core_modules/files/reorder");
const { startserver } = require("./core_modules/web/startserver");
const { port } = require("./settings.json");
const open = require("open");

const zip = finder();
unzip(zip, "./src/pfiles");
reorder(zip);
console.log("ok");
startserver(port);
open(`http://localhost:${port}`);
