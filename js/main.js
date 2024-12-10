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
    validateCrosswordData();
    initializeCrossword();
    setupEventListeners();
});

// Validace dat křížovky
function validateCrosswordData() {
    Object.entries(crosswordData.words).forEach(([id, word]) => {
        if (!word.row || !word.col || !word.answer || !word.direction) {
            console.error(`Chyba v definici slova ID ${id}`);
        }
    });
}

// Inicializace křížovky
function initializeCrossword() {
    createGrid();
    generateClues();
    setupTooltips();
}

// Vytvoření mřížky
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const dimensions = calculateGridDimensions();
    setupGridTemplate(grid, dimensions);
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

function setupGridTemplate(grid, dimensions) {
    grid.style.gridTemplateRows = `repeat(${dimensions.maxRow}, var(--cell-size))`;
    grid.style.gridTemplateColumns = `repeat(${dimensions.maxCol}, var(--cell-size))`;
}

function createGridCells(grid, dimensions) {
    const numberedCells = new Set();
    
    for (let i = 1; i <= dimensions.maxRow; i++) {
        for (let j = 1; j <= dimensions.maxCol; j++) {
            const cellId = `${i}-${j}`;
            if (dimensions.usedCells.has(cellId)) {
                createCell(grid, i, j);
            } else {
                createEmptySpace(grid, i, j);
            }
        }
    }

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
    
    // Přidat číslo k první buňce slova
    const firstCellId = `${row}-${col}`;
    if (!numberedCells.has(firstCellId)) {
        const cell = findCell(row, col);
        if (cell) {
            const wrapper = cell.closest('.cell-wrapper');
            const number = document.createElement('div');
            number.className = 'cell-number';
            number.textContent = id;
            wrapper.appendChild(number);
            numberedCells.add(firstCellId);
        }
    }

    // Aktivovat buňky pro slovo
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
    if (!acrossClues || !downClues) return;

    acrossClues.innerHTML = '';
    downClues.innerHTML = '';

    Object.entries(crosswordData.words)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([id, word]) => {
            const clueElement = createClueElement(id, word);
            if (word.direction === 'across') {
                acrossClues.appendChild(clueElement);
            } else {
                downClues.appendChild(clueElement);
            }
        });
}

function createClueElement(id, word) {
    const clueElement = document.createElement('p');
    clueElement.textContent = `${id}. ${word.clue}`;
    clueElement.dataset.id = id;
    clueElement.className = 'clue';
    
    clueElement.addEventListener('click', () => {
        highlightWord(id);
        focusFirstCell(word);
        showActiveClue(word.clue, id);
    });

    return clueElement;
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
        checkButton.addEventListener('click', checkFullSolution);
    }
}

function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();

    if (cell.value) {
        validateCell(cell);
        moveNext(cell);
    }
}

function handleKeydown(event) {
    const cell = event.target;
    
    switch(event.key) {
        case 'Backspace':
            handleBackspace(event, cell);
            break;
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowDown':
            handleArrowKeys(event, cell);
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
        const word = crosswordData.words[wordId];
        const currentDirection = cell.dataset.activeDirection || word.direction;
        const newDirection = currentDirection === 'across' ? 'down' : 'across';
        
        const hasOtherDirection = Object.values(crosswordData.words).some(w => 
            w.direction !== currentDirection && 
            isCellInWord(cell, w)
        );
        
        if (hasOtherDirection) {
            cell.dataset.activeDirection = newDirection;
            highlightWord(findWordInDirection(cell, newDirection));
        }
    }
}

// Pomocné funkce pro kontrolu a validaci
function validateCell(cell) {
    const isCorrect = cell.value.toUpperCase() === cell.dataset.correct;
    cell.classList.toggle('correct', isCorrect);
    cell.classList.toggle('error', !isCorrect);
    
    if (isCorrect) {
        const wordId = cell.dataset.wordId;
        if (wordId) {
            checkWordCompletion(crosswordData.words[wordId]);
        }
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
        });
    }
}

function checkFullSolution() {
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

    if (allCorrect && solutionLetters.join('') === crosswordData.solution) {
        showSolutionAnimation(crosswordData.solution);
    } else {
        showErrorFeedback();
    }
}

function showSolutionAnimation(solution) {
    const solutionReveal = document.getElementById('solutionReveal');
    const content = solutionReveal.querySelector('.solution-content');
    if (!solutionReveal || !content) return;

    content.innerHTML = '';
    solutionReveal.classList.add('show');
    
    solution.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'solution-letter';
        span.textContent = letter;
        content.appendChild(span);
        
        setTimeout(() => {
            span.classList.add('reveal');
        }, index * 200);
    });
    
    // Zavřít po kliknutí
    solutionReveal.addEventListener('click', () => {
        solutionReveal.classList.remove('show');
    }, { once: true });
}

