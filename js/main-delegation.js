import {
  getCellElementList,
  getCellElementAtIdx,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayBtnElement,
  getCellUlElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";
import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";

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

function resetTurn() {
  currentTurn = TURN.CROSS;

  // Update DOM
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(currentTurn);
}

function updateGameStatus(newGameStatus) {
  const statusElement = getGameStatusElement();
  if (!statusElement) return;
  statusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayBtn = getReplayBtnElement();
  if (!replayBtn) return;
  replayBtn.classList.add("show");
}

function highlightWinCells(winPositionList) {
  if (!Array.isArray(winPositionList) || winPositionList.length !== 3)
    throw new Error("Invalid win position");

  for (const position of winPositionList) {
    const cellElement = getCellElementAtIdx(position);
    if (!cellElement) return;
    cellElement.classList.add(CELL_VALUE.WIN);
  }
}

function handleCellClick(cellElement, index) {
  const clicked =
    cellElement.classList.contains(TURN.CIRCLE) ||
    cellElement.classList.contains(TURN.CROSS);

  if (clicked || isGameEnded) return;
  // Mark
  cellElement.classList.add(currentTurn);

  // Mark in Array
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
  // Check status
  const game = checkGameStatus(cellValues);

  switch (game?.status) {
    case GAME_STATUS.PLAYING: {
      isGameEnded = false;
      break;
    }
    case GAME_STATUS.ENDED: {
      isGameEnded = true;
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }
    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      isGameEnded = true;
      updateGameStatus(game.status);
      showReplayButton();
      highlightWinCells(game.winPositions);
      break;
    }
    default:
      break;
  }

  // Toggle turn
  toggleTurn();
}

function handleReplayClick() {
  const replayBtn = getReplayBtnElement();
  if (!replayBtn) return;
  replayBtn.classList.remove("show");

  const cellElementList = getCellElementList();
  if (!cellElementList) return;
  for (const cell of cellElementList) {
    cell.classList.remove(CELL_VALUE.WIN, TURN.CIRCLE, TURN.CROSS);
  }

  cellValues = cellValues.fill("");
  isGameEnded = false;
  resetTurn();
  updateGameStatus(GAME_STATUS.PLAYING);
}

function initCellElmentList() {
  const cellElementList = getCellElementList();
  if (!cellElementList) return;
  cellElementList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  // bind Cell click
  const ulElement = getCellUlElement();
  if (!ulElement) throw new Error("Cannot get Ul Element");
  ulElement.addEventListener("click", (e) => {
    const liClicked = e.target;
    const index = e.target.dataset.idx;
    handleCellClick(e.target, index);
  });

  // bind replay button click
  const replayBtnElement = getReplayBtnElement();
  if (!replayBtnElement) throw new Error("Cannot get Replay Element");
  replayBtnElement.addEventListener("click", () => {
    handleReplayClick();
  });
}

(() => {
  // bind click event for all li elements
  initCellElmentList();
})();
