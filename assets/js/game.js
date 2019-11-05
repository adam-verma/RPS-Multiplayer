// Create a variable for firebase database 
const database = firebase.database;

// Create a root reference for the players, wins/losses, and player choices

game = { 
    playerNum = 0, 
    playerName, 
    numOfConnections, 
    p1: {
        isConnected: false,
        wins = 0,
        losses = 0,
        choice,
    }, 
    p2: { 
        isConnected: false,
        wins = 0,
        losses = 0,
        choice,
    },
    turn = 0 
}
// From the root reference, create on "value" functions to display per player 
// For each player reference, include isConnected, 
// Wait for each player's move and turn's end before determining the result; if (p1.Connected===true && p2.isConnected===true && turn === 1) {display_choice.text()}
// Once turn ends, record player's move to database database.ref("/players/p1/choice").set("choice")
// 