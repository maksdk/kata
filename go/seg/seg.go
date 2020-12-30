package main

import (
	"fmt"
)

func main() {
	seg := []int{1, 2, 3, 4, 5}

	seg2 := append(seg, 100)
	seg3 := append(seg2, 200)

	seg3[0] = 1000

	fmt.Println(seg)
	fmt.Println(seg2)
	fmt.Println(seg3)

	var segment []int
	fmt.Printf("segment: %#v", segment)
	fmt.Println("seg nil length: ", len(segment))

	nilSegment := append(segment, 100)
	fmt.Println("Append nil segment:", nilSegment)
}
