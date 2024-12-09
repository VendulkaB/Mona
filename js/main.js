// Crossword Data
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

// Initialize the crossword
function initializeCrossword() {
    createGrid();
    generateClues();
    setupEventListeners();
}

// Create the crossword grid
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = ''; // Clear existing content

    for (let i = 1; i <= crosswordData.size; i++) {
        for (let j = 1; j <= crosswordData.size; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.disabled = true;
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

// Highlight a word and its clue
function highlightWord(id) {
    removeHighlights();
    const word = crosswordData.words[id];
    if (!word) return;

    // Highlight clue
    const clueElement = document.querySelector(`p[data-id="${id}"]`);
    if (clueElement) clueElement.classList.add('highlight');

    // Highlight cells
    for (let i = 0; i < word.answer.length; i++) {
        const currentRow = word.direction === 'across' ? word.row : word.row + i;
        const currentCol = word.direction === 'across' ? word.col + i : word.col;
        const cell = findCell(currentRow, currentCol);
        if (cell) cell.classList.add('highlight');
    }
}

// Remove all highlights
function removeHighlights() {
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
}

// Helper function to find a cell
function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Setup event listeners
function setupEventListeners() {
    const tooltip = document.getElementById('tooltip');
    
    document.querySelectorAll('.cell:not([disabled])').forEach(cell => {
        cell.addEventListener('focus', handleCellFocus);
        cell.addEventListener('input', handleCellInput);
        cell.addEventListener('keydown', handleCellKeydown);
    });
}

// Handle cell focus
function handleCellFocus(event) {
    const wordId = event.target.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
        showTooltip(event.target, crosswordData.words[wordId].clue);
    }
}

// Handle cell input
function handleCellInput(event) {
    const input = event.target;
    input.value = input.value.toUpperCase();
    if (input.value) {
        const nextCell = findNextCell(input);
        if (nextCell) nextCell.focus();
    }
}

// Handle cell keydown
function handleCellKeydown(event) {
    const cell = event.target;
    
    switch(event.key) {
        case 'Backspace':
            if (!cell.value) {
                const prevCell = findPrevCell(cell);
                if (prevCell) {
                    prevCell.focus();
                    prevCell.value = '';
                }
            }
            break;
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowDown':
            event.preventDefault();
            const nextCell = findAdjacentCell(cell, event.key);
            if (nextCell) nextCell.focus();
            break;
    }
}

// Show tooltip
function showTooltip(element, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;
}

// Check solution
function checkSolution() {
    let correct = 0;
    let total = 0;

    Object.entries(crosswordData.words).forEach(([id, word]) => {
        const userAnswer = getUserAnswer(word);
        if (userAnswer === word.answer) correct++;
        total++;
    });

    const percentage = Math.round((correct / total) * 100);
    alert(`Správně vyplněno: ${correct} z ${total} (${percentage}%)`);
}

// Get user answer for a word
function getUserAnswer(word) {
    let answer = '';
    for (let i = 0; i < word.answer.length; i++) {
        const currentRow = word.direction === 'across' ? word.row : word.row + i;
        const currentCol = word.direction === 'across' ? word.col + i : word.col;
        const cell = findCell(currentRow, currentCol);
        answer += (cell?.value || '').toUpperCase();
    }
    return answer;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCrossword);
