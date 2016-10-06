navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var peer;
var myID = null;
var call;

var localStream;
var connectedCall;

var myID;
var partnerID;

window.onload = function(){
    displayMyCamera();
}

function displayMyCamera(){
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        localStream = stream;
        document.getElementById("myVideo").src = URL.createObjectURL(stream);
    }, function() { alert("Error!"); });
}

function setmyID(){
    myID = document.getElementById("my-id-input").value;
    document.getElementById("my-id").innerHTML = myID;
    if(myID){
        startPeerConnection();
    } else alert("please input your id");
}

function startPeerConnection() {
    peer = new Peer( myID, {key: 'nvxn9tnx5t6mkj4i', debug: 3});

    peer.on('connection', function(conn) {
    	document.getElementById("partnerID").innerHTML = conn.peer;
	    conn.on('data', function(data){
	        document.getElementById("receive_message").innerHTML = data;
	        convertData(data);
	    });
	});

    peer.on('call', function(call){
        connectedCall = call;
        call.answer(localStream);

        call.on('stream', function(stream){
            document.getElementById("partnerVideo").src = URL.createObjectURL(stream);
        });
    });
}