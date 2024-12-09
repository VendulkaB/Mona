// main.js
const crosswordData = {
    size: 12,
    words: {
        1: { clue: "Nejhlubší oceánský příkop", answer: "MARIANSKY", row: 1, col: 1, direction: "across" },
        2: { clue: "DNA objevitel", answer: "MENDEL", row: 3, col: 4, direction: "across" },
        3: { clue: "Český nositel Nobelovy ceny", answer: "HEYROVSKY", row: 5, col: 2, direction: "across" },
        4: { clue: "Nejhlubší jezero světa", answer: "BAJKAL", row: 7, col: 5, direction: "across" },
        5: { clue: "Nejrychleji rostoucí rostlina", answer: "BAMBUS", row: 9, col: 3, direction: "across" },
        6: { clue: "Nejdelší jazyk mezi savci", answer: "MRAVENECNIK", row: 11, col: 1, direction: "across" },
        7: { clue: "Největší motýl světa", answer: "ATLAS", row: 2, col: 8, direction: "down" },
        8: { clue: "Hlavní složka vzduchu", answer: "DUSIK", row: 1, col: 3, direction: "down" },
        9: { clue: "Nejstarší město světa", answer: "JERICHO", row: 3, col: 6, direction: "down" },
        10: { clue: "Nejtvrdší nerost", answer: "DIAMANT", row: 4, col: 10, direction: "down" },
        11: { clue: "Mění pohlaví - ryba", answer: "KLAUN", row: 6, col: 4, direction: "down" },
        12: { clue: "Nejvyšší strom světa", answer: "SEKVOJ", row: 5, col: 7, direction: "down" },
        13: { clue: "Nejrychlejší ve vesmíru", answer: "SVETLO", row: 4, col: 2, direction: "down" },
        14: { clue: "První národní park USA", answer: "YELLOWSTONE", row: 1, col: 5, direction: "down" },
        15: { clue: "Nejlehčí prvek", answer: "VODIK", row: 7, col: 9, direction: "down" },
        16: { clue: "Planeta s nejvíce měsíci", answer: "JUPITER", row: 8, col: 1, direction: "down" }
    },
    tajenka: [
        { row: 1, col: 1 }, { row: 3, col: 4 }, { row: 5, col: 2 },
        { row: 7, col: 5 }, { row: 9, col: 3 }, { row: 11, col: 1 }
    ]
};

function initCrossword() {
    createNumbering();
    createGrid();
    createClues();
}

function createNumbering() {
    const colNumbers = document.querySelector('.column-numbers');
    const rowNumbers = document.querySelector('.row-numbers');

    for (let i = 1; i <= crosswordData.size; i++) {
        const colNum = document.createElement('div');
        colNum.className = 'number-cell';
        colNum.textContent = i;
        colNumbers.appendChild(colNum);

        const rowNum = document.createElement('div');
        rowNum.className = 'number-cell';
        rowNum.textContent = i;
        rowNumbers.appendChild(rowNum);
    }
}

function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    
    for (let i = 0; i < crosswordData.size; i++) {
        for (let j = 0; j < crosswordData.size; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'cell';
            cell.dataset.row = i + 1;
            cell.dataset.col = j + 1;
            cell.disabled = true;
            grid.appendChild(cell);
        }
    }

    // Aktivace buněk a číslování
    let cellNumber = 1;
    for (const word of Object.values(crosswordData.words)) {
        const cells = getWordCells(word);
        cells.forEach((cell, i) => {
            cell.disabled = false;
            if (i === 0) {
                const numberSpan = document.createElement('span');
                numberSpan.className = 'cell-number';
                numberSpan.textContent = cellNumber;
                cell.parentElement.appendChild(numberSpan);
            }
        });
        cellNumber++;
    }

    // Označení tajenky
    crosswordData.tajenka.forEach(pos => {
        const cell = document.querySelector(
            `input[data-row="${pos.row}"][data-col="${pos.col}"]`
        );
        cell.classList.add('tajenka');
    });
}

function createClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');

    Object.entries(crosswordData.words).forEach(([num, word]) => {
        const li = document.createElement('li');
        li.textContent = word.clue;
        if (word.direction === 'across') {
            acrossClues.appendChild(li);
        } else {
            downClues.appendChild(li);
        }
    });
}

function getWordCells(word) {
    const cells = [];
    const length = word.answer.length;
    
    for (let i = 0; i < length; i++) {
        const row = word.direction === 'across' ? word.row : word.row + i;
        const col = word.direction === 'across' ? word.col + i : word.col;
        const cell = document.querySelector(
            `input[data-row="${row}"][data-col="${col}"]`
        );
        if (cell) cells.push(cell);
    }
    
    return cells;
}

document.addEventListener('DOMContentLoaded', initCrossword);
