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

// Size both boards to the viewport now that they have content, so the markup's
// placeholder "101" / "Book" is already in proportion before the first spin.
document.addEventListener("DOMContentLoaded", () => {
  fitNumberBoard();
  fitBookBoard();
});

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
  // Loop over each flap (each character). The flaps are grouped into rows, so
  // query for them rather than walking the container's direct children.
  for (let [index, item] of [...bookFlapContainer.querySelectorAll(".flap")].entries()) {
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

// ---------------------------------------------------------------------------
// Sizing the split-flap boards
//
// A board is laid out at full size (a flap is 210px wide, 280px tall) and then
// scaled down with a CSS transform. The scale used to be a hard-coded constant
// tuned for a 500px-wide desktop board, so on a phone — where there may only be
// ~260px to play with — the wider book titles ran off the edge of the screen.
// Instead we measure what the board's frame actually offers and scale to that,
// re-fitting whenever the viewport changes.
// ---------------------------------------------------------------------------
const FLAP_UNIT = 210;          // laid-out width of one flap, including margins
const BOARD_INSET = 10;         // breathing room either side of the board
const BOARD_INSET_Y = 6;        // ...and above/below it
const NUMBER_MAX_SCALE = 0.45;  // never grow past the original desktop sizes
const BOOK_MAX_SCALE = 0.3;
const BOOK_MAX_ROWS = 3;
const MIN_FLAP_DISPLAY = 30;    // px on screen; below this a title starts to
                                // read as a smudge, so wrap it instead

// How much horizontal room a board's frame gives us, in CSS pixels.
function boardAvailableWidth(box) {
  if (!box) return 320;
  return Math.max(140, box.clientWidth - BOARD_INSET * 2);
}

// Scale a board to fit inside its frame.
function fitBoard(container, maxScale) {
  if (!container) return;
  const box = container.parentElement;
  if (!box) return;

  // offsetWidth/Height report the laid-out size and ignore the transform, so
  // these stay stable no matter what scale is currently applied.
  const naturalWidth = container.offsetWidth || 1;
  const naturalHeight = container.offsetHeight || 1;
  const scale = Math.min(maxScale, boardAvailableWidth(box) / naturalWidth);

  container.style.transform = `scale(${scale})`;
  // The frame's height is the stylesheet's business — the two frames are meant
  // to match. Only step in when a board would otherwise be cropped, which a
  // title wrapped onto three rows can manage on a very short screen.
  box.style.minHeight = `${Math.round(naturalHeight * scale) + BOARD_INSET_Y * 2}px`;
}

function fitNumberBoard() {
  fitBoard(document.querySelector(".split-flap-wrapper"), NUMBER_MAX_SCALE);
}

function fitBookBoard() {
  fitBoard(document.querySelector(".split-flap-wrapper-book"), BOOK_MAX_SCALE);
}

// Reduce a title to characters the board can actually flip to. A flap asked
// for a symbol that isn't in the alphabet never finds it and spins forever, so
// accents are folded onto their base letter ("Café" -> "Cafe") and anything
// still unknown becomes a space.
function sanitizeTitle(title) {
  const folded = String(title).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return [...folded]
    .map((ch) => (bookAlphabet.includes(ch) ? ch : " "))
    .join("")
    .trim() || "Book";
}

function chunkWord(word, size) {
  const parts = [];
  for (let i = 0; i < word.length; i += size) {
    parts.push(word.slice(i, i + size));
  }
  return parts;
}

// Greedy word wrap. A word that is merely longer than the budget keeps its own
// row — hyphenating "Architecture" across two rows of flaps looks like a fault,
// not a design. Only a word more than twice the budget gets broken up.
function wrapTitle(title, perRow) {
  const rows = [];
  let current = "";

  title
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word) => {
      const parts = word.length > perRow * 2 ? chunkWord(word, perRow) : [word];
      parts.forEach((part) => {
        if (!current) {
          current = part;
        } else if (current.length + 1 + part.length <= perRow) {
          current += ` ${part}`;
        } else {
          rows.push(current);
          current = part;
        }
      });
    });

  if (current) rows.push(current);
  return rows.length ? rows : ["Book"];
}

