var peer;
var myID;

function getmyID(){
    myID = document.getElementById("my-id-input").value;
    document.getElementById("my-id").innerHTML = myID;
    startPeerConnection();
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
}