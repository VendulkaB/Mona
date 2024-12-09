// Crossword data structure
const crosswordData = {
    size: 15,
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Hlavní město České republiky", 
            answer: "PRAHA", 
            row: 1, 
            col: 3, 
            direction: "across",
            solutionLetters: {2: 0} // 'O' pro OTEC
        },
        2: { 
            clue: "Nejvyšší hora světa", 
            answer: "EVEREST", 
            row: 1, 
            col: 1, 
            direction: "down",
            solutionLetters: {3: 1} // 'T' pro OTEC
        },
        3: { 
            clue: "Chemický prvek Fe", 
            answer: "ZELEZO", 
            row: 2, 
            col: 4, 
            direction: "across",
            solutionLetters: {2: 2} // 'E' pro OTEC
        },
        4: { 
            clue: "Jméno skladatele Dvořáka", 
            answer: "ANTONIN", 
            row: 3, 
            col: 2, 
            direction: "across",
            solutionLetters: {5: 3} // 'C' pro OTEC
        },
        5: { 
            clue: "Nejrychlejší suchozemské zvíře", 
            answer: "GEPARD", 
            row: 4, 
            col: 5, 
            direction: "down",
            solutionLetters: {0: 4} // 'F' pro FURA
        },
        6: { 
            clue: "Planeta nejblíže Slunci", 
            answer: "MERKUR", 
            row: 5, 
            col: 3, 
            direction: "across",
            solutionLetters: {3: 5} // 'U' pro FURA
        },
        7: { 
            clue: "Hlavní město Francie", 
            answer: "PARIZ", 
            row: 6, 
            col: 1, 
            direction: "across",
            solutionLetters: {2: 6} // 'R' pro FURA
        },
        8: { 
            clue: "Velká pouštˇ v Africe", 
            answer: "SAHARA", 
            row: 7, 
            col: 4, 
            direction: "across",
            solutionLetters: {1: 7} // 'A' pro FURA
        },
        9: {
            clue: "Nejdelší řeka ČR", 
            answer: "VLTAVA", 
            row: 3, 
            col: 6, 
            direction: "down"
        },
        10: {
            clue: "Základní jednotka délky", 
            answer: "METR", 
            row: 8, 
            col: 2, 
            direction: "down"
        },
        11: {
            clue: "Největší savec", 
            answer: "VELRYBA", 
            row: 6, 
            col: 8, 
            direction: "down"
        },
        12: {
            clue: "Český národní strom", 
            answer: "LIPA", 
            row: 4, 
            col: 1, 
            direction: "across"
        },
        13: {
            clue: "Značka českých aut", 
            answer: "SKODA", 
            row: 9, 
            col: 3, 
            direction: "across"
        },
        14: {
            clue: "Protiklad dne", 
            answer: "NOC", 
            row: 8, 
            col: 7, 
            direction: "across"
        },
        15: {
            clue: "Jednotka elektrického napětí", 
            answer: "VOLT", 
            row: 2, 
            col: 9, 
            direction: "down"
        },
        16: {
            clue: "Název našeho Slunce", 
            answer: "SOL", 
            row: 5, 
            col: 8, 
            direction: "across"
        }
    }
};

// Initialize crossword
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    generateClues();
    setupEventListeners();
});

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
            clueElement.addEventListener('click', () => highlightWord(id));

            if (word.direction === 'across') {
                acrossClues.appendChild(clueElement);
            } else {
                downClues.appendChild(clueElement);
            }
        });
}

// Setup event listeners for all cells
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
    
    // Convert input to uppercase
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
            event.preventDefault();
            moveFocus(cell, 0, 1);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            moveFocus(cell, 0, -1);
            break;
        case 'ArrowUp':
            event.preventDefault();
            moveFocus(cell, -1, 0);
            break;
        case 'ArrowDown':
            event.preventDefault();
            moveFocus(cell, 1, 0);
            break;
        case 'Backspace':
            if (!cell.value) {
                event.preventDefault();
                const prevCell = findPrevCell(cell);
                if (prevCell) {
                    prevCell.focus();
                    prevCell.value = '';
                }
            }
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

// Move focus in specified direction
function moveFocus(cell, rowDelta, colDelta) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    const nextCell = findCell(currentRow + rowDelta, currentCol + colDelta);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

// Move to next cell after input
function moveToNextCell(cell) {
    const direction = cell.dataset.direction;
    const nextCell = findNextCell(cell, direction);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

// Find next cell
function findNextCell(cell, direction) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    
    if (direction === 'across') {
        return findCell(currentRow, currentCol + 1);
    } else {
        return findCell(currentRow + 1, currentCol);
    }
}

// Find previous cell
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
    
    // Highlight word cells
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
    }
}

// Get all cells for a word
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

// Get user's answer for a word
function getUserAnswer(word) {
    let answer = '';
    for (let i = 0; i < word.answer.length; i++) {
        const currentRow = word.direction === 'across' ? word.row : word.row + i;
        const currentCol = word.direction === 'across' ? word.col + i : word.col;
        const cell = findCell(currentRow, currentCol);
        if (cell) answer += (cell.value || '').toUpperCase();
    }
    return answer;
}

// Find cell by coordinates
function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Handle focus and blur
function handleFocus(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
    }
}

function handleBlur(event) {
    // Optionally remove highlights when leaving a cell
    // Currently left empty for better UX
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
