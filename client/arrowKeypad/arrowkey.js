var ButtonIdMap = {
  "38": "forward",
  "40": "back",
  "37": "turnLeft",
  "39": "turnRight"
}

function keyPressed(key, pressed) {
  if (key < 37 || 40 < key) {
    return;
  }
  console.log("Direction: " + ButtonIdMap[key] + ", pressed:" + pressed);
  let elem = document.getElementById(ButtonIdMap[key]);
  if (pressed) {
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