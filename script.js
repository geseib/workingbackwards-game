const books = ["Arhcitecutre", "Culinary", "Interior Design","Law", "Medical", "Film", "Psychology"];

const players = ["David", "George", "Hawn", "Josh", "Sam" ]
  
// ------- Osmo [https://osmo.supply/] ------- //

document.addEventListener("DOMContentLoaded", () => {
	// Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);
  // Parallax Layers
  document.querySelectorAll('[data-parallax-layers]').forEach((triggerElement) => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: 0
      }
    });
    const layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 }
    ];
    layers.forEach((layerObj, idx) => {
      tl.to(
        triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
        {
          yPercent: layerObj.yPercent,
          ease: "none"
        },
        idx === 0 ? undefined : "<"
      );
    });
  });
});
/* Lenis */
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {lenis.raf(time * 1000);});
gsap.ticker.lagSmoothing(0);


"use strict";
//Audio doesn't work on Safari.
//SOUND CONTROLS
   
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext(); 

function playFile(filepath) {
  // see https://jakearchibald.com/2016/sounds-fun/
  // Fetch the file
  fetch(filepath)
    // Read it into memory as an arrayBuffer
    .then((response) => response.arrayBuffer())
    // Turn it from mp3/aac/whatever into raw audio data
    .then((arrayBuffer) =>      {    
          context.decodeAudioData(arrayBuffer, audioBuffer => {
          const soundSource = context.createBufferSource();
          soundSource.buffer = audioBuffer;
          soundSource.connect(context.destination);
          soundSource.start();
            },
            error =>
              console.error(error)
          )})
    // .then((audioBuffer) => {
    //   // Now we're ready to play!
    //   const soundSource = context.createBufferSource();
    //   soundSource.buffer = audioBuffer;
    //   soundSource.connect(context.destination);
    //   soundSource.start();
    // });
}

let soundOn = false;
function downloadSound(event) {
  if (soundOn) {
    document.querySelector(".turn-sound-on-btn").innerHTML ="Sound off";
    playFile("https://101.sb.seibtribe.us/splitflapsound2.m4a");
    soundOn = false;
  } else {
    soundOn = true;
    document.querySelector(".turn-sound-on-btn").innerHTML ="Sound on";
    playFile("https://101.sb.seibtribe.us/splitflapsound2.m4a");
  }
}

//FLIP FLAP
let flap = document.querySelector(".split-flap-wrapper");

