var commandList = {
  "Back" : 0,
  "Forward" : 1,
  "Right" : 2,
  "Left" : 3,
  "Reset" : 4,
  "Full" : 5,
  "Safe" : 6,
  "Passive" : 7,
  "Beep" : 10,
  "Close" : 11,
  "Stop" : 12
};

var irobotCommand = io.connect('http://localhost:3332/irobotCommand');
var directionId = {
    statusForwarBack:0,
    statusRightLeft:0,
    stopForwardBack:0,
    stopAll:0
};

(function(){
		if(!(window.Gamepad)) return;
		if(!(navigator.getGamepads)) return;
		var element = document.getElementById("aaa");
              
		setInterval(function(){
			var str = "";
			var gamepad_list = navigator.getGamepads();
			var num = gamepad_list.length;

			var i;
			for(i=0;i < num;i++){
				var gamepad = gamepad_list[i];
				if(!gamepad) continue;
				str += "index: " + gamepad.index + "\n";
				str += "timestamp: " + gamepad.timestamp + "\n";
				str += "id: \"" + gamepad.id + "\"\n";
				str += "connected: " + gamepad.connected + "\n";
				str += "mapping: \"" + gamepad.mapping + "\"\n";
				var buttons = gamepad.buttons;
				str += "buttons: {\n";
				var j;
				var n = buttons.length;
				for(j=0;j < n;j++){
					var button = buttons[j];
					str += "  \"" + j + "\": { ";
					str += "pressed:" + button.pressed + " , ";
					str += "value:" + button.value + " }\n";
				}
				str += "}\n";
				var axes = gamepad.axes;
				str += "axes: {\n";
				var j;
				var n = axes.length;
				for(j=0;j < n;j++){
					str += "  \"" + j + "\": ";
					str += axes[j] + "\n";
				}
				str += "}\n";
				str += "\n ----- \n\n";

				if(axes[1] < 0){
					str += "FORWARD" + "\n";
					directionId.statusForwarBack = 0;
				}else if(axes[1] > 0){
					str += "BACK" + "\n";
					directionId.statusForwarBack = 1;
				}

				if(axes[2] > 0){
					str += "RIGHT" + "\n";
					directionId.statusRightLeft = 0;
				}else if(axes[2] < 0){
					str += "LEFT" + "\n";
					directionId.statusRightLeft = 1;
				}

                if(Math.abs(axes[0]) < 0.1 && Math.abs(axes[1]) < 0.1){
                    directionId.stopForwardBack = 1;
                }else{
                    directionId.stopForwardBack = 0;
                }

                if(Math.abs(axes[0]) < 0.1 && Math.abs(axes[1]) < 0.1 && Math.abs(axes[2]) < 0.2 && Math.abs(axes[3]) < 0.2){
                    directionId.stopAll = 1;
                }else{
                    directionId.stopAll = 0;
                }
			}

			element.textContent = str;
            console.log(directionId);
            controlIrobot(directionId);
		},1000/60);
})();

function controlIrobot(directionId){

    if(directionId.stopAll==1){
        irobotCommand.emit("message",{id : commandList["Stop"]});
    }else{
        if(directionId.stopForwardBack==1){
            if(directionId.statusRightLeft == 0)irobotCommand.emit("message",{id : commandList["Right"]});
            if(directionId.statusRightLeft == 1)irobotCommand.emit("message",{id : commandList["Left"]}); 
        }else{
            if(directionId.statusForwarBack == 0)irobotCommand.emit("message",{id : commandList["Forward"]});
            if(directionId.statusForwarBack == 1)irobotCommand.emit("message",{id : commandList["Back"]});
        }        
    }

}