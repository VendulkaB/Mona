// Crossword data structure
const crosswordData = {
    size: 10,
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Základní nástroj zahradníka", 
            answer: "MOTYKA", 
            row: 1, 
            col: 2, 
            direction: "across",
            solutionLetters: {2: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Starší název pro televizi", 
            answer: "TELEVIZOR", 
            row: 2, 
            col: 1, 
            direction: "down",
            solutionLetters: {3: 1} // 'T' pro OTEC
        },
        3: { 
            clue: "Roční období", 
            answer: "PODZIM", 
            row: 2, 
            col: 4, 
            direction: "across",
            solutionLetters: {1: 2} // 'E' pro OTEC
        },
        4: { 
            clue: "Český vynálezce lodního šroubu (Josef)", 
            answer: "RESSEL", 
            row: 3, 
            col: 2, 
            direction: "across",
            solutionLetters: {4: 3} // 'C' pro OTEC
        },
        5: { 
            clue: "Hudební nástroj s klaviaturou", 
            answer: "FORTE", 
            row: 4, 
            col: 3, 
            direction: "across",
            solutionLetters: {0: 4} // 'F' pro FURA
        },
        6: { 
            clue: "Chemická značka uranu", 
            answer: "U", 
            row: 5, 
            col: 5, 
            direction: "across",
            solutionLetters: {0: 5} // 'U' pro FURA
        },
        7: { 
            clue: "Hlavní město Lotyšska", 
            answer: "RIGA", 
            row: 6, 
            col: 2, 
            direction: "across",
            solutionLetters: {0: 6} // 'R' pro FURA
        },
        8: { 
            clue: "První písmeno abecedy", 
            answer: "A", 
            row: 7, 
            col: 4, 
            direction: "across",
            solutionLetters: {0: 7} // 'A' pro FURA
        },
        9: {
            clue: "Český král (Karel IV.)", 
            answer: "KAREL", 
            row: 3, 
            col: 6, 
            direction: "down"
        },
        10: {
            clue: "Značka českých hodinek", 
            answer: "PRIM", 
            row: 4, 
            col: 1, 
            direction: "down"
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
}

function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';
    
    // Find actual grid dimensions and mark used cells
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

    // Set grid dimensions
    grid.style.gridTemplateRows = `repeat(${maxRow}, var(--cell-size))`;
    grid.style.gridTemplateColumns = `repeat(${maxCol}, var(--cell-size))`;

    // Create cells
    for (let i = 1; i <= maxRow; i++) {
        for (let j = 1; j <= maxCol; j++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'cell-wrapper';
            wrapper.style.gridRow = i;
            wrapper.style.gridColumn = j;
            
            if (!usedCells.has(`${i}-${j}`)) {
                wrapper.classList.add('empty');
            } else {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.maxLength = 1;
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                wrapper.appendChild(cell);
            }
            
            grid.appendChild(wrapper);
        }
    }

    // Enable cells and add numbers
    const numberedCells = new Set();
    Object.entries(crosswordData.words).forEach(([id, word]) => {
        enableWordCells(id, word, numberedCells);
    });
}
// Enable cells for a word
function enableWordCells(id, word, numberedCells) {
    const { row, col, answer, direction, solutionLetters } = word;
    
    // Add cell number
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

    // Enable cells for the word
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
                const wrapper = cell.closest('.cell-wrapper');
                const indicator = document.createElement('div');
                indicator.className = 'solution-indicator';
                indicator.textContent = parseInt(solutionLetters[i]) + 1;
                wrapper.appendChild(indicator);
            }
        }
    }
}

// Generate clues
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

// Setup event listeners
function setupEventListeners() {
    document.querySelectorAll('.cell:not([disabled])').forEach(cell => {
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);
        cell.addEventListener('focus', handleFocus);
        cell.addEventListener('click', handleClick);
    });
}

// Handle input
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        validateCell(cell);
        moveToNextCellInWord(cell);
    }
}

// Handle keyboard navigation
function handleKeydown(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const currentIndex = parseInt(cell.dataset.index);
    
    switch (event.key) {
        case 'Backspace':
            handleBackspace(event, cell, word, currentIndex);
            break;
        case 'ArrowRight':
        case 'ArrowLeft':
            if (word.direction === 'across') {
                event.preventDefault();
                handleHorizontalNavigation(event.key, cell, word, currentIndex);
            }
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            if (word.direction === 'down') {
                event.preventDefault();
                handleVerticalNavigation(event.key, cell, word, currentIndex);
            }
            break;
        case 'Tab':
            event.preventDefault();
            moveToNextWord(cell, event.shiftKey);
            break;
    }
}

