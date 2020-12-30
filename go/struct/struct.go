package main

import "fmt"

type car struct {
	name     string
	topSpeed float64
}

type part struct {
	description string
	count       int
}

type subscriber struct {
	name   string
	rate   float64
	active bool
}

func showInfo(info part) {
	fmt.Println("Desc: ", info.description)
	fmt.Println("Count: ", info.count)
}

func printInfo(s *subscriber) {
	fmt.Println("Name: ", s.name)
	fmt.Println("Rate: ", s.rate)
	fmt.Println("Active?: ", s.active)
}

func defaultSubscriber(name string) *subscriber {
	var s subscriber
	s.name = name
	s.rate = 5.99
	s.active = true
	return &s
}

func applyDiscuont(s *subscriber) {
	(*s).rate = 4.99
	s.rate = 4.99
}

func double(num *int) {
	*num *= 2
}

func main() {
	var myStruct struct {
		number float64
		word   string
		toggle bool
	}

	// fmt.Printf("Init struct: %#v\n", myStruct)

	myStruct.number = 100
	myStruct.word = "Maks"
	myStruct.toggle = true
	// fmt.Printf("Change struct:  %#v\n", myStruct)

	var porsche car
	porsche.name = "Porsche 911"
	porsche.topSpeed = 323
	// fmt.Println("Car name: ", porsche.name)
	// fmt.Println("Car top speed: ", porsche.topSpeed)

	subscriber1 := defaultSubscriber("Aman Singh")
	applyDiscuont(subscriber1)
	printInfo(subscriber1)

	// num := 100
	// fmt.Println("Double 1:", num)
	// double(&num)
	// fmt.Println("Double 2:", num)
}