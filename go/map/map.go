package main

import (
	"fmt"
	"sort"
)

func printSortMap(coll map[string]int) map[string]int {
	var names []string

	for name := range coll {
		names = append(names, name)
	}

	sort.Strings(names)

	for _, name := range names {
		fmt.Printf("Name: %s. Value: %d\n", name, coll[name])
	}
}

func main() {
	var coll map[string]int
	coll = make(map[string]int)

	ranks := make(map[string]int)
	ranks["gold"] = 1
	ranks["silver"] = 2
	ranks["bronze"] = 3

	fmt.Println("Map:", coll)
	fmt.Println("Ranks:", ranks)

	myMap := map[string]int{"a": 1, "b": 2, "c": 3}
	fmt.Println("My map:", myMap)

	myEmptyMap := map[string]int{}
	fmt.Println("Empty map:", myEmptyMap)

	defaultValMap := map[string]int{}
	fmt.Println("Default prop:", defaultValMap["suka"])

	checkProp := map[string]int{"maks": 50, "peta": 60}
	propVal, ok := checkProp["maks"]
	fmt.Printf("Value: %d, OK: %t\n", propVal, ok)
	propVal, ok = checkProp["None"]
	fmt.Printf("Value: %d, OK: %t\n", propVal, ok)

	delPropMap := map[string]int{"prop1": 1, "prop2": 2}
	fmt.Println("Before del:", delPropMap)
	delete(delPropMap, "prop1")
	fmt.Println("After del:", delPropMap)

	for key := range ranks {
		fmt.Println(key)
	}
}
