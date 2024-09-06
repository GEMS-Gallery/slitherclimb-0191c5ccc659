import Nat8 "mo:base/Nat8";

import Array "mo:base/Array";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Blob "mo:base/Blob";

actor {
  type Player = {
    name: Text;
    position: Nat;
  };

  type GameState = {
    players: [Player];
    currentTurn: Nat;
    winner: ?Text;
  };

  stable var gameState: ?GameState = null;

  let boardSize: Nat = 100;
  let snakesAndLadders: [(Nat, Nat)] = [
    (16, 6), (47, 26), (49, 11), (56, 53), (62, 19),
    (64, 60), (87, 24), (93, 73), (95, 75), (98, 78),
    (1, 38), (4, 14), (9, 31), (21, 42), (28, 84),
    (36, 44), (51, 67), (71, 91), (80, 100)
  ];

  public func initGame(playerNames: [Text]) : async Result.Result<Text, Text> {
    if (playerNames.size() < 2 or playerNames.size() > 4) {
      return #err("Number of players must be between 2 and 4");
    };

    let players = Array.map<Text, Player>(playerNames, func (name) {
      { name = name; position = 1 }
    });

    gameState := ?{
      players = players;
      currentTurn = 0;
      winner = null;
    };

    #ok("Game initialized successfully")
  };

  public func rollDice() : async Result.Result<Nat, Text> {
    switch (gameState) {
      case (null) { #err("Game not initialized") };
      case (?state) {
        let roll = await Random.blob();
        let rollArray = Blob.toArray(roll);
        let diceValue = if (rollArray.size() > 0) {
          (Nat8.toNat(rollArray[0]) % 6) + 1
        } else {
          1 // Fallback to 1 if the array is empty
        };
        #ok(diceValue)
      };
    }
  };

  public func movePlayer(diceRoll: Nat) : async Result.Result<Text, Text> {
    switch (gameState) {
      case (null) { #err("Game not initialized") };
      case (?state) {
        var updatedState = state;
        let currentPlayer = state.players[state.currentTurn];
        var newPosition = currentPlayer.position + diceRoll;

        if (newPosition > boardSize) {
          newPosition := boardSize - (newPosition - boardSize);
        };

        // Check for snakes and ladders
        for ((start, end) in snakesAndLadders.vals()) {
          if (newPosition == start) {
            newPosition := end;
          };
        };

        let updatedPlayer = { name = currentPlayer.name; position = newPosition };
        let updatedPlayers = Array.tabulate<Player>(state.players.size(), func(i) {
          if (i == state.currentTurn) { updatedPlayer } else { state.players[i] }
        });

        updatedState := {
          players = updatedPlayers;
          currentTurn = (state.currentTurn + 1) % state.players.size();
          winner = if (newPosition == boardSize) { ?currentPlayer.name } else { null };
        };

        gameState := ?updatedState;

        if (updatedState.winner != null) {
          #ok("Player " # currentPlayer.name # " wins!")
        } else {
          #ok("Player " # currentPlayer.name # " moved to " # Nat.toText(newPosition))
        }
      };
    }
  };

  public query func getGameState() : async Result.Result<GameState, Text> {
    switch (gameState) {
      case (null) { #err("Game not initialized") };
      case (?state) { #ok(state) };
    }
  };
}
