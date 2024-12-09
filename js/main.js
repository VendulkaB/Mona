document.addEventListener("DOMContentLoaded", () => {
    const crosswordData = {
        size: 12,
        words: {
            1: { clue: "Hlavní město Itálie", answer: "RIM", row: 1, col: 2, direction: "across" },
            2: { clue: "Nejvyšší hora světa", answer: "EVEREST", row: 2, col: 4, direction: "down" },
            3: { clue: "Největší oceán na světě", answer: "PACIFIK", row: 4, col: 1, direction: "across" },
            4: { clue: "Autor Hamleta", answer: "SHAKESPEARE", row: 1, col: 8, direction: "down" },
            5: { clue: "Planeta nejblíže Slunci", answer: "MERKUR", row: 7, col: 3, direction: "across" },
            6: { clue: "Slavný italský malíř", answer: "DAVINCI", row: 5, col: 6, direction: "down" },
            7: { clue: "Hlavní město Japonska", answer: "TOKIO", row: 10, col: 2, direction: "across" },
            8: { clue: "Chemický prvek Au", answer: "ZLATO", row: 8, col: 5, direction: "down" },
            9: { clue: "Největší kontinent světa", answer: "ASIE", row: 3, col: 10, direction: "down" },
            10: { clue: "Hlavní město Francie", answer: "PARIZ", row: 2, col: 6, direction: "across" },
            11: { clue: "Nejvyšší vodopád světa", answer: "ANGEL", row: 9, col: 5, direction: "across" },
            12: { clue: "Největší savce", answer: "VELRYBA", row: 12, col: 1, direction: "across" },
            13: { clue: "Řeka protékající Londýnem", answer: "TEMZE", row: 5, col: 8, direction: "across" },
            14: { clue: "Planeta pojmenovaná po bohu války", answer: "MARS", row: 11, col: 3, direction: "down" },
            15: { clue: "Hlavní město Německa", answer: "BERLIN", row: 6, col: 3, direction: "down" },
            16: { clue: "Řeka v Egyptě", answer: "NIL", row: 7, col: 6, direction: "across" }
        },
        tajenka: [
            { row: 1, col: 2 },
            { row: 2, col: 4 },
            { row: 4, col: 1 },
            { row: 7, col: 3 },
            { row: 8, col: 5 },
            { row: 10, col: 2 }
        ]
    };

    function createGrid() {
        const grid = document.getElementById("crosswordGrid");
        for (let i = 0; i <= crosswordData.size; i++) {
            for (let j = 0; j <= crosswordData.size; j++) {
                const cell = document.createElement("div");
                if (i === 0 && j > 0) {
                    cell.textContent = j;
                    cell.className = "label";
                } else if (j === 0 && i > 0) {
                    cell.textContent = i;
                    cell.className = "label";
                } else if (i > 0 && j > 0) {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "cell";
                    input.maxLength = 1;
                    input.disabled = true;
                    cell.appendChild(input);
                }
                grid.appendChild(cell);
            }
        }

        for (const [id, word] of Object.entries(crosswordData.words)) {
            const { row, col, answer, direction } = word;
            for (let i = 0; i < answer.length; i++) {
                const index =
                    (row - 1) * (crosswordData.size + 1) +
                    (direction === "across" ? col + i : col);
                const cell = grid.children[index];
                const input = cell.querySelector("input");
                if (input) input.disabled = false;
            }
        }

        crosswordData.tajenka.forEach(({ row, col }) => {
            const index = (row - 1) * (crosswordData.size + 1) + col;
            const cell = grid.children[index];
            const input = cell.querySelector("input");
            if (input) input.classList.add("cell-tajenka");
        });
    }

    function generateClues() {
        const acrossClues = document.getElementById("acrossClues");
        const downClues = document.getElementById("downClues");

        for (const [id, word] of Object.entries(crosswordData.words)) {
            const clueElement = document.createElement("p");
            clueElement.textContent = `${id}. ${word.clue}`;
            if (word.direction === "across") acrossClues.appendChild(clueElement);
            else downClues.appendChild(clueElement);
        }
    }

    function checkSolution() {
        const solution = crosswordData.tajenka
            .map(({ row, col }) => {
                const index = (row - 1) * (crosswordData.size + 1) + col;
                const cell = document.getElementById("crosswordGrid").children[index];
                const input = cell.querySelector("input");
                return input ? input.value.toUpperCase() : "";
            })
            .join("");

        alert(solution === "OTECFURA" ? "Tajenka je správně: Otec Fura!" : "Tajenka není správná.");
    }

    createGrid();
    generateClues();
});
