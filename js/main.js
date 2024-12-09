// Data pro křížovku
const crosswordData = {
    size: 12,
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
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#002f4f';
    tooltip.style.color = '#ffffff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '10';
    tooltip.style.fontSize = '14px';
    document.body.appendChild(tooltip);

    for (let i = 1; i <= crosswordData.size; i++) {
        for (let j = 1; j <= crosswordData.size; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.disabled = true;

            // Tooltip on hover or focus
            cell.addEventListener('mouseenter', (event) => {
                const wordId = event.target.dataset.wordId;
                if (wordId) {
                    tooltip.textContent = crosswordData.words[wordId].clue;
                    tooltip.style.left = `${event.pageX + 10}px`;
                    tooltip.style.top = `${event.pageY + 10}px`;
                    tooltip.style.display = 'block';
                }
            });

            cell.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });

            cell.addEventListener('focus', (event) => {
                const wordId = event.target.dataset.wordId;
                if (wordId) {
                    tooltip.textContent = crosswordData.words[wordId].clue;
                    tooltip.style.left = `${event.pageX + 10}px`;
                    tooltip.style.top = `${event.pageY + 10}px`;
                    tooltip.style.display = 'block';
                }
            });

            cell.addEventListener('blur', () => {
                tooltip.style.display = 'none';
            });

            grid.appendChild(cell);
        }
    }

    // Enable grid cells for the crossword words
    for (const [id, word] of Object.entries(crosswordData.words)) {
        const { row, col, answer, direction } = word;
        for (let i = 0; i < answer.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;
            const cell = grid.querySelector(`.cell[data-row="${currentRow}"][data-col="${currentCol}"]`);
            cell.disabled = false;
            cell.dataset.wordId = id;
        }
    }
}

// Zvýraznění nápovědy
function highlightClue(id, direction) {
    const clues = document.getElementById(direction === 'across' ? 'acrossClues' : 'downClues');
    const clueElement = clues.querySelector(`[data-id="${id}"]`);
    clueElement.classList.add('highlight');
}

// Odstranění zvýraznění
function removeHighlight() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(element => element.classList.remove('highlight'));
}

// Generování nápověd
function generateClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');

    for (const [id, word] of Object.entries(crosswordData.words)) {
        const clueElement = document.createElement('p');
        clueElement.textContent = `${id}. ${word.clue}`;
        clueElement.dataset.id = id;

        if (word.direction === 'across') {
            acrossClues.appendChild(clueElement);
        } else {
            downClues.appendChild(clueElement);
        }
    }
}

// Kontrola odpovědí
function checkSolution() {
    let correct = 0;
    let total = 0;

    for (const [id, word] of Object.entries(crosswordData.words)) {
        const { row, col, answer, direction } = word;
        let userAnswer = '';

        for (let i = 0; i < answer.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;
            const cell = document.querySelector(`.cell[data-row="${currentRow}"][data-col="${currentCol}"]`);
            userAnswer += cell.value.toUpperCase();
        }

        if (userAnswer === answer) {
            correct++;
        }
        total++;
    }

    alert(`Správně: ${correct} z ${total}`);
}

createGrid();
generateClues();
