// Crossword data structure
const crosswordData = {
    size: 15,
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Hlavní město České republiky", 
            answer: "PRAHA", 
            row: 1, 
            col: 2, 
            direction: "across",
            solutionLetters: {2: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Chemický prvek Fe", 
            answer: "ZELEZO", 
            row: 2, 
            col: 4, 
            direction: "across",
            solutionLetters: {4: 1} // 'T' pro OTEC
        },
        3: { 
            clue: "Řeka protékající Prahou", 
            answer: "VLTAVA", 
            row: 1, 
            col: 4, 
            direction: "down",
            solutionLetters: {2: 2} // 'E' pro OTEC
        },
        4: { 
            clue: "Největší český skladatel (Antonín)", 
            answer: "DVORAK", 
            row: 3, 
            col: 1, 
            direction: "across",
            solutionLetters: {5: 3} // 'C' pro OTEC
        },
        5: { 
            clue: "Značka českých aut", 
            answer: "SKODA", 
            row: 4, 
            col: 3, 
            direction: "down",
            solutionLetters: {0: 4} // 'F' pro FURA
        },
        6: { 
            clue: "Národní strom ČR", 
            answer: "LIPA", 
            row: 5, 
            col: 2, 
            direction: "across",
            solutionLetters: {2: 5} // 'U' pro FURA
        },
        7: { 
            clue: "Planetka objevená českými astronomy", 
            answer: "EROS", 
            row: 6, 
            col: 5, 
            direction: "across",
            solutionLetters: {0: 6} // 'R' pro FURA
        },
        8: { 
            clue: "První česká světice", 
            answer: "LUDMILA", 
            row: 4, 
            col: 7, 
            direction: "down",
            solutionLetters: {5: 7} // 'A' pro FURA
        },
        9: {
            clue: "Nejvyšší hora ČR", 
            answer: "SNEZKA", 
            row: 7, 
            col: 3, 
            direction: "across"
        },
        10: {
            clue: "Písmeno řecké abecedy", 
            answer: "BETA", 
            row: 3, 
            col: 6, 
            direction: "down"
        },
        11: {
            clue: "Chemická značka zlata", 
            answer: "AU", 
            row: 8, 
            col: 4, 
            direction: "across"
        },
        12: {
            clue: "Jednotka elektrického napětí", 
            answer: "VOLT", 
            row: 5, 
            col: 8, 
            direction: "down"
        },
        13: {
            clue: "Hlavní město Norska", 
            answer: "OSLO", 
            row: 2, 
            col: 9, 
            direction: "across"
        },
        14: {
            clue: "Český vynálezce lodního šroubu", 
            answer: "RESSEL", 
            row: 1, 
            col: 8, 
            direction: "down"
        },
        15: {
            clue: "Část molekuly vody", 
            answer: "VODIK", 
            row: 6, 
            col: 1, 
            direction: "down"
        },
        16: {
            clue: "Chemická značka dusíku", 
            answer: "N", 
            row: 4, 
            col: 10, 
            direction: "across"
        }
    }
};

// Initialize crossword
document.addEventListener('DOMContentLoaded', () => {
    initializeCrossword();
});

function initializeCrossword() {
    createGrid();
    generateClues();
    setupEventListeners();
    setupTooltip();
}

// Create the crossword grid
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';

    // Create the grid cells
    for (let i = 1; i <= crosswordData.size; i++) {
        for (let j = 1; j <= crosswordData.size; j++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'cell-wrapper';
            
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.disabled = true;
            
            wrapper.appendChild(cell);
            grid.appendChild(wrapper);
        }
    }

    // Enable cells and add numbers
    const numberedCells = new Set();
    Object.entries(crosswordData.words).forEach(([id, word]) => {
        enableWordCells(id, word);
        addCellNumber(id, word, numberedCells);
    });
}

function addCellNumber(id, word, numberedCells) {
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
}
// Enable cells for a word and setup tooltips
function enableWordCells(id, word) {
    const { row, col, answer, direction, solutionLetters, clue } = word;
    
    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        
        if (cell) {
            cell.disabled = false;
            cell.dataset.wordId = id;
            cell.dataset.direction = direction;
            cell.dataset.index = i;
            cell.dataset.clue = clue;
            
            // Add solution cell marking
            if (solutionLetters && solutionLetters[i] !== undefined) {
                cell.classList.add('solution-cell');
                const wrapper = cell.closest('.cell-wrapper');
                const indicator = document.createElement('div');
                indicator.className = 'solution-indicator';
                indicator.textContent = parseInt(solutionLetters[i]) + 1;
                wrapper.appendChild(indicator);
            }

            // Add tooltip events
            cell.addEventListener('mouseenter', showTooltip);
            cell.addEventListener('mouseleave', hideTooltip);
            cell.addEventListener('focus', showTooltip);
            cell.addEventListener('blur', hideTooltip);
        }
    }
}

// Setup tooltip
function setupTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        const newTooltip = document.createElement('div');
        newTooltip.id = 'tooltip';
        newTooltip.className = 'tooltip';
        document.body.appendChild(newTooltip);
    }
}

