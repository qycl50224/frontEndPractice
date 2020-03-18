var numSquares = 6;
var colors = generateColor();
var squares = document.querySelectorAll(".square");
var target = pickColor();
var colorDisplay = document.querySelector("#target");
var messageDisplay = document.querySelector("#message")
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");


init();
//initialize all squares and add them events
function init(){
	setupSquaresButtons();
	setupModeButtons();
	reset();
}

function setupModeButtons(){
	for( var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			reset();
		})
	}
}

function setupSquaresButtons(){
	for(var i = 0; i < squares.length; i++){
		squares[i].style.backgroundColor = colors[i];
		
		squares[i].addEventListener("click", function(){
			if(this.style.backgroundColor === target){
				var pickedColor = this.style.backgroundColor;
				resetButton.textContent = "Try Again?";
				messageDisplay.textContent = "Correct!";
				h1.style.backgroundColor = pickedColor;
				changeColor(pickedColor);
			}else{
				this.style.backgroundColor = "#232323";
				messageDisplay.textContent = "Try Again"
			}
		})
	}
}


function reset(){
	//generate colors
	colors = generateColor();
	//pick a new target color
	target = pickColor();
	//update colorDisplay
	colorDisplay.textContent = target;
	//initialize the message
	messageDisplay.textContent = "";
	//initizlize the reset button text;
	resetButton.textContent = "New Color?";
	//initialize the h1 background color
	h1.style.background = "steelblue";
	//update squares
	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.display = "block";
			squares[i].style.backgroundColor = colors[i];
		}else{
			//not display the last 3 squares
			squares[i].style.display = "none";
		}
	}
}


resetButton.addEventListener("click", function(){
	reset();
})

function changeColor(color){
	for(var i = 0; i < numSquares; i++){
		squares[i].style.backgroundColor = color;
	}
}

function pickColor(){
	var random = Math.floor(Math.random() * numSquares);
	console.log(random);
	return colors[random];
}

function generateColor(){
	var arr = [];
	for(var i = 0; i < numSquares; i++){
		//get random color
		arr.push(randomColor());
	}
	return arr;
}

function randomColor(){
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b +")";
}