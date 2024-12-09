document.addEventListener("DOMContentLoaded", () => {
    const crosswordData = {
        size: 12,
        words: {
            1: { clue: "Hlavní město Itálie", answer: "RIM", row: 1, col: 1, direction: "across" },
            2: { clue: "Planeta nejblíže Slunci", answer: "MERKUR", row: 2, col: 2, direction: "across" },
            3: { clue: "Největší oceán na světě", answer: "PACIFIK", row: 4, col: 1, direction: "across" },
            4: { clue: "Řeka protékající Londýnem", answer: "TEMZE", row: 6, col: 3, direction: "across" },
            5: { clue: "Planeta pojmenovaná po bohu války", answer: "MARS", row: 8, col: 1, direction: "across" },
            6: { clue: "Největší kontinent světa", answer: "ASIE", row: 9, col: 5, direction: "across" },
            7: { clue: "Chemický prvek Au", answer: "ZLATO", row: 11, col: 2, direction: "across" },
            8: { clue: "Hlavní město Francie", answer: "PARIZ", row: 12, col: 6, direction: "across" },
            9: { clue: "Nejvyšší hora světa", answer: "EVEREST", row: 1, col: 4, direction: "down" },
            10: { clue: "Autor Hamleta", answer: "SHAKESPEARE", row: 1, col: 8, direction: "down" },
            11: { clue: "Hlavní město Japonska", answer: "TOKIO", row: 3, col: 7, direction: "down" },
            12: { clue: "Základní část rostliny", answer: "KOREN", row: 5, col: 2, direction: "down" },
            13: { clue: "Slavný italský malíř", answer: "DAVINCI", row: 5, col: 6, direction: "down" },
            14: { clue: "Řeka v Egyptě", answer: "NIL", row: 7, col: 9, direction: "down" },
            15: { clue: "První prezident Československa", answer: "MASARYK", row: 10, col: 4, direction: "down" },
            16: { clue: "Planeta nejvzdálenější od Slunce", answer: "NEPTUN", row: 2, col: 11, direction: "down" }
        }
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
                cell.dataset.answer = answer[i];
                cell.dataset.word = id;

                if (i === 0) {
                    cell.placeholder = id;
                }
            }
        }
    }

    function attachTooltip() {
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.style.position = "absolute";
        tooltip.style.display = "none";
        tooltip.style.background = "#00ffaa";
        tooltip.style.padding = "5px";
        tooltip.style.borderRadius = "5px";
        tooltip.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        document.body.appendChild(tooltip);

        document.querySelectorAll(".cell").forEach((cell) => {
            cell.addEventListener("focus", (e) => {
                const wordId = e.target.dataset.word;
                if (wordId) {
                    const wordData = crosswordData.words[wordId];
                    tooltip.textContent = wordData.clue;
                    tooltip.style.display = "block";
                    tooltip.style.left = `${e.target.getBoundingClientRect().x}px`;
                    tooltip.style.top = `${e.target.getBoundingClientRect().y + 40}px`;
                }
            });

            cell.addEventListener("blur", () => {
                tooltip.style.display = "none";
            });
        });
    }

    function checkSolution() {
        let correct = 0;
        let incorrect = 0;

        document.querySelectorAll(".cell").forEach((cell) => {
            if (!cell.disabled) {
                if (cell.value.toUpperCase() === cell.dataset.answer) {
                    cell.style.backgroundColor = "#00ff99";
                    correct++;
                } else {
                    cell.style.backgroundColor = "#ff4d4d";
                    incorrect++;
                }
            }
        });

        alert(`Správně: ${correct}, Špatně: ${incorrect}`);
    }

    createGrid();
    attachTooltip();
});
