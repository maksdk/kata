package main

import "fmt"

// defer - гарантирует вызов при любом завершении функции
func socialize() {
	defer fmt.Println("Goodbye!") // Вызов будет самый последний
	fmt.Println("Hello!")
	fmt.Println("Nice weather, eh?")
}

func main() {
	socialize()
}
