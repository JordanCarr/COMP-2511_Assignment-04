/**
 * Created by Jordan Carr on 2017-03-28.
 */
let cardValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let selectedCards = [false, false, false, false, false, false, false, false, false, false];
let valueToBeat = 0;
let playerTurnValue = 0;
let playerName = ["", ""];

$(document).ready(function () {
    // On player name submission setup game with players, cards, etc...
    $("form.newGameForm").submit(function (e) {
        loadPlayers();
        setupEndGame();
        e.preventDefault();
    });
});

// Set player display to show input names and initialise player 1's turn
function loadPlayers() {
    playerName[0] = $("#Player1Name").val();
    playerName[1] = $("#Player2Name").val();
    $("#Player1NameDisplay").html(playerName[0]);
    $("#Player2NameDisplay").html(playerName[1]);

    //Game starts with player 1's turn which has an index of 0
    setupPlayerTurn(playerTurnValue);
}

function setupPlayerTurn(playerNumber) {
    loadCards(playerNumber);
}

function loadCards(playerNumber) {
    $.post("http://ins.mtroyal.ca/~nkhemka/test/process.php").done(function (data) {
        // convert POST response to a JAVASCRIPT OBJECT/variable
        const deck = $.parseJSON(data);
        /** @namespace deck.Cards */
        valueToBeat = deck.Cards[0].value;
        // putting all 10 card values from POST into the ARRAY- this is our game memory
        for (let i = 0; i < cardValues.length; i++) {
            cardValues[i] = deck.Cards[i + 1].value;
        }
        // we are creating events for each card -- the way you will identify what card you have clicked
        for (let cardIndex = 0; cardIndex < cardValues.length; cardIndex++) {
            const card = $("#Card" + cardIndex);
            card.html(cardValues[cardIndex]);  //TODO make cards have separate images
            resetCard(card);
            card.click(cardSetup);
        }
        playerTurn(playerNumber);
        $(".cardArea").css("visibility", "visible");
    });
}

function resetCard(card) {
    card.off("click", cardSetup);
    card.css("background-color", "");
}

function playerTurn(playerNumber) {
    setupEndTurn();
    $("#PlayerMove").html(`Player ${playerNumber + 1}, value to beat: `);
    $("#Move").html(valueToBeat);
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
    selectedCards[cardIndex] = !selectedCards[cardIndex];
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

function sumOfSelectedCards() {
    let sum = 0;
    for (let i = 0; i < selectedCards.length; i++) {
        if (selectedCards[i] === true) {
            sum += cardValues[i];
        }
    }
    return sum;
}

function changeTurn() {
    playerTurnValue = (playerTurnValue + 1) % 2
}

function setupEndTurn() {
    let endTurnButton = $("#EndTurnButton");
    endTurnButton.off("click", endTurn);
    endTurnButton.click(endTurn)
}

function endTurn() {
    console.log(selectedCards);
    let sum = sumOfSelectedCards();
    if (sum > valueToBeat) {
        let playerScoreDisplay = $(`#Player${playerTurnValue + 1}ScoreDisplay`);
        let currentScore = playerScoreDisplay.html();
        playerScoreDisplay.html(parseInt(currentScore) + 10);
        changeTurn();
        alert(`You are correct, you score 10 points, now it's ${playerName[playerTurnValue]}'s turn`);
        setupPlayerTurn(playerTurnValue)
    } else {
        changeTurn();
        alert(`You are incorrect, you score 0 points, now it's ${playerName[playerTurnValue]}'s turn`);
        setupPlayerTurn(playerTurnValue)
    }
    resetSelected()
}

function resetSelected() {
    for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i] = false;
    }
}


function setupEndGame() {
    $("#EndGameButton").click(function () {
        window.location.reload();
    });
}
