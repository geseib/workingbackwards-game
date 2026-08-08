const DEFAULT_BOOKS = ["Architecture", "Culinary", "Interior Design", "Law", "Medical", "Film", "Psychology"];

const DEFAULT_PLAYERS = ["Player 1", "Player 2"];

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

// Scale the book display so long titles still fit inside the board.
const BOOK_FLAP_WIDTH = 214; // 200px flap + margins + borders
const BOOK_MAX_WIDTH = 460;
function fitBookFlaps(container, count) {
  const scale = Math.min(0.3, BOOK_MAX_WIDTH / (count * BOOK_FLAP_WIDTH));
  container.style.transform = `scale(${scale})`;
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

  fitBookFlaps(container, target.length);

  // Animate the book title using the duplicate setup function.
  // (Using splitBookTitle() to ensure proper segmentation of the bookAlphabet.)
  setupBook(currentPos, splitBookTitle(bookAlphabet), target);
}

// Function to update game state indicators
function updateGameStateIndicators(state) {
  const gameStatus = document.getElementById('game-status');
  const scoresStatus = document.getElementById('scores-status');
  
  if (!gameStatus || !scoresStatus) return;
  
  if (state === 'clean-slate') {
    // Update game status
    gameStatus.className = 'status-indicator clean-slate active';
    gameStatus.textContent = 'Clean Slate';
    
    // Update scores status
    scoresStatus.className = 'status-indicator clean-slate active';
    scoresStatus.textContent = 'Clean Slate';
    
    // Set default book display
    resetBookDisplay();
    
    // Reset bar-raiser display
    if (playersColumn) {
      playersColumn.textContent = 'Bar-raiser: play to find out who';
    }
  } else if (state === 'in-progress') {
    // Update game status
    gameStatus.className = 'status-indicator in-progress active';
    gameStatus.textContent = 'Game in Progress';
  } else if (state === 'scores-reset') {
    // Only update scores status
    scoresStatus.className = 'status-indicator clean-slate active';
    scoresStatus.textContent = 'Clean Slate';
  } else if (state === 'scores-active') {
    // Only update scores status when points exist
    scoresStatus.className = 'status-indicator in-progress active';
    scoresStatus.textContent = 'Points Recorded';
  }
}

// Function to reset book display to "Book"
function resetBookDisplay() {
  const defaultBookDisplay = ['B', 'o', 'o', 'k'];
  
  // Build the flaps dynamically:
  const container = document.querySelector(".split-flap-wrapper-book");
  container.innerHTML = ""; // Clear previous content
  
  // Create exactly 4 flaps for the word "Book"
  for (let i = 0; i < 4; i++) {
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
  }
  
  fitBookFlaps(container, 4);

  // Animate the flaps to display "Book"
  setupBook(
    [...new Array(4).fill(' ')],
    splitBookTitle(bookAlphabet),
    defaultBookDisplay
  );
}

