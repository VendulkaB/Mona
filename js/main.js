// Data křížovky
const crosswordData = {
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
        },
        11: {
            clue: "Hlavní město Norska",
            answer: "OSLO",
            row: 1,
            col: 8,
            direction: "down"
        },
        12: {
            clue: "Český hudební skladatel (Bedřich)",
            answer: "SMETANA",
            row: 5,
            col: 2,
            direction: "across"
        }
    }
};

// Inicializace křížovky
document.addEventListener('DOMContentLoaded', () => {
    initializeCrossword();
    setupCheckButton();
});

function initializeCrossword() {
    createGrid();
    generateClues();
    setupEventListeners();
}

// Vytvoření mřížky
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';
    
    // Nalezení rozměrů mřížky
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

    grid.style.gridTemplateRows = `repeat(${maxRow}, var(--cell-size))`;
    grid.style.gridTemplateColumns = `repeat(${maxCol}, var(--cell-size))`;

    // Vytvoření buněk
    for (let i = 1; i <= maxRow; i++) {
        for (let j = 1; j <= maxCol; j++) {
            const cellId = `${i}-${j}`;
            if (usedCells.has(cellId)) {
                createCell(grid, i, j);
            } else {
                createEmptySpace(grid, i, j);
            }
        }
    }

    // Přidání čísel slov a aktivace buněk
    const numberedCells = new Set();
    Object.entries(crosswordData.words).forEach(([id, word]) => {
        enableWordCells(id, word, numberedCells);
    });
}

function createCell(grid, row, col) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cell-wrapper';
    wrapper.style.gridRow = row;
    wrapper.style.gridColumn = col;

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.className = 'cell';
    input.dataset.row = row;
    input.dataset.col = col;

    wrapper.appendChild(input);
    grid.appendChild(wrapper);
}

function createEmptySpace(grid, row, col) {
    const space = document.createElement('div');
    space.className = 'cell-wrapper empty';
    space.style.gridRow = row;
    space.style.gridColumn = col;
    grid.appendChild(space);
}
// Aktivace buněk pro slovo
function enableWordCells(id, word, numberedCells) {
    const { row, col, answer, direction, solutionLetters } = word;
    
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

    for (let i = 0; i < answer.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        const cell = findCell(currentRow, currentCol);
        
        if (cell) {
            cell.dataset.wordId = id;
            cell.dataset.direction = direction;
            cell.dataset.index = i;
            cell.dataset.correct = answer[i];
            
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

// Generování nápověd
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
            clueElement.className = 'clue';
            
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

// Event listenery
function setupEventListeners() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);
        cell.addEventListener('focus', handleFocus);
        cell.addEventListener('click', handleClick);
    });
}

function setupCheckButton() {
    const checkButton = document.querySelector('.btn-check');
    if (checkButton) {
        checkButton.addEventListener('click', checkSolution);
    }
}

// Zpracování vstupu
function handleInput(event) {
    const cell = event.target;
    cell.value = cell.value.toUpperCase();
    
    if (cell.value) {
        validateCell(cell);
        moveToNextCellInWord(cell);
    }
}

function handleKeydown(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const index = parseInt(cell.dataset.index);
    
    switch(event.key) {
        case 'Backspace':
            if (!cell.value && index > 0) {
                event.preventDefault();
                const prevCell = findPreviousCellInWord(word, index);
                if (prevCell) {
                    prevCell.focus();
                    prevCell.value = '';
                }
            }
            break;
            
        case 'ArrowRight':
        case 'ArrowLeft':
            if (word.direction === 'across') {
                event.preventDefault();
                const delta = event.key === 'ArrowRight' ? 1 : -1;
                const nextIndex = index + delta;
                if (nextIndex >= 0 && nextIndex < word.answer.length) {
                    const nextCell = findNextCellInWord(word, nextIndex);
                    if (nextCell) nextCell.focus();
                }
            }
            break;
            
        case 'ArrowUp':
        case 'ArrowDown':
            if (word.direction === 'down') {
                event.preventDefault();
                const delta = event.key === 'ArrowDown' ? 1 : -1;
                const nextIndex = index + delta;
                if (nextIndex >= 0 && nextIndex < word.answer.length) {
                    const nextCell = findNextCellInWord(word, nextIndex);
                    if (nextCell) nextCell.focus();
                }
            }
            break;
    }
}

function handleFocus(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
        showActiveClue(crosswordData.words[wordId].clue, wordId);
    }
}

function handleClick(event) {
    const cell = event.target;
    const wordId = cell.dataset.wordId;
    if (wordId) {
        highlightWord(wordId);
        showActiveClue(crosswordData.words[wordId].clue, wordId);
    }
}

// Pomocné funkce pro navigaci
function moveToNextCellInWord(cell) {
    const wordId = cell.dataset.wordId;
    const word = crosswordData.words[wordId];
    const currentIndex = parseInt(cell.dataset.index);
    
    if (currentIndex < word.answer.length - 1) {
        const nextCell = findNextCellInWord(word, currentIndex + 1);
        if (nextCell) nextCell.focus();
    }
}

function findNextCellInWord(word, index) {
    const row = word.direction === 'across' ? word.row : word.row + index;
    const col = word.direction === 'across' ? word.col + index : word.col;
    return findCell(row, col);
}

