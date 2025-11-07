const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultBox = document.getElementById("result");
const emojiBox = document.getElementById("emoji");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function loadQuestions() {
  const res = await fetch("https://mocki.io/v1/your-api-id-herehttps://mocki.io/v1/4549b179-efb3-48cd-8b39-dd217dca590d");
  const data = await res.json();
  questions = data.questions;
  startQuiz();
}


function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultBox.innerHTML = "";
    nextButton.innerText = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    const current = questions[currentQuestionIndex];
    questionElement.innerText = `Q${currentQuestionIndex + 1}: ${current.question}`;
    current.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, option === current.correct));
        answerButtons.appendChild(button);
    });
}

function fireConfetti() {
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
    });
}

function resetState() {
    nextButton.style.display = "none";
    answerButtons.innerHTML = "";
    emojiBox.innerHTML = "";
}

function selectAnswer(button, isCorrect) {
  Array.from(answerButtons.children).forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === questions[currentQuestionIndex].correct) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });

  emojiBox.innerHTML = isCorrect ? "😊" : "😞";

  if (isCorrect) {
    score++;
    fireConfetti();

    // 🖤 Add dark background to body
    document.body.classList.add("dark-bg");

    setTimeout(() => {
      document.body.classList.remove("dark-bg"); // Remove dark bg
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        showScore();
      }
    }, 3000);
  } else {
    nextButton.style.display = "block";
  }
}


nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    resetState();
    questionElement.innerText = "Quiz Completed! 🎉";
    resultBox.innerText = `You scored ${score} out of ${questions.length}`;
    nextButton.innerText = "Play Again";
    nextButton.style.display = "block";
    nextButton.onclick = () => startQuiz();
}

loadQuestions();
