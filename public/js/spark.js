
var currentCall = null
var incomingCall=null
var firstTimestamp = 0

ciscospark = ciscospark.init({credentials:{access_token:"<your token here>"}})


ciscospark.phone.register()
  .then(function(d){
    console.log("registered")
  });


$(document).ready(function(){

$('#answer').hide()
$('#answer').click(function(){
  incomingCall.acknowledge();
  incomingCall.answer();
  $('#answer').hide()
  $('#callbutton').hide()
  $('#uri').hide()
})
  ciscospark.phone.on('call:incoming', function(call) {
    console.log("Incoming call!!!")
    $('#answer').show()
    $('#callbutton').hide()
    $('#uri').hide()
    call.on('connected', function() {
      console.log("Incoming call connected")
      document.getElementById('incoming-video').src = call.remoteMediaStreamUrl;
    });

    call.on('remoteMediaStream:change', function() {
      console.log("Call connected")
      document.querySelector('#incoming-video').src = call.remoteMediaStreamUrl;
      var rvideo = document.querySelector("#incoming-video");

    });

    call.on('localMediaStream:change', function() {
      console.log("local media changed")
      var video = document.querySelector("#outgoing-video");
      video.src = call.localMediaStreamUrl;
      video.muted = true;
      // Mute the local video so you don't hear yourself speaking

    });

   incomingCall = call
   currentCall = call;

  });

  $('#incoming-video').on('loadedmetadata', function(e) {
    var dimensions = [this.videoWidth, this.videoHeight];
    var video = document.querySelector("#incoming-video");
    video.width = 640;
    video.height = 360;
    console.log(e)
    console.log('incoming loadedmetadata')
  });

  $('#outgoing-video').on('loadedmetadata', function(e) {
    var dimensions = [this.videoWidth, this.videoHeight];
    var video = document.querySelector("#outgoing-video");
    video.width = this.videoWidth/4;
    video.height = this.videoHeight/4;
    console.log(e)
    console.log('outgoing-video loadedmetadata')
  });

  $('#callbutton').click(function(){
    var uritext = $('#uri').val()
    console.log("calling "+uritext)
    var call = ciscospark.phone.dial(uritext);
    currentCall = call
    call.on('remoteMediaStream:change', function() {
      console.log("Call connected")
      document.querySelector('#incoming-video').src = call.remoteMediaStreamUrl;
      var rvideo = document.querySelector("#incoming-video");

    });

    call.on('ringing', function(c){
        console.log("*** Call ringing")
    })
    call.on(`disconnected`, function(c) {
        console.log("*** Call disconnected")
    })
    call.on(`connected`, function(c) {
      console.log("*** Call connected")

    });
    call.on('localMediaStream:change', function() {
      console.log("local media changed")
      var video = document.querySelector("#outgoing-video");
      video.src = call.localMediaStreamUrl;
      video.muted = true;
      // Mute the local video so you don't hear yourself speaking

    });

    call.on('hangup', function() {
      console.log("*** Call Hangup")

    });

  });

  $('#hangup').click(function() {
    if (currentCall)
    {
      currentCall.hangup()
      $('#answer').hide()
      $('#callbutton').show()
      $('#uri').show()
      var video = document.querySelector("#outgoing-video");
      video.src = null
      video = document.querySelector("#incoming-video");
      video.src = null
    }
    else
      console.log("Current call is null")

  })
});
