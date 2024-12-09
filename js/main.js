// Crossword data structure with hidden solution
const crosswordData = {
    size: 12,
    solution: "OTEC FURA",
    words: {
        1: { 
            clue: "Největší planeta sluneční soustavy", 
            answer: "JUPITER", 
            row: 1, 
            col: 1, 
            direction: "across",
            solutionLetters: {3: 0} // 'T' for OTEC
        },
        2: { 
            clue: "Chemická značka kyslíku", 
            answer: "O", 
            row: 1, 
            col: 5, 
            direction: "down",
            solutionLetters: {0: 0} // 'O' for OTEC
        },
        3: { 
            clue: "Vedoucí školy", 
            answer: "REDITEL", 
            row: 2, 
            col: 3, 
            direction: "across",
            solutionLetters: {1: 1} // 'E' for OTEC
        },
        4: { 
            clue: "Největší světadíl", 
            answer: "ASIE", 
            row: 3, 
            col: 1, 
            direction: "down",
            solutionLetters: {2: 3} // 'C' for OTEC
        },
        5: { 
            clue: "Automobil (hovorově)", 
            answer: "FARAK", 
            row: 4, 
            col: 2, 
            direction: "across",
            solutionLetters: {0: 0} // 'F' for FURA
        },
        6: { 
            clue: "Řeka v Praze", 
            answer: "VLTAVA", 
            row: 4, 
            col: 6, 
            direction: "down",
            solutionLetters: {4: 2} // 'A' for FURA
        },
        7: { 
            clue: "Vysoká škola (zkratka)", 
            answer: "UNIVERZITA", 
            row: 5, 
            col: 1, 
            direction: "across",
            solutionLetters: {0: 1} // 'U' for FURA
        },
        8: { 
            clue: "Dopravní prostředek na kolejích", 
            answer: "METRO", 
            row: 6, 
            col: 4, 
            direction: "down",
            solutionLetters: {2: 2} // 'R' for FURA
        },
        9: {
            clue: "Planeta Země je...", 
            answer: "MODRA", 
            row: 3, 
            col: 8, 
            direction: "down"
        },
        10: {
            clue: "Část lidského těla", 
            answer: "HLAVA", 
            row: 7, 
            col: 2, 
            direction: "across"
        },
        11: {
            clue: "Hlavní město ČR", 
            answer: "PRAHA", 
            row: 8, 
            col: 5, 
            direction: "across"
        },
        12: {
            clue: "Opak dne", 
            answer: "NOC", 
            row: 9, 
            col: 3, 
            direction: "across"
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    generateClues();
    setupTooltip();
});

// Create the crossword grid
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';

    for (let i = 1; i <= crosswordData.size; i++) {
        for (let j = 1; j <= crosswordData.size; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.disabled = true;
            
            const solutionInfo = isSolutionCell(i, j);
            if (solutionInfo) {
                cell.dataset.solutionIndex = solutionInfo.solutionIndex;
                cell.classList.add('solution-cell');
            }
            
            cell.addEventListener('input', handleInput);
            cell.addEventListener('keydown', handleKeydown);
            cell.addEventListener('focus', handleFocus);
            cell.addEventListener('blur', handleBlur);
            
            grid.appendChild(cell);
        }
    }

    enableWordCells();
}

// Check if cell is part of the solution
function isSolutionCell(row, col) {
    for (const [id, word] of Object.entries(crosswordData.words)) {
        if (word.solutionLetters) {
            for (const [letterIndex, solutionIndex] of Object.entries(word.solutionLetters)) {
                const currentRow = word.direction === 'across' ? word.row : word.row + parseInt(letterIndex);
                const currentCol = word.direction === 'across' ? word.col + parseInt(letterIndex) : word.col;
                if (currentRow === row && currentCol === col) {
                    return { wordId: id, solutionIndex };
                }
            }
        }
    }
    return false;
}

// Enable cells for words
function enableWordCells() {
    Object.entries(crosswordData.words).forEach(([id, word]) => {
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

// Setup tooltip
function setupTooltip() {
    if (!document.getElementById('tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        document.body.appendChild(tooltip);
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

// Move to next cell after input
function moveToNextCell(cell) {
    const direction = cell.dataset.direction;
    const nextCell = findNextCell(cell, direction);
    if (nextCell && !nextCell.disabled) {
        nextCell.focus();
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

// Move to next/previous word
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

// Highlight word and its clue
function highlightWord(wordId) {
    // Remove previous highlights
    document.querySelectorAll('.cell.highlight, .clues p.highlight')
        .forEach(el => el.classList.remove('highlight'));

    const word = crosswordData.words[wordId];
    const { row, col, answer, direction } = word;
    
    // Highlight cells
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

// Check solution
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
        } else {
            incorrectWords.push(id);
        }
        total++;
    });

    const percentage = Math.round((correct / total) * 100);
    const solution = revealedSolution.join('');
    
    if (correct === total) {
        alert(`Gratulujeme! Vyřešili jste křížovku správně!\nTajenka je: ${solution}`);
    } else {
        let message = `Správně vyplněno: ${correct} z ${total} slov (${percentage}%)\n`;
        if (incorrectWords.length > 0) {
            message += `Zkontrolujte slova: ${incorrectWords.join(', ')}`;
        }
        alert(message);
    }
}
