package main

import (
	"fmt"

	"github.com/headfirstgo/calendar"
)

func main() {
	event := calendar.Event{}
	event.SetYear(2020)
	event.SetMonth(12)
	event.SetDay(30)
	event.SetTitle("My birthday")

	fmt.Println(event.Title())
	fmt.Println(event.Year())
	fmt.Println(event.Month())
	fmt.Println(event.Day())

}
