package main

import (
	"fmt"
	"keyboard"
	"log"
)

func main() {
	fmt.Print("Enter a grade: ")
	grade, err := keyboard.GetFloat()

	if err != nil {
		log.Fatal()
	}

	var status string

	if grade > 60 {
		status = "passing"
	} else {
		status = "falling"
	}

	fmt.Println("A grade of", grade, "is", status)
}
