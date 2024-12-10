const crosswordData = {
  solution: "OTEC FURA",
  words: {
    1: { 
      clue: "Největší oceán na Zemi", 
      answer: "TICHÝ", 
      row: 1, 
      col: 2, 
      direction: "across",
      solutionLetters: {0: 0} // 'O' pro OTEC
    },
    2: { 
      clue: "Chemický symbol pro železo",
      answer: "FE", 
      row: 1, 
      col:3, 
      direction: "down",
      solutionLetters: {1: 1} // 'T' pro OTEC
    },
    3: { 
      clue: "Hlavní součást jádra atomu",
      answer: "PROTON", 
      row: 3, 
      col: 1, 
      direction: "across",
      solutionLetters: {2: 2} // 'E' pro OTEC
    },
    4: { 
      clue: "Nejmenší planeta sluneční soustavy",
      answer: "MERKUR",
      row: 4, 
      col: 3, 
      direction: "across",
      solutionLetters: {3: 3} // 'C' pro OTEC
    },
    5: { 
      clue: "Nejznámější africký savec",
      answer: "LEV", 
      row: 6, 
      col: 1, 
      direction: "across",
      solutionLetters: {0: 4} // 'F' pro FURA
    },
    6: { 
      clue: "Nejvyšší hora na světě",
      answer: "EVEREST",
      row: 6, 
      col: 8, 
      direction: "across",
      solutionLetters: {1: 5} // 'U' pro FURA
    },
    7: { 
      clue: "Hlavní město Austrálie",
      answer: "CANBERRA",
      row: 7, 
      col: 2, 
      direction: "across",
      solutionLetters: {2: 6} // 'R' pro FURA
    },
    8: { 
      clue: "První písmeno řecké abecedy",
      answer: "ALFA",
      row: 8, 
      col: 5, 
      direction: "across",
      solutionLetters: {3: 7} // 'A' pro FURA
    },
    9: {
      clue: "Nejdelší řeka na světě",
      answer: "NIL",
      row: 2,
      col: 7,
      direction: "down"
    },
    10: {
      clue: "Vědecká jednotka intenzity světla",
      answer: "LUX",
      row: 4,
      col: 7, 
      direction: "down"
    },
    11: {
      clue: "Nejvyšší hora v Evropě",
      answer: "ELBRUS",
      row: 6,
      col: 9,
      direction: "down"
    },
    12: {
      clue: "Nejvyšší objem lidského těla",
      answer: "MOZEK",
      row: 3,
      col: 8,
      direction: "across"
    },
    13: {
      clue: "První muž, který vstoupil na Měsíc",
      answer: "ARMSTRONG",
      row: 5,
      col: 6,
      direction: "across"
    },
    14: {
      clue: "Nejrychlejší suchozemské zvíře",
      answer: "GEPARD",
      row: 9,
      col: 1,
      direction: "across" 
    },
    15: {
      clue: "Hlavní složka vody",
      answer: "VODÍK",
      row: 8,
      col: 7,
      direction: "across"
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initializeCrossword();
  setupEventListeners();
});

function initializeCrossword() {
  createGrid();
  generateClues();
  setupTooltips();
}

function createGrid() {
  const grid = document.getElementById('crosswordGrid');
  grid.innerHTML = '';
  
  let maxRow = 0;
  let maxCol = 0;
  const usedCells = new Set();
  
  // Zjištění rozměrů mřížky
  Object.values(crosswordData.words).forEach(word => {
    const { row, col, answer, direction } = word;
    for (let i = 0; i < answer.length; i++) {
      const currentRow = direction === 'across' ? row : row + i;
      const currentCol = direction === 'across' ? col + i : col;
      maxRow = Math.max(maxRow, currentRow);
      maxCol = Math.max(maxCol, currentCol);
      usedCells.add(`${currentRow}-${currentCol}`);
    }
  });

  // Nastavení rozměrů mřížky
  grid.style.gridTemplateRows = `repeat(${maxRow}, var(--cell-size))`;
  grid.style.gridTemplateColumns = `repeat(${maxCol}, var(--cell-size))`;

  // Vytvoření buněk
  for (let i = 1; i <= maxRow; i++) {
    for (let j = 1; j <= maxCol; j++) {
      const cellId = `${i}-${j}`;
      if (usedCells.has(cellId)) {
        createCell(grid, i, j);
      } else {
        createEmptySpace(grid, i, j);
      }
    }
  }

  // Aktivace buněk a číslování
  const numberedCells = new Set();
  Object.entries(crosswordData.words).forEach(([id, word]) => {
    enableWordCells(id, word, numberedCells);
  });
}

function createCell(grid, row, col) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cell-wrapper';
  wrapper.style.gridRow = row;
  wrapper.style.gridColumn = col;

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 1;
  input.className = 'cell';
  input.dataset.row = row;
  input.dataset.col = col;

  wrapper.appendChild(input);
  grid.appendChild(wrapper);
}

