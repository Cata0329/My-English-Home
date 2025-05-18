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
  document.getElementById('quiz-section')?.classList.add('hidden');
  document.getElementById('explore-room')?.classList.add('hidden');

  // Mostrar solo la que corresponde
  if (section === 'vocabulary') {
    document.getElementById('vocabulary-section').classList.remove('hidden');
  } else if (section === 'game') {
    document.getElementById('game-section').classList.remove('hidden');
    initializeGame(); // drag & drop
  } else if (section === 'quiz') {
    document.getElementById('quiz-section').classList.remove('hidden');
    showQuizSection(); // carga el quiz
  } else if (section === 'explore-room') { // ¡Nuevo caso!
    document.getElementById('explore-room').classList.remove('hidden');
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
  document.getElementById('quiz-section').classList.add('hidden');
  document.getElementById('explore-room').classList.add('hidden');

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

// PREGUNTAS DEL QUIZ

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
  },
  {
  image: "bathroom.png",
  question: "Which room do we use to brush our teeth?",
  options: ["Bedroom", "Bathroom", "Kitchen"],
  answer: "Bathroom"
},
{
  image: "kitchen.png",
  question: "Which item is used to heat food?",
  options: ["Stove", "Mirror", "Sofa"],
  answer: "Stove"
},
{
  image: "livingroom.png",
  question: "What do we usually sit on in the living room?",
  options: ["Sofa", "Bathtub", "Chair"],
  answer: "Sofa"
},
{
  image: "bathroom.png",
  question: "What do we use to dry our body?",
  options: ["Towel", "Toilet", "Rug"],
  answer: "Towel"
},
{
  image: "bedroom.png",
  question: "What is used for sleeping?",
  options: ["Table", "Bed", "Cupboard"],
  answer: "Bed"
},
{
  image: "kitchen.png",
  question: "Where do we throw the trash?",
  options: ["Sink", "Cupboard", "Bin"],
  answer: "Bin"
},
{
  image: "livingroom.png",
  question: "Which object lights up the room?",
  options: ["Lamp", "Sink", "Drawer"],
  answer: "Lamp"
},
{
  image: "bathroom.png",
  question: "Which item do we use to clean our hands?",
  options: ["Sink", "Sofa", "Carpet"],
  answer: "Sink"
},
{
  image: "kitchen.png",
  question: "Where do we store plates and cups?",
  options: ["Cupboard", "Toaster", "Rug"],
  answer: "Cupboard"
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

//SECCIÓN EXPLORE ROOM
// CASA COMPLETA
// Tooltips para la casa completa
document.addEventListener('DOMContentLoaded', () => {
    const houseAreas = document.querySelectorAll('map[name="house-map"] area');
    const houseImage = document.querySelector('.house-image');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    houseAreas.forEach(area => {
        area.addEventListener('mouseenter', () => {
            const name = area.getAttribute('data-name');
            tooltip.textContent = name;
            tooltip.style.opacity = '1';

            const coords = area.getAttribute('coords').split(',');
            const x = parseInt(coords[0]);
            const y = parseInt(coords[1]);

            // Obtener la posición de la imagen
            const imageRect = houseImage.getBoundingClientRect();

            // Ajustar tooltip con base en la posición real
            const tooltipX = imageRect.left + x;
            const tooltipY = imageRect.top + y;

            tooltip.style.left = `${tooltipX + 10}px`;
            tooltip.style.top = `${tooltipY - 30}px`;
        });

        area.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
});


const rooms = {
    "bedroom": {
        image: "exploracion/dormitorio.png",
        map: `
            <area shape="circle" coords="364,235,39" data-word="Bed" data-audio="audio/bed.mp4">
            <area shape="circle" coords="285,326,34" data-word="Rug" data-audio="audio/rug.mp4">
            <area shape="circle" coords="495,143,40" data-word="Window" data-audio="audio/window.mp4">
            <area shape="circle" coords="97,121,47" data-word="Mirror" data-audio="audio/mirror.mp4">
            <area shape="circle" coords="132,266,47" data-word="Drawer" data-audio="audio/drawer.mp4">
        `
    },
    "bathroom": {
        image: "exploracion/bathroom.png",
        map: `
            <area shape="circle" coords="407,264,40" data-word="Toilet" data-audio="audio/toilet.mp4">
            <area shape="circle" coords="347,158,29" data-word="Towel" data-audio="audio/towel.mp4">
            <area shape="circle" coords="275,218,39" data-word="Sink" data-audio="audio/sink.mp4">
            <area shape="circle" coords="114,261,52" data-word="Bathtub" data-audio="audio/bathtub.mp4">
            <area shape="circle" coords="76,120,21" data-word="Shower" data-audio="audio/shower.mp4">
            <area shape="circle" coords="273,107,32" data-word="Mirror" data-audio="audio/mirror.mp4">
        `
    },
    "livingroom": {
        image: "exploracion/livingroom.png",
        map: `
            <area shape="circle" coords="294,263,49" data-word="Sofa" data-audio="audio/sofa.mp4">
            <area shape="circle" coords="65,188,47" data-word="Bookshelf" data-audio="audio/bookshelf.mp4">
            <area shape="circle" coords="344,67,35" data-word="Lamp" data-audio="audio/lamp.mp4">
            <area shape="circle" coords="284,373,45" data-word="Carpet" data-audio="audio/carpet.mp4">
            <area shape="circle" coords="429,255,34" data-word="End table" data-audio="audio/endtable.mp4">
            <area shape="circle" coords="177,306,34" data-word="Table" data-audio="audio/table.mp4">
            <area shape="circle" coords="245,140,44" data-word="Picture" data-audio="audio/picture.mp4">
        `    
    },
    "kitchen": {
        image: "exploracion/kitchen.png",
        map: `
            <area shape="circle" coords="813,541,116" data-word="Stove" data-audio="audio/stove.mp4">
            <area shape="circle" coords="794,151,84" data-word="Cooker hood" data-audio="audio/cookerhood.mp4">
            <area shape="circle" coords="181,435,91" data-word="Sink" data-audio="audio/sink.mp4">
            <area shape="circle" coords="358,392,43" data-word="Toaster" data-audio="audio/toaster.mp4">
            <area shape="circle" coords="447,188,87" data-word="Cupboard" data-audio="audio/cupboard.mp4">
            <area shape="circle" coords="1417,598,69" data-word="Bin" data-audio="audio/bin.mp4">
        `
    }
};

// Botón para volver a la casa
document.getElementById('back-to-house').addEventListener('click', () => {
    document.getElementById('room-detail').classList.add('hidden');
    document.getElementById('house-overview').classList.remove('hidden');
});

// Tooltips y audio
document.querySelectorAll('area[data-word]').forEach(area => {
    area.addEventListener('click', (e) => {
        const word = area.getAttribute('data-word');
        document.getElementById('display-word').textContent = word;
        new Audio(area.getAttribute('data-audio')).play();
    });
});


// Evento para clic en áreas de la casa
document.querySelectorAll('area[data-room]').forEach(area => {
    area.addEventListener('click', (e) => {
        e.preventDefault();
        const roomType = area.getAttribute('data-room');
        
        // Cargar la habitación seleccionada
        document.getElementById('current-room-image').src = rooms[roomType].image;
        document.querySelector('map[name="room-map"]').innerHTML = rooms[roomType].map;
        
        // Cambiar de vista
        document.getElementById('house-overview').classList.add('hidden');
        document.getElementById('room-detail').classList.remove('hidden');
    });
});

// Botón para volver
document.getElementById('back-to-house').addEventListener('click', () => {
    document.getElementById('room-detail').classList.add('hidden');
    document.getElementById('house-overview').classList.remove('hidden');
});

// Diccionario de palabras con traducción y pronunciación
const wordDictionary = {
    "Bed": {
        translation: "Cama",
        pronunciation: "/bed/"
    },
    "Rug": {
        translation: "Alfombra",
        pronunciation: "/raɡ/"
    },
    "Window": {
        translation: "Ventana",
        pronunciation: "/uin-dou/"
    },
    "Mirror": {
        translation: "Espejo",
        pronunciation: "/mirror/"
    },
    "Drawer": {
        translation: "Cajón",
        pronunciation: "/drowr/"
    },
    "Toilet": {
        translation: "Inodoro",
        pronunciation: "/tóilet/"
    },
    "Towel": {
        translation: "Toalla",
        pronunciation: "/táuel/"
    },
    "Sink": {
        translation: "Lavamanos",
        pronunciation: "/sink/"
    },
    "Bathtub": {
        translation: "Bañera",
        pronunciation: "/Bát tab/"
    },
    "Shower": {
        translation: "Ducha",
        pronunciation: "/sháuer/"
    },
    "Sofa": {
        translation: "Sofá",
        pronunciation: "/sóufa/"
    },
    "Bookshelf": {
        translation: "Estantería de libros",
        pronunciation: "/búk-shelf/"
    },
    "Lamp": {
        translation: "Lámpara",
        pronunciation: "/lámp/"
    },
    "Carpet": {
        translation: "Alfombra",
        pronunciation: "/kár-pet/"
    },
     "End table": {
        translation: "Mesa auxiliar",
        pronunciation: "/énd téi-bol/"
    },
     "Table": {
        translation: "Mesa",
        pronunciation: "/téi-bol/"
    },
     "Picture": {
        translation: "Cuadro",
        pronunciation: "/pík-cher/"
    },
     "Stove": {
        translation: "Estufa",
        pronunciation: "/stóuv/"
    },
     "Cooker hood": {
        translation: "Campana extractora",
        pronunciation: "/kúker júd/"
    },
     "Toaster": {
        translation: "Tostadora",
        pronunciation: "/tóus-ter/"
    },
     "Cupboard": {
        translation: "Alacena",
        pronunciation: "/káp-berd/"
    },
     "Bin": {
        translation: "Bote de basura",
        pronunciation: "/bín/"
    },

};

document.addEventListener('DOMContentLoaded', () => {
    // Configurar áreas de la CASA 
    document.querySelectorAll('area[data-room]').forEach(area => {
        area.addEventListener('click', (e) => {
            e.preventDefault();
            const roomType = area.getAttribute('data-room');
            
            if (rooms[roomType]) {
                // Cargar la habitación seleccionada
                document.getElementById('current-room-image').src = rooms[roomType].image;
                document.querySelector('map[name="room-map"]').innerHTML = rooms[roomType].map;
                
                // Cambiar de vista
                document.getElementById('house-overview').classList.add('hidden');
                document.getElementById('room-detail').classList.remove('hidden');
            }
        });
    });

    // Botón para volver
    document.getElementById('back-to-house').addEventListener('click', () => {
        document.getElementById('room-detail').classList.add('hidden');
        document.getElementById('house-overview').classList.remove('hidden');
    });

    // Tooltips y selección de objetos
    const tooltip = document.getElementById('tooltip');
    
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'AREA' && e.target.hasAttribute('data-word')) {
            const word = e.target.getAttribute('data-word');
            tooltip.textContent = word;
            tooltip.style.opacity = '1';
            
            const coords = e.target.getAttribute('coords').split(',');
            tooltip.style.left = `${parseInt(coords[0])}px`;
            tooltip.style.top = `${parseInt(coords[1]) - 30}px`;
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'AREA') {
            tooltip.style.opacity = '0';
        }
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'AREA' && e.target.hasAttribute('data-word')) {
            const englishWord = e.target.getAttribute('data-word');
            const audioPath = e.target.getAttribute('data-audio');
            
            // Actualizar panel
            document.getElementById('display-word').textContent = englishWord;
            document.getElementById('display-translation').textContent = wordDictionary[englishWord].translation;
            document.getElementById('display-pronunciation').textContent = wordDictionary[englishWord].pronunciation;
            
            // Reproducir audio
            if (audioPath) {
                new Audio(audioPath).play()
                    .catch(e => console.error("Error de audio:", e));
            }
        }
    });
});



