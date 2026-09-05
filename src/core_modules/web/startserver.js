const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { getdata } = require("../../core_modules/web/getdata");
const settings = require("../../settings.json");

function startserver(port) {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  app.use(express.static("src/web"));

  io.on("connection", (socket) => {
    socket.on("getsettings", () => {
      io.emit("settingscb", settings);
    });
    socket.on("getdata", () => {
      io.emit("datacb", getdata());
    });
  });

  server.listen(port, () => console.log(`http://localhost:${port}`));
}

module.exports = { startserver };
