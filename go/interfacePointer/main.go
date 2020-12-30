package main

import "fmt"

type Switch string

type Toggleable interface {
	toggle()
}

func (s *Switch) toggle() {
	if *s == "on" {
		*s = "off"
	} else {
		*s = "on"
	}
	fmt.Println(*s)
}

func main() {
	s := Switch("off")
	var t Toggleable = &s // Use pointer
	t.toggle()
	t.toggle()
}
