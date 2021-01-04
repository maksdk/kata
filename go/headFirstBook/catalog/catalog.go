package main

import (
	"fmt"
	"io/ioutil"
	"path/filepath"
)

func scanDirectory(path string) error {
	fmt.Println("Directory: ", path)

	files, err := ioutil.ReadDir(path)

	if err != nil {
		panic(err)
	}

	for _, file := range files {
		if file.IsDir() {
			scanDirectory(filepath.Join(path, file.Name()))
		} else {
			fmt.Println("File:", file.Name())
		}
	}

	return nil
}

func reportPanic() {
	err := recover()
	if err != nil {
		e, ok := err.(error)
		if ok {
			fmt.Println(e.Error())
		} else {
			panic(err)
		}
	}
}

func main() {
	defer reportPanic()

	scanDirectory("my_directory")
}
