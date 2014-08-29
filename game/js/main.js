/* ----------------------------------------------- */
/* ------------------ Variables ------------------ */
/* ----------------------------------------------- */
var playGame;
var correctElements = 0;
var correctEmotion;
var emotions = [ "anger", "happy", "fear", "disgust", "sad", "surprise" ];

var ui = $("#gameUI");
var uiIntro = $("#gameIntro");
var uiStats = $("#gameStats");
var uiComplete = $("#gameComplete");
var uiGame = $("#gameArea");
var uiPlay = $("#gamePlay");
var uiReset = $("#gameReset a");

/* ----------------------------------------------- */
/* ------------------ On load -------------------- */
/* ----------------------------------------------- */

$(function() {
	init();
});

//initialise game
function init(){
	uiComplete.hide();
	uiGame.hide();
	playGame = false;

	//uiIntro.show();
	uiIntro.hide();
	startGame();
	
	uiPlay.click(function(e){
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
	uiStats.show();
	loadGame();
	uiGame.show();
}

function loadGame(){
	// Hide the success message
	$('#success').hide();
	$('#success').css( {left: '160px', top: '150px', width: 0, height: 0} );
	$('#answer').remove();

	emotions.sort(function() {return Math.random() - 0.3;});
	correctEmotion = emotions[0];

	// Create the face elements for each expression
	var eyebrows = [ "anger", "happy", "fear", "disgust", "sad", "surprise" ];
	eyebrows.sort(function() {return Math.random() - 0.5;});

	$('<div class="eyebrowsList"></div>').appendTo( '#dragArea' );
	for ( var i=0; i< eyebrows.length; i++ ) {
	$('<div></div>').attr({ 'data-zone': 'eyebrows', 'data-emotion': eyebrows[i] }).appendTo( '.eyebrowsList' ).draggable( {
		containment: 'gameArea',
		stack: '#dragArea',
		cursor: 'move',
		revert: true
	} );
	}
	
	var eyes = [ "anger", "happy", "fear", "disgust", "sad", "surprise" ];
	eyes.sort(function() {return Math.random() - 0.5;});

	$('<div class="eyesList"></div>').appendTo( '#dragArea' );
	for ( var j=0; j< eyes.length; j++ ) {
	$('<div></div>').attr({ 'data-zone': 'eyes', 'data-emotion': eyes[j] }).appendTo( '.eyesList' ).draggable( {
		containment: '#gameArea',
		stack: '#dragArea',
		cursor: 'move',
		revert: true
	} );
	}

	var mouths = [ "anger", "happy", "fear", "disgust", "sad", "surprise" ];
	mouths.sort(function() {return Math.random() - 0.5;});

	$('<div class="mouthsList"></div>').appendTo( '#dragArea' );
	for ( var k=0; k< mouths.length; k++ ) {
		$('<div></div>').attr({ 'data-zone': 'mouth', 'data-emotion': mouths[k] }).appendTo( '.mouthsList' ).draggable( {
		containment: '#gameArea',
		stack: '#dragArea',
		cursor: 'move',
		revert: true
		} );
	}

	var dropzone = [ "eyebrows", "eyes", "mouth" ];

	for ( var n=0; n< dropzone.length; n++ ) {
		$('<div></div>').attr({ 'data-zone': dropzone[n] }).appendTo( '#dropArea' ).droppable( {
		accept: '#dragArea div div',
		drop: handleElementDrop
		} );
	}

	$('<div id="answer">' + correctEmotion + '</div>').appendTo( '#gameArea' );
}

function handleElementDrop( event, ui ) {
  var correctZone = $(this).data( 'zone' );

  var dragEmotion = ui.draggable.data( 'emotion' );
  var dragZone = ui.draggable.data( 'zone' );
 
  if ( correctZone == dragZone && correctEmotion == dragEmotion ) {
    ui.draggable.addClass( 'hovered' );
    $(this).addClass( 'hovered' );

    ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );

    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );

    ui.draggable.draggable( 'option', 'revert', false );
    correctElements++;
  }
 
  if ( correctElements == 3 ) {
    $('#success').show();
    $('#success').animate( {
      left: '162px',
      top: '206px',
      width: '600px',
      height: '100px',
      opacity: 1
    } );
  }
}

/* ----------------------------------------------- */
/* ------------------ Restart game --------------- */
/* ----------------------------------------------- */

//recreate the original card , stop the timer and re populate the array with class names
function reStartGame(){
	playGame = false;
	correctElements = 0;

	$('#dragArea').html('');
	$('#dropArea').html('');

	startGame();
}

$(document).ready(function(){
 uiReset.bind('click', function(){
    reStartGame();
  });
});