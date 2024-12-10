// Crossword data structure
const crosswordData = {
    size: 12,
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Ruční nářadí na kopání", 
            answer: "MOTYKA", 
            row: 1, 
            col: 2, 
            direction: "across",
            solutionLetters: {1: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Stroj na lisování", 
            answer: "LIS", 
            row: 1, 
            col: 2, 
            direction: "down"
        },
        3: { 
            clue: "Pomůcka k psaní", 
            answer: "TUZKA", 
            row: 2, 
            col: 1, 
            direction: "across",
            solutionLetters: {0: 1} // 'T' pro OTEC
        },
        4: { 
            clue: "Český vědec (Jaroslav)", 
            answer: "HEYROVSKY", 
            row: 3, 
            col: 3, 
            direction: "across",
            solutionLetters: {1: 2} // 'E' pro OTEC
        },
        5: { 
            clue: "Italská metropole", 
            answer: "ROMA", 
            row: 4, 
            col: 2, 
            direction: "across",
            solutionLetters: {0: 3} // 'C' pro OTEC
        },
        6: { 
            clue: "Lesní plod", 
            answer: "FIALKA", 
            row: 5, 
            col: 1, 
            direction: "across",
            solutionLetters: {0: 4} // 'F' pro FURA
        },
        7: { 
            clue: "Část vozu", 
            answer: "UHEL", 
            row: 6, 
            col: 3, 
            direction: "across",
            solutionLetters: {0: 5} // 'U' pro FURA
        },
        8: { 
            clue: "Druh obilí", 
            answer: "RÝŽE", 
            row: 7, 
            col: 2, 
            direction: "across",
            solutionLetters: {0: 6} // 'R' pro FURA
        },
        9: { 
            clue: "Planetka", 
            answer: "ADAM", 
            row: 8, 
            col: 4, 
            direction: "across",
            solutionLetters: {0: 7} // 'A' pro FURA
        },
        10: {
            clue: "České pohoří", 
            answer: "TATRY", 
            row: 2, 
            col: 5, 
            direction: "down"
        },
        11: {
            clue: "Chemická značka sodíku", 
            answer: "NA", 
            row: 3, 
            col: 7, 
            direction: "across"
        },
        12: {
            clue: "Proud vody", 
            answer: "TOK", 
            row: 4, 
            col: 6, 
            direction: "down"
        }
    }
};

// Initialize crossword when DOM is loaded
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
    
    // Find actual grid dimensions
    let maxRow = 0;
    let maxCol = 0;
    const usedCells = new Set();
    
    // Calculate grid size and mark used cells
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

    // Create only necessary cells
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

    // Enable cells for words and add numbers
    const numberedCells = new Set();
    Object.entries(crosswordData.words).forEach(([id, word]) => {
        enableWordCells(id, word, numberedCells);
    });
}

function enableWordCells(id, word, numberedCells) {
    const { row, col, answer, direction, solutionLetters } = word;
    
    // Add cell number if needed
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
// Generate clues with enhanced interaction
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
            });

            if (word.direction === 'across') {
                acrossClues.appendChild(clueElement);
            } else {
                downClues.appendChild(clueElement);
            }
        });
}

// Setup event listeners for all interactive elements
function setupEventListeners() {
    document.querySelectorAll('.cell:not([disabled])').forEach(cell => {
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);
        cell.addEventListener('focus', handleFocus);
        cell.addEventListener('blur', handleBlur);
        cell.addEventListener('mouseenter', showTooltip);
        cell.addEventListener('mouseleave', hideTooltip);
    });
}

// Enhanced tooltip handling
function showTooltip(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const tooltip = document.getElementById('tooltip');
    
    if (tooltip && word) {
        const tooltipContent = `${wordId}. ${word.clue} (${word.answer.length} písmen)`;
        tooltip.querySelector('.tooltip-content').textContent = tooltipContent;
        
        const rect = cell.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        tooltip.style.top = `${rect.bottom + scrollTop + 10}px`;
        tooltip.style.left = `${rect.left + scrollLeft - 10}px`;
        
        tooltip.classList.add('show');
        highlightWord(wordId);
    }
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

// Handle input in cells
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        validateCell(cell);
        moveToNextCellInWord(cell);
    }
}

