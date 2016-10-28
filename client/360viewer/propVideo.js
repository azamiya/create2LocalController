navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

window.onload = function(){
    displayMyCamera();
}

function displayMyCamera(){
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        document.getElementById("360video").src = URL.createObjectURL(stream);
    }, function() { alert("Error!"); });
}