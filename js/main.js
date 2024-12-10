// Debug logger
const debug = {
    log: (message, data) => {
        console.log(`🔍 DEBUG: ${message}`, data || '');
    },
    error: (message, error) => {
        console.error(`❌ ERROR: ${message}`, error || '');
    }
};

// Konfigurace křížovky
const crosswordData = {
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Zahradní nářadí s dřevěnou násadou", 
            answer: "MOTYKA", 
            row: 1, 
            col: 2, 
            direction: "across",
            solutionLetters: {2: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Zařízení na sledování filmů", 
            answer: "TELEVIZOR", 
            row: 1, 
            col: 3, 
            direction: "down",
            solutionLetters: {3: 1} // 'T' pro OTEC
        },
        3: { 
            clue: "Jedno ze čtyř ročních období", 
            answer: "PODZIM", 
            row: 3, 
            col: 1, 
            direction: "across",
            solutionLetters: {1: 2} // 'E' pro OTEC
        },
        4: { 
            clue: "Josef, český vynálezce lodního šroubu", 
            answer: "RESSEL", 
            row: 4, 
            col: 3, 
            direction: "across",
            solutionLetters: {4: 3} // 'C' pro OTEC
        },
        5: { 
            clue: "Nástroj na hraní kláves", 
            answer: "FORTE", 
            row: 6, 
            col: 1, 
            direction: "across",
            solutionLetters: {0: 4} // 'F' pro FURA
        },
        6: { 
            clue: "Chemická značka uranu", 
            answer: "U", 
            row: 6, 
            col: 8, 
            direction: "across",
            solutionLetters: {0: 5} // 'U' pro FURA
        },
        7: { 
            clue: "Hlavní město Lotyšska", 
            answer: "RIGA", 
            row: 7, 
            col: 2, 
            direction: "across",
            solutionLetters: {0: 6} // 'R' pro FURA
        },
        8: { 
            clue: "První písmeno abecedy", 
            answer: "A", 
            row: 8, 
            col: 5, 
            direction: "across",
            solutionLetters: {0: 7} // 'A' pro FURA
        },
        9: { 
            clue: "Tajemství nebo záhada", 
            answer: "MYSTERY", 
            row: 2, 
            col: 6, 
            direction: "down"
        },
        10: { 
            clue: "Domácí mazlíček, který štěká", 
            answer: "PES", 
            row: 5, 
            col: 7, 
            direction: "across"
        },
        11: { 
            clue: "Třetí planeta sluneční soustavy", 
            answer: "ZEME", 
            row: 4, 
            col: 9, 
            direction: "down"
        },
        12: { 
            clue: "Český básník Karel ___ Mácha", 
            answer: "HYNEK", 
            row: 8, 
            col: 1, 
            direction: "across"
        },
        13: { 
            clue: "Opačný směr od jihu", 
            answer: "SEVER", 
            row: 7, 
            col: 7, 
            direction: "down"
        },
        14: { 
            clue: "Hlavní město Francie", 
            answer: "PARIZ", 
            row: 3, 
            col: 6, 
            direction: "across"
        },
        15: { 
            clue: "Planeta známá jako červená", 
            answer: "MARS", 
            row: 9, 
            col: 3, 
            direction: "across"
        },
        16: { 
            clue: "Zpěvné ptactvo", 
            answer: "SLAVIK", 
            row: 5, 
            col: 10, 
            direction: "down"
        }
    }
};

// Inicializace
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    try {
        createGrid();
        generateClues();
        setupEventListeners();
    } catch (error) {
        console.error('Chyba při inicializaci:', error);
    }
}

// Vytvoření mřížky
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    if (!grid) {
        throw new Error('Není nalezen element mřížky');
    }

    const dimensions = calculateGridDimensions();
    grid.style.gridTemplateRows = `repeat(${dimensions.maxRow}, var(--cell-size))`;
    grid.style.gridTemplateColumns = `repeat(${dimensions.maxCol}, var(--cell-size))`;

    createGridCells(grid, dimensions);
}

// Výpočet rozměrů mřížky
function calculateGridDimensions() {
    let maxRow = 0;
    let maxCol = 0;
    const usedCells = new Set();

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

    return { maxRow, maxCol, usedCells };
}

// Vytvoření buněk mřížky
function createGridCells(grid, dimensions) {
    const numberedCells = new Set();

    for (let row = 1; row <= dimensions.maxRow; row++) {
        for (let col = 1; col <= dimensions.maxCol; col++) {
            const cellId = `${row}-${col}`;
            if (dimensions.usedCells.has(cellId)) {
                createCell(grid, row, col);
            } else {
                createEmptySpace(grid, row, col);
            }
        }
    }

    Object.entries(crosswordData.words).forEach(([id, word]) => {
        enableWordCells(id, word, numberedCells);
    });
}

// Vytvoření buňky
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

// Vytvoření prázdného prostoru
function createEmptySpace(grid, row, col) {
    const space = document.createElement('div');
    space.className = 'cell-wrapper empty';
    space.style.gridRow = row;
    space.style.gridColumn = col;
    grid.appendChild(space);
}