// Move to next cell within the same word
function moveToNextCellInWord(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const currentIndex = parseInt(cell.dataset.index);
    
    if (currentIndex < word.answer.length - 1) {
        const nextRow = word.direction === 'across' ? word.row : word.row + currentIndex + 1;
        const nextCol = word.direction === 'across' ? word.col + currentIndex + 1 : word.col;
        const nextCell = findCell(nextRow, nextCol);
        if (nextCell) {
            nextCell.focus();
        }
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
        case 'ArrowLeft':
        case 'ArrowRight':
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

// Handle backspace key
function handleBackspace(event, cell, word, currentIndex) {
    if (!cell.value) {
        event.preventDefault();
        if (currentIndex > 0) {
            const prevRow = word.direction === 'across' ? word.row : word.row + currentIndex - 1;
            const prevCol = word.direction === 'across' ? word.col + currentIndex - 1 : word.col;
            const prevCell = findCell(prevRow, prevCol);
            if (prevCell) {
                prevCell.focus();
                prevCell.value = '';
            }
        }
    }
}

// Handle horizontal navigation
function handleHorizontalNavigation(key, cell, word, currentIndex) {
    const delta = key === 'ArrowRight' ? 1 : -1;
    const newIndex = currentIndex + delta;
    
    if (newIndex >= 0 && newIndex < word.answer.length) {
        const nextCell = findCell(word.row, word.col + newIndex);
        if (nextCell) {
            nextCell.focus();
        }
    }
}

// Handle vertical navigation
function handleVerticalNavigation(key, cell, word, currentIndex) {
    const delta = key === 'ArrowDown' ? 1 : -1;
    const newIndex = currentIndex + delta;
    
    if (newIndex >= 0 && newIndex < word.answer.length) {
        const nextCell = findCell(word.row + newIndex, word.col);
        if (nextCell) {
            nextCell.focus();
        }
    }
}
// Highlight active word
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

// Validate cell input
function validateCell(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const index = parseInt(cell.dataset.index);
    
    if (cell.value.toUpperCase() === word.answer[index]) {
        cell.classList.add('correct');
        checkWordCompletion(word);
    } else {
        cell.classList.remove('correct');
    }
}

// Check if word is complete
function checkWordCompletion(word) {
    const cells = getWordCells(word);
    const isComplete = cells.every(cell => 
        cell.value.toUpperCase() === word.answer[parseInt(cell.dataset.index)]
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

// Get cells for a word
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

// Show solution animation
function showSolutionAnimation(solution) {
    const reveal = document.getElementById('solutionReveal');
    const content = reveal.querySelector('.solution-content');
    content.innerHTML = '';
    
    // Create letters with staggered animation
    solution.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'solution-letter';
        span.textContent = letter;
        span.style.animationDelay = `${index * 0.1}s`;
        content.appendChild(span);
        
        // Add space after OTEC
        if (index === 3) {
            const space = document.createElement('span');
            space.className = 'solution-letter';
            space.innerHTML = '&nbsp;';
            space.style.animationDelay = `${index * 0.1}s`;
            content.appendChild(space);
        }
    });

    // Show the reveal container
    reveal.classList.add('show');
    
    // Trigger letter animations
    setTimeout(() => {
        document.querySelectorAll('.solution-letter').forEach(letter => {
            letter.classList.add('reveal');
        });
    }, 100);

    // Add click to dismiss
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

function focusFirstCell(word) {
    const firstCell = findCell(word.row, word.col);
    if (firstCell) {
        firstCell.focus();
    }
}

function getWordAnswer(word) {
    let answer = '';
    for (let i = 0; i < word.answer.length; i++) {
        const currentRow = word.direction === 'across' ? word.row : word.row + i;
        const currentCol = word.direction === 'across' ? word.col + i : word.col;
        const cell = findCell(currentRow, currentCol);
        if (cell) {
            answer += (cell.value || '').toUpperCase();
        }
    }
    return answer;
}

// Handle focus and blur
function handleFocus(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
    }
}

function handleBlur() {
    // Optional: Remove highlights on blur
    // Currently kept for better UX
}
