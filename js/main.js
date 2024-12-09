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
   addEventListeners();
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
   grid.innerHTML = '';
   
   for (let i = 0; i < crosswordData.size; i++) {
       for (let j = 0; j < crosswordData.size; j++) {
           const cell = document.createElement('div');
           cell.className = 'cell-wrapper';
           
           const input = document.createElement('input');
           input.type = 'text';
           input.maxLength = 1;
           input.className = 'cell';
           input.dataset.row = i + 1;
           input.dataset.col = j + 1;
           input.disabled = true;
           
           cell.appendChild(input);
           grid.appendChild(cell);
       }
   }

   enableCells();
   markTajenka();
}

function enableCells() {
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
}

function markTajenka() {
   crosswordData.tajenka.forEach(pos => {
       const cell = document.querySelector(
           `input[data-row="${pos.row}"][data-col="${pos.col}"]`
       );
       if (cell) cell.classList.add('tajenka');
   });
}

function createClues() {
   const acrossClues = document.getElementById('acrossClues');
   const downClues = document.getElementById('downClues');
   
   acrossClues.innerHTML = '';
   downClues.innerHTML = '';

   Object.entries(crosswordData.words)
       .sort((a, b) => a[0] - b[0])
       .forEach(([num, word]) => {
           const li = document.createElement('li');
           li.textContent = word.clue;
           if (word.direction === 'across') {
               acrossClues.appendChild(li);
           } else {
               downClues.appendChild(li);
           }
       });
}

function addEventListeners() {
   const grid = document.getElementById('crosswordGrid');
   
   grid.addEventListener('input', handleInput);
   grid.addEventListener('keydown', handleKeyDown);
   grid.addEventListener('click', handleClick);
}

function handleInput(event) {
   if (!event.target.matches('.cell')) return;
   
   const input = event.target;
   input.value = input.value.toUpperCase();

   if (input.value.length === 1) {
       const nextCell = findNextCell(input);
       if (nextCell) nextCell.focus();
   }
}

function handleKeyDown(event) {
   if (!event.target.matches('.cell')) return;

   const input = event.target;
   const currentPos = {
       row: parseInt(input.dataset.row),
       col: parseInt(input.dataset.col)
   };

   switch(event.key) {
       case 'Backspace':
           if (input.value === '') {
               const prevCell = findPrevCell(input);
               if (prevCell) {
                   prevCell.focus();
                   prevCell.value = '';
               }
           }
           break;
       case 'ArrowLeft':
       case 'ArrowRight':
       case 'ArrowUp':
       case 'ArrowDown':
           event.preventDefault();
           const direction = event.key.replace('Arrow', '').toLowerCase();
           moveToCell(currentPos, direction);
           break;
   }
}

function handleClick(event) {
   if (event.target.matches('.cell')) {
       event.target.select();
   }
}

function findNextCell(currentCell) {
   const currentRow = parseInt(currentCell.dataset.row);
   const currentCol = parseInt(currentCell.dataset.col);
   
   // Nejdřív zkusíme buňku vpravo
   let nextCell = document.querySelector(
       `input[data-row="${currentRow}"][data-col="${currentCol + 1}"]`
   );
   
   if (!nextCell || nextCell.disabled) {
       // Pokud není buňka vpravo, zkusíme buňku dole
       nextCell = document.querySelector(
           `input[data-row="${currentRow + 1}"][data-col="${currentCol}"]`
       );
   }
   
   return nextCell && !nextCell.disabled ? nextCell : null;
}

function findPrevCell(currentCell) {
   const currentRow = parseInt(currentCell.dataset.row);
   const currentCol = parseInt(currentCell.dataset.col);
   
   let prevCell = document.querySelector(
       `input[data-row="${currentRow}"][data-col="${currentCol - 1}"]`
   );
   
   return prevCell && !prevCell.disabled ? prevCell : null;
}

function moveToCell(currentPos, direction) {
   const movements = {
       left: { row: 0, col: -1 },
       right: { row: 0, col: 1 },
       up: { row: -1, col: 0 },
       down: { row: 1, col: 0 }
   };

   const movement = movements[direction];
   const nextCell = document.querySelector(
       `input[data-row="${currentPos.row + movement.row}"][data-col="${currentPos.col + movement.col}"]`
   );

   if (nextCell && !nextCell.disabled) nextCell.focus();
}

function checkSolution() {
   const solution = crosswordData.tajenka
       .map(pos => {
           const cell = document.querySelector(
               `input[data-row="${pos.row}"][data-col="${pos.col}"]`
           );
           return cell ? cell.value.toUpperCase() : '';
       })
       .join('');
   
   alert(solution === "OTECFURA" ? 
       "Správně! Tajenka je: Otec Fura" : 
       "Zkuste to znovu!");
}

document.addEventListener('DOMContentLoaded', initCrossword);