function showErrorFeedback() {
    document.querySelectorAll('.cell.error').forEach(cell => {
        cell.classList.add('shake');
        setTimeout(() => cell.classList.remove('shake'), 500);
    });
}

// Pomocné funkce pro navigaci
function moveNext(cell) {
    const wordId = cell.dataset.wordId;
    if (!wordId) return;

    const word = crosswordData.words[wordId];
    const currentIndex = parseInt(cell.dataset.index);

    if (currentIndex < word.answer.length - 1) {
        const nextCell = findNextCellInWord(word, currentIndex + 1);
        if (nextCell) {
            nextCell.focus();
        }
    }
}

function handleBackspace(event, cell) {
    if (!cell.value && parseInt(cell.dataset.index) > 0) {
        event.preventDefault();
        const wordId = cell.dataset.wordId;
        if (!wordId) return;

        const word = crosswordData.words[wordId];
        const prevCell = findNextCellInWord(word, parseInt(cell.dataset.index) - 1);
        if (prevCell) {
            prevCell.focus();
            prevCell.value = '';
        }
    }
}

function handleArrowKeys(event, cell) {
    const wordId = cell.dataset.wordId;
    if (!wordId) return;

    const word = crosswordData.words[wordId];
    const currentIndex = parseInt(cell.dataset.index);
    const direction = cell.dataset.activeDirection || word.direction;
    let nextCell;
    
    switch(event.key) {
        case 'ArrowRight':
            if (direction === 'across') {
                nextCell = findNextCellInWord(word, currentIndex + 1);
            }
            break;
        case 'ArrowLeft':
            if (direction === 'across') {
                nextCell = findNextCellInWord(word, currentIndex - 1);
            }
            break;
        case 'ArrowDown':
            if (direction === 'down') {
                nextCell = findNextCellInWord(word, currentIndex + 1);
            }
            break;
        case 'ArrowUp':
            if (direction === 'down') {
                nextCell = findNextCellInWord(word, currentIndex - 1);
            }
            break;
    }
    
    if (nextCell) {
        event.preventDefault();
        nextCell.focus();
    }
}

function moveToNextWord(currentCell, reverse = false) {
    const currentWordId = parseInt(currentCell.dataset.wordId);
    const wordIds = Object.keys(crosswordData.words)
        .map(id => parseInt(id))
        .sort((a, b) => a - b);
    
    let nextWordId;
    const currentIndex = wordIds.indexOf(currentWordId);
    
    if (reverse) {
        nextWordId = wordIds[currentIndex - 1] || wordIds[wordIds.length - 1];
    } else {
        nextWordId = wordIds[currentIndex + 1] || wordIds[0];
    }
    
    const nextWord = crosswordData.words[nextWordId];
    focusFirstCell(nextWord);
    highlightWord(nextWordId);
    showActiveClue(nextWord.clue, nextWordId);
}

// Pomocné funkce pro zvýraznění a zobrazení
function highlightWord(wordId) {
    // Odstranit předchozí zvýraznění
    document.querySelectorAll('.cell.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });
    document.querySelectorAll('.clue.highlight').forEach(clue => {
        clue.classList.remove('highlight');
    });

    // Zvýraznit nové slovo
    const word = crosswordData.words[wordId];
    const cells = getWordCells(word);
    cells.forEach(cell => cell.classList.add('highlight'));

    // Zvýraznit nápovědu
    const clue = document.querySelector(`.clue[data-id="${wordId}"]`);
    if (clue) clue.classList.add('highlight');
}

function showActiveClue(clueText, id) {
    const activeClue = document.getElementById('activeClue');
    if (!activeClue) return;

    const clueTextElement = activeClue.querySelector('.clue-text');
    if (clueTextElement) {
        clueTextElement.textContent = `${id}. ${clueText}`;
    }
    activeClue.style.opacity = '1';
}

// Pomocné funkce pro práci s buňkami
function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function findNextCellInWord(word, index) {
    if (index >= word.answer.length || index < 0) return null;
    const row = word.direction === 'across' ? word.row : word.row + index;
    const col = word.direction === 'across' ? word.col + index : word.col;
    return findCell(row, col);
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

function findWordInDirection(cell, direction) {
    return Object.entries(crosswordData.words).find(([_, word]) => 
        word.direction === direction && 
        isCellInWord(cell, word)
    )?.[0];
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