function setup(currentPos, symbolOrder, target) {
  for (let [index, item] of [...flap.children].entries()) {
    console.log(index);
    let SVG_POS = 3;
    if (index === SVG_POS) {
      continue;
    }

    let symbolCursor = symbolOrder.indexOf(currentPos[index]);
    //Get DOM element/
    let top_flap_queued = item.querySelector(".top-flap-queued");
    let top_flap_visible = item.querySelector(".top-flap-visible");
    let bottom_flap_queued = item.querySelector(".bottom-flap-queued");
    let bottom_flap_visible = item.querySelector(".bottom-flap-visible");

    //SETUP
    top_flap_visible.innerHTML = `<span>${symbolOrder[symbolCursor]}</span>`;
    top_flap_queued.innerHTML = `<span>${
      symbolOrder[(symbolCursor + 1) % symbolOrder.length]
    }</span>`;
    bottom_flap_queued.innerHTML = `<span>${
      symbolOrder[(symbolCursor + 1) % symbolOrder.length]
    }</span>`;
    bottom_flap_visible.innerHTML = `<span>${currentPos[index]}</span>`;

    if (top_flap_visible.innerHTML !== `<span>${target[index]}</span>`) {
      console.log(
        bottom_flap_visible,
        "wor",
        currentPos[index],
        currentPos,
        index
      );
      top_flap_visible.classList.remove("top-flap-animation");
      void top_flap_visible.offsetWidth;
      top_flap_visible.classList.add("top-flap-animation");
    }

    if (bottom_flap_visible.innerHTML !== `<span>${target[index]}</span>`) {
      console.log(
        bottom_flap_visible,
        "wor",
        currentPos[index],
        currentPos,
        index
      );
      bottom_flap_queued.classList.remove("bottom-flap-animation");
      void bottom_flap_queued.offsetWidth;
      bottom_flap_queued.classList.add("bottom-flap-animation");
    }

    function updateTopFlaps(e) {
      top_flap_visible.innerHTML = `<span>${
        symbolOrder[(symbolCursor + 1) % symbolOrder.length]
      }</span>`;
      top_flap_queued.innerHTML = `<span>${
        symbolOrder[(symbolCursor + 2) % symbolOrder.length]
      }</span>`;
    }

    top_flap_visible.addEventListener("animationend", updateTopFlaps);

    function updateBottomFlaps(e) {
      bottom_flap_visible.innerHTML = `<span>${
        symbolOrder[(symbolCursor + 1) % symbolOrder.length]
      }</span>`;
      bottom_flap_queued.innerHTML = `<span>${
        symbolOrder[(symbolCursor + 2) % symbolOrder.length]
      }</span>`;

      //run a check if we landed on the correct position.
      if (top_flap_visible.innerHTML === `<span>${target[index]}</span>`) {
        console.log(`${index} arived`);
        top_flap_visible.removeEventListener("animationend", updateTopFlaps);
        bottom_flap_queued.removeEventListener(
          "animationend",
          updateBottomFlaps
        );
        return;
      } else {
        function resetAnimation() {
          if (soundOn) {
            //I sampled this from my flip clock lol
            playFile("https://101.sb.seibtribe.us/splitflapsound2.m4a");
          } 
          top_flap_visible.classList.remove("top-flap-animation");
          void top_flap_visible.offsetWidth;
          top_flap_visible.classList.add("top-flap-animation");
          bottom_flap_queued.classList.remove("bottom-flap-animation");
          void bottom_flap_queued.offsetWidth;
          bottom_flap_queued.classList.add("bottom-flap-animation");
        }
        symbolCursor++;
        resetAnimation();
      }
    }

    //STEP 3
    bottom_flap_queued.addEventListener("animationend", updateBottomFlaps);

    if (top_flap_visible.innerHTML === `<span>${target[index]}</span>`) {
      top_flap_visible.removeEventListener("animationend", updateTopFlaps);
      bottom_flap_queued.removeEventListener("animationend", updateBottomFlaps);
    }

    if (bottom_flap_visible.innerHTML === `<span>${target[index]}</span>`) {
      top_flap_visible.removeEventListener("animationend", updateTopFlaps);
      bottom_flap_queued.removeEventListener("animationend", updateBottomFlaps);
    }
  }
}

let alphabet =
  "0123456789_-";

