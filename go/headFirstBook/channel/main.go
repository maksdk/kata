package main

import (
	"fmt"
)

func greet(c chan string, num string) {
	c <- "Hello " + num
}

func main() {
	// var myChannel chan string
	// myChannel = make(chan string)
	// go greet(myChannel, "1")
	// fmt.Println("First channel: ", <-myChannel)

	// myShortChannel := make(chan string)
	// go greet(myShortChannel, "2")
	// fmt.Println("Sec channel: ", <-myShortChannel)

	channel1 := make(chan string)
	channel2 := make(chan string)
	fmt.Println("START")

	go abc(channel1)
	go def(channel2)

	fmt.Println("RUN LOGS")

	fmt.Println("1 A:", <-channel1)
	fmt.Println("2 D:", <-channel2)
	fmt.Println("3 B:", <-channel1)
	fmt.Println("4 E:", <-channel2)
	fmt.Println("5 F:", <-channel2)
	fmt.Println("6 C:", <-channel1)

	fmt.Println("END")
}

func abc(channel chan string) {
	fmt.Println("CALL ABC")
	channel <- "a"
	channel <- "b"
	channel <- "c"
}

func def(channel chan string) {
	fmt.Println("CALL DEF")
	channel <- "d"
	channel <- "e"
	channel <- "f"
}
