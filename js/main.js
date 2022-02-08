import {
  getCellElementList,
  getCellElementAtIdx,
  getCurrentTurnElement,
  getGameStatusElement,
} from "./selectors.js";

import { TURN } from "./constants.js";

/**
 * Global variables
 */

let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  // Update DOM
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(currentTurn);
}

function handleCellClick(cellElement, index) {
  console.log(cellElement, index);
  // isMark
  if (
    cellElement.classList.contains(TURN.CIRCLE) ||
    cellElement.classList.contains(TURN.CROSS)
  )
    return;
  // Mark
  cellElement.classList.add(currentTurn);

  // Toggle turn
  toggleTurn();
}

function initCellElmentList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });
}

(() => {
  // bind click event for all li elements
  initCellElmentList();
})();