const splitEmoji = (string) => {
if (!!Intl?.Segmenter) {
  return[...new Intl.Segmenter().segment(string)].map((x) => x.segment);
} else {
  return [...string.replace(/[^a-z0-9-=_~!@#$%^&*?]/gi, '').split("")];
  //firefox doesn't support Intl.segmenter, default to alphanumerial.
}
}

function handleInput(e) {
  e.preventDefault();
  let input = generateRandomNumber();
  input = input.replaceAll(" ", "_");
  console.log(input);

  setup(
    [...new Array(input.length).fill("0")],
    splitEmoji(alphabet),
    [...splitEmoji(input), "0", "0", "0"].splice(0, 4)
  );
}

function numbersGo() {
  let input = generateRandomNumber();
  input = input.replaceAll(" ", "_");
  console.log(input);

  setup(
    [...new Array(input.length).fill("0")],
    splitEmoji(alphabet),
    [...splitEmoji(input), "0", "0", "0"].splice(0, 4)
  );
}

function generateRandomNumber() {
  let randomNumber = Math.floor(Math.random() * 101) + 1; // Generate random number between 1 and 101
  let formattedNumber = randomNumber.toString();

  // If it's a one-digit number, pad it with zeros to make it three digits
  if (formattedNumber.length === 1) {
    formattedNumber = '00' + formattedNumber;
  }
  // If it's a two-digit number, pad it with one zero
  else if (formattedNumber.length === 2) {
    formattedNumber = '0' + formattedNumber;
  }

  return formattedNumber; // Return the formatted number as a string (e.g., "007" or "010")
}

function scaleUp(event) {
  let value = event.target.value;
  // console.log(value);
  event.preventDefault();
  if (value == "small") {
    document.querySelector(".split-flap-wrapper").style.transform =
      "scale(0.45)";
  }
  if (value == "medium") {
    console.log("fired medium");
    document.querySelector(".split-flap-wrapper").style.transform =
      "scale(0.6)";
  }
  if (value == "large") {
    document.querySelector(".split-flap-wrapper").style.transform = "scale(1)";
  }
}



const SplitFlapCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '🕺', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '=', '_', '~', '!', '@', '#', '$', '%', '^', '&', '*', '?']

//Fire once for demo / preview - remove to disable preview text
setup([...new Array(3).fill("0")], SplitFlapCharacters, [
  "1",
  "0",
  "1"
]);

// --- Book Title Functionality ---

// Define an alphabet for the book display – include letters, numbers, punctuation, and space.
let bookAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,.!?'-";

// Helper function (using Intl.Segmenter if available) similar to your splitEmoji
const splitBookTitle = (string) => {
  if (Intl?.Segmenter) {
    return [...new Intl.Segmenter().segment(string)].map(segment => segment.segment);
  } else {
    return [...string];
  }
};

// Get the list of enabled books from the checkboxes
function getEnabledBooks() {
  const checkboxes = document.querySelectorAll('.book-checkbox');
  const enabledBooks = [];
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      enabledBooks.push(cb.value);
    }
  });
  return enabledBooks;
}

// Pick a random book from the enabled list
function pickRandomBook() {
  const books = getEnabledBooks();
  if (books.length === 0) {
    return "No Book";
  }
  const index = Math.floor(Math.random() * books.length);
  return books[index];
}

// Duplicate of your setup() function for the book title display.
// It uses the container ".split-flap-wrapper-book" instead of ".split-flap-wrapper".
function setupBook(currentPos, symbolOrder, target) {
  const bookFlapContainer = document.querySelector(".split-flap-wrapper-book");
  // Loop over each flap (each character)
  for (let [index, item] of [...bookFlapContainer.children].entries()) {
    let symbolCursor = symbolOrder.indexOf(currentPos[index]);
    if (symbolCursor === -1) symbolCursor = 0; // fallback

    const top_flap_queued = item.querySelector(".top-flap-queued");
    const top_flap_visible = item.querySelector(".top-flap-visible");
    const bottom_flap_queued = item.querySelector(".bottom-flap-queued");
    const bottom_flap_visible = item.querySelector(".bottom-flap-visible");

    // Initial setup
    top_flap_visible.innerHTML = `<span>${symbolOrder[symbolCursor]}</span>`;
    top_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;
    bottom_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;
    bottom_flap_visible.innerHTML = `<span>${currentPos[index]}</span>`;

    if (top_flap_visible.innerHTML !== `<span>${target[index]}</span>`) {
      top_flap_visible.classList.remove("top-flap-animation");
      void top_flap_visible.offsetWidth;
      top_flap_visible.classList.add("top-flap-animation");
    }

    if (bottom_flap_visible.innerHTML !== `<span>${target[index]}</span>`) {
      bottom_flap_queued.classList.remove("bottom-flap-animation");
      void bottom_flap_queued.offsetWidth;
      bottom_flap_queued.classList.add("bottom-flap-animation");
    }

    function updateTopFlaps(e) {
      top_flap_visible.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;
      top_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 2) % symbolOrder.length]}</span>`;
    }

    top_flap_visible.addEventListener("animationend", updateTopFlaps);

    function updateBottomFlaps(e) {
      bottom_flap_visible.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;
      bottom_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 2) % symbolOrder.length]}</span>`;

      // Check if we have reached the target character
      if (top_flap_visible.innerHTML === `<span>${target[index]}</span>`) {
        top_flap_visible.removeEventListener("animationend", updateTopFlaps);
        bottom_flap_queued.removeEventListener("animationend", updateBottomFlaps);
        return;
      } else {
        function resetAnimation() {
          if (soundOn) {
            playFile("https://101.sb.seibtribe.us/splitflapsound2.m4a");
          }
          top_flap_visible.classList.remove("top-flap-animation");
          void top_flap_visible.offsetWidth;
          top_flap_visible.classList.add("top-flap-animation");
          bottom_flap_queued.classList.remove("bottom-flap-animation");
          void bottom_flap_queued.offsetWidth;
          bottom_flap_queued.classList.add("bottom-flap-animation");
        }
        symbolCursor++;
        resetAnimation();
      }
    }

    bottom_flap_queued.addEventListener("animationend", updateBottomFlaps);

    if (top_flap_visible.innerHTML === `<span>${target[index]}</span>`) {
      top_flap_visible.removeEventListener("animationend", updateTopFlaps);
      bottom_flap_queued.removeEventListener("animationend", updateBottomFlaps);
    }

    if (bottom_flap_visible.innerHTML === `<span>${target[index]}</span>`) {
      top_flap_visible.removeEventListener("animationend", updateTopFlaps);
      bottom_flap_queued.removeEventListener("animationend", updateBottomFlaps);
    }
  }
}