function findPreviousCellInWord(word, currentIndex) {
    return findNextCellInWord(word, currentIndex - 1);
}

function findCell(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Zvýraznění a validace
function highlightWord(wordId) {
    document.querySelectorAll('.cell.highlight, .clue.highlight')
        .forEach(el => el.classList.remove('highlight'));
        
    const word = crosswordData.words[wordId];
    if (!word) return;

    for (let i = 0; i < word.answer.length; i++) {
        const currentRow = word.direction === 'across' ? word.row : word.row + i;
        const currentCol = word.direction === 'across' ? word.col + i : word.col;
        const cell = findCell(currentRow, currentCol);
        if (cell) cell.classList.add('highlight');
    }

    const clue = document.querySelector(`.clue[data-id="${wordId}"]`);
    if (clue) {
        clue.classList.add('highlight');
        clue.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showActiveClue(clue, id) {
    const activeClue = document.querySelector('.active-clue .clue-text');
    if (activeClue) {
        activeClue.textContent = `${id}. ${clue}`;
    }
}

// Kontrola řešení
function validateCell(cell) {
    const isCorrect = cell.value.toUpperCase() === cell.dataset.correct;
    cell.classList.toggle('correct', isCorrect);
    cell.classList.toggle('error', !isCorrect);
    
    if (isCorrect) {
        const wordId = cell.dataset.wordId;
        checkWordCompletion(crosswordData.words[wordId]);
        checkFullSolution();
    }
}

function checkWordCompletion(word) {
    const cells = getWordCells(word);
    const isComplete = cells.every(cell => 
        cell.value.toUpperCase() === cell.dataset.correct
    );
    
    if (isComplete) {
        cells.forEach(cell => {
            cell.classList.add('correct');
            cell.classList.remove('error');
            if (cell.classList.contains('solution-cell')) {
                cell.classList.add('solution-revealed');
            }
        });
    }
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

function checkFullSolution() {
    let allCorrect = true;
    const solutionLetters = new Array(crosswordData.solution.length).fill('');
    
    Object.values(crosswordData.words).forEach(word => {
        const cells = getWordCells(word);
        const isWordCorrect = cells.every(cell => 
            cell.value.toUpperCase() === cell.dataset.correct
        );
        
        if (!isWordCorrect) {
            allCorrect = false;
        } else if (word.solutionLetters) {
            Object.entries(word.solutionLetters).forEach(([letterIndex, solutionIndex]) => {
                solutionLetters[solutionIndex] = word.answer[letterIndex];
            });
        }
    });

    if (allCorrect) {
        showSolutionAnimation(solutionLetters.join(''));
    }
}

// Animace řešení
function showSolutionAnimation(solution) {
    const reveal = document.getElementById('solutionReveal');
    const content = reveal.querySelector('.solution-content');
    content.innerHTML = '';
    
    // Rozdělení řešení na dvě slova
    const words = solution.split(' ');
    
    // Vytvoření animovaných písmen
    words.forEach((word, wordIndex) => {
        if (wordIndex > 0) {
            // Přidání mezery mezi slovy
            const space = document.createElement('span');
            space.className = 'solution-letter';
            space.innerHTML = '&nbsp;';
            space.style.width = '20px';
            content.appendChild(space);
        }
        
        [...word].forEach((letter, index) => {
            const span = document.createElement('span');
            span.className = 'solution-letter';
            span.textContent = letter;
            // Postupné zpoždění animace pro každé písmeno
            span.style.animationDelay = `${(wordIndex * word.length + index) * 0.1}s`;
            content.appendChild(span);
        });
    });

    // Zobrazení modálního okna
    reveal.classList.add('show');
    
    // Spuštění animace písmen
    setTimeout(() => {
        document.querySelectorAll('.solution-letter').forEach(letter => {
            letter.classList.add('reveal');
        });
    }, 100);

    // Zavření modálního okna po kliknutí
    reveal.addEventListener('click', () => {
        reveal.classList.remove('show');
    }, { once: true });

    // Přidání confetti efektu
    addConfettiEffect();
}

// Confetti efekt pro oslavu vyřešení
function addConfettiEffect() {
    const colors = ['#00e0ff', '#ffd700', '#ff69b4', '#00ff00'];
    const confettiCount = 200;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiParticle(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiParticle(color) {
    const particle = document.createElement('div');
    particle.className = 'confetti';
    particle.style.backgroundColor = color;
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random();
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    document.body.appendChild(particle);
    
    // Odstranění částice po dokončení animace
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

// Pomocné funkce pro práci s buňkami
function focusFirstCell(word) {
    const firstCell = findCell(word.row, word.col);
    if (firstCell) {
        firstCell.focus();
    }
}

function getWordAnswer(word) {
    return getWordCells(word)
        .map(cell => cell.value || '')
        .join('')
        .toUpperCase();
}

// Nastavení tooltipů a zvýraznění
function setupTooltipAndHighlight() {
    document.querySelectorAll('.cell').forEach(cell => {
        const wordId = cell.dataset.wordId;
        if (wordId) {
            const word = crosswordData.words[wordId];
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = word.clue;
            cell.parentElement.appendChild(tooltip);
        }
    });
}

// Automatické spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    initializeCrossword();
    setupTooltipAndHighlight();
});
