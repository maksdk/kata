package main

import (
	"fmt"
	"time"
)

func reportNav(name string, delay int) {
	for i := 0; i < delay; i++ {
		fmt.Println(name, "sleeping")
		time.Sleep(time.Second)
	}
	fmt.Println(name, "wakes up!")
}

func send(channel chan string) {
	reportNav("Sending goroutine", 2)
	fmt.Println("*** sending value in channel ***")
	channel <- "a"
	fmt.Println("*** sending value in channel ***")
	channel <- "b"
}

func main() {
	channel := make(chan string)

	go send(channel)

	reportNav("Receiving goroutine", 5)

	fmt.Println(<-channel)
	fmt.Println(<-channel)

}