// Function to build the book title display dynamically and animate it
function displayBookTitle() {
  const bookTitle = pickRandomBook();
  // Split the title into an array of characters
  const target = [...bookTitle];
  // Create an initial array – here using a space (" ") for each flap
  const currentPos = new Array(target.length).fill(" ");
  
  // Build the flaps dynamically based on the title length:
  const container = document.querySelector(".split-flap-wrapper-book");
  container.innerHTML = ""; // Clear previous content, if any

  target.forEach(() => {
    // Create a new flap element (structure similar to your number display)
    const flap = document.createElement("div");
    flap.className = "flap flex-center-all";
    flap.innerHTML = `
      <div class="top">
        <div class="top-flap-queued"><span>_</span></div>
        <div class="top-flap-visible"><span> </span></div>
      </div>
      <div class="bottom">
        <div class="bottom-flap-queued"><span>_</span></div>
        <div class="bottom-flap-visible"><span> </span></div>
      </div>
    `;
    container.appendChild(flap);
  });

  // Animate the book title using the duplicate setup function.
  // (Using splitBookTitle() to ensure proper segmentation of the bookAlphabet.)
  setupBook(currentPos, splitBookTitle(bookAlphabet), target);
}

// Listen for clicks on the center logo to trigger the game turn
document.addEventListener("DOMContentLoaded", function() {
  // Get the center logo SVG element
  const centerLogo = document.querySelector('.osmo-icon-svg');
  
  // Make sure it's visually clear that it's clickable
  if (centerLogo) {
    centerLogo.style.cursor = 'pointer';
    
    // Add click event listener to the logo only
    centerLogo.addEventListener("click", function(e) {
      // Update bar-raiser
      updateBarRaiser();
      
      // Update the number and book displays
      numbersGo();
      setTimeout(displayBookTitle, 100);
      
      // Prevent event from bubbling up
      e.stopPropagation();
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Array of book titles
  
  // Get the container where the book entries should appear
  const bookEntriesContainer = document.querySelector('.book-entries');
  
  // Loop over the array and create each book entry
  books.forEach(function(book) {
    // Create a div for the entry
    const bookEntry = document.createElement('div');
    bookEntry.className = 'book-entry';
    
    // Create the custom checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'book-checkbox';
    checkbox.value = book;
    checkbox.checked = true;  // default to checked; adjust as needed
    
    // Create the div for the static split-flap style book title
    const flapStatic = document.createElement('div');
    flapStatic.className = 'flap-static';
    flapStatic.textContent = book;
    
    // Append the checkbox and title div to the book entry container
    bookEntry.appendChild(checkbox);
    bookEntry.appendChild(flapStatic);
    
    // Append the complete book entry to the main container
    bookEntriesContainer.appendChild(bookEntry);
  });
});


let currentIndex = -1; // Start at -1 to indicate no player has been selected yet



function getNextPlayer() {
  const gamePlayers = getEnabledPlayers(); 
  if (currentIndex === -1) {
    // First time: pick randomly
    currentIndex = Math.floor(Math.random() * gamePlayers.length);
  } else {
    // Subsequent times: go in order
    currentIndex = (currentIndex + 1) % gamePlayers.length;
  }
  return gamePlayers[currentIndex];
}

// Function to update the Bar-raiser display
const playersColumn = document.querySelector('.players-column h2');

function updateBarRaiser() {
  const nextPlayer = getNextPlayer();
  
  // Display the selected player
  playersColumn.innerHTML = `<h2>Bar-raiser: ${nextPlayer}</h2>`;
}

// Note: We'll call this function only when the center logo is clicked
// This is now handled in the centerLogo click event listener

const playerEntriesContainer = document.querySelector('.player-entries');

// Loop over the array and create each player entry
players.forEach(function(player) {
  // Create a div for the player entry
  const playerEntry = document.createElement('div');
  playerEntry.className = 'player-entry';
  
  // Create the custom checkbox element
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'player-checkbox';
  checkbox.value = player;
  checkbox.checked = true;  // default to checked
  
  // Create the div to display the player's name
  const playerName = document.createElement('div');
  playerName.className = 'player-name';
  playerName.textContent = player;
  
  // Append the checkbox and name div to the player entry container
  playerEntry.appendChild(checkbox);
  playerEntry.appendChild(playerName);
  
  // Append the complete player entry to the main container
  playerEntriesContainer.appendChild(playerEntry);
});


// Get the list of enabled books from the checkboxes
function getEnabledPlayers() {
  const checkboxes = document.querySelectorAll('.player-checkbox');
  const enabledPlayers = [];
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      enabledPlayers.push(cb.value);
    }
  });
  return enabledPlayers;
}


