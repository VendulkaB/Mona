// Data pro křížovku
const crosswordData = {
    size: 12, // Velikost mřížky
    words: {
        1: { clue: "Hlavní město Itálie", answer: "RIM", row: 1, col: 1, direction: "across" },
        2: { clue: "Největší hora světa", answer: "EVEREST", row: 1, col: 3, direction: "down" },
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

// Vytvoření mřížky
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    const tooltip = document.getElementById('tooltip');

    for (let i = 0; i < crosswordData.size; i++) {
        for (let j = 0; j < crosswordData.size; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.classList.add('cell');
            cell.dataset.row = i + 1;
            cell.dataset.col = j + 1;
            cell.disabled = true;
            cell.addEventListener('focus', () => {
                const wordId = cell.dataset.wordId;
                if (wordId) {
                    const word = crosswordData.words[wordId];
                    tooltip.textContent = `${wordId}. ${word.clue}`;
                    tooltip.style.display = 'block';
                }
            });
            cell.addEventListener('blur', () => {
                tooltip.style.display = 'none';
            });
            grid.appendChild(cell);
        }
    }

    // Povolit buňky pro odpovědi
    for (const [id, word] of Object.entries(crosswordData.words)) {
        const { row, col, answer, direction } = word;
        for (let i = 0; i < answer.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;
            const cell = grid.querySelector(`.cell[data-row="${currentRow}"][data-col="${currentCol}"]`);
            cell.disabled = false;
            cell.dataset.wordId = id;
            if (answer === "OTEC FURA" && i < 8) {
                cell.classList.add('cell-tajenka');
            }
        }
    }
}

// Vygenerování nápověd
function generateClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');

    for (const [id, word] of Object.entries(crosswordData.words)) {
        const clueElement = document.createElement('p');
        clueElement.textContent = `${id}. ${word.clue}`;

        if (word.direction === 'across') {
            acrossClues.appendChild(clueElement);
        } else if (word.direction === 'down') {
            downClues.appendChild(clueElement);
        }
    }
}

// Kontrola odpovědí
function checkSolution() {
    let correct = true;
    const grid = document.getElementById('crosswordGrid');

    for (const [id, word] of Object.entries(crosswordData.words)) {
        const { row, col, answer, direction } = word;
        let userAnswer = '';

        for (let i = 0; i < answer.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;
            const cell = grid.querySelector(`.cell[data-row="${currentRow}"][data-col="${currentCol}"]`);
            userAnswer += cell.value.toUpperCase();
        }

        if (userAnswer !== answer) {
            correct = false;
            for (let i = 0; i < answer.length; i++) {
                const currentRow = direction === 'across' ? row : row + i;
                const currentCol = direction === 'across' ? col + i : col;
                const cell = grid.querySelector(`.cell[data-row="${currentRow}"][data-col="${currentCol}"]`);
                cell.classList.add('error');
            }
        }
    }

    if (correct) {
        alert('Gratulujeme! Tajenka je správná!');
    } else {
        alert('Některé odpovědi jsou nesprávné. Opravte je.');
    }
}

// Inicializace
createGrid();
generateClues();

