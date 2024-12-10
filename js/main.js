// Konfigurace křížovky
const crosswordData = {
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Základní nástroj zahradníka", 
            answer: "MOTYKA", 
            row: 2, 
            col: 3, 
            direction: "across",
            solutionLetters: {2: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Starší název pro televizi", 
            answer: "TELEVIZOR", 
            row: 1, 
            col: 5, 
            direction: "down",
            solutionLetters: {3: 1} // 'T' pro OTEC
        },
        3: { 
            clue: "Roční období", 
            answer: "PODZIM", 
            row: 4, 
            col: 2, 
            direction: "across",
            solutionLetters: {1: 2} // 'E' pro OTEC
        },
        4: { 
            clue: "Český vynálezce lodního šroubu (Josef)", 
            answer: "RESSEL", 
            row: 6, 
            col: 4, 
            direction: "across",
            solutionLetters: {4: 3} // 'C' pro OTEC
        },
        5: { 
            clue: "Hudební nástroj s klaviaturou", 
            answer: "FORTE", 
            row: 3, 
            col: 7, 
            direction: "across",
            solutionLetters: {0: 4} // 'F' pro FURA
        },
        6: { 
            clue: "Chemická značka uranu", 
            answer: "U", 
            row: 5, 
            col: 9, 
            direction: "across",
            solutionLetters: {0: 5} // 'U' pro FURA
        },
        7: { 
            clue: "Hlavní město Lotyšska", 
            answer: "RIGA", 
            row: 8, 
            col: 3, 
            direction: "across",
            solutionLetters: {0: 6} // 'R' pro FURA
        },
        8: { 
            clue: "První písmeno abecedy", 
            answer: "A", 
            row: 7, 
            col: 8, 
            direction: "across",
            solutionLetters: {0: 7} // 'A' pro FURA
        },
        9: {
            clue: "Český král (Karel IV.)", 
            answer: "KAREL", 
            row: 3, 
            col: 11, 
            direction: "down"
        },
        10: {
            clue: "Značka českých hodinek", 
            answer: "PRIM", 
            row: 5, 
            col: 2, 
            direction: "down"
        },
        11: {
            clue: "Hlavní město Norska",
            answer: "OSLO",
            row: 2, 
            col: 13, 
            direction: "down"
        },
        12: {
            clue: "Český hudební skladatel (Bedřich)",
            answer: "SMETANA",
            row: 9, 
            col: 5, 
            direction: "across"
        }
    }
};

// Inicializace křížovky
document.addEventListener('DOMContentLoaded', () => {
    initializeCrossword();
    setupEventListeners();
});

function initializeCrossword() {
    createGrid();
    generateClues();
}
// Vytvoření mřížky
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';
    
    // Nalezení rozměrů mřížky
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

    // Přidání extra prostoru pro lepší oddělení
    maxRow += 2;
    maxCol += 2;

    grid.style.gridTemplateRows = `repeat(${maxRow}, var(--cell-size))`;
    grid.style.gridTemplateColumns = `repeat(${maxCol}, var(--cell-size))`;

    // Vytvoření buněk s mezerami
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

    // Aktivace buněk a přidání čísel
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
            
            // Přidání označení pro písmena tajenky
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

// Generování nápověd
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

// Pomocné funkce pro nalezení buněk
function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function findNextCellInWord(word, index) {
    const row = word.direction === 'across' ? word.row : word.row + index;
    const col = word.direction === 'across' ? word.col + index : word.col;
    return findCell(row, col);
}

function findPreviousCellInWord(word, currentIndex) {
    return findNextCellInWord(word, currentIndex - 1);
}

function focusFirstCell(word) {
    const firstCell = findCell(word.row, word.col);
    if (firstCell) {
        firstCell.focus();
    }
}
// Nastavení event listenerů
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

// Zpracování vstupu
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
                navigateHorizontally(cell, word, index, event.key === 'ArrowRight' ? 1 : -1);
            }
            break;
            
        case 'ArrowUp':
        case 'ArrowDown':
            if (word.direction === 'down') {
                event.preventDefault();
                navigateVertically(cell, word, index, event.key === 'ArrowDown' ? 1 : -1);
            }
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

// Navigační funkce
function navigateHorizontally(cell, word, currentIndex, delta) {
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < word.answer.length) {
        const nextCell = findNextCellInWord(word, nextIndex);
        if (nextCell) nextCell.focus();
    }
}

function navigateVertically(cell, word, currentIndex, delta) {
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < word.answer.length) {
        const nextCell = findNextCellInWord(word, nextIndex);
        if (nextCell) nextCell.focus();
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
// Nastavení event listenerů
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

// Zpracování vstupu
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
                navigateHorizontally(cell, word, index, event.key === 'ArrowRight' ? 1 : -1);
            }
            break;
            
        case 'ArrowUp':
        case 'ArrowDown':
            if (word.direction === 'down') {
                event.preventDefault();
                navigateVertically(cell, word, index, event.key === 'ArrowDown' ? 1 : -1);
            }
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

// Navigační funkce
function navigateHorizontally(cell, word, currentIndex, delta) {
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < word.answer.length) {
        const nextCell = findNextCellInWord(word, nextIndex);
        if (nextCell) nextCell.focus();
    }
}

function navigateVertically(cell, word, currentIndex, delta) {
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < word.answer.length) {
        const nextCell = findNextCellInWord(word, nextIndex);
        if (nextCell) nextCell.focus();
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