document.addEventListener("DOMContentLoaded", function () {
  const books = ["Architecture", "Culinary", "Interior Design", "Law", "Medical", "Film", "Psychology"];
  const players = ["David", "George", "Hawn", "Josh", "Sam"];

  const bookEntriesContainer = document.querySelector('.book-entries');
  const playerEntriesContainer = document.querySelector('.player-entries');

  const bookForm = document.getElementById("book-form");
  const newBookInput = document.getElementById("new-book");

  const playerForm = document.getElementById("player-form");
  const newPlayerInput = document.getElementById("new-player");

  const toggleButton = document.getElementById('toggle-rules-btn');
  const rulesSection = document.getElementById('rules-section');

  toggleButton.addEventListener('click', function () {
    rulesSection.classList.toggle('open');

    if (rulesSection.classList.contains('open')) {
      toggleButton.textContent = 'Hide Rules';
    } else {
      toggleButton.textContent = 'Show Rules';
    }
  });


  let currentIndex = -1; // For cycling through players

  // Display initial books
  function displayBooks() {
    bookEntriesContainer.innerHTML = "";
    books.forEach(book => {
      const bookEntry = createEntry(book, 'book');
      bookEntriesContainer.appendChild(bookEntry);
    });
  }

  // Display initial players
  function displayPlayers() {
    playerEntriesContainer.innerHTML = "";
    players.forEach(player => {
      const playerEntry = createEntry(player, 'player');
      playerEntriesContainer.appendChild(playerEntry);
    });
  }

  // Create entries for books or players
  function createEntry(name, type) {
    const entry = document.createElement('div');
    entry.className = `${type}-entry`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = `${type}-checkbox`;
    checkbox.value = name;
    checkbox.checked = true;

    const label = document.createElement('label');
    label.textContent = name;

    entry.appendChild(checkbox);
    entry.appendChild(label);

    return entry;
  }

  // Add new book
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const bookName = newBookInput.value.trim();
    if (bookName) {
      const bookEntry = createEntry(bookName, 'book');
      bookEntriesContainer.appendChild(bookEntry);
      newBookInput.value = "";
    }
  });

  // Add new player
  playerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const playerName = newPlayerInput.value.trim();
    if (playerName) {
      const playerEntry = createEntry(playerName, 'player');
      playerEntriesContainer.appendChild(playerEntry);
      newPlayerInput.value = "";
    }
  });

  // Handle checkbox changes to reset the player cycling
  playerEntriesContainer.addEventListener('change', (event) => {
    if (event.target.classList.contains('player-checkbox')) {
      currentIndex = -1;
      console.log(`Checkbox for ${event.target.value} changed. currentIndex reset to -1.`);
    }
  });

  // Load initial data
  displayBooks();
  displayPlayers();
});

