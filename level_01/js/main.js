/* ----------------------------------------------- */
/* ------------------ Variables ------------------ */
/* ----------------------------------------------- */

var score;
var emotionsMatched;

var ui = $("#gameUI");
var uiIntro = $("#gameIntro");
var uiStats = $("#gameStats");
var uiComplete = $("#gameComplete");
var uiEmotions= $("#emotions");
var uiReset = $(".gameReset");
var uiScore = $(".gameScore");
var uiPlay = $("#gamePlay");
var uiTimer = $("#timer");

var matchingGame = {};
matchingGame.deck = ['happy', 'happy', 'happy', 'sad', 'sad', 'sad', 'fear', 'fear', 'fear', 'anger', 'anger', 'anger', 'disgust', 'disgust', 'disgust', 'surprise', 'surprise', 'surprise'];

/* ----------------------------------------------- */
/* ------------------ On load -------------------- */
/* ----------------------------------------------- */

$(function(){
	  init();
});

//initialise game
function init() {
	uiComplete.hide();
	uiEmotions.hide();
	playGame = false;
	
	uiPlay.click(function(e) {
		e.preventDefault();
		uiIntro.hide();
		startGame();
	});

	uiReset.click(function(e) {
		e.preventDefault();
		uiComplete.hide();					
		reStartGame();
	});
}

/* ----------------------------------------------- */
/* ------------------ Start game ----------------- */
/* ----------------------------------------------- */

function startGame(){
	uiTimer.show();
	uiScore.html("0 seconds");
	uiStats.show();
	uiEmotions.show();
	score = 0;
	emotionsMatched = 0;
	
   	if (playGame == false) {
   			playGame = true;
			matchingGame.deck.sort(shuffle);
			
			for(var i=0;i<17;i++){
				$(".emotion:first-child").clone().appendTo("#emotions");
			}
				
			// initialize each emotion's position
			uiEmotions.children().each(function(index) {
				// align the cards to be 3x6 ourselves.
				$(this).css({
					"left" : ($(this).width() + 20) * (index % 6),
					"top" : ($(this).height() + 20) * Math.floor(index / 6)
				});
				
				// get a pattern from the shuffled deck
				var pattern = matchingGame.deck.pop();
				
				// visually apply the pattern on the emotion's front side.
				$(this).find(".front").addClass(pattern);
				
				// embed the pattern data into the DOM element.
				$(this).attr("data-pattern", pattern);
				
				// listen the click event on each emotion DIV element.
				$(this).click(selectCard);
			});											 
	   	timer();
	};			   
}

//onclick function check if pattern of the card is the samen as the variable, else return
function selectCard() {
	// we do nothing if this card is already clicked.
	if ($(".card-clicked").size() > 3) {
		return;
	}
	
	$(this).addClass("card-clicked");
	
	// check the pattern of the card 0.7s later.
	setTimeout(checkPattern($(this)),700);
}

//if pattern is same remove cards otherwise flip back
function checkPattern(object) {
	var patternClicked = object.data("pattern");
	
	if (isMatchPattern(patternClicked)) {
		
		object.addClass("card-removed");
		object.removeClass("card-clicked");
		emotionsMatched++;
		
		if(document.webkitTransitionEnd){
			$(".card-removed").bind("webkitTransitionEnd",	removeTookEmotions);
		} else {
			removeTookEmotions();
		}
			
	} else {
		object.removeClass("card-clicked");
	}
}

//put 2 flipped cards in an array then check the image to see if it's the same.
function isMatchPattern(patternClicked) {
	var pattern = 'sad';
	return (pattern == patternClicked) ;
}

/* ----------------------------------------------- */
/* ------------------ Restart game --------------- */
/* ----------------------------------------------- */

//recreate the original card , stop the timer and re populate the array with class names
function reStartGame(){
	playGame = false;
	uiEmotions.html("<div class='emotion'><div class='face front'></div></div>");	
	clearTimeout(scoreTimeout);	
	matchingGame.deck = ['happy', 'happy', 'happy', 'sad', 'sad', 'sad', 'fear', 'fear', 'fear', 'anger', 'anger', 'anger', 'disgust', 'disgust', 'disgust', 'surprise', 'surprise', 'surprise'];			
	startGame();
}

//check to see if all emotionsMatched variable is less than 2 if so remove card only otherwise remove card and end game 
function removeTookEmotions() {
	if (emotionsMatched > 2){
		uiEmotions.hide();
		uiComplete.show();
		clearTimeout(scoreTimeout);
	}	
}

//timer for game
function timer() {
	if (playGame) {
		scoreTimeout = setTimeout(function() {
			uiScore.html(++score + " seconds");		
			timer();
		}, 1000);
	};
};

//shuffle cards
function shuffle() {
	return 0.5 - Math.random();
}