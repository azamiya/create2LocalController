var ButtonIdMap = {
  "38": "forward",
  "40": "back",
  "37": "turnLeft",
  "39": "turnRight"
}

var create2Direction = {
  "forward" : 1,
  "back" : 0,
  "turnLeft" : 3,
  "turnRight" : 2
}

var irobotCommand = io.connect('http://localhost:3332/irobotCommand');

function keyPressed(key, pressed) {
  if (key < 37 || 40 < key) {
    return;
  }
  console.log("Direction: " + ButtonIdMap[key] + ", pressed:" + pressed);
  let elem = document.getElementById(ButtonIdMap[key]);
  if (pressed) {
    irobotCommand.emit("message",{id : create2Direction[ButtonIdMap[key]]});
    elem.style.backgroundColor = "red";
  } else {
    elem.style.backgroundColor = "yellow";
  }
}

document.addEventListener("keydown", function (e) {
  keyPressed(e.which, true);
});
document.addEventListener("keyup", function (e) {
  keyPressed(e.which, false);
});

function Reset(){
  irobotCommand.emit("message",{id : 4});
}

function Passive(){
  irobotCommand.emit("message",{id : 7});
}

function Safe(){
  irobotCommand.emit("message",{id : 6});
}

function Full(){
  irobotCommand.emit("message",{id : 5});
}

function Beep(){
  irobotCommand.emit("message",{id : 10});
}

function Close(){
  irobotCommand.emit("message",{id : 11});
}