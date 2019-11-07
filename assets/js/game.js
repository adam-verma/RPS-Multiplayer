// Create a variable for firebase database 
const database = firebase.database();

// Create a root reference for the players, wins/losses, and player choices

game = {
    playerNum: 0,
    numOfConnections: 0,
    p1: {
        isConnected: false,
        wins: 0,
        losses: 0,
        p1Name: '',
        choice: '',
    },
    p2: {
        isConnected: false,
        wins: 0,
        losses: 0,
        p2Name: '',
        choice: '',
    },
    turn: 0,
}

// Create refs in the database for respective variables 
let pRef = database.ref("/players");
let p1Ref = database.ref("/players/p1");
let p2Ref = database.ref("/players/p2");
let turnRef = database.ref("/turns");
let chatRef = database.ref("/chat");
let connectedRef = database.ref(".info/connected");
let numOnlineRef = database.ref("/isOnline");



$(document).on("click", "#add-name", function (event) {
    event.preventDefault();
    // Pull name entry from dom into variable
    playerName = $('#player-name').val().trim().toUpperCase();
    // Clear the player name text-box
    $('#player-name').val("");
    console.log("Does this work??")
    // Update the database with player info
    pRef.once("value").then(function (snap) {
        game.p1.p1Name = snap.child('/p1/p1Name');
        game.p1.wins = snap.child('/p1/p1Wins').val();
        game.p1.losses = snap.child('/p1/p1Losses').val();
        game.p2.p2Name = snap.child('/p2/p2Name');
        game.p2.wins = snap.child('/p2/p2Wins').val();
        game.p2.losses = snap.child('/p2/p2Losses').val();
        if (!game.p1.p1Name.exists()) { //If no player is assigned it assigns the first to player 1
            game.p1.isConnected = true;
            game.playerNum = 1;
            p1Ref.set({
                p1Name: `Player ${game.playerNum}: ${playerName}`,
                p1Wins: game.p1.wins,
                p1Losses: game.p1.losses,
            })
            $('#p1-name').html('Player 1: ' + game.p1.p1Name.val());
            $('#p1-stats').html('Wins: ' + game.p1.wins + 'Losses: ' + game.p1.losses);
        } else if (!game.p2.p2Name.exists()) {
            game.p2.isConnected = true;
            game.playerNum = 2;
            p2Ref.set({
                p2Name: `Player ${game.playerNum}: ${game.p2.p2Name}`,
                p2Wins: game.p2.wins,
                p2Losses: game.p2.losses,
            })
            $('#p2-name').html('Player 2: ' + game.p2.p2Name.val());
            $('#p2-stats').html('Wins: ' + game.p2.wins + 'Losses: ' + game.p2.losses);
        } else {
            $('#p2-name').html('Two players in lobby already!')
        }
        // Log errors to console
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // From the root reference, create listener to detect connection state 
    connectedRef.on("value", function (snap) {
        if (snap.val() === true) {
            game.numberOfConnections++;
            $('.chat').append(`${moment().fromNow()}: A new person connected... <br /> ${game.numOfConnections} people connected <br />`);
        } else {
            game.numberOfConnections--;
            $('.chat').append(`${moment().fromNow()}: A new person connected... <br /> ${game.numOfConnections} people connected <br />`);
        }
    })

});

// For each player reference, include isConnected, 
// Wait for each player's move and turn's end before determining the result; if (p1.Connected===true && p2.isConnected===true && turn === 1) {display_choice.text()}
// Once turn ends, record player's move to database database.ref("/players/p1/choice").set("choice")
// 