package main

import "fmt"

type Whistle string

func (w Whistle) MakeSound() {
	fmt.Println("Tweet!")
}

type Horn string

func (h Horn) MakeSound() {
	fmt.Println("Honk!")
}

type Robot string

func (r Robot) Walk() {
	fmt.Println("Walk!")
}

func (r Robot) MakeSound() {
	fmt.Println("Beep Boop!")
}

type NoiseMaker interface {
	MakeSound()
}

func play(n NoiseMaker) {
	n.MakeSound()
}

func main() {
	var noise NoiseMaker
	noise = Horn("Toyko Blaster")
	noise.MakeSound()

	play(Whistle("Canary"))
	play(Robot("Robot"))
}
