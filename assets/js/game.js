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
let turnRef = database.ref("/turn");
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
    pRef.on("value", function (snap) {
        game.p1.p1Name = snap.child('/p1/p1Name');
        game.p1.wins = snap.child('/p1/p1Wins').val();
        game.p1.losses = snap.child('/p1/p1Losses').val();
        game.p2.p2Name = snap.child('/p2/p2Name');
        game.p2.wins = snap.child('/p2/p2Wins').val();
        game.p2.losses = snap.child('/p2/p2Losses').val();
        if (!game.p1.isConnected) { //If no player is assigned it assigns the first to player 1
            game.p1.isConnected = true;
            game.playerNum = 1;
            p1Ref.update({
                p1Name: `Player ${game.playerNum}: ${playerName}`,
                p1Wins: game.p1.wins,
                p1Losses: game.p1.losses,
            })
            $('#p1-name').html('Player 1: ' + game.p1.p1Name.val());
            $('#p1-stats').html('Wins: ' + game.p1.wins + 'Losses: ' + game.p1.losses);
            p1Ref.OnDisconnect().remove();
        } else if (!game.p2.isConnected && game.p1.isConnected === true) {
            game.p2.isConnected = true;
            game.playerNum = 2;
            p2Ref.set({
                p2Name: `Player ${game.playerNum}: ${game.p2.p2Name}`,
                p2Wins: game.p2.wins,
                p2Losses: game.p2.losses,
            })
            $('#p2-name').html('Player 2: ' + game.p2.p2Name.val());
            $('#p2-stats').html('Wins: ' + game.p2.wins + 'Losses: ' + game.p2.losses);
            p2Ref.OnDisconnect().remove();
            game.turn = 1; 
            turnRef.update({
                turn: game.turn
            });
        } else if(!game.p1.isConnected && game.p2.isConnected === true) {
            game.p1.isConnected = true;
            game.playerNum = 1;
            p1Ref.update({
                p1Name: `Player ${game.playerNum}: ${playerName}`,
                p1Wins: game.p1.wins,
                p1Losses: game.p1.losses,
            })
            $('#p1-name').html('Player 1: ' + game.p1.p1Name.val());
            $('#p1-stats').html('Wins: ' + game.p1.wins + 'Losses: ' + game.p1.losses);
            p1Ref.OnDisconnect().remove();
        } else {
            $('#p2-name').html('Two players in lobby already!')
        }
        if (game.p1.p1Name.exists() && game.p2.p2Name.exists()) {
            game.turn = 1; 
            turnRef.update({
                turn: game.turn
            });
        }
        function(errorObject) {
        console.log("Displaying error: " + errorObject.code);
    }
});

    $("#p1-content").on("click", function () {//Show Players their own choice
        let p1Choice = $(this).text();
        $("#p1-content").html("<div>" + choice + "</div>");
            p1Ref.update({
                turn: 2
            });
            turnRef.update({
                choice: p1Choice
            });
    });

    $("#p2-content").on("click", function () {
        let choice = $(this).text();
        $("#p2-content").html("<div>" + choice + "</dov>");
            p2Ref.update({
                choice: p2Choice
            });
            turnRef.update({
                turn: 3
            });
    });

    pRef.once("value", function(snap) {
        //Only proceed with players' choices if the value of player 1 and player 2 exists 
        p1Outcome = snap.child("/p1").val()
        p2Outcome = snap.child("/p2").val()
    
        if (!p1Outcome.exists() && !p2Outcome.exists()) { // Introduces choice scenarios 
            if (p1Outcome.val().choice === p2Outcome.val().choice) { //If they both choose the same thing
                $("#p1=content").html("<div>" + p1Outcome.val().choice + "</div>");
                $("#p2=content").html("<div>" + p2Outcome.val().choice + "</div>");
                $("#content").html("<div> It's a tie </div>")

        }       
           


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
