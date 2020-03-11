import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
// import socialRoutes from "@colyseus/social/express"

import { basic } from "./2dbasic";

const version = "mzrc0.3"
const port = Number(process.env.PORT || 2567);
const app = express()

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

// register your room handlers
gameServer.define('basic', basic);

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

var extensiveDivider = "================================"

console.log(extensiveDivider)
console.log("Mazopolis C")
console.log("Server version: "+version)
console.log(extensiveDivider)
console.log("\nStarting web server...\n")

gameServer.listen(port);
console.log(`Done! Listening for users at: ws://localhost:${ port }`)