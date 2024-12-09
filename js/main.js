// Crossword data structure
const crosswordData = {
    size: 12,
    words: {
        1: { clue: "Hlavní město Itálie", answer: "RIM", row: 1, col: 1, direction: "across" },
        2: { clue: "Nejvyšší hora světa", answer: "EVEREST", row: 1, col: 3, direction: "down" },
        3: { clue: "Planeta nejblíže Slunci", answer: "MERKUR", row: 2, col: 1, direction: "across" },
        4: { clue: "Autor Hamleta", answer: "SHAKESPEARE", row: 2, col: 5, direction: "down" },
        5: { clue: "Největší oceán", answer: "TICHY", row: 4, col: 1, direction: "across" },
        6: { clue: "Hlavní město Japonska", answer: "TOKIO", row: 5, col: 4, direction: "down" },
        7: { clue: "Chemický prvek Au", answer: "ZLATO", row: 6, col: 1, direction: "across" },
        8: { clue: "Hlavní město Francie", answer: "PARIZ", row: 8, col: 1, direction: "across" },
        9: { clue: "Řeka protékající Londýnem", answer: "TEMZE", row: 9, col: 2, direction: "across" },
        10: { clue: "Základní část rostliny", answer: "KOREN", row: 10, col: 1, direction: "across" },
        11: { clue: "Slavný italský malíř", answer: "DAVINCI", row: 11, col: 2, direction: "down" },
        12: { clue: "Planeta pojmenovaná po bohu války", answer: "MARS", row: 12, col: 3, direction: "across" },
        13: { clue: "První prezident Československa", answer: "MASARYK", row: 7, col: 5, direction: "down" },
        14: { clue: "Řeka v Egyptě", answer: "NIL", row: 10, col: 6, direction: "down" },
        15: { clue: "Planeta nejvzdálenější od Slunce", answer: "NEPTUN", row: 5, col: 8, direction: "down" },
        16: { clue: "Největší kontinent světa", answer: "ASIE", row: 3, col: 7, direction: "across" }
    }
};

// Initialize crossword when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    generateClues();
    setupTooltip();
});

// Create the crossword grid
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = ''; // Clear existing content

    // Create cells
    for (let i = 1; i <= crosswordData.size; i++) {
        for (let j = 1; j <= crosswordData.size; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.disabled = true;
            
            // Add event listeners
            cell.addEventListener('input', handleInput);
            cell.addEventListener('keydown', handleKeydown);
            cell.addEventListener('focus', handleFocus);
            cell.addEventListener('blur', handleBlur);
            
            grid.appendChild(cell);
        }
    }
    
    // Enable cells for words
    Object.entries(crosswordData.words).forEach(([id, word]) => {
        enableWordCells(id, word);
    });
}

// Enable cells for a word
function enableWordCells(id, word) {
    const { row, col, answer, direction } = word;
    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        if (cell) {
            cell.disabled = false;
            cell.dataset.wordId = id;
            cell.dataset.direction = direction;
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

// Setup tooltip
function setupTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        const newTooltip = document.createElement('div');
        newTooltip.id = 'tooltip';
        document.body.appendChild(newTooltip);
    }
}

// Handle input in cells
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        moveToNextCell(cell);
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
        case 'Tab':
            event.preventDefault();
            moveToNextWord(cell, event.shiftKey);
            break;
    }
}

// Move to next/previous word
function moveToNextWord(cell, reverse = false) {
    const currentWordId = parseInt(cell.dataset.wordId);
    const wordIds = Object.keys(crosswordData.words).map(Number).sort((a, b) => a - b);
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

// Handle cell focus
function handleFocus(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
        showTooltip(cell, crosswordData.words[wordId].clue);
    }
}

// Handle cell blur
function handleBlur() {
    hideTooltip();
}

// Highlight word cells
function highlightWord(wordId) {
    // Remove previous highlights
    document.querySelectorAll('.cell.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });
    document.querySelectorAll('.clues p.highlight').forEach(clue => {
        clue.classList.remove('highlight');
    });

    // Highlight current word
    const word = crosswordData.words[wordId];
    const { row, col, answer, direction } = word;
    
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
    }
}

// Show tooltip
function showTooltip(cell, text) {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
    }
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
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

function moveFocus(cell, rowDelta, colDelta) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    const nextCell = findCell(currentRow + rowDelta, currentCol + colDelta);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

// Check solution
function checkSolution() {
    let correct = 0;
    let total = 0;
    let incorrectWords = [];

    Object.entries(crosswordData.words).forEach(([id, word]) => {
        const userAnswer = getUserAnswer(word);
        if (userAnswer === word.answer) {
            correct++;
        } else {
            incorrectWords.push(id);
        }
        total++;
    });

    const percentage = Math.round((correct / total) * 100);
    
    if (correct === total) {
        alert(`Gratulujeme! Vyřešili jste křížovku správně! (${correct}/${total})`);
    } else {
        alert(`Správně vyplněno: ${correct} z ${total} slov (${percentage}%)\nZkontrolujte slova: ${incorrectWords.join(', ')}`);
    }
}

// Get user answer for a word
function getUserAnswer(word) {
    let answer = '';
    const { row, col, answer: correctAnswer, direction } = word;
    
    for (let i = 0; i < correctAnswer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        answer += (cell?.value || '').toUpperCase();
    }
    
    return answer;
}