package main

import "fmt"

type noiseMaker interface {
	makeSound()
}

type robot string

func (r robot) makeSound() {
	fmt.Println("Beep Boop")
}

func (r robot) walk() {
	fmt.Println("Walk")
}

func main() {
	var n noiseMaker = robot("I am robot !!!")
	n.makeSound()

	var r robot = n.(robot)
	r.walk()
	r.makeSound()
}
