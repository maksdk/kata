package main

import "fmt"

type anything interface{}

func acceptAny(thing anything) {
	fmt.Println(thing)
}

func main() {
	acceptAny("I am a string")
	acceptAny(100)
	acceptAny(map[string]string{})
}
