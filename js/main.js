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

// Initialize crossword
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    generateClues();
});

// Create crossword grid
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    
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
        const { row, col, answer, direction } = word;
        for (let i = 0; i < answer.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;
            const cell = findCell(currentRow, currentCol);
            if (cell) {
                cell.disabled = false;
                cell.dataset.wordId = id;
            }
        }
    });
}

// Generate clues
function generateClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');
    
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

// Handle input in cells
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        const wordId = cell.dataset.wordId;
        const word = crosswordData.words[wordId];
        const nextCell = findNextCell(cell, word.direction);
        if (nextCell) nextCell.focus();
    }
}

// Handle keyboard navigation
function handleKeydown(event) {
    const cell = event.target;
    
    switch (event.key) {
        case 'ArrowRight':
            moveFocus(cell, 0, 1);
            break;
        case 'ArrowLeft':
            moveFocus(cell, 0, -1);
            break;
        case 'ArrowUp':
            moveFocus(cell, -1, 0);
            break;
        case 'ArrowDown':
            moveFocus(cell, 1, 0);
            break;
        case 'Backspace':
            if (!cell.value) {
                const prevCell = findPrevCell(cell);
                if (prevCell) {
                    prevCell.focus();
                    prevCell.value = '';
                }
            }
            break;
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

// Helper functions
function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function findNextCell(currentCell, direction) {
    const currentRow = parseInt(currentCell.dataset.row);
    const currentCol = parseInt(currentCell.dataset.col);
    
    if (direction === 'across') {
        return findCell(currentRow, currentCol + 1);
    } else {
        return findCell(currentRow + 1, currentCol);
    }
}

function findPrevCell(currentCell) {
    const currentRow = parseInt(currentCell.dataset.row);
    const currentCol = parseInt(currentCell.dataset.col);
    return findCell(currentRow, currentCol - 1) || findCell(currentRow - 1, currentCol);
}

function moveFocus(cell, rowDelta, colDelta) {
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    const nextCell = findCell(currentRow + rowDelta, currentCol + colDelta);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
    }
}

function</antArtifact>