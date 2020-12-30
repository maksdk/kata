package main

import (
	"fmt"
	"math"
)

func max(numbers ...float64) float64 {
	m := math.Inf(-1)

	for _, num := range numbers {
		if num > m {
			m = num
		}
	}

	return m
}

func inRange(min float64, max float64, numbers ...float64) []float64 {
	var result []float64

	for _, num := range numbers {
		if num >= min && num <= max {
			result = append(result, num)
		}
	}

	return result
}

func average(numbers ...float64) float64 {
	var sum float64 = 0

	for _, num := range numbers {
		sum += num
	}

	return sum / float64(len(numbers))
}

func main() {
	fmt.Println("max:", max(2, 3, 4, 556))
	fmt.Println("range:", inRange(2, 10, 4, 5, 8, 203, 47, 2))
}
