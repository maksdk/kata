package main

import (
	"fmt"
)

func paintNeeded(width float64, height float64) (float64, error) {
	if width < 0 {
		return 0, fmt.Errorf("A width of %0.2f is invalid ", width)
	}
	
	if height < 0 {
		return 0, fmt.Errorf("A height of %0.2f is invalid ", height)
	}

	area := width * height

	return area / 10.0, nil
}

func main() {
	amount, err := paintNeeded(5.3, -6.5)

	if err != nil {
		fmt.Println("Error: ", err)
	} else {
		fmt.Printf("%.2f liters needed\n", amount)
	}
}