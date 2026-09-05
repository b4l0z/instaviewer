const fs = require("fs");
const { test_mode } = require("../../settings.json");

function reorder(zippath) {
  if (test_mode == false) fs.rmSync(zippath);
  fs.readdirSync("./src/pfiles/connections/followers_and_following/").forEach((file) => {
    fs.renameSync(`./src/pfiles/connections/followers_and_following/${file}`, `./src/pfiles/${file}`);
  });
  fs.rmSync("./src/pfiles/connections", { recursive: true, force: true });
}

module.exports = { reorder };