// Show tooltip with clue
function showTooltip(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const tooltip = document.getElementById('tooltip');
    
    if (tooltip && word) {
        tooltip.textContent = `${wordId}. ${word.clue}`;
        tooltip.style.display = 'block';
        
        // Position tooltip
        const rect = cell.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        tooltip.style.top = `${rect.bottom + scrollTop + 5}px`;
        tooltip.style.left = `${rect.left + scrollLeft}px`;
        
        // Highlight current word
        highlightWord(wordId);
    }
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Generate clues with improved highlighting
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
            clueElement.dataset.direction = word.direction;
            
            // Add click event for highlighting
            clueElement.addEventListener('click', () => {
                highlightWord(id);
                focusFirstCell(word);
            });

            if (word.direction === 'across') {
                acrossClues.appendChild(clueElement);
            } else {
                downClues.appendChild(clueElement);
            }
        });
}

// Focus first cell of a word
function focusFirstCell(word) {
    const firstCell = findCell(word.row, word.col);
    if (firstCell) {
        firstCell.focus();
    }
}

// Setup event listeners for cells
function setupEventListeners() {
    document.querySelectorAll('.cell:not([disabled])').forEach(cell => {
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);
        cell.addEventListener('focus', handleFocus);
        cell.addEventListener('blur', handleBlur);
    });
}

// Handle input in cells
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        checkWord(cell);
        moveToNextCell(cell);
    }
}

// Handle keyboard navigation
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

// Handle arrow key navigation
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
// Handle backspace
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

// Move focus in specified direction
function moveFocus(cell, rowDelta, colDelta) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    const nextCell = findCell(currentRow + rowDelta, currentCol + colDelta);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

// Move to next cell
function moveToNextCell(cell) {
    const direction = cell.dataset.direction;
    const nextCell = findNextCell(cell, direction);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

// Highlight word and its clue
function highlightWord(wordId) {
    // Remove previous highlights
    document.querySelectorAll('.cell.highlight, .clues-list p.highlight')
        .forEach(el => el.classList.remove('highlight'));

    const word = crosswordData.words[wordId];
    if (!word) return;

    // Highlight cells
    for (let i = 0; i < word.answer.length; i++) {
        const currentRow = word.direction === 'across' ? word.row : word.row + i;
        const currentCol = word.direction === 'across' ? word.col + i : word.col;
        const cell = findCell(currentRow, currentCol);
        if (cell) {
            cell.classList.add('highlight');
        }
    }

    // Highlight clue
    const clue = document.querySelector(`.clues-list p[data-id="${wordId}"]`);
    if (clue) {
        clue.classList.add('highlight');
        clue.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Check word completion
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
        
        // If correct, update related words
        if (isCorrect) {
            updateCrossingWords(word);
        }
    }
}

// Update crossing words when a word is completed correctly
function updateCrossingWords(word) {
    const { row, col, answer, direction } = word;
    
    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        
        if (cell) {
            const crossingWordId = getCrossingWordId(cell, direction);
            if (crossingWordId) {
                const crossingWord = crosswordData.words[crossingWordId];
                checkWord(cell);
            }
        }
    }
}

// Get crossing word ID
function getCrossingWordId(cell, currentDirection) {
    const crossingCells = document.querySelectorAll(
        `.cell[data-row="${cell.dataset.row}"][data-col="${cell.dataset.col}"]`
    );
    
    for (const crossingCell of crossingCells) {
        if (crossingCell.dataset.direction !== currentDirection) {
            return crossingCell.dataset.wordId;
        }
    }
    return null;
}

// Get all cells for a word
function getWordCells(word) {
    const cells = [];
    const { row, col, answer, direction } = word;
    
    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        if (cell) cells.push(cell);
    }
    return cells;
}

// Get user's answer for a word
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
    return answer;
}

// Helper functions for cell navigation
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

// Check complete solution
function checkSolution() {
    let correct = 0;
    let total = 0;
    let revealedSolution = new Array(crosswordData.solution.length).fill('');
    let incorrectWords = [];

    Object.entries(crosswordData.words).forEach(([id, word]) => {
        const userAnswer = getUserAnswer(word);
        if (userAnswer === word.answer) {
            correct++;
            if (word.solutionLetters) {
                Object.entries(word.solutionLetters).forEach(([letterIndex, solutionIndex]) => {
                    revealedSolution[solutionIndex] = word.answer[letterIndex];
                });
            }
        } else if (userAnswer.length > 0) {
            incorrectWords.push(id);
        }
        total++;
    });

    const percentage = Math.round((correct / total) * 100);
    const solution = revealedSolution.join('');
    
    if (correct === total) {
        alert(`Gratulujeme! Vyřešili jste křížovku správně!\nTajenka je: ${solution}`);
        // Highlight all solution cells
        document.querySelectorAll('.solution-cell').forEach(cell => {
            cell.classList.add('solution-revealed');
        });
    } else {
        let message = `Správně vyplněno: ${correct} z ${total} slov (${percentage}%)\n`;
        if (incorrectWords.length > 0) {
            message += `Zkontrolujte slova s čísly: ${incorrectWords.join(', ')}`;
        }
        alert(message);
    }
}
