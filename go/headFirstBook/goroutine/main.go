package main

import (
	"fmt"
	"time"
)

func a() {
	for i := 0; i < 50; i++ {
		fmt.Print("A")
	}
}

func b() {
	for i := 0; i < 50; i++ {
		fmt.Print("B")
	}
}

func main() {
	go a()
	go b()

	// приостановили выполнения main на одну секунду
	// так как main - это тоже горутина
	time.Sleep(time.Second)

	fmt.Println("End main()")
}
