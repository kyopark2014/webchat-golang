# webchat golang

### RUN
```c
$ go get github.com/nkovacs/go-socket.io 
$ go run main.go
```

### Docker
```c
$ docker build -t webchat-golang:v1 .
```

```c
###################
##  build stage  ##
###################
FROM golang:1.13.0-alpine as builder
WORKDIR /webchat-golang
COPY . .
RUN go build -v -o webchat-golang

##################
##  exec stage  ##
##################
FROM alpine:3.10.2
WORKDIR /app
COPY --from=builder /webchat-golang /app/
CMD ["./webchat-golang"]
```

### RESULT
![image](https://user-images.githubusercontent.com/52392004/82226152-19af0780-9961-11ea-9f57-5feb9cd748a7.png)

### SEVER
```go
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.E("%v", err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.D("on connection")
		so.Join("chat")

		so.On("chat", func(msg string) {
			log.D("debug: %v", msg)
			so.Emit("chat", msg)
		})

		so.On("typing", func(msg string) {
			log.I("typing...")
			so.Emit("typing", msg)
		})

		so.On("disconnection", func() {
			log.D("on disconnect")
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.E("error: %v", err)
	})

	//http.Handle("/socket.io/", server)

	http.HandleFunc("/socket.io/", func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		server.ServeHTTP(w, r)
	})

	http.Handle("/", http.FileServer(http.Dir("./asset")))
	log.I("Serving at localhost:4000...")
	log.E("%v", http.ListenAndServe(":4000", nil))

```

### Client: chat.js
```js
// Make connection
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
```


### Reference
https://github.com/socketio/socket.io

https://github.com/iamshaunjp/websockets-playlist

https://github.com/nkovacs/go-socket.io
