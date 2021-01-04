package main

import (
	"fmt"
)

type Number int

// MyFirstMethodType - my first method type
type MyFirstMethodType string

// My first method
func (m MyFirstMethodType) sayHi() {
	fmt.Println("Hi -", m)
}

func (m MyFirstMethodType) getLen() int {
	return len(m)
}

func (n *Number) double() {
	*n *= 2
}

type Liters float64
type Gallons float64
type Milliliters float64

func toGallons(l Liters) Gallons {
	return Gallons(l * 0.264)
}

func toLiters(g Gallons) Liters {
	return Liters(g * 3.785)
}

func main() {
	myFirstMethod := MyFirstMethodType("a my type value")
	myFirstMethod.sayHi()
	fmt.Println("length:", myFirstMethod.getLen())

	mySecMethod := MyFirstMethodType("anather my type value")
	mySecMethod.sayHi()

	num := Number(100)
	fmt.Println("Num 1:", num)
	num.double()
	fmt.Println("Num 2:", num)

	var carFuel Gallons
	var busFuel Liters

	carFuel = Gallons(10.0)
	busFuel = Liters(240)
	fmt.Println(carFuel, busFuel)

	// short
	carFuel2 := Gallons(10.0)
	busFuel2 := Liters(240.0)
	fmt.Println(carFuel2, busFuel2)

	// next
	carFuel = Gallons(Liters(40.0) * 0.264)
	busFuel = Liters(Gallons(63.0) * 3.785)
	fmt.Printf("Gallons: %0.1f Liters: %0.1f\n", carFuel, busFuel)

	// use funcs
	carFuel = toGallons(Liters(40.0))
	busFuel = toLiters(Gallons(30.0))
}
