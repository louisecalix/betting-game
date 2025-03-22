import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { io as ioClient } from "socket.io-client";

dotenv.config({ path: "user.env" });

import UserSocket from "./sockets/userSocket.js";
import PrizeSocket from "./sockets/prizesSocket.js";
import authenticateSocket from "./middleware/authentication.js";
import RoundSocket from "./sockets/roundSocket.js";
import BetSocket from "./sockets/betsSocket.js";
import OtherSocket from "./sockets/otherSocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.ENV === "production";

async function createCustomServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);
  //cors config

  let vite;
  if (!IS_PRODUCTION) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      build: { ssr: true, ssrEmitAssets: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "../")));
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const index = fs.readFileSync(
        path.resolve(__dirname, IS_PRODUCTION ? "../index.html" : "../index.html"),
        "utf-8"
      );

      let render, template;

      if (IS_PRODUCTION) {
        template = index;
        render = await import("./dist/server/server-entry.js").then((mod) => mod.render);
      } else {
        template = await vite.transformIndexHtml(url, index);
        try {
          render = (await vite.ssrLoadModule("./src/server-entry.jsx")).render;
        } catch (viteError) {
          console.error("Vite SSR Module Load Error:", viteError);
          return res.status(500).send("SSR Module Load Failed");
        }
      }

      const context = {};
      const appHtml = render(url, context);
      const html = template.replace("<!-- ssr -->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });

  let roundSocket = null;


  if (PORT == 3000) {
    console.log("✅ Running as MASTER (Port 3000)");
    roundSocket = new RoundSocket(PORT, io);
  } else {
    console.log(`🔹 Running as SLAVE (Port ${PORT})`);
    // ilagay dapat dito yug url ni maaster para makaconnect ibang ports sa roundsock

    const master = ioClient("http://localhost:3000");

    master.on("connect", ()=>{
      console.log(`SLAVE ${PORT} connected to the master`);
    });

    master.on("roundNumber", (data)=>{
      io.emit("roundNumber", data);
    });
    master.on("timer-update", (data)=>{
      io.emit("timer-update", data);
    });
    master.on("winning-numbers", (data)=>{
      io.emit("winning-numbers", data);
    });
    master.on("prize-update", (data)=>{
      io.emit("prize-update", data);
    });
    master.on("sendPrevWinners", (data)=>{
      io.emit("sendPrevWinners", data);
    });



  }

 
  io.on("connection", (socket) => {
    console.log(`User connected on port ${PORT} with ID: ${socket.id}`);

    const userSocket = new UserSocket(io);
    userSocket.handleSocket(socket);

    socket.on("request-authentication", () => {
      authenticateSocket(socket, async (err) => {
        if (err) {
          console.log("Authentication failed:", err.message);
          socket.emit("authentication-failed", "Invalid token");
          return;
        }

        console.log(`Authenticated user: ${socket.user_id}`);

       
        // if (!roundSocket ) {
        //   console.log("✅ Initializing RoundSocket on MASTER");
        //   roundSocket = new RoundSocket(PORT, io);
        // }
        
        new PrizeSocket(io, socket);
        new BetSocket(io, socket);
        new OtherSocket(socket, io);

        socket.emit("authentication-success");
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

createCustomServer();
