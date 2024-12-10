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
            clueElement.dataset.clue = word.clue;
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

function handleFocus(event) {
    const cell = even
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
            clueElement.dataset.clue = word.clue;
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

function handleFocus(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
        const word = crosswordData.words[wordId];
        showActiveClue(word.clue, wordId);
    }
}

function handleClick(event) {
    handleFocus(event);
}

// Show active clue
function showActiveClue(clue, id) {
    const activeClue = document.getElementById('activeClue');
    activeClue.textContent = `${id}. ${clue}`;
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

// Validate cells
function validateCell(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const index = parseInt(cell.dataset.index);
    
    const isCorrect = cell.value.toUpperCase() === word.answer[index];
    cell.classList.toggle('correct', isCorrect);
    cell.classList.toggle('error', !isCorrect);
    
    if (isCorrect) {
        checkWordCompletion(word);
    }
}

// Check word completion
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

// Check solution
function checkSolution() {
    const allCells = document.querySelectorAll('.cell');
    const isComplete = Array.from(allCells).every(cell => 
        cell.value.toUpperCase() === cell.dataset.correct
    );
    
    if (isComplete) {
        showSolutionAnimation();
    } else {
        allCells.forEach(cell => {
            validateCell(cell);
        });
    }
}

// Show solution animation
function showSolutionAnimation() {
    const solutionContent = document.querySelector('.solution-content');
    solutionContent.innerHTML = '';
    
    [...crosswordData.solution].forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'solution-letter';
        span.textContent = letter;

        if (letter === ' ') {
            span.classList.add('space');
            span.innerHTML = '&nbsp;';
        }
        
        span.style.animationDelay = `${index * 0.1}s`;
        solutionContent.appendChild(span);
    });

    const solutionReveal = document.getElementById('solutionReveal');
    solutionReveal.classList.add('show');
    
    setTimeout(() => {
        document.querySelectorAll('.solution-letter').forEach(letter => {
            letter.classList.add('reveal');
        });
    }, 100);
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

// Tooltip setup
function setupTooltips() {
    document.querySelectorAll('.clues-list p[data-clue]').forEach(clue => {
        clue.addEventListener('mouseover', () => {
            clue.setAttribute('title', clue.dataset.clue);
        });
    });
}

// Control setup
function setupControls() {
    const checkButton = document.querySelector('.btn-check');
    checkButton.addEventListener('click', () => {
        checkSolution();
    });
}
