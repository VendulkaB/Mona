// Crossword data structure with solution highlighting
const crosswordData = {
    size: 15,
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Otáčivá část elektromotoru", 
            answer: "ROTOR", 
            row: 1, 
            col: 5, 
            direction: "across",
            solutionLetters: {1: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Planeta s prstencem", 
            answer: "SATURN", 
            row: 2, 
            col: 3, 
            direction: "across",
            solutionLetters: {2: 1} // 'T' pro OTEC
        },
        3: { 
            clue: "Slavný český malíř (Mikoláš)", 
            answer: "ALES", 
            row: 3, 
            col: 7, 
            direction: "down",
            solutionLetters: {0: 2} // 'E' pro OTEC
        },
        4: { 
            clue: "Chemický prvek Ca", 
            answer: "VAPNIK", 
            row: 4, 
            col: 2, 
            direction: "across",
            solutionLetters: {2: 3} // 'C' pro OTEC
        },
        5: { 
            clue: "Mražený dezert", 
            answer: "FROZEN", 
            row: 5, 
            col: 4, 
            direction: "across",
            solutionLetters: {0: 4} // 'F' pro FURA
        },
        6: { 
            clue: "Jihomoravské město proslulé vínem", 
            answer: "UHERSKE", 
            row: 6, 
            col: 1, 
            direction: "across",
            solutionLetters: {0: 5} // 'U' pro FURA
        },
        7: { 
            clue: "Hlavní město Lotyšska", 
            answer: "RIGA", 
            row: 7, 
            col: 6, 
            direction: "across",
            solutionLetters: {0: 6} // 'R' pro FURA
        },
        8: { 
            clue: "Český hudební skladatel (Bedřich)", 
            answer: "SMETANA", 
            row: 3, 
            col: 1, 
            direction: "down",
            solutionLetters: {4: 7} // 'A' pro FURA
        },
        9: {
            clue: "Lesní plod", 
            answer: "MALINA", 
            row: 8, 
            col: 3, 
            direction: "across"
        },
        10: {
            clue: "Značka českých hodinek", 
            answer: "PRIM", 
            row: 9, 
            col: 5, 
            direction: "down"
        },
        11: {
            clue: "Základní jednotka délky", 
            answer: "METR", 
            row: 10, 
            col: 2, 
            direction: "across"
        },
        12: {
            clue: "Největší savec", 
            answer: "VELRYBA", 
            row: 11, 
            col: 4, 
            direction: "across"
        },
        13: {
            clue: "Italská sopka", 
            answer: "ETNA", 
            row: 7, 
            col: 1, 
            direction: "down"
        },
        14: {
            clue: "Materiál na výrobu skla", 
            answer: "PISEK", 
            row: 5, 
            col: 8, 
            direction: "down"
        },
        15: {
            clue: "Hlavní město Norska", 
            answer: "OSLO", 
            row: 2, 
            col: 10, 
            direction: "across"
        },
        16: {
            clue: "Jednotka elektrického napětí", 
            answer: "VOLT", 
            row: 1, 
            col: 8, 
            direction: "down"
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCrossword();
});

function initializeCrossword() {
    createGrid();
    generateClues();
    addNumbersToGrid();
    setupEventListeners();
}

function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';

    // Create cells
    for (let i = 1; i <= crosswordData.size; i++) {
        for (let j = 1; j <= crosswordData.size; j++) {
            const cellWrapper = document.createElement('div');
            cellWrapper.className = 'cell-wrapper';

            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.disabled = true;

            cellWrapper.appendChild(cell);
            grid.appendChild(cellWrapper);
        }
    }

    enableCells();
}

function enableCells() {
    Object.entries(crosswordData.words).forEach(([id, word]) => {
        const { row, col, answer, direction, solutionLetters } = word;
        
        for (let i = 0; i < answer.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;
            const cell = findCell(currentRow, currentCol);
            
            if (cell) {
                cell.disabled = false;
                cell.dataset.wordId = id;
                cell.dataset.direction = direction;
                cell.dataset.index = i;
                
                if (solutionLetters && solutionLetters[i] !== undefined) {
                    cell.classList.add('solution-cell');
                    cell.dataset.solutionIndex = solutionLetters[i];
                    
                    // Add solution letter indicator
                    const wrapper = cell.closest('.cell-wrapper');
                    const indicator = document.createElement('div');
                    indicator.className = 'solution-indicator';
                    indicator.textContent = parseInt(solutionLetters[i]) + 1;
                    wrapper.appendChild(indicator);
                }
            }
        }
    });
}

