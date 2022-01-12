const squares = document.querySelectorAll('.square');

let currentBoardState = {
  play: 0,
  whoPlayed: '',
  winner: '',
};

const boardStateList = [
  {
    ...currentBoardState,
  },
];

const playing = document.querySelector('.play').firstElementChild;
let whoIsPlaying = '';

updateWhoIsPlaying();
updateClickEventListener();

// Utilities
function updateWhoIsPlaying() {
  whoIsPlaying = 'X';

  if (currentBoardState.winner) {
    whoIsPlaying = currentBoardState.winner;
    playing.innerText = 'Winner: ' + whoIsPlaying;
  } else {
    if (currentBoardState.whoPlayed === 'X') {
      whoIsPlaying = 'O';
    } else if (currentBoardState.whoPlayed === 'O') {
      whoIsPlaying = 'X';
    }
    playing.innerText = 'Playing: ' + whoIsPlaying;
  }
}

function updateClickEventListener() {
  if (currentBoardState.winner) {
    removeClickEventListener();
  } else {
    addClickEventListener();
  }
}

function addClickEventListener() {
  squares.forEach((square) => {
    square.addEventListener('click', handleClick);
  });
}

function removeClickEventListener() {
  squares.forEach((square) => {
    square.removeEventListener('click', handleClick);
  });
}

function handleClick() {
  const clickedSquareIndex = this.dataset.index;

  if (this.firstElementChild.innerText) return;
  else this.firstElementChild.innerText = whoIsPlaying;

  updateCurrentBoardState(clickedSquareIndex);
  updateBoardStateList();

  if (!checkWin()) {
    updateWhoIsPlaying();
  } else {
    updateWhoIsPlaying();
    updateClickEventListener();
  }

  updateActionList();
}

function updateCurrentBoardState(clickedSquareIndex) {
  currentBoardState.play++;
  currentBoardState.whoPlayed = whoIsPlaying;
  currentBoardState['square' + clickedSquareIndex] = whoIsPlaying;
}

function updateBoardStateList() {
  boardStateList.length = currentBoardState.play;
  boardStateList.push({
    ...currentBoardState,
  });
}

function checkWin() {
  const winningLines = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  outer: for (let i = 0; i < winningLines.length; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentBoardState['square' + winningLines[i][j]] !== whoIsPlaying) {
        continue outer;
      }
    }
    currentBoardState.winner = whoIsPlaying;
    return true;
  }

  return false;
}

function updateActionList() {
  const list = document.createElement('ol');
  const div = document.querySelector('.plays');

  list.className = 'actions-list';
  list.innerHTML = '<li><button data-index="0">Go to game start</button></li>';

  for (let i = 1; i <= currentBoardState.play; i++) {
    list.innerHTML += `<li><button data-index="${i}">Go to move #${i}</button></li>`;
  }

  div.innerHTML = '';
  div.append(list);

  const buttons = document.querySelectorAll('button');

  buttons.forEach((button) => {
    button.addEventListener('click', updateGameState);
  });
}

function updateGameState() {
  currentBoardState = {
    ...boardStateList[this.dataset.index],
  };

  reloadBoardState();
  updateWhoIsPlaying();
  updateClickEventListener();
}

function reloadBoardState() {
  squares.forEach((square, index) => {
    square.firstElementChild.innerHTML =
      currentBoardState[`square${index + 1}`] ?? '';
  });
}
