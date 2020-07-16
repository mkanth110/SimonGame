var userClickedPattern = [];
var gamePattern = [];
var buttoncolors = ["red", "blue", "green", "yellow"];
var started = false;
var level = 1;
var pos = 0;
var colorIndex = 0;
var score = 0;
var highscore = 0;
var wrong;

// Function to start game
function startGame() {
  $(".score").text("Score: 0"); // Reset score to 0
  $(".hiScore").text("High Score: " + localStorage.getItem("highscore")); // Display high score
  $(".gameContainer").show(); // Show game div
  $(".msgContainer").fadeOut(300); // Fade out start message div
  setTimeout(nextSequence, 1000); // In one second, start the sequence
  started = true; // Game now started
} // End of startGame function

// Function to play the previously selected buttons
function playGamePattern() {
  started = false; // False to disable buttons from being pressed until the sequence has been played.
  $("#instructions").text("Watch!"); //Change instructions

// setInterval to play the gamePattern array items every 1 second
  var player = setInterval(function() {
    playsound(gamePattern[colorIndex]); // Play audio
    $("#" + (gamePattern[colorIndex])).fadeOut(300).fadeIn(300); // Animate button
    colorIndex++; // Increment to move on to the next item in the array
    if (colorIndex >= gamePattern.length) { // When colorIndex is equal to the number of items in gamePattern array
      clearInterval(player); // Clear interval
    }
  }, 1000);

  setTimeout(nextSequence, 1000 * (gamePattern.length + 1)); // nextSequence function 1 second after the last item in gamePattern array is played
}

// Function for next sequence
function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4); // Generate random number between 0-3
  var randomChosencolor = buttoncolors[randomNumber]; // From the random number generated, select the coordinating color in the buttoncolors Array
  $("#" + randomChosencolor).fadeOut(300).fadeIn(300); // Select the button with the corresponding color and animate
  gamePattern.push(randomChosencolor); // Push the color into the gamePattern Array
  playsound(randomChosencolor); // Play the audio
  userClickedPattern = []; // Clear userClickedPattern
  pos = 0; // Reset pos to 0

  setTimeout(function() {
    // Change instruction after 1 second to let player know to start
    $("#instructions").text("Play!");
  }, 1000);

  started = true; // Re-enable the buttons
}

// Function to play audio when button is clicked or played
function playsound(name) {

  const mq = window.matchMedia( "(min-width: 500px)" );

  if (mq.matches) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
   }
}

// Function to animate buttons
function animatePress(currentcolor) {
  var activeButton = $("." + currentcolor);
  activeButton.addClass("pressed");

  setTimeout(function() {
    activeButton.removeClass("pressed");
  }, 150);
}


// Detect which buttons are clicked
$(".myButton").click(function() {
  var userChosencolor = $(this).attr("id"); // Find id
  if (started == true) { // If the gamePattern sequence has been played already
    playsound(userChosencolor); // Play audio
    animatePress(userChosencolor); // Animate button
    userClickedPattern.push(userChosencolor); // Push the chosen color to userClickedPattern array
    checkAnswer(); // Call function to check answer
  }
});


// Function to check answer
function checkAnswer() {
  if (userClickedPattern[pos] == gamePattern[pos]) {
    pos++; // Increment to check for the next selection
    if (userClickedPattern.length == gamePattern.length) { // When player has repeated all of the gamePattern sequence
      colorIndex = 0; // Reset colorIndex for playGamePattern sequence
      score++; // Add to score
      $(".score").text("Score: " + score); // Show score
      if (score > localStorage.getItem("highscore")) { // If score is more than the stored highscore
        localStorage.setItem("highscore", score); // Set new score as highscore
        $(".hiScore").text("High Score: " + localStorage.getItem("highscore"));
      }
      setTimeout(playGamePattern, 1000); // After 1 second, playGamePattern
    }
  } else { // If player has got the wrong sequence
    playsound(wrong); // Play wrong audio

    // Flash game over class
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);

    $(".gameContainer").hide(); // Hide game div
    $(".msgTitle").text("Game Over"); // Change text to game over
    $(".msgP1").text("Score: " + score); // Display score
    $(".msgP2").text("High Score: " + localStorage.getItem("highscore")); // Display highscore
    $(".msgP3").hide(); // Hide third p tag
    $(".startBtn").text("Try Again"); // Change button text
    $(".msgContainer").addClass("addMarginTop").show(); // Add class for extra margin top
    startOver(); // Call function to reset values
  }
}

// Function to reset values
function startOver() {
  gamePattern = [];
  started = false;
  score = 0;
}