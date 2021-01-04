package main

import "fmt"

type Liters float64
type Gallons float64
type Milliliters float64

func (l *Liters) toGallons() Gallons {
	return Gallons(*l * 0.264)
}

func (m *Milliliters) toGallons() Gallons {
	return Gallons(*m * 0.000264)
}

func (m *Milliliters) toLiters() {

}

func (g *Gallons) toLiters() Liters {
	return Liters(*g * 3.785)
}

func (g *Gallons) toMilliliters() Milliliters {
	return Milliliters(*g * 3785.41)
}

func main() {
	soda := Liters(2)
	fmt.Printf("%0.3f liters equals %0.3f gallons\n", soda, soda.toGallons())

	water := Milliliters(500)
	fmt.Printf("%0.3f milliliters equals %0.3f gallons\n", water, water.toGallons())

}
