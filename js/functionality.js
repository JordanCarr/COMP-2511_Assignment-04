/**
 * Created by Jordan Carr on 2017-03-28.
 */
let cardValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let selectedCards = [false, false, false, false, false, false, false, false, false, false];
let valueToBeat = 0;
let playerTurnValue = 0;

$(document).ready(function () {

    // On player name submission setup game with players, cards, etc...
    $("form.newGameForm").submit(function (e) {
        loadPlayers();
        loadCards();
        setupEndTurn();
        setupEndGame();
        e.preventDefault();
    });
});

// Set player display to show input names and initialise player 1's turn
function loadPlayers() {
    $("#PlayerOneNameDisplay").html($("#playerOneName").val());
    $("#PlayerTwoNameDisplay").html($("#playerTwoName").val());

    //Game starts with player 1's turn
    playerTurn(1);

    $("#Move").html(valueToBeat);
}

function playerTurn(playerNumber) {
    const playerMoveElement = $("#PlayerMove");
    playerMoveElement.html(`Player ${playerNumber}, value to beat: `);
}

function loadCards() {
    $.post("http://ins.mtroyal.ca/~nkhemka/test/process.php").done(function (data) {
        // convert POST response to a JAVASCRIPT OBJECT/variable
        const deck = $.parseJSON(data);
        valueToBeat = deck.Cards[0].value;
        // putting all 10 card values from POST into the ARRAY- this is our game memory
        for (let i = 0; i < cardValues.length; i++) {
            cardValues[i] = deck.Cards[i + 1].value;
        }
        // we are creating events for each card -- the way you will identify what card you have clicked
        for (let cardIndex = 0; cardIndex < cardValues.length; cardIndex++) {
            const card = $("#Card" + cardIndex);
            card.html(cardValues[cardIndex]);
            card.click(cardSetup);
        }
    });

    $(".cardArea").css("visibility", "visible");
}

function cardSetup(e) {
    const cardIndex = e.target.id.substr(4, 1);
    const card = $(e.target);
    selectCard(cardIndex, card);
    console.log("You clicked card: " + cardIndex);
    console.log("This card has a value of: " + cardValues[cardIndex])
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

function setupEndTurn() {
    $("#EndTurnButton").click(function () {
        if (!selectedCards.find(x => x === true)) {
            console.log(selectedCards);
            alert("Please select a card");

        }
    })
}

function setupEndGame() {
    $("#EndGameButton").click(function () {
        window.location.reload();
    });
}
