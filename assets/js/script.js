var question1 = {
    questionText: "What is not a looping function?",
    answers: ["For", "While", "If", "Do While"],
    correct: "If"
}

var question2 = {
    questionText: "What is 3+3 equal to?",
    answers: ["1", "33", "9", "6"],
    correct: "6"
}

var question3 = {
    questionText: "What shape has 20 sides?",
    answers: ["Icosahedron", "Dodecahedron", "Pentagonal Trapezohedron", "Octagon"],
    correct: "Icosahedron"
}

var question4 = {
    questionText: "What coding language have we not learned in bootcamp so far?",
    answers: ["Javascript", "HTML", "CSS", "C++"],
    correct: "C++"
}

var question5 = {
    questionText: "How many days are in a typical year?",
    answers: ["7", "365", "1000", "30"],
    correct: "365"
}
//set each question object into an array
var questionList = [question1, question2, question3, question4, question5];
var answerID = ["a", "b", "c", "d"]; //for displaying answers with letters

var startEl = document.querySelector("#start");
var questionEl = document.querySelector("#question");
var choicesEl = document.querySelector("#answerChoices");
var answersEl = document.querySelectorAll(".answer");
var resultEl = document.querySelector("#result");
var submitEl = document.querySelector("#submit");
var clearEl = document.querySelector("#clearButton");
var refreshEl = document.querySelector("#refreshButton");

var timerEl = document.querySelector("#timer");
var timeLeft = 50; //starting time
var finished = false; //check on whether all questions have been answered
var currentQuestion = 0; //current question index

//array for leaderboard
var initials = [];
var scores = [];

startEl.addEventListener("click", function() {
	countdown();
	choicesEl.setAttribute("style", "display: block")
	startEl.setAttribute("style", "display: none");	
	generateQuestions(questionList[currentQuestion]);
});

//timer that decrements by seconds
function countdown() {
	
	var timeInterval = setInterval(function () {
		timerEl.textContent = timeLeft + " seconds remaining";
		timeLeft--;
		if(timeLeft < 0 || finished) { //timer ends when time remaining is 0 or if all questions are answers
		timerEl.textContent = "";
		clearInterval(timeInterval);
		generateResults();//displays your score
		}
	}, 1000);
}

//based on the current question, writes over the new questions and answers
function generateQuestions(question) {
	questionEl.textContent = question.questionText;
	for (var i = 0; i < answersEl.length; i++) {
		answersEl[i].textContent = answerID[i].toUpperCase() + ": " + question.answers[i];
	}
}

//when an answer is chosen, checks whether the answer is correct or wrong and generates the next set of questions
choicesEl.addEventListener("click", function(event) { //calls function every time anything within the choices list is clicked
	var element = event.target;
	if  (element.matches(".answer")) {//checks if the element clicked is one of the answers
		if (element.textContent.substring(3,element.textContent.length) === questionList[currentQuestion].correct) {//checks if the text in the answer matches with the correct answer
			resultEl.textContent = "Correct";
		} else {//if the answer chosen is wrong, takes off seconds from the current time
			timeLeft -= 10;
			resultEl.textContent = "Wrong";
		}
		currentQuestion++;//increment the current time
		if (currentQuestion >= questionList.length) {//checks if we have finished all questions
			finished = true;
		} else {//if there are questions left, generate them
		  generateQuestions(questionList[currentQuestion])
		}
	}
});

//hides answers element and displays the user's current score and reveals the submission
function generateResults() {
	choicesEl.setAttribute("style", "display:none");
	if (timeLeft > 0) { 
		questionEl.textContent = "Congratulations! You finished!";
		resultEl.textContent = "You scored " + timeLeft + " points!";
	} else {
		questionEl.textContent = "You ran out of time!";
		resultEl.textContent = "You scored 0 points!";
	}
	submitEl.setAttribute("style", "display:block");
}

//when submit was clicked on, pushes initials and current score onto the array and puts it onto local storage
document.querySelector("#submitButton").addEventListener("click", function(event) {
	event.preventDefault();
	initials.push(document.querySelector("#initials").value);
	if(timeLeft <0) {
		timeLeft = 0;
	}
	scores.push(timeLeft);
	localStorage.setItem("initials", JSON.stringify(initials));
	localStorage.setItem("scores", JSON.stringify(scores));

	viewHighScore();
});

//when view highscores is clicked, call viewHighScore()
document.querySelector("#showBoard").addEventListener("click", function(event) {
	event.preventDefault();
	viewHighScore();
});

//when clicked, calls clearHighScore()
clearEl.addEventListener("click", function(event) {
	event.preventDefault();
	clearHighScore();
});

//when clicked, page refreshes
refreshEl.addEventListener("click", function(event) {
	location.reload();
});

//hides current elements and reveals elements for scoreboard and generates list
function viewHighScore() {
	document.querySelector("#showBoard").setAttribute("style", "visibility: hidden");
	submitEl.setAttribute("style", "display: none");
	questionEl.setAttribute("style", "display:none");
	resultEl.setAttribute("style", "display:none");
	startEl.setAttribute("style", "display:none");
	document.querySelector("#title").textContent = "LeaderBoard";
  clearEl.setAttribute("style", "display:flex; justify-content: center");
	refreshEl.setAttribute("style", "display:flex")
	var newUl = document.createElement("ul");//creates ul tag
	for (var i=0;i<initials.length;i++) {//creates li tag and sets text to be the current initials and scores
		var newLi = document.createElement("li");
		newLi.textContent = initials[i] + ": " + scores[i];
		newUl.appendChild(newLi);//appends li to ul
	}
	newUl.setAttribute("id", "leaderBoard");
	document.querySelector("#container").appendChild(newUl);//appends to container

}

//overrides current array with empty array and removes the ul scoreboard
function clearHighScore() {
	localStorage.setItem("initials", JSON.stringify([]));
	localStorage.setItem("scores", JSON.stringify([]));
	document.querySelector("#leaderBoard").remove();//doesn't work
	
}
//obtains initials and scores from local storage
function init() {
	initials = JSON.parse(localStorage.getItem("initials"));
	scores = JSON.parse(localStorage.getItem("scores"));
	if (initials == null) {//if values don't exist, sets empty array
		initials = []
	}
	if (scores == null) {
		scores = []
	}
}


init();