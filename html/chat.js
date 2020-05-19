// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    const chatmsg = {
        message: message.value,
        handle: handle.value
    };

    const msgJSON = JSON.stringify(chatmsg);
    console.log(msgJSON);
    
    socket.emit('chat', msgJSON);

    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('chat', function(data){
    const object = JSON.parse(data);

    feedback.innerHTML = '';

    output.innerHTML += '<p><strong>' + object.handle + ': </strong>' + object.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
