"use strict";
const SerialPort = require("serialport");
const fs = require("fs");
const debug = require("debug")("create2:driver");
const Repl = require("repl");

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const server = require("./server");

app.use(express.static(__dirname + '/client'));
server.start(app, http);

const irobotCommand = require("./irobotConnect.js");
irobotCommand.start(io, fs, debug);