function createEmptySpace(grid, row, col) {
  const space = document.createElement('div');
  space.className = 'cell-wrapper empty';
  space.style.gridRow = row;
  space.style.gridColumn = col;
  grid.appendChild(space);
}

function enableWordCells(id, word, numberedCells) {
  const { row, col, answer, direction, solutionLetters } = word;
  
  // Přidání čísla slova
  const cellId = `${row}-${col}`;
  if (!numberedCells.has(cellId)) {
    const cell = findCell(row, col);
    if (cell) {
      const wrapper = cell.closest('.cell-wrapper');
      const number = document.createElement('div');
      number.className = 'cell-number';
      number.textContent = id;
      wrapper.appendChild(number);
      numberedCells.add(cellId);
    }
  }

  // Aktivace buněk pro slovo
  for (let i = 0; i < answer.length; i++) {
    const currentRow = direction === 'across' ? row : row + i;
    const currentCol = direction === 'across' ? col + i : col;
    const cell = findCell(currentRow, currentCol);
    
    if (cell) {
      cell.dataset.wordId = id;
      cell.dataset.direction = direction;
      cell.dataset.index = i;
      cell.dataset.correct = answer[i];
      
      if (solutionLetters && solutionLetters[i] !== undefined) {
        cell.classList.add('solution-cell');
        const wrapper = cell.closest('.cell-wrapper');
        const indicator = document.createElement('div');
        indicator.className = 'solution-indicator';
        indicator.textContent = parseInt(solutionLetters[i]) + 1;
        wrapper.appendChild(indicator);
      }
    }
  }
}

function generateClues() {
  const acrossClues = document.getElementById('acrossClues');
  const downClues = document.getElementById('downClues');
  acrossClues.innerHTML = '';
  downClues.innerHTML = '';

  Object.entries(crosswordData.words)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .forEach(([id, word]) => {
      const clueElement = document.createElement('p');
      clueElement.textContent = `${id}. ${word.clue}`;
      clueElement.dataset.id = id;
      clueElement.className = 'clue';
      
      clueElement.addEventListener('click', () => {
        highlightWord(id);
        focusFirstCell(word);
        showActiveClue(word.clue, id);
      });

      if (word.direction === 'across') {
        acrossClues.appendChild(clueElement);
      } else {
        downClues.appendChild(clueElement);
      }
    });
}

function setupTooltips() {
  document.querySelectorAll('.cell').forEach(cell => {
    const wordId = cell.dataset.wordId;
    if (wordId) {
      const word = crosswordData.words[wordId];
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = `${wordId}. ${word.clue} (${word.direction === 'across' ? 'vodorovně' : 'svisle'})`;
      cell.parentElement.appendChild(tooltip);
    }
  });
}

function setupEventListeners() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('input', handleInput);
    cell.addEventListener('keydown', handleKeydown);
    cell.addEventListener('focus', handleFocus);
    cell.addEventListener('click', handleClick);
  });

  const checkButton = document.querySelector('.btn-check');
  if (checkButton) {
    checkButton.addEventListener('click', checkSolution);
  }
}

