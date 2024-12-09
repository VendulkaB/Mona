// main.js
const crosswordData = {
    size: 12,
    words: {
        // Vodorovně (8 slov)
        1: { clue: "Nejhlubší oceánský příkop", answer: "MARIANSKA", row: 1, col: 1, direction: "across" },
        2: { clue: "Největší pouštˇ světa", answer: "SAHARA", row: 3, col: 4, direction: "across" },
        3: { clue: "Kolik planet má sluneční soustava", answer: "OSMPLA", row: 5, col: 2, direction: "across" },
        4: { clue: "Chemická značka zlata", answer: "AURUM", row: 7, col: 5, direction: "across" },
        5: { clue: "Matematická konstanta", answer: "PISLO", row: 9, col: 3, direction: "across" },
        6: { clue: "Nejdelší řeka světa", answer: "NIL", row: 11, col: 1, direction: "across" },
        7: { clue: "Nejvyšší hora světa", answer: "EVEREST", row: 2, col: 6, direction: "across" },
        8: { clue: "Chemický prvek Na", answer: "NATRIUM", row: 4, col: 3, direction: "across" },

        // Svisle (8 slov)
        9: { clue: "Největší oceán", answer: "TICHY", row: 1, col: 3, direction: "down" },
        10: { clue: "První člověk na Měsíci", answer: "ARMSTRONG", row: 1, col: 5, direction: "down" },
        11: { clue: "Největší savec", answer: "PLEJTVAK", row: 2, col: 8, direction: "down" },
        12: { clue: "Nejtvrdší nerost", answer: "DIAMANT", row: 3, col: 6, direction: "down" },
        13: { clue: "Planeta s prstenci", answer: "SATURN", row: 4, col: 2, direction: "down" },
        14: { clue: "Autor teorie relativity", answer: "EINSTEIN", row: 5, col: 7, direction: "down" },
        15: { clue: "Největší buňka", answer: "VAJICKO", row: 6, col: 4, direction: "down" },
        16: { clue: "Nejrychlejší zvíře", answer: "GEPARD", row: 7, col: 1, direction: "down" }
    },
    tajenka: [
        { row: 1, col: 1 },
        { row: 3, col: 4 },
        { row: 5, col: 2 },
        { row: 7, col: 5 },
        { row: 9, col: 3 },
        { row: 11, col: 1 }
    ]
};

// Funkce pro inicializaci křížovky
function initCrossword() {
    createGrid();
    fillClues();
    addEventListeners();
}

// Vytvoření mřížky křížovky
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    
    for (let i = 1; i <= crosswordData.size; i++) {
        for (let j = 1; j <= crosswordData.size; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            // Označení tajenky
            if (isTajenka(i, j)) {
                cell.classList.add('tajenka');
            }
            
            grid.appendChild(cell);
        }
    }
    
    // Přidání čísel k polím
    Object.values(crosswordData.words).forEach((word, index) => {
        const cell = grid.querySelector(`[data-row="${word.row}"][data-col="${word.col}"]`);
        const number = document.createElement('div');
        number.className = 'cell-number';
        number.textContent = index + 1;
        cell.parentNode.insertBefore(number, cell);
    });
}

// Kontrola, zda je políčko součástí tajenky
function isTajenka(row, col) {
    return crosswordData.tajenka.some(pos => pos.row === row && pos.col === col);
}

// Vyplnění nápověd
function fillClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');
    
    Object.entries(crosswordData.words).forEach(([index, word]) => {
        const clue = document.createElement('p');
        clue.textContent = `${index}. ${word.clue}`;
        
        if (word.direction === 'across') {
            acrossClues.appendChild(clue);
        } else {
            downClues.appendChild(clue);
        }
    });
}

// Přidání event listenerů
function addEventListeners() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        cell.addEventListener('input', handleInput);
        cell.addEventListener('keydown', handleKeydown);
    });
}

// Zpracování vstupu
function handleInput(e) {
    if (e.target.value) {
        e.target.value = e.target.value.toUpperCase();
        moveToNextCell(e.target);
    }
}

// Zpracování kláves
function handleKeydown(e) {
    if (e.key === 'Backspace' && !e.target.value) {
        moveToPreviousCell(e.target);
    }
}

// Přesun na další políčko
function moveToNextCell(currentCell) {
    const nextCell = findNextCell(currentCell);
    if (nextCell) nextCell.focus();
}

// Přesun na předchozí políčko
function moveToPreviousCell(currentCell) {
    const prevCell = findPreviousCell(currentCell);
    if (prevCell) prevCell.focus();
}

// Kontrola tajenky
function checkSolution() {
    const solution = crosswordData.tajenka.map(pos => {
        const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
        return cell.value || '';
    }).join('');
    
    alert(solution === 'OTECFURA' ? 'Správně!' : 'Zkuste to znovu.');
}

// Inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', initCrossword);
