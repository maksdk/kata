package main

import (
	"log"
	"net/http"
)

func write(writter http.ResponseWriter, message string) {
	_, err := writter.Write([]byte(message))
	if err != nil {
		log.Fatal(err)
	}
}

func englishHandler(writter http.ResponseWriter, req *http.Request) {
	write(writter, "Hello, web!")
}

func frenchHandler(writter http.ResponseWriter, req *http.Request) {
	write(writter, "Salut web!")
}

func hindiHandler(writter http.ResponseWriter, req *http.Request) {
	write(writter, "Namaste, web!")
}

func main() {
	http.HandleFunc("/hello", englishHandler)
	http.HandleFunc("/salut", frenchHandler)
	http.HandleFunc("/namaste", hindiHandler)

	err := http.ListenAndServe("localhost:8080", nil)

	log.Fatal(err)
}
