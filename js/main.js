// Crossword data structure
const crosswordData = {
    size: 15,
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Pevná část motoru", 
            answer: "STATOR", 
            row: 1, 
            col: 3, 
            direction: "across",
            solutionLetters: {2: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Silniční poplatek", 
            answer: "MYTNE", 
            row: 2, 
            col: 1, 
            direction: "across",
            solutionLetters: {2: 1} // 'T' pro OTEC
        },
        3: { 
            clue: "Nemocniční oddělení", 
            answer: "INTERNA", 
            row: 3, 
            col: 4, 
            direction: "down",
            solutionLetters: {3: 2} // 'E' pro OTEC
        },
        4: { 
            clue: "Část molekuly vody", 
            answer: "VODIK", 
            row: 1, 
            col: 5, 
            direction: "down",
            solutionLetters: {4: 3} // 'C' pro OTEC
        },
        5: { 
            clue: "Hlavní město Francie", 
            answer: "PARIZ", 
            row: 4, 
            col: 2, 
            direction: "across",
            solutionLetters: {3: 4} // 'F' pro FURA
        },
        6: { 
            clue: "Severský mořský pták", 
            answer: "ALKA", 
            row: 5, 
            col: 6, 
            direction: "across",
            solutionLetters: {2: 5} // 'U' pro FURA
        },
        7: { 
            clue: "Český hudebník (Karel)", 
            answer: "KRYL", 
            row: 6, 
            col: 3, 
            direction: "across",
            solutionLetters: {1: 6} // 'R' pro FURA
        },
        8: { 
            clue: "Jméno herce Rodena", 
            answer: "KAREL", 
            row: 3, 
            col: 7, 
            direction: "down",
            solutionLetters: {3: 7} // 'A' pro FURA
        },
        9: {
            clue: "Část svíčky", 
            answer: "KNOT", 
            row: 2, 
            col: 8, 
            direction: "down"
        },
        10: {
            clue: "Plemeno psa", 
            answer: "BOXR", 
            row: 7, 
            col: 1, 
            direction: "across"
        },
        11: {
            clue: "Část nohy", 
            answer: "PATA", 
            row: 5, 
            col: 1, 
            direction: "down"
        },
        12: {
            clue: "Tužkou nakreslený obrázek", 
            answer: "SKICA", 
            row: 8, 
            col: 4, 
            direction: "across"
        },
        13: {
            clue: "Dopravní prostředek", 
            answer: "METRO", 
            row: 4, 
            col: 8, 
            direction: "down"
        },
        14: {
            clue: "Citoslovce bolesti", 
            answer: "AU", 
            row: 9, 
            col: 6, 
            direction: "across"
        },
        15: {
            clue: "Český zpěvák (Václav)", 
            answer: "NECKAR", 
            row: 6, 
            col: 7, 
            direction: "down"
        },
        16: {
            clue: "Chemická značka dusíku", 
            answer: "N", 
            row: 3, 
            col: 10, 
            direction: "across"
        }
    }
};

// Initialize crossword when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCrossword();
});

// Initialize all crossword components
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

    // Create cells
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
        
        // Add cell number
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
// Enable cells for a word
function enableWordCells(id, word) {
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

// Setup event listeners
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

// Handle input
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        checkWord(cell);
        moveToNextCell(cell);
    }
}

// Show tooltip
function showTooltip(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const tooltip = document.getElementById('tooltip');
    
    if (tooltip && word) {
        tooltip.textContent = `${wordId}. ${word.clue}`;
        tooltip.style.display = 'block';
        
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

// Focus first cell of a word
function focusFirstCell(word) {
    const cell = findCell(word.row, word.col);
    if (cell) {
        cell.focus();
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

// Move to next word
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

// Highlight word
function highlightWord(wordId) {
    // Remove previous highlights
    document.querySelectorAll('.cell.highlight, .clues-list p.highlight')
        .forEach(el => el.classList.remove('highlight'));

    const word = crosswordData.words[wordId];
    if (!word) return;

    // Highlight cells
    const cells = getWordCells(word);
    cells.forEach(cell => cell.classList.add('highlight'));

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
    }
}

// Get cells for a word
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
    const cells = getWordCells(word);
    return cells.map(cell => cell.value || '').join('').toUpperCase();
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
            // Add solution letters if word is correct
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
        createSuccessModal(`
            <h2>🎉 Gratulujeme! 🎉</h2>
            <p>Úspěšně jste vyřešili křížovku!</p>
            <p>Tajenka je: <strong>${solution}</strong></p>
        `);
        
        // Highlight all solution cells
        document.querySelectorAll('.solution-cell').forEach(cell => {
            cell.classList.add('solution-revealed');
        });
    } else {
        const message = `
            <h2>Ještě to není ono...</h2>
            <p>Správně vyplněno: ${correct} z ${total} slov (${percentage}%)</p>
            ${incorrectWords.length > 0 ? 
                `<p>Zkontrolujte slova s čísly: ${incorrectWords.join(', ')}</p>` : 
                ''}
        `;
        createInfoModal(message);
    }
}

// Create modal for messages
function createModal(content, type = 'info') {
    const modal = document.createElement('div');
    modal.className = `modal modal-${type}`;
    modal.innerHTML = `
        <div class="modal-content">
            ${content}
            <button class="modal-close">Zavřít</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function createSuccessModal(content) {
    createModal(content, 'success');
}

function createInfoModal(content) {
    createModal(content, 'info');
}

// Handle focus and blur events
function handleFocus(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
    }
}

function handleBlur(event) {
    // Optional: Remove highlights
    // Keeping highlights for better UX
}
