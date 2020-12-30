package main

import (
	"fmt"
	"log"
)

type refrigirator []string

func find(item string, coll []string) bool {
	res := false

	for _, val := range coll {
		if val == item {
			res = true
			break
		}
	}

	return res
}

func (r *refrigirator) open() {
	fmt.Println("Openning")
}

func (r *refrigirator) close() {
	fmt.Println("Closing")
}

func (r refrigirator) find(food string) error {
	r.open()

	defer r.close()

	if find(food, r) {
		fmt.Println("Found", food)
	} else {
		return fmt.Errorf("%s not found", food)
	}

	return nil
}

func main() {
	fridge := refrigirator{"Milk", "Pizza", "Salsa"}

	for _, food := range []string{"Milk", "Bananas"} {
		err := fridge.find(food)
		if err != nil {
			log.Fatal(err)
		}
	}
}
