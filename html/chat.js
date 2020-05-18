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
    console.log('Enter message: ' + handle.value + ':' + message.value);
    /* socket.emit('chat', {
        message: message.value,
        handle: handle.value 
    }); */ 
    socket.emit('chat', message.value);
    message.value = '';
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('chat', function(data){
    console.log('message: '+data);

    feedback.innerHTML = '';
    // output.innerHTML = '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    output.innerHTML = '<p><strong>' + data + ': </strong></p>';
});

socket.on('typing', function(data){
    console.log('typing message: '+data);

    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});