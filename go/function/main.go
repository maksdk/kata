package main

import "fmt"

func callMe(two func()) {
	two()
}

func callMeParams(one int, two int, cb func()) {
	fmt.Println("Params:", one, two)
	cb()
}

func main() {
	var fn func()
	fn = func() {
		fmt.Println("OPA")
	}
	callMe(fn)

	fn2 := func() {
		fmt.Println("OPA @")
	}

	callMe(fn2)

	var f func(one int, two int, cb func()) = callMeParams
	f(1, 2, func() {
		fmt.Println("I am callback")
	})
}
