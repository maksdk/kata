package main

import (
	"fmt"
)

func createPointer() *float64 {
	myFloat := 98.5
	return &myFloat
}

func printPointer(myBoolPointer *bool) {
	fmt.Println(myBoolPointer)
	fmt.Println(*myBoolPointer)
}

func double(numPointer *float64) {
	*numPointer *= 2
}

func main() {
	myFloatPointer := createPointer()
	fmt.Println(myFloatPointer)
	fmt.Println(*myFloatPointer)

	myBool := true
	printPointer(&myBool)

	var num float64 = 0.5
	double(&num)
	fmt.Println("Dounled num: ", num)
}