// Listen for clicks on the center logo to trigger the game turn
document.addEventListener("DOMContentLoaded", function() {
  // Initialize game state indicators
  setTimeout(() => updateGameStateIndicators('clean-slate'), 500);
  
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



let currentIndex = -1; // Start at -1 to indicate no player has been selected yet



function getNextPlayer() {
  const gamePlayers = getEnabledPlayers();
  if (gamePlayers.length === 0) {
    currentIndex = -1;
    return "No Players";
  }
  if (currentIndex >= gamePlayers.length) {
    currentIndex = -1;
  }
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

// Variable to keep track of the current bar-raiser
let currentBarRaiser = '';

function updateBarRaiser() {
  const nextPlayer = getNextPlayer();
  
  // Set the current bar-raiser
  currentBarRaiser = nextPlayer;
  
  // Display the selected player
  playersColumn.textContent = `Bar-raiser: ${nextPlayer}`;
  
  // Update the player score row to highlight the bar-raiser
  updatePlayerHighlights();
  
  // Update game state indicators
  updateGameStateIndicators('in-progress');
}

// Function to update player highlights based on bar-raiser status
function updatePlayerHighlights() {
  // Get all player score items
  const playerScoreItems = document.querySelectorAll('.player-score-item');
  
  // Update each item's styling based on whether it's the bar-raiser
  playerScoreItems.forEach(item => {
    const playerName = item.querySelector('.player-name').textContent;
    
    if (playerName === currentBarRaiser) {
      item.classList.add('bar-raiser');
    } else {
      item.classList.remove('bar-raiser');
    }
  });
}

// Note: We'll call this function only when the center logo is clicked
// This is now handled in the centerLogo click event listener



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



// ---------------------------------------------------------------------------
// Editable lists (books + players)
// Each row is an inline-editable name with an include checkbox and a remove
// button. The last row of each list is a ghost "add" row.
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "wb-game-lists-v1";

  const state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.books) && Array.isArray(saved.players)) {
        return saved;
      }
    } catch (err) {
      /* ignore corrupt storage */
    }
    return {
      books: DEFAULT_BOOKS.map((name) => ({ name, checked: true })),
      players: DEFAULT_PLAYERS.map((name) => ({ name, checked: true }))
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* storage unavailable — the game still works, it just won't persist */
    }
  }

  const lists = {
    book: {
      items: state.books,
      container: document.querySelector(".book-entries"),
      addLabel: "Add a book"
    },
    player: {
      items: state.players,
      container: document.querySelector(".player-entries"),
      addLabel: "Add a player"
    }
  };

  function notify(type) {
    const container = lists[type].container;
    container.dispatchEvent(new Event("change", { bubbles: true }));
    if (type === "book") return;
    document.dispatchEvent(new CustomEvent("players-changed"));
  }

  function uniqueName(type, name, ignoreIndex) {
    const taken = lists[type].items.some(
      (item, i) => i !== ignoreIndex && item.name.toLowerCase() === name.toLowerCase()
    );
    if (!taken) return name;
    let n = 2;
    while (
      lists[type].items.some(
        (item, i) => i !== ignoreIndex && item.name.toLowerCase() === `${name} ${n}`.toLowerCase()
      )
    ) {
      n++;
    }
    return `${name} ${n}`;
  }

  function render(type) {
    const { items, container, addLabel } = lists[type];
    container.innerHTML = "";

    items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = `entry-row ${type}-entry`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = `${type}-checkbox`;
      checkbox.value = item.name;
      checkbox.checked = item.checked;
      checkbox.setAttribute("aria-label", `Include ${item.name}`);
      checkbox.addEventListener("change", () => {
        item.checked = checkbox.checked;
        saveState();
        notify(type);
      });

      const input = document.createElement("input");
      input.type = "text";
      input.className = "entry-input";
      input.value = item.name;
      input.setAttribute("aria-label", `${type} name`);

      const commit = () => {
        const value = input.value.trim();
        if (!value) {
          input.value = item.name;
          return;
        }
        if (value === item.name) return;
        const previous = item.name;
        item.name = uniqueName(type, value, index);
        input.value = item.name;
        checkbox.value = item.name;
        saveState();
        if (type === "player") {
          document.dispatchEvent(
            new CustomEvent("player-renamed", { detail: { from: previous, to: item.name } })
          );
        }
        notify(type);
      };

      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        } else if (event.key === "Escape") {
          input.value = item.name;
          input.blur();
        }
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "entry-remove";
      remove.title = `Remove ${item.name}`;
      remove.setAttribute("aria-label", `Remove ${item.name}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        items.splice(index, 1);
        saveState();
        render(type);
        notify(type);
      });

      row.append(checkbox, input, remove);
      container.appendChild(row);
    });

    // Ghost "add" row, styled like the others.
    const addRow = document.createElement("div");
    addRow.className = "entry-row entry-row--add";

    const plus = document.createElement("span");
    plus.className = "entry-add-icon";
    plus.textContent = "+";

    const addInput = document.createElement("input");
    addInput.type = "text";
    addInput.className = "entry-input entry-add-input";
    addInput.placeholder = addLabel;
    addInput.setAttribute("aria-label", addLabel);

    const addItem = () => {
      const value = addInput.value.trim();
      if (!value) return;
      items.push({ name: uniqueName(type, value, -1), checked: true });
      saveState();
      render(type);
      notify(type);
      // Keep typing: focus the fresh add row.
      const nextAdd = lists[type].container.querySelector(".entry-add-input");
      if (nextAdd) nextAdd.focus();
    };

    addInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addItem();
      }
    });
    addInput.addEventListener("blur", addItem);
    plus.addEventListener("click", () => addInput.focus());

    addRow.append(plus, addInput);
    container.appendChild(addRow);
  }

  render("book");
  render("player");

  // Any change to the player roster restarts the bar-raiser rotation.
  document.addEventListener("players-changed", () => {
    currentIndex = -1;
  });

  const toggleButton = document.getElementById("toggle-rules-btn");
  const rulesSection = document.getElementById("rules-section");
  toggleButton.addEventListener("click", function () {
    rulesSection.classList.toggle("open");
    toggleButton.textContent = rulesSection.classList.contains("open")
      ? "Hide Rules"
      : "Show Rules";
  });
});


// Player Score Manager
document.addEventListener('DOMContentLoaded', () => {
  // Store player scores
  const playerScores = {};
  // Live map of player name -> points element
  const scoreElements = {};

  // Get DOM elements
  const playerScoreRow = document.getElementById('player-score-row');
  const playersList = document.getElementById('players-list');
  const resetGameButton = document.getElementById('reset-game');
  const resetScoresButton = document.getElementById('reset-scores');

  // Function to update player score display
  function updatePlayerScoreRow() {
    // Clear current display
    playerScoreRow.innerHTML = '';
    Object.keys(scoreElements).forEach(key => delete scoreElements[key]);

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
      
      // Check if this player is the bar-raiser
      if (playerName === currentBarRaiser) {
        scoreItem.classList.add('bar-raiser');
      }
      
      const nameEl = document.createElement('div');
      nameEl.className = 'player-name';
      nameEl.textContent = playerName;

      const pointsEl = document.createElement('div');
      pointsEl.className = 'player-points';
      pointsEl.textContent = playerScores[playerName];
      scoreElements[playerName] = pointsEl;

      scoreItem.append(nameEl, pointsEl);

      // Only add click event for non-bar-raisers
      if (playerName !== currentBarRaiser) {
        scoreItem.addEventListener('click', () => {
          increasePlayerScore(playerName);
        });
      }
      
      playerScoreRow.appendChild(scoreItem);
    });
  }
  
  // Function to increase a player's score
  function increasePlayerScore(playerName) {
    // Don't allow bar-raiser to score
    if (playerName === currentBarRaiser) {
      return;
    }
    
    // Increase the score
    playerScores[playerName]++;
    
    // Update display
    const scoreElement = scoreElements[playerName];
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
    
    // Update score status to indicate points are recorded
    updateGameStateIndicators('scores-active');
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
  
  // Any roster edit (add, remove, rename, check/uncheck) refreshes the row
  document.addEventListener('players-changed', () => {
    updatePlayerScoreRow();
    updatePlayersList();
  });

  // Carry a player's score and bar-raiser status across a rename
  document.addEventListener('player-renamed', event => {
    const { from, to } = event.detail;
    if (from in playerScores) {
      playerScores[to] = playerScores[from];
      delete playerScores[from];
    }
    if (currentBarRaiser === from) {
      currentBarRaiser = to;
      if (playersColumn) {
        playersColumn.textContent = `Bar-raiser: ${to}`;
      }
    }
  });


  // Reset scores button
  resetScoresButton.addEventListener('click', () => {
    // Reset all scores to zero
    Object.keys(playerScores).forEach(playerName => {
      playerScores[playerName] = 0;
    });
    
    // Update displays
    updatePlayerScoreRow();
    updatePlayersList();
    
    // Update the status indicator
    updateGameStateIndicators('scores-reset');
  });
  
  // Reset game button (also resets bar-raiser)
  resetGameButton.addEventListener('click', () => {
    // Reset all scores to zero
    Object.keys(playerScores).forEach(playerName => {
      playerScores[playerName] = 0;
    });
    
    // Reset bar-raiser selection
    currentIndex = -1;
    currentBarRaiser = '';
    
    // Update displays
    updatePlayerScoreRow();
    updatePlayersList();
    
    // Reset all game indicators to clean slate
    updateGameStateIndicators('clean-slate');
  });
  
  // Initial call to updatePlayerHighlights to set up correct styling
  if (typeof updatePlayerHighlights === 'function') {
    setTimeout(updatePlayerHighlights, 500);
  }
  
  // Initial rendering
  updatePlayerScoreRow();
  updatePlayersList();
});