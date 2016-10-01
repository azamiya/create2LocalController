"use strict";
const SerialPort = require("serialport");
const fs = require("fs");
const debug = require("debug")("create2:driver");
const Repl = require("repl");

const path = getAvailableDevicePaths()[0];
if (!path) {
  return "Device cannot use";
}
debug(`connect to ${path}`);
const options = {
  baudRate: 115200,
  dataBits:8,
  parity:'none', stopBits:1,
  flowControl:false
};
const port = new SerialPort(path, options);

let inputBuffer = null;

port.on("data", (data) => {
  if (!inputBuffer) {
    inputBuffer = data;
  } else {
    inputBuffer = Buffer.concat([inputBuffer, data]);
  }

  debug(`${inputBuffer.length} Bytes received`);
  debug(inputBuffer.toJSON().data.toString());

  if (inputBuffer.length == 80) {
    debug("===== Clear");
    inputBuffer = null;
  }
});

port.on("open", () => {
  debug("connected");
  main();
});

function close() {
  debug("close");
  port.close();
  process.exit(0);
}


function drive(right, left) {
  const buf = new Buffer(5);
  buf[0] = 145;
  buf.writeInt16BE(right, 1);
  buf.writeInt16BE(left, 3);
  port.write(buf);
  debug(buf.toJSON().data.toString());
}

function main() {
  port.write(Buffer.from([128]));
  port.write(Buffer.from([131]));

  const repl = Repl.start("==> ").context.r = {
    back: () => { drive(-20, -20); setTimeout(() => { drive(0,0) }, 500)},
    forward: () => { drive(20, 20); setTimeout(() => { drive(0,0) }, 500)},
    left: () => { drive(-20, 20); setTimeout(() => { drive(0,0) }, 500)},
    right: () => { drive(20, -20); setTimeout(() => { drive(0,0) }, 500)},
    reset: () => { port.write(Buffer.from([7])) },
    full: () => { port.write(Buffer.from([132])) },
    safe: () => { port.write(Buffer.from([131])) },
    passive: () => { port.write(Buffer.from([128])) },
    lightOn: () => { port.write(Buffer.from([139, 0, 125, 255])) },
    lightOff: () => { port.write(Buffer.from([139, 0, 0, 0])) },
    write: (arr) =>{ port.write(Buffer.from(arr)) },
    beep: () => { port.write(Buffer.from([140, 3, 1, 64, 16, 141, 3])) },
    print: (str) => {var a = str.split("").map((c) => {return  c.charCodeAt();}); a.unshift(164); port.write(Buffer.from(a)); },
    drive: drive,
    close: () => { close() }
  };
}


function getAvailableDevicePaths() {
  const paths = fs.readdirSync("/dev").map((d) => {
    if (d.includes("tty.usb")) {
      return "/dev/" + d;
    }
  }).filter(Boolean);
  return paths;
}
