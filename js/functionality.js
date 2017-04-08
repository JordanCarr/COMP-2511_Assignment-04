/**
 * Created by Jordan Carr on 2017-03-28.
 */
var myCardValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var selectedCards = [false, false, false, false, false, false, false, false, false, false];
var valueToBeat = 0;
var playerTurn = 1;

$(document).ready(function () {
    // This is only a click event where you can't get the values from form elements
    $("#submitButton").click(function () {
        $("#PlayerOneNameDisplay").html($("#playerOneName").val());
        $("#PlayerTwoNameDisplay").html($("#playerTwoName").val());
    });
    // This is a form submission where you can get all the values from the form elements
    $("form.newGameForm").submit(function (e) {
        // $("#ID").val()
        $("#PlayerOneNameDisplay").html($("#playerOneName").val());
        $("#PlayerTwoNameDisplay").html($("#playerTwoName").val());

        // Calling a post REST API to the card values when you click new game
        $.post("http://ins.mtroyal.ca/~nkhemka/test/process.php").done(function (data) {
            // convert POST response to a JAVASCRIPT OBJECT/variable
            var deck = $.parseJSON(data);
            valueToBeat = deck.Cards[0].value;
            // putting all 10 card values from POST into the ARRAY- this is our game memory
            for (var i = 0; i < myCardValues.length; i++) {
                myCardValues[i] = deck.Cards[i].value;
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
        $("#Move").html(valueToBeat);
        $(".cardArea").css("visibility", "visible");
        e.preventDefault();
    });
});

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