// Aktivace buněk pro slovo
function enableWordCells(id, word, numberedCells) {
    const { row, col, answer, direction, solutionLetters } = word;
    
    // Přidání čísla k první buňce slova
    if (!numberedCells.has(`${row}-${col}`)) {
        addCellNumber(row, col, id);
        numberedCells.add(`${row}-${col}`);
    }

    // Nastavení buněk pro slovo
    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        setupCell(currentRow, currentCol, id, i, direction, answer[i], solutionLetters?.[i]);
    }
}

// Přidání čísla buňky
function addCellNumber(row, col, id) {
    const cell = findCell(row, col);
    if (!cell) return;

    const wrapper = cell.closest('.cell-wrapper');
    const number = document.createElement('div');
    number.className = 'cell-number';
    number.textContent = id;
    wrapper.appendChild(number);
}

// Nastavení buňky
function setupCell(row, col, wordId, index, direction, correctLetter, solutionIndex) {
    const cell = findCell(row, col);
    if (!cell) return;

    cell.dataset.wordId = wordId;
    cell.dataset.direction = direction;
    cell.dataset.index = index;
    cell.dataset.correct = correctLetter;

    if (solutionIndex !== undefined) {
        cell.classList.add('solution-cell');
        addSolutionIndicator(cell, parseInt(solutionIndex) + 1);
    }
}

// Přidání indikátoru řešení
function addSolutionIndicator(cell, number) {
    const wrapper = cell.closest('.cell-wrapper');
    const indicator = document.createElement('div');
    indicator.className = 'solution-indicator';
    indicator.textContent = number;
    wrapper.appendChild(indicator);
}

// Generování nápověd
function generateClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');

    if (!acrossClues || !downClues) {
        throw new Error('Chybí elementy pro nápovědy');
    }

    Object.entries(crosswordData.words)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .forEach(([id, word]) => {
            const clueElement = createClueElement(id, word);
            (word.direction === 'across' ? acrossClues : downClues).appendChild(clueElement);
        });
}

// Vytvoření elementu nápovědy
function createClueElement(id, word) {
    const element = document.createElement('div');
    element.className = 'clue';
    element.textContent = `${id}. ${word.clue}`;
    element.dataset.id = id;

    element.addEventListener('click', () => {
        highlightWord(id);
        focusFirstCell(word);
    });

    return element;
}

// Event listenery
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

// Obsluha událostí
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();

    if (cell.value) {
        validateCell(cell);
        moveToNextCell(cell);
    }
}

function handleKeydown(event) {
    const cell = event.target;
    
    switch(event.key) {
        case 'Backspace':
            if (!cell.value) {
                event.preventDefault();
                moveToPreviousCell(cell);
            }
            break;
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowDown':
            handleArrowKey(event, cell);
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
    }
}

function handleClick(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        toggleDirection(cell);
    }
}

// Validace a kontrola řešení
function validateCell(cell) {
    if (!cell.value) return;

    const isCorrect = cell.value.toUpperCase() === cell.dataset.correct;
    cell.classList.toggle('correct', isCorrect);
    cell.classList.toggle('error', !isCorrect);
}

function checkSolution() {
    let isComplete = true;
    let solutionString = '';

    document.querySelectorAll('.solution-cell').forEach(cell => {
        if (!cell.value || cell.value.toUpperCase() !== cell.dataset.correct) {
            isComplete = false;
        }
        solutionString += cell.value || ' ';
    });

    if (isComplete && solutionString.trim() === crosswordData.solution) {
        showSuccess();
    } else {
        showError();
    }
}

// Zobrazení výsledků
function showSuccess() {
    const solutionReveal = document.getElementById('solutionReveal');
    const content = solutionReveal.querySelector('.solution-content');
    
    content.innerHTML = '';
    solutionReveal.classList.add('show');

    crosswordData.solution.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'solution-letter';
        span.textContent = letter;
        content.appendChild(span);

        setTimeout(() => {
            span.classList.add('reveal');
        }, index * 200);
    });
}

function showError() {
    document.querySelectorAll('.cell.error').forEach(cell => {
        cell.classList.add('shake');
        setTimeout(() => cell.classList.remove('shake'), 500);
    });
}

// Pomocné funkce
function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function highlightWord(wordId) {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('highlight');
    });

    document.querySelectorAll('.clue').forEach(clue => {
        clue.classList.remove('highlight');
    });

    const word = crosswordData.words[wordId];
    if (!word) return;

    const cells = getWordCells(word);
    cells.forEach(cell => cell.classList.add('highlight'));

    const clue = document.querySelector(`.clue[data-id="${wordId}"]`);
    if (clue) clue.classList.add('highlight');
}

function getWordCells(word) {
    const cells = [];
    for (let i = 0; i < word.answer.length; i++) {
        const row = word.direction === 'across' ? word.row : word.row + i;
        const col = word.direction === 'across' ? word.col + i : word.col;
        const cell = findCell(row, col);
        if (cell) cells.push(cell);
    }
    return cells;
}

