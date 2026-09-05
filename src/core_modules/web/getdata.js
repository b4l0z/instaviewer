const { extractdata } = require("../files/extractdata");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
require("dayjs/locale/fr");
dayjs.extend(relativeTime);
dayjs.locale("fr");

function getdata() {
  const data = extractdata();

  function notBack() {
    const followers = data[0];
    const following = data[1].relationships_following;

    let followerslist = [];

    following.forEach((user) => {
      followerslist.push(user);
    });

    followers.forEach((user) => {
      const index = followerslist.findIndex((u) => u.title === user.string_list_data[0].value);
      if (index !== -1) followerslist.splice(index, 1);
    });

    let result = [];

    followerslist.forEach((nbusers) => {
      result.push({ username: nbusers.title, meta: `Suivi depuis ${dayjs(nbusers.string_list_data[0].timestamp * 1000).fromNow(true)}` });
    });

    return result;
  }

  function notFollowing() {
    const followers = data[0];
    const following = data[1].relationships_following;

    let followerslist = [];

    followers.forEach((user) => {
      followerslist.push(user);
    });

    following.forEach((user) => {
      const index = followerslist.findIndex((u) => u.string_list_data[0].value === user.title);
      if (index !== -1) followerslist.splice(index, 1);
    });

    let result = [];

    followerslist.forEach((nbusers) => {
      result.push({ username: nbusers.string_list_data[0].value, meta: `Te suit depuis ${dayjs(nbusers.string_list_data[0].timestamp * 1000).fromNow(true)}` });
    });

    return result;
  }

  function pending() {
    const pending = data[2];
    let pendinglist = [];
    pending.forEach((pend) => {
      pendinglist.push({ username: pend.label_values[2].value, meta: `Demande envoyée ${dayjs(pend.timestamp * 1000).fromNow()}` });
    });

    return pendinglist;
  }

  function blocked() {
    const blocked = data[3];
    let blockedlist = [];
    blocked.forEach((block) => {
      blockedlist.push({ username: block.label_values[2].value, meta: `Compte bloqué ${dayjs(block.timestamp * 1000).fromNow()}` });
    });

    return blockedlist;
  }

  const finaldata = {
    notBack: notBack(),
    notFollowing: notFollowing(),
    pending: pending(),
    blocked: blocked(),
    userinfo: [data[0].length, data[1].relationships_following.length, data[2].length, data[3].length],
  };

  return finaldata;
}

module.exports = { getdata };
