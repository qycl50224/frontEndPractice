var p1Button = document.querySelector("#p1");
var p2Button = document.querySelector("#p2");
var resetButton = document.getElementById("reset");
var p1ScoreDisplay = document.querySelector("#p1ScoreDisplay");
var p2ScoreDisplay = document.querySelector("#p2ScoreDisplay");
var numInput = document.querySelector("input");
var targetDisplay = document.querySelector("p span");
var p1Score = 0;
var p2Score = 0;
var gameOver = false;
var targetScore = 5;

p1Button.addEventListener("click", function(){
	if(!gameOver){
		p1Score++;
		console.log(p1Score, targetScore);
		if(p1Score === targetScore){
			gameOver = true;
			p1ScoreDisplay.classList.add("winner");
		}
		p1ScoreDisplay.textContent = p1Score;
	}
	
});


p2Button.addEventListener("click", function(){
	if(!gameOver){
		p2Score++;
		if(p2Score === targetScore){
			gameOver = true;
			p2ScoreDisplay.classList.add("winner");
		}
		p2ScoreDisplay.textContent = p2Score;
	}
});

resetButton.addEventListener("click", function(){
	reset();
})

function reset(){
	p1Score = 0;
	p2Score = 0;
	gameOver = false;
	p1ScoreDisplay.textContent = 0;
	p2ScoreDisplay.textContent = 0;
	p1ScoreDisplay.classList.remove("winner");
	p2ScoreDisplay.classList.remove("winner");
}

numInput.addEventListener("change", function(){
	targetDisplay.textContent = numInput.value;
	targetScore = Number(numInput.value);
	reset();
})