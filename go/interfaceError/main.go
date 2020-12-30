package main

import "fmt"

type comedyError string

func (c comedyError) Error() string {
	return string(c)
}

func main() {
	// program error
	err := fmt.Errorf("A height of %0.2f is invalid", -2.123123)
	fmt.Println(err.Error())
	fmt.Println(err)

	// custom error
	e := comedyError("What's a programmer's favorite beer? Logger?")
	fmt.Println(e)

}