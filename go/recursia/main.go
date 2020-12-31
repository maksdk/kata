package main

import "fmt"

func recurses(start int, end int) {
	fmt.Println(start)

	if start < end {
		recurses(start+1, end)
	}
}

func main() {
	recurses(1, 3)
}
