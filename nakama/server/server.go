package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	"github.com/heroiclabs/nakama-common/runtime"
)

type MatchState struct {
	debug bool
}

type Match struct{}

func (m *Match) MatchInit(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, params map[string]interface{}) (interface{}, int, string) {
	fmt.Println("MATCH INIT")

	var debug bool
	if d, ok := params["debug"]; ok {
		debug, _ = d.(bool)
	}
	state := &MatchState{debug: debug}
	tickRate := 1
	label := ""

	return state, tickRate, label
}

func (m *Match) MatchJoinAttempt(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, dispatcher runtime.MatchDispatcher, tick int64, state interface{}, presence runtime.Presence, metadata map[string]string) (interface{}, bool, string) {
	fmt.Println("MATCH JOIN ATTEMPT")

	return state, true, ""
}

func (m *Match) MatchJoin(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, dispatcher runtime.MatchDispatcher, tick int64, state interface{}, presences []runtime.Presence) interface{} {
	fmt.Println("MATCH JOIN")

	return state
}

func (m *Match) MatchLeave(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, dispatcher runtime.MatchDispatcher, tick int64, state interface{}, presences []runtime.Presence) interface{} {
	fmt.Println("MATCH LEAVE")

	return state
}

func (m *Match) MatchLoop(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, dispatcher runtime.MatchDispatcher, tick int64, state interface{}, messages []runtime.MatchData) interface{} {
	// fmt.Println("MATCH LOOP")

	return state
}

func (m *Match) MatchTerminate(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, dispatcher runtime.MatchDispatcher, tick int64, state interface{}, graceSeconds int) interface{} {
	fmt.Println("MATCH TERMINATE")

	return state
}

// All Go modules must have a InitModule function with this exact signature.
func InitModule(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, initializer runtime.Initializer) error {
	// Register the RPC function.
	fmt.Println("INIT MODULE")
	if err := initializer.RegisterRpc("GetMatchRpc", GetMatchRpc); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}
	fmt.Println("REGISTER RPC")

	// Register as match handler, this call should be in InitModule.
	if err := initializer.RegisterMatch("pingpong", func(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule) (runtime.Match, error) {
		return &Match{}, nil
	}); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	return nil
}

type GetMatchResponse struct {
	MatchId string `json:"matchId"`
}

func GetMatchRpc(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	fmt.Println("==== GET MATCH ==== ")

	params := make(map[string]interface{})
	err := json.Unmarshal([]byte(payload), &params)
	fmt.Println("err", err)
	if err != nil {
		return "", err
	}

	limit := 10
	authoritative := true
	label := ""
	minSize := 0
	maxSize := 4
	query := "+label.mode:freeforall label.level:>10"
	matches, err := nk.MatchList(ctx, limit, authoritative, label, minSize, maxSize, query)
	fmt.Println("matches: ", matches)
	fmt.Println("err: ", err)

	modulename := "pingpong" // Name with which match handler was registered in InitModule, see example above.
	matchId, err := nk.MatchCreate(ctx, modulename, params)

	fmt.Println("matchId: ", matchId)
	fmt.Println("err: ", err)

	response := &GetMatchResponse{}

	if err != nil {
		return "", err
	} else {
		// return matchId, nil
		response.MatchId = matchId
		resStr := string(encodeData(response))
		fmt.Println("response: ", resStr)
		return resStr, nil
	}

	// return "Success", nil
}

func encodeData(data interface{}) []byte {
	responseBytes, err := json.Marshal(data)

	if err != nil {
		log.Fatalln("Marshal encode data error: ", err)
	}

	return responseBytes
}