function handleClick(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        const word = crosswordData.words[wordId];
        highlightWord(wordId);
        showActiveClue(word.clue, wordId);
    }
}

// Show active clue
function showActiveClue(clue, id) {
    const activeClue = document.querySelector('.active-clue .clue-text');
    if (activeClue) {
        activeClue.textContent = `${id}. ${clue}`;
    }
}

// Handle backspace
function handleBackspace(event, cell, word, currentIndex) {
    if (!cell.value) {
        event.preventDefault();
        if (currentIndex > 0) {
            const prevCell = findPreviousCellInWord(word, currentIndex);
            if (prevCell) {
                prevCell.focus();
                prevCell.value = '';
            }
        }
    }
}

// Move to next cell in word
function moveToNextCellInWord(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const currentIndex = parseInt(cell.dataset.index);
    
    if (currentIndex < word.answer.length - 1) {
        const nextCell = findNextCellInWord(word, currentIndex + 1);
        if (nextCell) nextCell.focus();
    }
}
// Navigation helpers
function handleHorizontalNavigation(key, cell, word, currentIndex) {
    const delta = key === 'ArrowRight' ? 1 : -1;
    const newIndex = currentIndex + delta;
    
    if (newIndex >= 0 && newIndex < word.answer.length) {
        const nextCell = findNextCellInWord(word, newIndex);
        if (nextCell) nextCell.focus();
    }
}

function handleVerticalNavigation(key, cell, word, currentIndex) {
    const delta = key === 'ArrowDown' ? 1 : -1;
    const newIndex = currentIndex + delta;
    
    if (newIndex >= 0 && newIndex < word.answer.length) {
        const nextCell = findNextCellInWord(word, newIndex);
        if (nextCell) nextCell.focus();
    }
}

// Find cells in word
function findNextCellInWord(word, index) {
    const row = word.direction === 'across' ? word.row : word.row + index;
    const col = word.direction === 'across' ? word.col + index : word.col;
    return findCell(row, col);
}

function findPreviousCellInWord(word, currentIndex) {
    return findNextCellInWord(word, currentIndex - 1);
}

// Highlight word
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

// Validate cells and words
function validateCell(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const index = parseInt(cell.dataset.index);
    
    const isCorrect = cell.value.toUpperCase() === word.answer[index];
    cell.classList.toggle('correct', isCorrect);
    
    if (isCorrect) {
        checkWordCompletion(word);
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
            if (cell.classList.contains('solution-cell')) {
                cell.classList.add('solution-revealed');
            }
        });
    }
}

// Show solution animation
function showSolutionAnimation(solution) {
    const reveal = document.getElementById('solutionReveal');
    const content = reveal.querySelector('.solution-content');
    content.innerHTML = '';
    
    solution.split('').forEach((letter, index) => {
        if (index === 4) { // Add space after OTEC
            const space = document.createElement('span');
            space.className = 'solution-letter';
            space.innerHTML = '&nbsp;';
            space.style.width = '20px';
            content.appendChild(space);
        }
        
        const span = document.createElement('span');
        span.className = 'solution-letter';
        span.textContent = letter;
        span.style.animationDelay = `${index * 0.1}s`;
        content.appendChild(span);
    });

    reveal.classList.add('show');
    
    setTimeout(() => {
        document.querySelectorAll('.solution-letter').forEach(letter => {
            letter.classList.add('reveal');
        });
    }, 100);

    // Close on click
    reveal.addEventListener('click', () => {
        reveal.classList.remove('show');
    }, { once: true });
}

// Check complete solution
function checkSolution() {
    let correct = 0;
    let total = 0;
    let revealedSolution = new Array(crosswordData.solution.length).fill('');
    let incorrectWords = [];

    Object.entries(crosswordData.words).forEach(([id, word]) => {
        const userAnswer = getWordAnswer(word);
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

    if (correct === total) {
        const solution = revealedSolution.join('');
        showSolutionAnimation(solution);
    } else {
        const percentage = Math.round((correct / total) * 100);
        alert(`Správně vyplněno: ${correct} z ${total} slov (${percentage}%)\n` +
              `Zkontrolujte slova s čísly: ${incorrectWords.join(', ')}`);
    }
}

// Helper functions
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

function getWordAnswer(word) {
    const cells = getWordCells(word);
    return cells.map(cell => cell.value || '').join('').toUpperCase();
}

function focusFirstCell(word) {
    const firstCell = findCell(word.row, word.col);
    if (firstCell) {
        firstCell.focus();
    }
}
