package main

import (
	"fmt"

	"github.com/headfirstgo/gadget"
)

// Player -
type Player interface {
	Play(song string)
	Stop()
}

func playList(device Player, sounds []string) {
	for _, sound := range sounds {
		device.Play(sound)
	}
	device.Stop()
}

func tryOut(player Player) {
	player.Play("Test Sound")
	player.Stop()

	r, ok := player.(gadget.TapeRecorder)
	if ok {
		r.Record()
	} else {
		fmt.Println("Player was not a TapeRecorder")
	}
}

func main() {
	tryOut(gadget.TapeRecorder{})
	tryOut(gadget.TapePlayer{})
}
