package main

import (
	"fmt"
)

func main() {
	var notes [7]string
	notes[0] = "do"
	notes[1] = "re"
	notes[2] = "mi"
	fmt.Println(len(notes))

	notes2 := [3]string{
		"do",
		"re",
		"mi",
	}
	fmt.Println(len(notes2))

	for i := 0; i < len(notes2); i += 1 {
		fmt.Println(notes2[i])
	}

	for index, _ := range notes {
		fmt.Println("index: ", index)
		// fmt.Println("value: ", value)
	}
}