// Player Score Manager
document.addEventListener('DOMContentLoaded', () => {
  // Store player scores
  const playerScores = {};
  
  // Get DOM elements
  const playerScoreRow = document.getElementById('player-score-row');
  const playersList = document.getElementById('players-list');
  const resetGameButton = document.getElementById('reset-game');
  const resetScoresButton = document.getElementById('reset-scores');

  // Function to update player score display
  function updatePlayerScoreRow() {
    // Clear current display
    playerScoreRow.innerHTML = '';
    
    // Get checked players
    const checkedPlayers = getEnabledPlayers();
    
    // Initialize scores for new players
    checkedPlayers.forEach(playerName => {
      if (!playerScores[playerName]) {
        playerScores[playerName] = 0;
      }
    });
    
    // Create score items for each player
    checkedPlayers.forEach(playerName => {
      const scoreItem = document.createElement('div');
      scoreItem.className = 'player-score-item';
      scoreItem.innerHTML = `
        <div class="player-name">${playerName}</div>
        <div class="player-points" id="score-${playerName.replace(/\s+/g, '-')}">${playerScores[playerName]}</div>
      `;
      
      // Add click event to increase score
      scoreItem.addEventListener('click', () => {
        increasePlayerScore(playerName);
      });
      
      playerScoreRow.appendChild(scoreItem);
    });
  }
  
  // Function to increase a player's score
  function increasePlayerScore(playerName) {
    // Increase the score
    playerScores[playerName]++;
    
    // Update display
    const scoreElement = document.getElementById(`score-${playerName.replace(/\s+/g, '-')}`);
    if (scoreElement) {
      scoreElement.textContent = playerScores[playerName];
      
      // Add animation effect
      scoreElement.style.transform = 'scale(1.3)';
      setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
      }, 200);
    }
    
    // Also update the players list if it exists
    updatePlayersList();
  }
  
  // Function to update players list
  function updatePlayersList() {
    if (!playersList) return;
    
    playersList.innerHTML = '';
    
    // Get all checked players
    const checkedPlayers = getEnabledPlayers();
    
    // Create player elements with scores
    checkedPlayers.forEach(playerName => {
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player';
      playerDiv.innerHTML = `
        <h3>${playerName}</h3>
        <div class="player-score">${playerScores[playerName] || 0}</div>
      `;
      
      playersList.appendChild(playerDiv);
    });
  }
  
  // Listen for player checkbox changes
  document.querySelector('.player-entries').addEventListener('change', event => {
    if (event.target.classList.contains('player-checkbox')) {
      updatePlayerScoreRow();
      updatePlayersList();
    }
  });
  
  // Handle new player additions
  const playerForm = document.getElementById('player-form');
  if (playerForm) {
    playerForm.addEventListener('submit', () => {
      // Use setTimeout to allow DOM to update first
      setTimeout(() => {
        updatePlayerScoreRow();
        updatePlayersList();
      }, 0);
    });
  }
  
  // Reset scores button
  resetScoresButton.addEventListener('click', () => {
    // Reset all scores to zero
    Object.keys(playerScores).forEach(playerName => {
      playerScores[playerName] = 0;
    });
    
    // Update displays
    updatePlayerScoreRow();
    updatePlayersList();
  });
  
  // Reset game button (also resets bar-raiser)
  resetGameButton.addEventListener('click', () => {
    // Reset all scores to zero
    Object.keys(playerScores).forEach(playerName => {
      playerScores[playerName] = 0;
    });
    
    // Reset bar-raiser selection
    currentIndex = -1;
    
    // Update displays
    updatePlayerScoreRow();
    updatePlayersList();
  });
  
  // Initial rendering
  updatePlayerScoreRow();
  updatePlayersList();
});