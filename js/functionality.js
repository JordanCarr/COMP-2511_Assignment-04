/**
 * Created by Jordan Carr on 2017-03-28.
 */

//TODO more better comments

var myCardValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var selectedCards = [false, false, false, false, false, false, false, false, false, false];
var valueToBeat = 0;
var playerTurnValue = 1;

$(document).ready(function () {
    // On player name submission setup game with players, cards, etc...
    $("form.newGameForm").submit(function (e) {
        loadPlayers();
        loadCards();
        setupEndGame();
        e.preventDefault();
    });
});

// Set player display to show input names and initialise player 1's turn
function loadPlayers() {
    $("#PlayerOneNameDisplay").html($("#playerOneName").val());
    $("#PlayerTwoNameDisplay").html($("#playerTwoName").val());

    //Game starts with player 1's turn
    playerTurnValue(1);

    $("#Move").html(valueToBeat);
}

function playerTurn(playerNumber) {
    var playerMoveElement = $("#PlayerMove");
    switch (playerNumber) {
        case 1:
            playerMoveElement.html("Player 1, value to beat: ");
            break;
        case 2:
            playerMoveElement.html("Player 2, value to beat: ");
            break;
    }
}

function loadCards() {
    $.post("http://ins.mtroyal.ca/~nkhemka/test/process.php").done(function (data) {
        // convert POST response to a JAVASCRIPT OBJECT/variable
        var deck = $.parseJSON(data);
        valueToBeat = deck.Cards[0].value;
        // putting all 10 card values from POST into the ARRAY- this is our game memory
        for (var i = 0; i < myCardValues.length; i++) {
            myCardValues[i] = deck.Cards[i + 1].value;
        }
        // we are creating events for each card -- the way you will identify what card you have clicked
        for (var cardIndex = 0; cardIndex < myCardValues.length; cardIndex++) {
            var card = $("#Card" + cardIndex);
            card.html(myCardValues[cardIndex]);
            card.click(function (e) {
                var cardIndex = e.target.id.substr(4, 1);
                var card = $(e.target);
                selectCard(cardIndex, card);
                console.log("You clicked card: " + cardIndex);
                console.log("This card has a value of: " + myCardValues[cardIndex])
            });
        }
    });

    $(".cardArea").css("visibility", "visible");
}

function selectCard(cardIndex, card) {
    // Store Card Selected Value
    switch (selectedCards[cardIndex]) {
        case true:
            selectedCards[cardIndex] = false;
            break;
        case false:
            selectedCards[cardIndex] = true;
            break;
    }

    // Change Colour
    switch (card.css("background-color")) {
        // blue = #0288D1, rgb(2, 136, 209)
        // red  = #F44336, rgb(244, 67, 54)
        case "rgb(2, 136, 209)": // blue
            card.css("background-color", "#F44336"); // red
            break;
        case "rgb(244, 67, 54)": // red
            card.css("background-color", ""); //un-sets colour
            break;
    }
}

function setupEndGame() {
    $("#EndGameButton").click(function () {
        window.location.reload();
    });
}
