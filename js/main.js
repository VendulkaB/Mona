const crosswordData = {
    size: 12,
    words: {
        1: { clue: "Nejhlubší oceánský příkop", answer: "MARIANSKY", row: 1, col: 1, direction: "across", number: 1 },
        2: { clue: "DNA objevitel", answer: "MENDEL", row: 3, col: 4, direction: "across", number: 2 },
        3: { clue: "Český nositel Nobelovy ceny", answer: "HEYROVSKY", row: 5, col: 2, direction: "across", number: 3 },
        4: { clue: "Nejhlubší jezero světa", answer: "BAJKAL", row: 7, col: 5, direction: "across", number: 4 },
        5: { clue: "Nejrychleji rostoucí rostlina", answer: "BAMBUS", row: 9, col: 3, direction: "across", number: 5 },
        6: { clue: "Nejdelší jazyk mezi savci", answer: "MRAVENECNIK", row: 11, col: 1, direction: "across", number: 6 },
        7: { clue: "Největší motýl světa", answer: "ATLAS", row: 2, col: 8, direction: "down", number: 7 },
        8: { clue: "Hlavní složka vzduchu", answer: "DUSIK", row: 1, col: 3, direction: "down", number: 8 },
        9: { clue: "Nejstarší město světa", answer: "JERICHO", row: 3, col: 6, direction: "down", number: 9 },
        10: { clue: "Nejtvrdší nerost", answer: "DIAMANT", row: 4, col: 10, direction: "down", number: 10 },
        11: { clue: "Mění pohlaví - ryba", answer: "KLAUN", row: 6, col: 4, direction: "down", number: 11 },
        12: { clue: "Nejvyšší strom světa", answer: "SEKVOJ", row: 5, col: 7, direction: "down", number: 12 },
        13: { clue: "Nejrychlejší ve vesmíru", answer: "SVETLO", row: 4, col: 2, direction: "down", number: 13 },
        14: { clue: "První národní park USA", answer: "YELLOWSTONE", row: 1, col: 5, direction: "down", number: 14 },
        15: { clue: "Nejlehčí prvek", answer: "VODIK", row: 7, col: 9, direction: "down", number: 15 },
        16: { clue: "Planeta s nejvíce měsíci", answer: "JUPITER", row: 8, col: 1, direction: "down", number: 16 }
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

function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    
    for (let i = 0; i < crosswordData.size; i++) {
        for (let j = 0; j < crosswordData.size; j++) {
            const cell = document.createElement('div');
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'cell';
            input.maxLength = 1;
            input.dataset.row = i + 1;
            input.dataset.col = j + 1;
            input.disabled = true;
            cell.appendChild(input);
            grid.appendChild(cell);
        }
    }

    for (const word of Object.values(crosswordData.words)) {
        const row = word.row - 1;
        const col = word.col - 1;
        
        // Přidat číslo
        const firstCell = grid.children[row * crosswordData.size + col];
        const numberDiv = document.createElement('div');
        numberDiv.className = 'cell-number';
        numberDiv.textContent = word.number;
        firstCell.appendChild(numberDiv);

        // Povolit buňky pro slovo
        for (let i = 0; i < word.answer.length; i++) {
            const cellRow = word.direction === 'across' ? row : row + i;
            const cellCol = word.direction === 'across' ? col + i : col;
            const cell = grid.children[cellRow * crosswordData.size + cellCol].querySelector('input');
            cell.disabled = false;
            cell.addEventListener('input', (e) => handleInput(e, word.direction));
            cell.addEventListener('keydown', handleKeyDown);
        }
    }

    // Označit tajenku
    crosswordData.tajenka.forEach(pos => {
        const cell = grid.children[(pos.row - 1) * crosswordData.size + (pos.col - 1)].querySelector('input');
        cell.classList.add('cell-tajenka');
    });
}

function handleInput(event, direction) {
    if (event.target.value.length === 1) {
        const currentRow = parseInt(event.target.dataset.row);
        const currentCol = parseInt(event.target.dataset.col);
        const nextCell = direction === 'across' 
            ? document.querySelector(`input[data-row="${currentRow}"][data-col="${currentCol + 1}"]`)
            : document.querySelector(`input[data-row="${currentRow + 1}"][data-col="${currentCol}"]`);
        
        if (nextCell && !nextCell.disabled) {
            nextCell.focus();
        }
    }
    event.target.value = event.target.value.toUpperCase();
}

function handleKeyDown(event) {
    if (event.key === 'Backspace' && event.target.value === '') {
        const currentRow = parseInt(event.target.dataset.row);
        const currentCol = parseInt(event.target.dataset.col);
        const prevCell = document.querySelector(
            `input[data-row="${currentRow}"][data-col="${currentCol - 1}"]`
        );
        if (prevCell && !prevCell.disabled) {
            prevCell.focus();
        }
    }
}

function generateClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');
    
    Object.values(crosswordData.words).forEach(word => {
        const clue = document.createElement('p');
        clue.textContent = `${word.number}. ${word.clue}`;
        if (word.direction === 'across') {
            acrossClues.appendChild(clue);
        } else {
            downClues.appendChild(clue);
        }
    });
}

function checkSolution() {
    const solution = crosswordData.tajenka
        .map(pos => {
            const cell = document.querySelector(`input[data-row="${pos.row}"][data-col="${pos.col}"]`);
            return cell ? cell.value.toUpperCase() : '';
        })
        .join('');
    
    alert(solution === "OTECFURA" ? "Správně! Tajenka je: Otec Fura" : "Zkuste to znovu!");
}

// Inicializace
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    generateClues();
});