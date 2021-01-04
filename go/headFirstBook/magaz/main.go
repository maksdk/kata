package main

import (
	"fmt"

	"github.com/headfirstgo/magazine"
)

func defaultSubscriber(name string) *magazine.Subscriber {
	s := magazine.Subscriber{
		Name:   name,
		Rate:   5.99,
		Active: true,
	}

	return &s
}

func main() {
	// s := defaultSubscriber("maks")
	address := magazine.Address{
		Street:     "123 Oak St",
		City:       "Omaha",
		State:      "NE",
		PostalCode: "68111",
	}

	s := magazine.Subscriber{
		Name:        "Maks",
		Rate:        5,
		Active:      true,
		HomeAddress: address,
	}

	e := magazine.Employee{
		Name:    "Vasya",
		Salary:  1000,
		Address: address,
	}

	// s.Rate = 0.2

	fmt.Printf("Sub: %#v\n", s)
	fmt.Printf("Emp: %#v\n", e)

	e.State = "YO"
}
