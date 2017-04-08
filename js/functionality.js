/**
 * Created by Jordan Carr on 2017-03-28.
 */
$(document).ready(function () {
// This is only a click event where you can't get the values from form elements
    $("#Submit").click(function () {
        $("#PlayerOneNameDisplay").html($("#playerOneName").val());
        console.log($("#playerOneName").val());
        $("#PlayerTwoNameDisplay").html($("#playerTwoName").val());
    });
});

// This is a form submission where you can get all the values from the form elements
var myCardValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
$("Submit").submit(function (e) {
    // How we can get form values using a form submit
    // $("#ID").val()
    $("#PlayerOneNameDisplay").html($("#PlayerOneName").val());
    $("#PlayerTwoNameDisplay").html($("#PlayerTwoName").val());
    // Calling a post REST API to the card values when you click new game
    $.post("http://ins.mtroyal.ca/~nkhemka/test/process.php")
        .done(function (data) {
            // convert POST response to a JAVASCRIPT OBJECT/variable
            var deck = $.parseJSON(data);
            console.log(deck);
            // putting all 10 card values from POST into the ARRAY- this is our game memory
            for (var i = 0; i < 10; i++) {
                // console.log(deck.Cards[i].value)
                myCardValues[i] = deck.Cards[i].value;
            }
            // we are creating events for each card -- the way you will identify what card you have clicked
            for (i = 0; i < 10; i++) {
                //$("#Card" + i).html(myCardValues[i] + ".svg");
                $("#Card" + i).click(function (e) {
                    // alert("You clicked :" + e.id)
                    // When you click the card, what happen: you will write here
                    console.log(e);
                    console.log(e.target.id);
                    console.log(e.target.id);
                    // how you can access one item from DOM / HTML elements
                    var clickedITEM = e.target.id.toString();
                    console.log(clickedITEM.substr(3, 1));
                    var X = clickedITEM.substr(3, 1);
                    // based on X you can use a if statement to separate each car
                    console.log("You clicked :" + myCardValues[X]);
                });
            }
        });
    e.preventDefault();
    //alert('worked')
    //return "done"
    console.log(myCardValues);
});

function selectCard(x) {
    changeColour(x)

}

function changeColour(x) {
    switch (rgbToHex($(x).css("background-color"))) {
        // blue = #0288D1
        // red  = #F44336
        case "#0288D1": // blue
            x.style.backgroundColor = "#F44336"; // red
            break;
        case "#F44336": // red
            x.style.backgroundColor = ""; //un-sets red colour
            break;
    }
}

function rgbToHex(rgbInputString) {
    var rgbString = rgbInputString.split("(")[1].split(")")[0]; //Remove CSS format leaving RGB CSVs
    rgbString = rgbString.split(","); //Remove commas leaving RGB values

    var hexString = rgbString.map(
        function parseHex(x) {                      //For each array element
            x = parseInt(x).toString(16);           //Convert to a base16 string
            return (x.length === 1) ? "0" + x : x;  //Add zero if only one character
        });
    return ("#" + hexString.join("")).toUpperCase();
}

