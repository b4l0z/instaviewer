const fs = require("fs");

function finder() {
  const files = fs.readdirSync("./");

  let zip_counter = 0;
  let zip_name;

  files.forEach((file) => {
    if (file.includes(".zip")) {
      zip_counter++;
      zip_name = file;
    }
  });

  if (zip_counter == 0) {
    return `Aucun fichier .ZIP detecté.`;
  }
  if (zip_counter > 1) {
    return `Trop de fichiers .ZIP detectés.`;
  }

  return zip_name;
}

module.exports = { finder };
