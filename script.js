let current_quiz;
let current_question_number;
document.getElementById("Submit").addEventListener("click", function(event) {
  event.preventDefault();
  var num_questions = document.getElementById("NumberOfQuestions").value;
  if (num_questions=== ""){
    num_questions = "1";
  }

  const category = document.getElementById("category").value;
  var url_category = "&category=" + category;
  if (category === "Any"){
    url_category = "";
  }

  const type = document.getElementById("type").value;
  var url_type = "&type=" + type;
  if (type === "Any"){
    url_type = "";
  }
  console.log(num_questions);
  const url = "https://opentdb.com/api.php?amount=" + num_questions + url_category + url_type;
  console.log(url);
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log(json);
      current_quiz = new Quiz(json.results);
      current_question_number = 0;
      populateQuestion(current_quiz.get_current_question())
      hideSettings();
      displayQuiz();
    });
});

document.getElementById("true").addEventListener("click", function(event) {
  addResult("True");
});

document.getElementById("false").addEventListener("click", function(event) {
  addResult("False");
});

document.getElementById("a").addEventListener("click", function(event) {
  addResult(document.getElementById("a").innerHTML);
});

document.getElementById("b").addEventListener("click", function(event) {
  addResult(document.getElementById("b").innerHTML);
});

document.getElementById("c").addEventListener("click", function(event) {
  addResult(document.getElementById("c").innerHTML);
});

document.getElementById("d").addEventListener("click", function(event) {
  addResult(document.getElementById("d").innerHTML);
});

document.getElementById("next").addEventListener("click", function(event) {
  console.log("CHECK")
  console.log(document.getElementById("result").innerHTML)

  if (current_quiz.is_finished()){
    displayScore();
    document.getElementById("result").innerHTML = "";
  }
  else if (document.getElementById("result").innerHTML.includes("<h3>")) {
    current_question_number += 1;
    populateQuestion(current_quiz.get_current_question());
    document.getElementById("result").innerHTML = "";
  }
});

function displaySettings(){
  document.getElementById("setup").style.display = "block";
  document.getElementById("score").style.display = "block";
}

function hideSettings(){
  document.getElementById("setup").style.display = "none";
  document.getElementById("score").style.display = "none";
}

function displayQuiz(){
  document.getElementById("quiz").style.display = "block";
}

function hideQuiz(){
  document.getElementById("quiz").style.display = "none";
}

function displayScore(){
  hideQuiz();
  displaySettings();
  document.getElementById("score").innerHTML = "<h1>Your Score is: </h1> <h2>" + current_quiz.get_score() + "%</h2>"
}

function addResult(answer){
  if(current_question_number === current_quiz.current_question){
    if(current_quiz.check_answer(answer)){
      document.getElementById("result").innerHTML = "<h3> Correct! </h3>";
    }
    else {
      document.getElementById("result").innerHTML = "<h3> Incorrect! </h3><br> <h2>Correct Answer is " + current_quiz.get_current_question().correct_answer +"</h2>";

    }
    current_quiz.next_question();
  }
}

function populateQuestion(current_question){
  document.getElementById("question").innerHTML = current_question.question;
  if (current_question.type === "boolean"){
    document.getElementById("tf").style.display = "flex";
    document.getElementById("mc").style.display = "none";
  }
  else {
    var choices = ["a", "b", "c", "d"];
    var place = Math.floor(Math.random()*Math.floor(4));
    answer = choices[place];
    choices.splice(place, 1);
    document.getElementById(answer).innerHTML = "<p>"+ current_question.correct_answer + "</p>";

    for(var i = 0; i < 3; i+=1){
      document.getElementById(choices[i]).innerHTML = "<p>"+ current_question.incorrect_answers[i] + "</p>";
    }

    document.getElementById("tf").style.display = "none";
    document.getElementById("mc").style.display = "flex";
  }
}


class Quiz {
  constructor(results) {
    this.num_questions = results.length;
    this.questions = results;
    this.current_question = 0;
    this.questions_right = 0;
  }
  check_answer(answer){
    let correct = false;
    if(answer.includes(this.questions[this.current_question].correct_answer)){
      this.questions_right += 1;
      correct = true;
    }
    return correct;
  }
  is_finished(){
    if(this.current_question >= this.num_questions){
      return true;
    }
    else{
      return false;
    }
  }
  get_current_question(){
    return this.questions[this.current_question];
  }
  get_score(){
    return this.questions_right/this.num_questions * 100;
  }
  next_question(){
    this.current_question +=1;
  }
}
