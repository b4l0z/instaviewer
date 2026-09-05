const socket = io();
socket.emit("getsettings");
socket.emit("getdata");

socket.on("settingscb", (settings) => {
  if (settings.test_mode == false) {
    setTimeout(() => {
      const splash = document.getElementById("splash");
      if (splash) splash.remove();
    }, 3000);
  } else {
    const splash = document.getElementById("splash");
    if (splash) splash.remove();
  }
});

socket.on("datacb", (data) => {
  addNotBackUsers(data.notBack);
  addNotFollowingUsers(data.notFollowing);
  addPendingUsers(data.pending);
  addBlockedUsers(data.blocked);
  document.getElementById("statFollowers").textContent = `${data.userinfo[0]}`;
  document.getElementById("statFollowing").textContent = `${data.userinfo[1]}`;
  document.getElementById("statNotBack").textContent = `${data.notBack.length}`;
  document.getElementById("statPending").textContent = `${data.userinfo[2]}`;

  let mutual = data.userinfo[0] - data.notBack.length;
  let total = mutual + data.notBack.length + data.userinfo[2];

  let mutualprop = ((mutual / total) * 100).toFixed();
  let notbackprop = ((data.notBack.length / total) * 100).toFixed();
  let pendingprop = ((data.userinfo[2] / total) * 100).toFixed();

  document.getElementById("bbmutual").style.width = `${Number(mutualprop)}%`;
  document.getElementById("bbdescmutual").textContent = `(${mutualprop}%)`;
  document.getElementById("bbnotback").style.width = `${Number(notbackprop)}%`;
  document.getElementById("bbdescnotback").textContent = `(${notbackprop}%)`;
  document.getElementById("bbpending").style.width = `${Number(pendingprop)}%`;
  document.getElementById("bbdescpending").textContent = `(${pendingprop}%)`;

  document.getElementById("baccount").textContent = `Sur la base de ${total} comptes`;
});

const lockIcon = `<svg class="lock" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3Z"/></svg>`;
const IG_GRADIENTS = ["linear-gradient(135deg,#405DE6,#5851DB)", "linear-gradient(135deg,#5851DB,#833AB4)", "linear-gradient(135deg,#833AB4,#C13584)", "linear-gradient(135deg,#C13584,#E1306C)", "linear-gradient(135deg,#E1306C,#FD1D1D)", "linear-gradient(135deg,#FD1D1D,#F77737)", "linear-gradient(135deg,#F77737,#FCAF45)", "linear-gradient(135deg,#405DE6,#833AB4)"];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h);
  }
  return Math.abs(h);
}

function avatarInitial(username) {
  const initial = (username.replace(/[^a-zA-Z0-9]/g, "").charAt(0) || username.charAt(0) || "?").toUpperCase();
  const gradient = IG_GRADIENTS[hashString(username) % IG_GRADIENTS.length];
  return `<div class="avatar-init" style="background:${gradient}">${initial}</div>`;
}

function rowNotBack(user) {
  return `
    <div class="row" data-u="${user.username}">
      ${avatarInitial(user.username)}
      <div class="row-info">
        <div class="row-name-line">
          <span class="username">${user.username}</span>
          ${user.verified ? `<svg class="badge" viewBox="0 0 24 24" fill="#0095F6"><path d="M12 2 14.4 4.4 17.7 4 19 7.1 22 8.4 21.6 11.8 24 14.2 21.6 16.6 22 20 19 21.3 17.7 24.4 14.4 24 12 26.4 9.6 24 6.3 24.4 5 21.3 2 20 2.4 16.6 0 14.2 2.4 11.8 2 8.4 5 7.1 6.3 4 9.6 4.4Z" transform="translate(0,-2) scale(0.85)"/><path d="M9 12.2l2 2 4.2-4.4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}
          ${user.private ? lockIcon : ""}
        </div>
        <div class="meta">${user.meta || ""}</div>
      </div>
      <div class="row-actions">
        <button class="btn btn-pill">Suivi ${`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>`}</button>
      </div>
    </div>`;
}

function rowNotFollowing(user) {
  return `
    <div class="row" data-u="${user.username}">
      ${avatarInitial(user.username)}
      <div class="row-info">
        <div class="row-name-line">
          <span class="username">${user.username}</span>
          ${user.private ? lockIcon : ""}
        </div>
        <div class="meta">${user.meta || ""}</div>
      </div>
      <div class="row-actions">
        <button class="btn btn-primary">${`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>`} Suivre</button>
      </div>
    </div>`;
}

function rowPending(user) {
  return `
    <div class="row" data-u="${user.username}">
      ${avatarInitial(user.username)}
      <div class="row-info">
        <div class="row-name-line">
          <span class="username">${user.username}</span>
          ${user.private ? lockIcon : ""}
        </div>
        <div class="meta">${user.meta || ""}</div>
      </div>
    </div>`;
}

function rowBlocked(user) {
  return `
    <div class="row" data-u="${user.username}">
      ${avatarInitial(user.username)}
      <div class="row-info">
        <div class="row-name-line">
          <span class="username">${user.username}</span>
        </div>
        <div class="meta danger">${user.meta || ""}</div>
      </div>
    </div>`;
}

function insertRow(listId, html) {
  const list = document.getElementById(listId);
  const empty = list.querySelector(".empty");
  if (empty) empty.remove();
  list.insertAdjacentHTML("beforeend", html);
}

function addNotBackUser(user) {
  insertRow("list-notback", rowNotBack(user));
  updateCount("countNotBack", +1);
  updateStat("statNotBack", +1);
}

function addNotFollowingUser(user) {
  insertRow("list-notfollowing", rowNotFollowing(user));
  updateCount("countNotFollowing", +1);
}

function addPendingUser(user) {
  insertRow("list-pending", rowPending(user));
  updateCount("countPending", +1);
  updateStat("statPending", +1);
}

function addBlockedUser(user) {
  insertRow("list-blocked", rowBlocked(user));
  updateCount("countBlocked", +1);
}

function addNotBackUsers(users) {
  users.forEach(addNotBackUser);
}

function addNotFollowingUsers(users) {
  users.forEach(addNotFollowingUser);
}

function addPendingUsers(users) {
  users.forEach(addPendingUser);
}

function addBlockedUsers(users) {
  users.forEach(addBlockedUser);
}

function updateCount(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;
  const n = parseInt(el.textContent.replace(/\D/g, "")) || 0;
  el.textContent = Math.max(0, n + delta);
}

function updateStat(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;
  const n = parseInt(el.textContent.replace(/\D/g, "")) || 0;
  el.textContent = Math.max(0, n + delta).toLocaleString("fr-FR");
}

function checkEmpty() {
  document.querySelectorAll(".list").forEach((list) => {
    if (list.children.length === 0 && !list.querySelector(".empty")) {
      list.innerHTML = `
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8 15c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5"/></svg>
          <h3>Rien à afficher ici</h3>
          <p>Cette liste est maintenant vide.</p>
        </div>`;
    }
  });
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
    document.getElementById("searchInput").value = "";
    filterRows("");
  });
});

function filterRows(term) {
  const activePanel = document.querySelector(".panel.active");
  activePanel.querySelectorAll(".row").forEach((row) => {
    const match = row.dataset.u.toLowerCase().includes(term.toLowerCase());
    row.style.display = match ? "" : "none";
  });
}
document.getElementById("searchInput").addEventListener("input", (e) => filterRows(e.target.value));

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const label = document.querySelector("#themeToggle span");
  label.textContent = document.body.classList.contains("dark") ? "Mode clair" : "Mode sombre";
});