// Split a title into the rows of flaps that best use the width on offer.
function bookRows(title) {
  const available = boardAvailableWidth(document.getElementById("book-box"));
  const perRow = Math.max(1, Math.floor(available / MIN_FLAP_DISPLAY));

  let rows = wrapTitle(title, perRow);
  if (rows.length > BOOK_MAX_ROWS) {
    // Too tall — pack it into BOOK_MAX_ROWS rows and accept smaller flaps.
    const dense = Math.ceil(title.length / BOOK_MAX_ROWS);
    rows = wrapTitle(title, Math.max(perRow, dense));
  }
  return rows;
}

function makeFlap() {
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
  return flap;
}

// Build the flaps for the given rows and return the flat list of characters
// they should land on (the space at a row break is dropped along with it).
function buildBookFlaps(rows) {
  const container = document.querySelector(".split-flap-wrapper-book");
  container.innerHTML = "";

  rows.forEach((text) => {
    const row = document.createElement("div");
    row.className = "book-flap-row";
    [...text].forEach(() => row.appendChild(makeFlap()));
    container.appendChild(row);
  });

  return [...rows.join("")];
}

// The title currently on the board, so a resize can re-wrap and redraw it.
let currentBookTitle = "Book";

// Function to build the book title display dynamically and animate it
function displayBookTitle() {
  currentBookTitle = sanitizeTitle(pickRandomBook());
  const target = buildBookFlaps(bookRows(currentBookTitle));
  fitBookBoard();

  // Animate the book title using the duplicate setup function.
  // (Using splitBookTitle() to ensure proper segmentation of the bookAlphabet.)
  setupBook(new Array(target.length).fill(" "), splitBookTitle(bookAlphabet), target);
}

// The flap faces hold their character in a span the stylesheet positions.
function setFlapFace(face, character) {
  const span = document.createElement("span");
  span.textContent = character;
  face.replaceChildren(span);
}

// Redraw the current title at a new width without replaying the animation.
function redrawBookTitle() {
  const target = buildBookFlaps(bookRows(currentBookTitle));
  document.querySelectorAll(".split-flap-wrapper-book .flap").forEach((flap, i) => {
    const character = target[i] || " ";
    setFlapFace(flap.querySelector(".top-flap-visible"), character);
    setFlapFace(flap.querySelector(".bottom-flap-visible"), character);
  });
  fitBookBoard();
}

// Re-fit both boards when the viewport changes — rotating a phone can more than
// double the width available, and a long title may then fit on fewer rows.
let boardResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(boardResizeTimer);
  boardResizeTimer = setTimeout(() => {
    fitNumberBoard();
    redrawBookTitle();
  }, 150);
});

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
  currentBookTitle = "Book";
  const target = buildBookFlaps(bookRows(currentBookTitle));
  fitBookBoard();

  // Animate the flaps to display "Book"
  setupBook(
    new Array(target.length).fill(" "),
    splitBookTitle(bookAlphabet),
    target
  );
}

// ---------------------------------------------------------------------------
// Round scoring
// Exactly one point is up for grabs each round. It stays movable — between
// players or back off the board entirely — until the next spin locks it in.
// ---------------------------------------------------------------------------
let roundActive = false;      // a spin has happened, so a point is in play
let roundWinner = null;       // player currently holding this round's point
let spinWarningArmed = false; // true once we've warned about spinning unscored

// Assigned by the score manager once the DOM is ready.
let renderScoreRow = () => {};
let clearRoundPoint = () => {};
let closeScoreEditor = () => {};

function setScoreMessage(text, tone) {
  const message = document.getElementById('score-message');
  if (!message) return;
  message.textContent = text || '';
  message.className = text ? `score-message active ${tone || 'info'}` : 'score-message';
}

// Draw attention to the score row when a spin is blocked by the warning.
function flashScoreRow() {
  const row = document.getElementById('player-score-row');
  if (!row) return;
  row.classList.remove('needs-score');
  void row.offsetWidth;
  row.classList.add('needs-score');
}

// The single entry point for spinning, shared by the centre icon and the
// "Click to Play" button.
function requestSpin() {
  // Spinning throws the round's point away, so warn before it happens.
  if (roundActive && roundWinner === null && !spinWarningArmed) {
    spinWarningArmed = true;
    setScoreMessage(
      "Hold on — nobody won this round yet. Click a player to award the point, or spin again to move on without scoring.",
      'warning'
    );
    flashScoreRow();
    return;
  }

  spinWarningArmed = false;
  closeScoreEditor();
  clearRoundPoint(); // last round's point (if any) is now locked in
  roundActive = true;

  updateBarRaiser();
  numbersGo();
  setTimeout(displayBookTitle, 100);

  setScoreMessage(
    "Click the winner to award this round's point. You can move it until the next spin.",
    'info'
  );
}

