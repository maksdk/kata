package main

import "fmt"

type coffeePot string

func (c coffeePot) String() string {
	return string(c) + " coffee pot"
}

func main() {
	c := coffeePot("Lux")
	fmt.Println(c) // fmt сам вызывает метод String, если он есть в передаваемом параметре
}
