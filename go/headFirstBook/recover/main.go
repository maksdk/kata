package main

import (
	"fmt"
)

func calmDown() {
	// return message from panic
	err := recover()

	if err != nil {
		e, ok := err.(error)
		if ok {
			fmt.Println(e.Error())
		} else {
			fmt.Println(e)
		}
	}

}

func fakeOut() {
	defer calmDown()
	panic(fmt.Errorf("message:My custom error, code: 404"))
}

func main() {
	// recover без panic возвращает nil
	fmt.Println(recover())
	fakeOut()
	fmt.Println("Exiting normally")
}
