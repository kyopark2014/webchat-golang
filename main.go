package main

import (
	"net/http"
	"webchat-golang/internal/logger"

	socketio "github.com/nkovacs/go-socket.io"
)

var log *logger.Logger

func init() {
	log = logger.NewLogger("webchat")
	logger.SetupLogger(true, "DEBUG")
}

func main() {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.E("%v", err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.D("on connection")
		so.Join("chat")

		so.On("chat", func(msg string) {
			log.I("chat: %v", msg)
			so.Emit("chat", msg)
			// so.Emit("chat message", msg)
			//so.BroadcastTo("room", "chat message", msg)
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
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		server.ServeHTTP(w, r)
	})

	http.Handle("/", http.FileServer(http.Dir("./asset")))
	log.I("Serving at localhost:4000...")
	log.E("%v", http.ListenAndServe(":4000", nil))
}
