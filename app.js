"use strict";
const SerialPort = require("serialport");
const fs = require("fs");
const debug = require("debug")("create2:driver");
const Repl = require("repl");
const app = require('http').createServer(handler);
const io = require('socket.io').listen(app);
app.listen(3000);

console.log("==> http://localhost:3000");

function handler(req,res){
    fs.readFile(__dirname+'/index.html',function(err,data){
	    if(err){
		res.writeHead(500);
		return res.end('Error');
	    }
	    res.writeHead(200);
	    res.write(data);
	    res.end();
	});
}

var irobotCommand=io.of('/irobotCommand').on('connection',function(socket){
	socket.on('message', function(data) {
		console.log(data);
		commands[data.id]();



	    });
    });

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

  var commands=[
    () => { drive(-20, -20); setTimeout(() => { drive(0,0) }, 500)},
    () => { drive(20, 20); setTimeout(() => { drive(0,0) }, 500)},
    () => { drive(-20, 20); setTimeout(() => { drive(0,0) }, 500)},
    () => { drive(20, -20); setTimeout(() => { drive(0,0) }, 500)},
    () => { port.write(Buffer.from([7])) },
    () => { port.write(Buffer.from([132])) },
    () => { port.write(Buffer.from([131])) },
    () => { port.write(Buffer.from([128])) },
    () => { port.write(Buffer.from([139, 0, 125, 255])) },
    () => { port.write(Buffer.from([139, 0, 0, 0])) },
    //(arr) =>{ port.write(Buffer.from(arr)) },
    () => { port.write(Buffer.from([140, 3, 1, 64, 16, 141, 3])) },
    //(str) => {var a = str.split("").map((c) => {return  c.charCodeAt();}); a.unshift(164); port.write(Buffer.from(a)); },
    //drive,
    () => { close() }
 ];


function main() {
  port.write(Buffer.from([128]));
  port.write(Buffer.from([131]));
  //back();

    
 // const repl = Repl.start("==> ").context.r = {

      //commands[0]();
  
}

function back(){
    drive(-20, -20); 
    setTimeout(() => { drive(0,0) }, 500);
}

function forward(){
    drive(20, 20); 
    setTimeout(() => { drive(0,0) }, 500);
}

function left(){
    drive(-20, 20); 
    setTimeout(() => { drive(0,0) }, 500);
}

function right(){
    drive(20, -20); 
    setTimeout(() => { drive(0,0) }, 500);
}

function reset(){
    port.write(Buffer.from([7]));
}

function full(){
    port.write(Buffer.from([132]));
}

function safe(){
    port.write(Buffer.from([131]));
}

function passive(){
    port.write(Buffer.from([128]));
}

function lightOn(){
    port.write(Buffer.from([139, 0, 125, 255]));
}

function lightOff(){
    port.write(Buffer.from([139, 0, 0, 0]));
}

function beep(){
    port.write(Buffer.from([140, 3, 1, 64, 16, 141, 3]));
}


function getAvailableDevicePaths() {
  const paths = fs.readdirSync("/dev").map((d) => {
    if (d.includes("tty.usb")) {
      return "/dev/" + d;
    }
  }).filter(Boolean);
  return paths;
}
