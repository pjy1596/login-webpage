const wordDisplay = document.querySelector(".guess-letter-container");
const popUp = document.querySelector(".pop-up");
const btn = document.querySelector(".btn");
const popUpContainer = document.querySelector(".pop-up-container");
const correct = [" "];
const wrong = [];
const wordList = ["james"];
let pickedWord = wordList[Math.floor(Math.random() * wordList.length)];
const noti = document.querySelector(".notification-container");
const wrongContainer = document.querySelector(".wrong-letter-container");
const humans = document.querySelectorAll(".human");
const comment = document.querySelector(".comment");
async function name() {
  const res = await fetch(`https://randomuser.me/api`);
  const data = await res.json();
  console.log(data);
  const namae = `${data.results[0].name.first} ${data.results[0].name.last}`;
  wordList.push(namae.toLowerCase());
  pickedWord = wordList[Math.floor(Math.random() * wordList.length)];
  displayWord();
  wrongFunc();
  console.log(wordList);
}
name();
// function ui() {
//   const div = document.createElement("div");
//   document
//     .querySelector(".figure-container")
//     .insertBefore(div, document.querySelector(".guess-letter-container"));
//   div.innerHTML = `<h4>(${wordList})</h4>`;

//   div.addEventListener("keydown", (e) => {
//     wordList.push(e.key);
//   });
// }
// ui();
function displayWord() {
  const isGuessd = pickedWord
    .split("")
    .every((letter) => correct.includes(letter));
  wordDisplay.innerHTML = `
          ${pickedWord
            .split("")
            .map((letter) => {
              if (letter === " ") {
                return `<span class= 'space'>${letter}</span>`;
              } else {
                return `<span class="eachLetter">
                  ${correct.includes(letter) ? letter : ""}
                </span>`;
              }
            })
            .join("")}
          `;
  if (isGuessd) {
    comment.innerText = "You have won";
    popUpContainer.style.display = "flex";
  }
}

displayWord();

function showNotif() {
  noti.classList.add("show");
  setTimeout(() => noti.classList.remove("show"), 1000);
}
window.addEventListener("keydown", (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    if (pickedWord.split("").includes(e.key)) {
      if (correct.includes(e.key)) {
        showNotif();
      } else {
        correct.push(e.key);

        displayWord();
      }
    }
    if (!pickedWord.split("").includes(e.key)) {
      if (wrong.includes(e.key)) {
        showNotif();
      } else {
        wrong.push(e.key);
        wrongFunc();
      }
    }
  }
});
function wrongFunc() {
  if (wrong.length > 0) {
    wrongContainer.innerHTML = `<p>Wrong</p>
    <span>${wrong}</span>`;
    humans.forEach((human, index) => {
      if (index < wrong.length) {
        human.style.display = "block";
      }
      if (6 === wrong.length) {
        popUpContainer.style.display = "flex";
        comment.innerText = "You have lost";
      }
    });
  }
}
btn.addEventListener("click", () => {
  popUpContainer.style.display = "none";
  correct.splice(1);
  wrong.splice(0);
  pickedWord = wordList[Math.floor(Math.random() * wordList.length)];
  // 개 놀라움
  wrongContainer.innerHTML = "";
  humans.forEach((human) => (human.style.display = "none"));
  displayWord();
  wrongFunc();
  name();
});