function handleInput(event) {
  const cell = event.target;
  cell.value = cell.value.toUpperCase();
  
  if (cell.value) {
    validateCell(cell);
    moveToNextCellInWord(cell);
  }
}

function handleKeydown(event) {
  const cell = event.target;
  const wordId = cell.dataset.wordId;
  const word = crosswordData.words[wordId];
  const index = parseInt(cell.dataset.index);
  
  switch(event.key) {
    case 'Backspace':
      if (!cell.value && index > 0) {
        event.preventDefault();
        const prevCell = findPreviousCellInWord(word, index);
        if (prevCell) {
          prevCell.focus();
          prevCell.value = '';
        }
      }
      break;
      
    case 'ArrowRight':
    case 'ArrowLeft':
      if (word.direction === 'across') {
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const nextCell = findNextCellInWord(word, index + delta);
        if (nextCell) nextCell.focus();
      }
      break;
      
    case 'ArrowUp':
    case 'ArrowDown':
      if (word.direction === 'down') {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        const nextCell = findNextCellInWord(word, index + delta);
        if (nextCell) nextCell.focus();
      }
      break;
      
    case 'Tab':
      event.preventDefault();
      moveToNextWord(cell, event.shiftKey);
      break;
  }
}

function handleFocus(event) {
  const cell = event.target;
  const wordId = cell.dataset.wordId;
  if (wordId) {
    highlightWord(wordId);
    showActiveClue(crosswordData.words[wordId].clue, wordId);
  }
}

function handleClick(event) {
  const cell = event.target;
  const wordId = cell.dataset.wordId;
  if (wordId) {
    highlightWord(wordId);
    showActiveClue(crosswordData.words[wordId].clue, wordId);
  }
}

function moveToNextCellInWord(cell) {
  const wordId = cell.dataset.wordId;
  const word = crosswordData.words[wordId];
  const currentIndex = parseInt(cell.dataset.index);
  
  if (currentIndex < word.answer.length - 1) {
    const nextCell = findNextCellInWord(word, currentIndex + 1);
    if (nextCell) nextCell.focus();
  }
}

