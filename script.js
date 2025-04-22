// Muestra el menú de opciones y oculta la pantalla inicial
document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".container").classList.add("hidden"); // Oculta pantalla inicial
  document.getElementById("menu-screen").classList.remove("hidden"); // Muestra menú
});

// Mostrar sección correspondiente y ocultar las demás
function showSection(section) {
  // Ocultar todas las secciones
  document.querySelector('.container')?.classList.add('hidden');
  document.getElementById('menu-screen')?.classList.add('hidden');
  document.getElementById('vocabulary-section')?.classList.add('hidden');
  document.getElementById('game-section')?.classList.add('hidden');

  // Mostrar solo la que corresponde
  if (section === 'vocabulary') {
    document.getElementById('vocabulary-section').classList.remove('hidden');
  } else if (section === 'game') {
    document.getElementById('game-section').classList.remove('hidden');
    initializeGame(); // drag & drop
  } else if (section === 'menu') {
    document.getElementById('menu-screen').classList.remove('hidden');
  }
}

// Volver al inicio desde el menú
function goBackToHome() {
  document.getElementById("menu-screen").classList.add("hidden");
  document.querySelector(".container").classList.remove("hidden");
}

// Volver al menú desde cualquier sección
function goBackToMenu() {
  document.querySelector('.container')?.classList.add('hidden');
  document.getElementById('vocabulary-section')?.classList.add('hidden');
  document.getElementById('game-section')?.classList.add('hidden');
  document.getElementById('menu-screen').classList.remove('hidden');
}

// Función para reproducir el audio
function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0; // Reiniciar audio
    audio.play().catch(err => console.error("Audio playback failed:", err));
  }
}

// Inicializar Drag & Drop
function initializeGame() {
  const draggables = document.querySelectorAll('.draggable-word');
  const dropzones = document.querySelectorAll('.dropzone');

  // Limpiar dropzones
  dropzones.forEach(zone => {
    zone.textContent = '';
    zone.removeAttribute('data-dropped');
  });

  // Asegurar que todas las palabras estén visibles
  draggables.forEach(word => {
    word.style.display = "flex";
    word.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text', e.target.dataset.word);
      e.target.classList.add('dragging');
    });

    word.addEventListener('dragend', e => {
      e.target.classList.remove('dragging');
    });
  });

  // Agregar eventos a zonas de soltado
  dropzones.forEach(zone => {
    if (!zone.classList.contains('initialized')) {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('over');
      });

      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('over');

        const droppedWord = e.dataTransfer.getData('text');
        zone.textContent = droppedWord;
        zone.setAttribute('data-dropped', droppedWord);

        // Oculta la palabra correctamente colocada
        const dragged = document.querySelector(`.draggable-word[data-word="${droppedWord}"]`);
        if (dragged) {
          dragged.style.display = "none";
        }
      });

      zone.classList.add('initialized');
    }
  });
}

// Validar respuestas del juego
function checkAnswers() {
  const dropzones = document.querySelectorAll('.dropzone');
  let correct = 0;

  dropzones.forEach(zone => {
    const correctWord = zone.getAttribute('data-word');
    const userWord = zone.getAttribute('data-dropped');
    if (correctWord === userWord) {
      correct++;
    }
  });

  const result = document.getElementById('game-result');
  if (correct === dropzones.length) {
    result.textContent = "🎉 ¡Muy bien! ¡Todas las respuestas son correctas!";
    result.style.color = "#00ff00";
  } else {
    result.textContent = `❌ Obtuviste ${correct} de ${dropzones.length} correctas. ¡Intenta de nuevo!`;
    result.style.color = "#ff4c4c";
  }
}

// Reiniciar juego: limpia todo y vuelve a empezar
function resetGame() {
  const dropzones = document.querySelectorAll('.dropzone');
  const draggables = document.querySelectorAll('.draggable-word');
  const result = document.getElementById('game-result');

  // Limpia las zonas de caída
  dropzones.forEach(zone => {
    zone.textContent = '';
    zone.removeAttribute('data-dropped');
  });

  // Vuelve a mostrar todas las palabras
  draggables.forEach(word => {
    word.style.display = 'flex';
  });

  // Limpia mensaje de resultado
  if (result) {
    result.textContent = '';
  }
}


//Sección del juego 

const quizData = [
  {
    image: "bedroom.png",
    question: "What room is this?",
    options: ["Kitchen", "Bedroom", "Bathroom"],
    answer: "Bedroom"
  },
  {
    image: "kitchen.png",
    question: "What do we do in this room?",
    options: ["Sleep", "Cook", "Take a shower"],
    answer: "Cook"
  },
  {
    image: "livingroom.png",
    question: "Which room is used to relax and watch TV?",
    options: ["Living Room", "Bathroom", "Garage"],
    answer: "Living Room"
  }
];

let currentQuestion = 0;
let score = 0;

function showQuizSection() {
  document.querySelector('.container')?.classList.add('hidden');
  document.getElementById('menu-screen')?.classList.add('hidden');
  document.getElementById('game-section')?.classList.add('hidden');
  document.getElementById('vocabulary-section')?.classList.add('hidden');
  document.getElementById('quiz-section')?.classList.remove('hidden');

  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  const questionObj = quizData[currentQuestion];
  document.getElementById('question-image').innerHTML = `<img src="${questionObj.image}" alt="Question Image">`;
  document.getElementById('question-text').textContent = questionObj.question;

  const optionsContainer = document.getElementById('answer-options');
  optionsContainer.innerHTML = "";

  questionObj.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.classList.add('answer-btn');
    btn.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('next-question-btn').classList.add('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
}

function checkAnswer(selected) {
  const correct = quizData[currentQuestion].answer;
  const resultDiv = document.getElementById('quiz-result');
  resultDiv.classList.remove('hidden');

  if (selected === correct) {
    resultDiv.textContent = "✅ Correct!";
    resultDiv.style.color = "#00ff00";
    score++;
  } else {
    resultDiv.textContent = `❌ Incorrect. The correct answer is: ${correct}`;
    resultDiv.style.color = "#ff4c4c";
  }

  document.getElementById('next-question-btn').classList.remove('hidden');
  document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
}

document.getElementById('next-question-btn').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showFinalResults();
  }
});

function showFinalResults() {
  document.getElementById('question-image').innerHTML = '';
  document.getElementById('question-text').textContent = '';
  document.getElementById('answer-options').innerHTML = '';
  document.getElementById('next-question-btn').classList.add('hidden');

  const result = document.getElementById('quiz-result');
  result.classList.remove('hidden');
  result.innerHTML = `🎉 You scored <strong>${score} out of ${quizData.length}</strong>! 🎉`;
  result.style.color = "#ffd53d";
}
