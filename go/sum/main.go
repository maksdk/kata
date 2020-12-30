package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

func openFile(filename string) (*os.File, error) {
	fmt.Println("Openning file -", filename)
	return os.Open(filename)
}

func closeFile(file *os.File) {
	fmt.Println("Closing file -", file.Name())
	file.Close()
}

func getFloats(filename string) ([]float64, error) {
	var numbers []float64

	file, err := openFile(filename)
	if err != nil {
		return nil, err
	}

	defer closeFile(file)

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		num, err := strconv.ParseFloat(scanner.Text(), 64)
		if err != nil {
			return nil, err
		}

		numbers = append(numbers, num)
	}

	if scanner.Err() != nil {
		return nil, scanner.Err()
	}

	return numbers, nil
}

func main() {
	numbers, err := getFloats(os.Args[1])

	if err != nil {
		log.Fatal(err)
	}

	var sum float64
	for _, val := range numbers {
		sum += val
	}

	fmt.Printf("Sum: %0.2f", sum)
}