function moveToNextWord(currentCell, reverse = false) {
  const currentWordId = parseInt(currentCell.dataset.wordId);
  const wordIds = Object.keys(crosswordData.words).map(Number);
  const currentIndex = wordIds.indexOf(currentWordId);
  
  let nextIndex = reverse ? currentIndex - 1 : currentIndex + 1;
  if (nextIndex >= wordIds.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = wordIds.length - 1;
  
  const nextWordId = wordIds[nextIndex];
  const nextWord = crosswordData.words[nextWordId];
  
  focusFirstCell(nextWord);
  highlightWord(nextWordId);
}

function findNextCellInWord(word, index) {
  if (index >= word.answer.length || index < 0) return null;
  const row = word.direction === 'across' ? word.row : word.row + index;
  const col = word.direction === 'across' ? word.col + index : word.col;
  return findCell(row, col);
}

function findPreviousCellInWord(word, currentIndex) {
  return findNextCellInWord(word, currentIndex - 1);
}

function findCell(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function getWordCells(word) {
  const cells = [];
  for (let i = 0; i < word.answer.length; i++) {
    const currentRow = word.direction === 'across' ? word.row : word.row + i;
    const currentCol = word.direction === 'across' ? word.col + i : word.col;
    const cell = findCell(currentRow, currentCol);
    if (cell) cells.push(cell);
  }
  return cells;
}

function focusFirstCell(word) {
  const firstCell = findCell(word.row, word.col);
  if (firstCell) firstCell.focus();
}

function showActiveClue(clue, id) {
  const activeClue = document.querySelector('.active-clue .clue-text');
  if (activeClue) {
    activeClue.textContent = `${id}. ${clue}`;
  }
}

function highlightWord(wordId) {
  document.querySelectorAll('.cell.highlight, .clue.highlight')
    .forEach(el => el.classList.remove('highlight'));
    
  const word = crosswordData.words[wordId];
  if (!word) return;

  const cells = getWordCells(word);
  cells.forEach(cell => cell.classList.add('highlight'));

  const clue = document.querySelector(`.clue[data-id="${wordId}"]`);
  if (clue) {
    clue.classList.add('highlight');
    clue.scrollIntoView({ behavior:'smooth', block: 'nearest' });
  }
}

// Validační funkce
function validateCell(cell) {
  const wordId = cell.dataset.wordId;
  const word = crosswordData.words[wordId];
  const index = parseInt(cell.dataset.index);
  
  const isCorrect = cell.value.toUpperCase() === cell.dataset.correct;
  cell.classList.toggle('correct', isCorrect);
  cell.classList.toggle('error', !isCorrect);
  
  if (isCorrect) {
    checkWordCompletion(word);
    checkFullSolution();
  }
}

function checkWordCompletion(word) {
  const cells = getWordCells(word);
  const isComplete = cells.every((cell, index) => 
    cell.value.toUpperCase() === word.answer[index]
  );
  
  if (isComplete) {
    cells.forEach(cell => {
      cell.classList.add('correct');
      cell.classList.remove('error');
      if (cell.classList.contains('solution-cell')) {
        cell.classList.add('solution-revealed');
      }
    });
  }
}

function checkSolution() {
  let allCorrect = true;
  const solutionLetters = new Array(crosswordData.solution.length).fill('');
  
  Object.values(crosswordData.words).forEach(word => {
    const cells = getWordCells(word);
    const isWordCorrect = cells.every((cell, index) => 
      cell.value.toUpperCase() === word.answer[index]
    );
    
    if (!isWordCorrect) {
      allCorrect = false;
    } else if (word.solutionLetters) {
      Object.entries(word.solutionLetters).forEach(([letterIndex, solutionIndex]) => {
        solutionLetters[solutionIndex] = word.answer[letterIndex];
      });
    }
  });

  if (allCorrect) {
    showSolutionAnimation(solutionLetters.join(''));
  } else {
    showErrorFeedback();
  }
}

function showSolutionAnimation(solution) {
  const reveal = document.getElementById('solutionReveal');
  const content = reveal.querySelector('.solution-content');
  content.innerHTML = '';
  
  // Rozdělení řešení na slova
  const words = solution.split(' ');
  
  words.forEach((word, wordIndex) => {
    if (wordIndex > 0) {
      const space = document.createElement('span');
      space.className = 'solution-letter';
      space.innerHTML = '&nbsp;';
      space.style.width = '20px';
      content.appendChild(space);
    }
    
    [...word].forEach((letter, index) => {
      const span = document.createElement('span');
      span.className = 'solution-letter';
      span.textContent = letter;
      span.style.animationDelay = `${(wordIndex * word.length + index) * 0.1}s`;
      content.appendChild(span);
    });
  });

  reveal.classList.add('show');
  
  setTimeout(() => {
    document.querySelectorAll('.solution-letter').forEach(letter => {
      letter.classList.add('reveal');
    });
    createConfetti();
  }, 100);

  reveal.addEventListener('click', () => {
    reveal.classList.remove('show');
  }, { once: true });
}

function showErrorFeedback() {
  const incorrectCells = document.querySelectorAll('.cell.error');
  incorrectCells.forEach(cell => {
    cell.classList.add('shake');
    setTimeout(() => cell.classList.remove('shake'), 500);
  });
}

function createConfetti() {
  const colors = ['#00e0ff', '#ffd700', '#ff69b4', '#00ff00'];
  const confettiCount = 200;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.opacity = Math.random();
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    document.body.appendChild(confetti);
    
    confetti.addEventListener('animationend', () => {
      confetti.remove();
    });
  }
}