// Navigační funkce
function moveToNextCell(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const index = parseInt(cell.dataset.index);

    if (index < word.answer.length - 1) {
        const nextCell = getWordCells(word)[index + 1];
        if (nextCell) nextCell.focus();
    }
}

function moveToPreviousCell(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const index = parseInt(cell.dataset.index);

    if (index > 0) {
        const prevCell = getWordCells(word)[index - 1];
        if (prevCell) {
            prevCell.focus();
            prevCell.value = '';
        }
    }
}

function moveToNextWord(currentCell, reverse = false) {
    const currentWordId = parseInt(currentCell.dataset.wordId);
    const wordIds = Object.keys(crosswordData.words)
        .map(id => parseInt(id))
        .sort((a, b) => a - b);
    
    const currentIndex = wordIds.indexOf(currentWordId);
    const nextIndex = reverse ? 
        (currentIndex - 1 + wordIds.length) % wordIds.length :
        (currentIndex + 1) % wordIds.length;
    
    const nextWordId = wordIds[nextIndex];
    const nextWord = crosswordData.words[nextWordId];
    
    focusFirstCell(nextWord);
    highlightWord(nextWordId);
}

function handleArrowKey(event, cell) {
    const direction = cell.dataset.direction;
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const index = parseInt(cell.dataset.index);

    let nextCell = null;
    
    switch(event.key) {
        case 'ArrowRight':
            if (direction === 'across') {
                nextCell = findNextCell(word, index + 1);
            }
            break;
        case 'ArrowLeft':
            if (direction === 'across') {
                nextCell = findNextCell(word, index - 1);
            }
            break;
        case 'ArrowDown':
            if (direction === 'down') {
                nextCell = findNextCell(word, index + 1);
            }
            break;
        case 'ArrowUp':
            if (direction === 'down') {
                nextCell = findNextCell(word, index - 1);
            }
            break;
    }

    if (nextCell) {
        event.preventDefault();
        nextCell.focus();
    }
}

function findNextCell(word, index) {
    if (index < 0 || index >= word.answer.length) return null;
    
    const row = word.direction === 'across' ? word.row : word.row + index;
    const col = word.direction === 'across' ? word.col + index : word.col;
    
    return findCell(row, col);
}

function focusFirstCell(word) {
    const firstCell = findCell(word.row, word.col);
    if (firstCell) firstCell.focus();
}

function toggleDirection(cell) {
    const currentDirection = cell.dataset.direction;
    const oppositeDirection = currentDirection === 'across' ? 'down' : 'across';
    
    // Zkontrolovat, zda buňka patří do slova v opačném směru
    const wordInOppositeDirection = Object.values(crosswordData.words).find(word => 
        word.direction === oppositeDirection && isCellInWord(cell, word)
    );

    if (wordInOppositeDirection) {
        highlightWord(getWordIdForCell(cell, oppositeDirection));
    }
}

function isCellInWord(cell, word) {
    const cellRow = parseInt(cell.dataset.row);
    const cellCol = parseInt(cell.dataset.col);
    
    if (word.direction === 'across') {
        return cellRow === word.row && 
               cellCol >= word.col && 
               cellCol < word.col + word.answer.length;
    } else {
        return cellCol === word.col && 
               cellRow >= word.row && 
               cellRow < word.row + word.answer.length;
    }
}

function getWordIdForCell(cell, direction) {
    return Object.entries(crosswordData.words).find(([_, word]) => 
        word.direction === direction && isCellInWord(cell, word)
    )?.[0];
}

// Funkce pro zavření modálního okna s řešením
document.addEventListener('click', (event) => {
    const solutionReveal = document.getElementById('solutionReveal');
    if (event.target === solutionReveal) {
        solutionReveal.classList.remove('show');
    }
});

// Pomocné funkce pro zpracování událostí
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Přidání zpětné vazby pro mobilní zařízení
function addTouchFeedback() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('touchstart', () => {
            cell.classList.add('touch');
        });
        
        cell.addEventListener('touchend', () => {
            cell.classList.remove('touch');
        });
    });
}

// Inicializace dotykové zpětné vazby pro mobilní zařízení
if ('ontouchstart' in window) {
    addTouchFeedback();
}

// Funkce pro automatické uložení postupu
function saveProgress() {
    const progress = {};
    document.querySelectorAll('.cell').forEach(cell => {
        if (cell.value) {
            progress[`${cell.dataset.row}-${cell.dataset.col}`] = cell.value;
        }
    });
    
    localStorage.setItem('crosswordProgress', JSON.stringify(progress));
}

// Funkce pro načtení uloženého postupu
function loadProgress() {
    try {
        const progress = JSON.parse(localStorage.getItem('crosswordProgress'));
        if (progress) {
            Object.entries(progress).forEach(([position, value]) => {
                const [row, col] = position.split('-');
                const cell = findCell(row, col);
                if (cell) {
                    cell.value = value;
                    validateCell(cell);
                }
            });
        }
    } catch (error) {
        console.error('Chyba při načítání uloženého postupu:', error);
    }
}

// Automatické ukládání každých 30 sekund
setInterval(debounce(saveProgress, 1000), 30000);

// Načtení uloženého postupu při startu
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
});
