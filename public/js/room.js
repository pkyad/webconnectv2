'use strict';

var app = angular.module('app', []);
app.controller('main', function($scope) {
	$scope.mic=true;
	$scope.pause=true;
})

var meeting;
var host = HOST_ADDRESS; // HOST_ADDRESS gets injected into room.ejs from the server side when it is rendered

$( document ).ready(function() {
	/////////////////////////////////
	// CREATE MEETING
	/////////////////////////////////
	meeting = new Meeting(host);

	document.getElementById('toggle').addEventListener('click',function () {
		meeting.toggleVideo()
	})

	document.getElementById('mute').addEventListener('click',function () {
		meeting.toggleMic()
	})

	document.getElementById('pause').addEventListener('click',function () {
		var vid = document.getElementById('abc')
		if (vid.paused) {
			vid.play();
		}else {
			vid.pause();
		}
	})

	meeting.onLocalVideo(function(stream) {
	        //alert(stream.getVideoTracks().length);
	        // document.querySelector('#localVideo').src = window.URL.createObjectURL(stream);

					  document.querySelector('#localVideo').srcObject = stream;
						// console.log(document.querySelector('#localVideo'));

						// var tracks= stream.getTracks();

						// for (var i = 0; i < tracks.length; i++) {
						// 	if (tracks[i].kind=="audio") {
						// 		tracks[i].enabled = !tracks[i].enabled;
						// 		console.log(tracks[i]);
						// 		document.getElementById('audio').srcObject = tracks[i]
						// 	}
						// }

	        $("#micMenu").on("click",function callback(e) {
				toggleMic();
    		});

    		$("#videoMenu").on("click",function callback(e) {
				toggleVideo();
    		});

			$("#localVideo").prop('muted', true);

	    }
	);

	meeting.onRemoteVideo(function(stream, participantID) {
	        addRemoteVideo(stream, participantID);
	    }
	);

	meeting.onParticipantHangup(function(participantID) {
			// Someone just left the meeting. Remove the participants video
			removeRemoteVideo(participantID);
		}
	);

    meeting.onChatReady(function() {
			console.log("Chat is ready");
	    }
	);

	meeting.onChatNotReady(function() {
		console.log("Chat is not ready");
		}
);

    var room = window.location.pathname.match(/([^\/]*)\/*$/)[1];
		console.log(room,'TRRRRRRRRRRr');
	meeting.joinRoom(room);

}); // end of document.ready

function addRemoteVideo(stream, participantID) {
	console.log(stream.getTracks());
	console.log(stream);
    var $videoBox = $("<div class='videoWrap' id='"+participantID+"'></div>");
    var $video = $("<video class='$videoBox' style='object-fit:fill;width:99vw;height:91vh;' id='abc' autoplay></video>");
		$videoBox.append($video);
    // $video.attr({"srcObject": stream, "autoplay": "autoplay"});
		console.log($video);
		$("#videosWrapper").append($videoBox);
		document.getElementById('abc').srcObject = stream

	 // document.querySelector('#remoteVideo').srcObject = stream;

	adjustVideoSize();

}

function removeRemoteVideo(participantID) {
	$("#"+participantID).remove();
	adjustVideoSize();
}

function adjustVideoSize() {
	var numOfVideos = $(".videoWrap").length;
	if (numOfVideos>2) {
		var $container = $("#videosWrapper");
		var newWidth;
		for (var i=1; i<=numOfVideos; i++) {
			newWidth = $container.width()/i;

			// check if we can start a new row
			var scale = newWidth/$(".videoWrap").width();
			var newHeight = $(".videoWrap").height()*scale;
			var columns = Math.ceil($container.width()/newWidth);
			var rows = numOfVideos/columns;

			if ((newHeight*rows) <= $container.height()) {
				break;
			}
		}

		var percent = (newWidth/$container.width())*100;
		$(".videoWrap").css("width", percent-5+"%");
		$(".videoWrap").css("height", "auto");


		//var numOfColumns = Math.ceil(Math.sqrt(numOfVideos));
		var numOfColumns;
		for (var i=2; i<=numOfVideos; i++) {
			if (numOfVideos % i === 0) {
				numOfColumns = i;
				break;
			}
		}
	    $('#videosWrapper').find("br").remove();
		$('.videoWrap:nth-child('+numOfColumns+'n)').after("<br>");
	} else if (numOfVideos == 2) {
		$(".videoWrap").width('100%');
		$("#localVideoWrap").css("width", 20+"%");
		$('#videosWrapper').find("br").remove();
	} else {
		$("#localVideoWrap").width('auto');
		$('#videosWrapper').find("br").remove();
	}
}
