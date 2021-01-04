package main

import (
	"fmt"
	"keyboard"
	"log"
)

func main() {
	fmt.Print("Enter a temperate in Fahrenheit: ")
	fahrenheit, err := keyboard.GetFloat()

	if err != nil {
		log.Fatal()
	}

	celsius := (fahrenheit - 32) * 5 / 9

	fmt.Printf("%0.2f degrees Celsius\n", celsius)
}
