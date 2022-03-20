const question = document.querySelector("#question");
const choices = document.querySelectorAll(".choice-text");
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");
const body = document.querySelector("body");

const SCORE_POINTS = 100;
const MAX_QUESTIONS = 5;
const URL = "https://opentdb.com/api.php?amount=5&category=18&type=multiple";

class App {
  #questions;
  #currentQuestion;
  #acceptingAnswers;
  #score;
  #questionCounter;
  #availableQuestions;

  constructor() {
    this.#currentQuestion = {};
    this.#acceptingAnswers = true;
    this.#score = 0;
    this.#questionCounter = 0;
    this.#availableQuestions = [];

    this.#fetchQuestions(URL).then(() => {
      console.log(this.#questions);
      this.#startGame();
    });

    // Attach event handlers
    choices.forEach((choice) =>
      choice.addEventListener("click", this.#checkAnswer.bind(this))
    );
  }

  async #fetchQuestions(url) {
    const res = await fetch(url);
    const data = await res.json();
    const questionsData = data.results;
    this.#questions = questionsData.map((question) => {
      return {
        question: question.question,
        choices: [...question.incorrect_answers, question.correct_answer],
        correctAnswer: question.correct_answer,
      };
    });
  }

  #startGame() {
    this.#availableQuestions = [...this.#questions];
    this.#getNewQuestion();
  }

  #checkAnswer(e) {
    if (!this.#acceptingAnswers) {
      return;
    }

    this.#acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.innerText;
    console.log(selectedAnswer);

    const classToApply =
      selectedAnswer == this.#currentQuestion.correctAnswer
        ? "correct"
        : "incorrect";

    body.classList.add(classToApply);
    const waitTime = classToApply === "correct" ? 5000 : 1000;

    setTimeout(() => {
      body.classList.remove(classToApply);
      if (classToApply === "correct") {
        return window.location.assign("index.html");
      }

      this.#getNewQuestion();
    }, waitTime);
  }

  #getNewQuestion() {
    if (
      this.#availableQuestions.length === 0 ||
      this.#questionCounter > MAX_QUESTIONS
    ) {
      return window.location.assign("index.html");
    }

    this.#questionCounter++;
    progressText.innerHTML = `Question ${
      this.#questionCounter
    } of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${
      (this.#questionCounter / MAX_QUESTIONS) * 100
    }%`;

    const questionId = Math.floor(
      Math.random() * this.#availableQuestions.length
    );
    this.#currentQuestion = this.#availableQuestions[questionId];
    question.innerHTML = this.#currentQuestion.question;

    choices.forEach((choice) => {
      const number = parseInt(choice.dataset["number"]);
      console.log(this.#currentQuestion["choices"]);
      choice.innerHTML = this.#currentQuestion["choices"][number - 1];
    });

    this.#availableQuestions.splice(questionId, 1);

    this.#acceptingAnswers = true;
  }

  #incrementScore(num) {
    this.#score += num;
    scoreText.innerHTML = this.#score;
  }
}

const app = new App();