// Listen for clicks on the center logo to trigger the game turn
document.addEventListener("DOMContentLoaded", function() {
  // Initialize game state indicators
  setTimeout(() => updateGameStateIndicators('clean-slate'), 500);

  // Both the centre icon and the button below it spin the machine.
  const spinTargets = [
    document.querySelector('.osmo-icon-svg'),
    document.getElementById('spin-btn')
  ];

  spinTargets.forEach(target => {
    if (!target) return;
    target.style.cursor = 'pointer';
    target.addEventListener("click", function(e) {
      requestSpin();
      // Prevent event from bubbling up
      e.stopPropagation();
    });
  });
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

// Function to update player highlights based on bar-raiser status.
// Rebuilding the row keeps the crown, the round-winner badge and the score
// controls in sync with whoever is currently the Bar-raiser.
function updatePlayerHighlights() {
  renderScoreRow();
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
  // True while the manual +/- editor is open
  let editing = false;

  // Get DOM elements
  const playerScoreRow = document.getElementById('player-score-row');
  const playersList = document.getElementById('players-list');
  const resetGameButton = document.getElementById('reset-game');
  const resetScoresButton = document.getElementById('reset-scores');
  const editScoresButton = document.getElementById('edit-scores-btn');
  const clearScoresButton = document.getElementById('clear-scores-btn');
  // The clear button sits next to the +/- controls, so it asks twice.
  let clearArmed = false;

  // Function to update player score display
  function updatePlayerScoreRow() {
    // Clear current display
    playerScoreRow.innerHTML = '';
    Object.keys(scoreElements).forEach(key => delete scoreElements[key]);

    // Get checked players
    const checkedPlayers = getEnabledPlayers();

    // Initialize scores for new players
    checkedPlayers.forEach(playerName => {
      if (!(playerName in playerScores)) {
        playerScores[playerName] = 0;
      }
    });

    // The round's point can't sit on a player who has left the game.
    if (roundWinner && !checkedPlayers.includes(roundWinner)) {
      roundWinner = null;
    }

    playerScoreRow.classList.toggle('editing', editing);

    // Create score items for each player
    checkedPlayers.forEach(playerName => {
      const scoreItem = document.createElement('div');
      scoreItem.className = 'player-score-item';

      // Check if this player is the bar-raiser
      if (playerName === currentBarRaiser) {
        scoreItem.classList.add('bar-raiser');
      }

      // …and whether they're holding this round's point
      if (playerName === roundWinner) {
        scoreItem.classList.add('round-winner');
      }

      const nameEl = document.createElement('div');
      nameEl.className = 'player-name';
      nameEl.textContent = playerName;

      const pointsEl = document.createElement('div');
      pointsEl.className = 'player-points';
      pointsEl.textContent = playerScores[playerName];
      scoreElements[playerName] = pointsEl;

      if (editing) {
        // Manual correction mode: nudge any total up or down.
        scoreItem.append(
          makeAdjustButton('−', `Remove a point from ${playerName}`, () => adjustScore(playerName, -1)),
          nameEl,
          pointsEl,
          makeAdjustButton('+', `Add a point to ${playerName}`, () => adjustScore(playerName, 1))
        );
      } else {
        scoreItem.append(nameEl, pointsEl);
        scoreItem.addEventListener('click', () => toggleRoundPoint(playerName));
      }

      playerScoreRow.appendChild(scoreItem);
    });
  }

  function makeAdjustButton(label, description, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'score-adjust';
    button.textContent = label;
    button.title = description;
    button.setAttribute('aria-label', description);
    button.addEventListener('click', event => {
      event.stopPropagation();
      onClick();
    });
    return button;
  }

  function addPoints(playerName, delta) {
    playerScores[playerName] = Math.max(0, (playerScores[playerName] || 0) + delta);
  }

  // Manual edits stand on their own — they don't disturb who holds the
  // round's point, so it can still be moved once the editor is closed.
  function adjustScore(playerName, delta) {
    setClearArmed(false);
    addPoints(playerName, delta);
    updatePlayerScoreRow();
    updatePlayersList();
    pulseScore(playerName);
    refreshScoreStatus();
  }

  // Award, move, or take back the single point available this round.
  function toggleRoundPoint(playerName) {
    if (playerName === currentBarRaiser) {
      setScoreMessage(`${playerName} is the Bar-raiser this round and can't take the point.`, 'warning');
      return;
    }

    if (!roundActive) {
      setScoreMessage('Spin first — click the machine to start a round.', 'warning');
      return;
    }

    if (roundWinner === playerName) {
      // Clicking the current winner takes the point back off the board.
      addPoints(playerName, -1);
      roundWinner = null;
      setScoreMessage('Point taken back — pick a winner before the next spin.', 'warning');
    } else {
      if (roundWinner) {
        addPoints(roundWinner, -1);
      }
      addPoints(playerName, 1);
      roundWinner = playerName;
      spinWarningArmed = false;
      setScoreMessage(
        `${playerName} takes this round. You can still move the point until the next spin.`,
        'success'
      );
    }

    updatePlayerScoreRow();
    updatePlayersList();
    pulseScore(playerName);
    refreshScoreStatus();
  }

  // Little bounce on the score bubble that just changed.
  function pulseScore(playerName) {
    const scoreElement = scoreElements[playerName];
    if (!scoreElement) return;
    scoreElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
      scoreElement.style.transform = 'scale(1)';
    }, 200);
  }

  function refreshScoreStatus() {
    const anyPoints = Object.values(playerScores).some(score => score > 0);
    updateGameStateIndicators(anyPoints ? 'scores-active' : 'scores-reset');
  }

  // Wipe the whole scoreboard. The round carries on — it just has no point
  // on it any more.
  function clearAllScores() {
    Object.keys(playerScores).forEach(playerName => {
      playerScores[playerName] = 0;
    });
    roundWinner = null;
    spinWarningArmed = false;
    updatePlayerScoreRow();
    updatePlayersList();
    updateGameStateIndicators('scores-reset');
  }

  function setClearArmed(next) {
    clearArmed = next;
    clearScoresButton.classList.toggle('armed', clearArmed);
    clearScoresButton.title = clearArmed ? 'Click again to clear all scores' : 'Clear all scores';
    clearScoresButton.setAttribute('aria-label', clearScoresButton.title);
  }

  function setEditing(next) {
    editing = next;
    editScoresButton.classList.toggle('active', editing);
    editScoresButton.setAttribute('aria-pressed', String(editing));
    editScoresButton.title = editing ? 'Lock in scores' : 'Edit scores';
    editScoresButton.setAttribute('aria-label', editScoresButton.title);
    clearScoresButton.hidden = !editing;
    setClearArmed(false);
    updatePlayerScoreRow();
    setScoreMessage(
      editing
        ? 'Editing scores — use − and + to fix any totals, then press the pencil again to lock them in.'
        : 'Scores locked in.',
      editing ? 'info' : 'success'
    );
  }

  editScoresButton.addEventListener('click', () => setEditing(!editing));

  clearScoresButton.addEventListener('click', () => {
    if (!clearArmed) {
      setClearArmed(true);
      setScoreMessage('Clear every score? Click the circle again to confirm.', 'warning');
      return;
    }
    setClearArmed(false);
    clearAllScores();
    setScoreMessage('All scores cleared.', 'info');
  });

  // Hooks the spin controller uses to settle the board before a new round.
  renderScoreRow = updatePlayerScoreRow;
  closeScoreEditor = () => {
    if (editing) setEditing(false);
  };
  clearRoundPoint = () => {
    roundWinner = null;
    updatePlayerScoreRow();
  };

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
    if (roundWinner === from) {
      roundWinner = to;
    }
  });


  // Reset scores button — the scoreboard only; the rotation carries on
  resetScoresButton.addEventListener('click', () => {
    clearAllScores();
    setScoreMessage('Scores cleared.', 'info');
  });

  // Reset game button — the scoreboard plus the round itself
  resetGameButton.addEventListener('click', () => {
    if (editing) setEditing(false);
    clearAllScores();

    // Reset bar-raiser selection
    currentIndex = -1;
    currentBarRaiser = '';

    // No round in play, so nothing is waiting to be scored
    roundActive = false;

    // Update displays
    updatePlayerScoreRow();
    updatePlayersList();

    // Reset all game indicators to clean slate
    updateGameStateIndicators('clean-slate');
    setScoreMessage('', 'info');
  });
  
  // Initial call to updatePlayerHighlights to set up correct styling
  if (typeof updatePlayerHighlights === 'function') {
    setTimeout(updatePlayerHighlights, 500);
  }
  
  // Initial rendering
  updatePlayerScoreRow();
  updatePlayersList();
});