function addNumbersToGrid() {
    const numberedCells = new Set();
    
    Object.entries(crosswordData.words)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([id, word]) => {
            const cellId = `${word.row}-${word.col}`;
            if (!numberedCells.has(cellId)) {
                const cell = findCell(word.row, word.col);
                if (cell) {
                    const wrapper = cell.closest('.cell-wrapper');
                    const number = document.createElement('div');
                    number.className = 'cell-number';
                    number.textContent = id;
                    wrapper.appendChild(number);
                    numberedCells.add(cellId);
                }
            }
        });
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
            clueElement.addEventListener('click', () => highlightWord(id));

            word.direction === 'across' 
                ? acrossClues.appendChild(clueElement)
                : downClues.appendChild(clueElement);
        });
}

function setupEventListeners() {
    document.querySelectorAll('.cell:not([disabled])').forEach(cell => {
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);
        cell.addEventListener('focus', handleFocus);
        cell.addEventListener('blur', handleBlur);
    });
}

function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        moveToNextCell(cell);
        checkWord(cell);
    }
}

function handleKeydown(event) {
    const cell = event.target;
    
    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowDown':
            event.preventDefault();
            handleArrowKey(event.key, cell);
            break;
        case 'Backspace':
            handleBackspace(event, cell);
            break;
        case 'Delete':
            cell.value = '';
            break;
        case 'Tab':
            event.preventDefault();
            moveToNextWord(cell, event.shiftKey);
            break;
    }
}

function handleArrowKey(key, cell) {
    const movements = {
        'ArrowRight': [0, 1],
        'ArrowLeft': [0, -1],
        'ArrowUp': [-1, 0],
        'ArrowDown': [1, 0]
    };
    const [rowDelta, colDelta] = movements[key];
    moveFocus(cell, rowDelta, colDelta);
}

function handleBackspace(event, cell) {
    if (!cell.value) {
        event.preventDefault();
        const prevCell = findPrevCell(cell);
        if (prevCell) {
            prevCell.focus();
            prevCell.value = '';
        }
    }
}

function moveToNextCell(cell) {
    const direction = cell.dataset.direction;
    const nextCell = findNextCell(cell, direction);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

function moveFocus(cell, rowDelta, colDelta) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    const nextCell = findCell(currentRow + rowDelta, currentCol + colDelta);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

function moveToNextWord(cell, reverse = false) {
    const currentWordId = parseInt(cell.dataset.wordId);
    const wordIds = Object.keys(crosswordData.words)
        .map(Number)
        .sort((a, b) => a - b);
    
    const currentIndex = wordIds.indexOf(currentWordId);
    const nextIndex = reverse ? 
        (currentIndex - 1 + wordIds.length) % wordIds.length : 
        (currentIndex + 1) % wordIds.length;
    
    const nextWordId = wordIds[nextIndex];
    const nextWord = crosswordData.words[nextWordId];
    const nextCell = findCell(nextWord.row, nextWord.col);
    
    if (nextCell) {
        nextCell.focus();
        highlightWord(nextWordId);
    }
}

function checkWord(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const userAnswer = getUserAnswer(word);
    
    if (userAnswer.length === word.answer.length) {
        const isCorrect = userAnswer === word.answer;
        const cells = getWordCells(word);
        cells.forEach(cell => {
            cell.classList.toggle('correct', isCorrect);
            if (isCorrect && cell.classList.contains('solution-cell')) {
                cell.classList.add('solution-revealed');
            }
        });
    }
}

function getWordCells(word) {
    const cells = [];
    const { row, col, answer, direction } = word;
    
    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        if (cell) {
            cells.push(cell);
        }
    }
    
    return cells;
}

function highlightWord(wordId) {
    // Remove previous highlights
    document.querySelectorAll('.cell.highlight, .clues p.highlight')
        .forEach(el => el.classList.remove('highlight'));

    const word = crosswordData.words[wordId];
    const { row, col, answer, direction } = word;
    
    // Highlight cells
    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        if (cell) {
            cell.classList.add('highlight');
        }
    }

    // Highlight clue
    const clue = document.querySelector(`.clues p[data-id="${wordId}"]`);
    if (clue) {
        clue.classList.add('highlight');
        clue.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function handleFocus(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
    }
}

function handleBlur() {
    // Optional: Remove highlights when leaving a cell
}

// Helper functions
function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function findNextCell(cell, direction) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    
    if (direction === 'across') {
        return findCell(currentRow, currentCol + 1);
    } else {
        return findCell(currentRow + 1, currentCol);
    }
}

function findPrevCell(cell) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    const direction = cell.dataset.direction;
    
    if (direction === 'across') {
        return findCell(currentRow, currentCol - 1);
    } else {
        return findCell(currentRow - 1, currentCol);
    }
}

function getUserAnswer(word) {
    let answer = '';
    const { row, col, answer: correctAnswer, direction } = word;
    
    for (let i = 0; i < correctAnswer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        if (cell) {
            answer += (cell.value || '').toUpperCase();
        }
    }
