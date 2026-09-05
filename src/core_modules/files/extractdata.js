const fs = require("fs");

function extractdata() {
  let files = fs.readdirSync("./src/pfiles");
  let followersfile;
  let followingfile;
  let pendingfile;
  let blockedfile;

  files.forEach((file) => {
    if (file.includes("follower")) followersfile = `./src/pfiles/${file}`;
    if (file.includes("following")) followingfile = `./src/pfiles/${file}`;
    if (file.includes("pending")) pendingfile = `./src/pfiles/${file}`;
    if (file.includes("blocked")) blockedfile = `./src/pfiles/${file}`;
  });

  const followers = fs.readFileSync(followersfile, "utf-8");
  const followersJson = JSON.parse(followers);

  const following = fs.readFileSync(followingfile, "utf-8");
  const followingJson = JSON.parse(following);

  const pending = fs.readFileSync(pendingfile, "utf-8");
  const pendingJson = JSON.parse(pending);

  const blocked = fs.readFileSync(blockedfile, "utf-8");
  const blockedJson = JSON.parse(blocked);

  return [followersJson, followingJson, pendingJson, blockedJson];
}

module.exports = { extractdata };
