document.addEventListener("DOMContentLoaded", () => {
    const crosswordData = {
        size: 12,
        words: {
            // 8 Vodorovně
            1: { clue: "Hlavní město Itálie", answer: "RIM", row: 1, col: 1, direction: "across" },
            2: { clue: "Planeta nejblíže Slunci", answer: "MERKUR", row: 2, col: 2, direction: "across" },
            3: { clue: "Největší oceán", answer: "PACIFIK", row: 4, col: 1, direction: "across" },
            4: { clue: "Řeka protékající Londýnem", answer: "TEMZE", row: 6, col: 3, direction: "across" },
            5: { clue: "Planeta pojmenovaná po bohu války", answer: "MARS", row: 8, col: 1, direction: "across" },
            6: { clue: "Největší kontinent světa", answer: "ASIE", row: 9, col: 5, direction: "across" },
            7: { clue: "Název chemického prvku Au", answer: "ZLATO", row: 11, col: 2, direction: "across" },
            8: { clue: "Hlavní město Francie", answer: "PARIZ", row: 12, col: 6, direction: "across" },

            // 8 Svisle
            9: { clue: "Nejvyšší hora světa", answer: "EVEREST", row: 1, col: 4, direction: "down" },
            10: { clue: "Autor Hamleta", answer: "SHAKESPEARE", row: 1, col: 8, direction: "down" },
            11: { clue: "Hlavní město Japonska", answer: "TOKIO", row: 3, col: 7, direction: "down" },
            12: { clue: "Základní část rostliny", answer: "KOREN", row: 5, col: 2, direction: "down" },
            13: { clue: "Slavný italský malíř", answer: "DAVINCI", row: 5, col: 6, direction: "down" },
            14: { clue: "Řeka v Egyptě", answer: "NIL", row: 7, col: 9, direction: "down" },
            15: { clue: "První prezident Československa", answer: "MASARYK", row: 10, col: 4, direction: "down" },
            16: { clue: "Planeta nejvzdálenější od Slunce", answer: "NEPTUN", row: 2, col: 11, direction: "down" }
        },
        tajenka: [
            { row: 1, col: 1 },
            { row: 2, col: 2 },
            { row: 4, col: 1 },
            { row: 8, col: 1 },
            { row: 6, col: 3 },
            { row: 9, col: 5 },
            { row: 11, col: 2 },
            { row: 12, col: 6 }
        ]
    };

    function createGrid() {
        const grid = document.getElementById("crosswordGrid");
        grid.style.gridTemplateColumns = `repeat(${crosswordData.size}, 40px)`;

        for (let i = 0; i < crosswordData.size; i++) {
            for (let j = 0; j < crosswordData.size; j++) {
                const cell = document.createElement("input");
                cell.type = "text";
                cell.className = "cell";
                cell.maxLength = 1;
                cell.disabled = true;
                grid.appendChild(cell);
            }
        }

        for (const [id, word] of Object.entries(crosswordData.words)) {
            const { row, col, answer, direction } = word;

            for (let i = 0; i < answer.length; i++) {
                const index =
                    (row - 1) * crosswordData.size +
                    (direction === "across" ? col + i - 1 : col - 1);
                const cell = grid.children[index];
                cell.disabled = false;
                cell.placeholder = id;
            }
        }

        crosswordData.tajenka.forEach(({ row, col }) => {
            const index = (row - 1) * crosswordData.size + (col - 1);
            const cell = grid.children[index];
            cell.classList.add("cell-tajenka");
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
                const index = (row - 1) * (crosswordData.size) + (col - 1);
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
