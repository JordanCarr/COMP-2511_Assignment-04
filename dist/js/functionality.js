"use strict";

/**
 * Created by Jordan Carr on 2017-03-28.
 */
var cardValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var selectedCards = [false, false, false, false, false, false, false, false, false, false];
var valueToBeat = 0;
var playerTurnValue = 0;
var playerName = ["", ""];

$(document).ready(function () {
    return $("form.newGameForm").submit(function (e) {
        return initialiseGame(e);
    });
});

function initialiseGame(e) {
    e.preventDefault();
    loadPlayers();
    setupGame();
    setupEndGame();
}

function setupGame() {
    setupPlayerTurn(playerTurnValue);
    setupTopArea();
}

function setupTopArea() {
    $("#NewGame").remove();
    $("#Score").css("width", "33%");
    $(".scoreBoard div:nth-child(2n)").css("width", "50%");
    $(".scoreBoard div:not(:nth-child(2n))").css("width", "50%");
    $("#ValueToReach").css("width", "34%");
    $("#EndGame").css("width", "33%");
}

function loadPlayers() {
    playerName[0] = $("#Player1Name").val();
    playerName[1] = $("#Player2Name").val();
    $("#Player1NameDisplay").html(playerName[0]);
    $("#Player2NameDisplay").html(playerName[1]);
}

function setupPlayerTurn(playerNumber) {
    loadCards(playerNumber);
}

function loadCards(playerNumber) {
    //noinspection FunctionWithMultipleLoopsJS
    $.post("http://ins.mtroyal.ca/~nkhemka/test/process.php").done(function (data) {
        // convert POST response to a JAVASCRIPT OBJECT/variable
        var deck = $.parseJSON(data);
        /** @namespace deck.Cards */
        valueToBeat = deck.Cards[0].value;
        // putting all 10 card values from POST into the ARRAY- this is our game memory
        for (var i = 0; i < cardValues.length; i++) {
            cardValues[i] = deck.Cards[i + 1].value;
        }
        // we are creating events for each card -- the way you will identify what card you have clicked
        for (var cardIndex = 0; cardIndex < cardValues.length; cardIndex++) {
            var card = $("#Card" + cardIndex);
            resetCard(card);
            card.addClass("card" + cardValues[cardIndex]);
            card.click(cardSetup);
        }
        playerTurn(playerNumber);
        $(".cardArea").css("visibility", "visible");
    });
}

function resetCard(card) {
    card.off("click", cardSetup);
    card.css("background-color", "");
    [0, 1, 2, 3, 4].map(function (i) {
        return card.removeClass('card' + i);
    });
}

function playerTurn(playerNumber) {
    setupEndTurn();
    $("#PlayerMove").html(playerName[playerNumber] + ", value to beat: ");
    $("#Move").html(valueToBeat);
}

function cardSetup(e) {
    var cardIndex = e.target.id.substr(4, 1);
    var card = $(e.target);
    selectCard(cardIndex, card);
    console.log("You clicked card: " + cardIndex);
    console.log("This card has a value of: " + cardValues[cardIndex]);
}

function selectCard(cardIndex, card) {
    // Store Card Selected Value
    selectedCards[cardIndex] = !selectedCards[cardIndex];
    // Change Colour
    switch (card.css("background-color")) {
        // blue = #0288D1, rgb(2, 136, 209)
        // red  = #F44336, rgb(244, 67, 54)
        case "rgb(2, 136, 209)":
            // blue
            card.css("background-color", "#F44336"); // red
            break;
        case "rgb(244, 67, 54)":
            // red
            card.css("background-color", ""); //un-sets colour
            break;
        default:
            alert("Something went horribly wrong with the style sheet. Reloading");
            window.location.reload();
    }
}

function sumOfSelectedCards() {
    var sum = 0;
    for (var i = 0; i < selectedCards.length; i++) {
        if (true === selectedCards[i]) {
            sum += cardValues[i];
        }
    }
    return sum;
}

function changeTurn() {
    playerTurnValue = (playerTurnValue + 1) % 2;
}

function setupEndTurn() {
    var endTurnButton = $("#EndTurnButton");
    endTurnButton.off("click");
    endTurnButton.click(function () {
        if (sumOfSelectedCards() > valueToBeat) {
            var playerSelector = "#Player" + (playerTurnValue + 1) + "ScoreDisplay";
            var playerScoreDisplay = $(playerSelector);
            var currentScore = playerScoreDisplay.html();
            playerScoreDisplay.html(parseInt(currentScore) + 10);
            changeTurn();
            alert("You are correct, you score 10 points, now it's " + playerName[playerTurnValue] + "'s turn");
            setupPlayerTurn(playerTurnValue);
        } else {
            changeTurn();
            alert("You are incorrect, you score 0 points, now it's " + playerName[playerTurnValue] + "'s turn");
            setupPlayerTurn(playerTurnValue);
        }
        selectedCards.fill(false);
        setupGame();
    });
}

function setupEndGame() {
    var endGameButton = $("#EndGameButton");
    endGameButton.click(function () {
        var playerScores = [parseInt($("#Player1ScoreDisplay").html()), parseInt($("#Player2ScoreDisplay").html())];
        if (playerScores[0] > playerScores[1]) {
            alert(playerName[0] + " Wins");
        } else if (playerScores[1] > playerScores[0]) {
            alert(playerName[1] + " Wins");
        } else {
            alert(playerName[0] + " and " + playerName[1] + " tied");
        }
        window.location.reload();
    });
}
//# sourceMappingURL=functionality.js.map