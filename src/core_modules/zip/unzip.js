const adm = require("adm-zip");

function unzip(path, dest) {
  const zip = new adm(path);

  zip.extractAllTo(dest);
}

module.exports = { unzip };
