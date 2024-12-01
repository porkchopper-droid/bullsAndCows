"use strict";

const readlineSync = require("readline-sync");

// introducing new technical variables
let hardcoreMode = false;
let userName = "stranger";
let gameExited = false;
let bulls = 0;
let userTries = 0;
let maxAttempts = Infinity;
let secretNumberGuess = "";
let digitsOfSecretNumber = 0;
let secretNumberArr = [];

// motivational messages picker function
function pickMotivationalMessage(bulls, cows) {
  const motivationalMessages = [
    `You've got ${bulls} bulls and ${cows} cows. Keep pushing!`,
    `${bulls} bulls are in the ring, but ${cows} are still running. Are you even trying?`,
    `You've got ${bulls} bulls and ${cows} cows... Is that all you've got? Try harder!`,
    `${bulls} bulls and ${cows} cows. Are we aiming for victory or just grazing around?`,
    `${bulls} bulls locked in, ${cows} wandering. Are you playing or just guessing blindly?`,
  ];
  const randomNum = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomNum];
}

// asking for username
function askUserName() {
  userName = readlineSync.question("May I have your name? ");
  if (userName === "") {
    userName = "stranger";
    console.log(`Hello, ${userName}`);
  } else {
    console.log(`Greetings ${userName}!`);
  }
}

// setting difficulty level
function askDifficultyLevel() {
  if (readlineSync.keyInYN(`Are you interested in hardcore mode? `)) {
    console.log(`Welcome to my dungeon, mortal!..`);

    // setting the number of tries
    maxAttempts = readlineSync.questionInt(
      "How many breaths do you want to take? "
    );
    digitsOfSecretNumber = 4;
    hardcoreMode = true;
  } else {
    console.log(`ATTENTION! ${userName} is a chicken!`);
    digitsOfSecretNumber = 3;
  }
}

function generateSecretNumberArr() {
  // generating an array with 10 elements (numbers 0-9)
  const digits = [...Array(10).keys()];

  // shuffling them with sort mechanism and Math.random()
  const randomDigitsArr = digits.sort(() => Math.random() - 0.5);

  // slicing the first 4 digits of an array to receive a secret number + map() to make strings
  secretNumberArr = randomDigitsArr.slice(0, digitsOfSecretNumber).map(String);

  console.log(secretNumberArr); // THE ANSWER
}

function playGame() {
  do {
    // number of tries for the user
    userTries++;

    // hardcore vs regular mode
    if (hardcoreMode === false) {
      secretNumberGuess = readlineSync.question(
        `Go ahead, ${userName}, try to guess a number I have in mind: `
      );
    } else {
      secretNumberGuess = readlineSync.question(
        `The number is ${digitsOfSecretNumber} digits long, but don't think too hard, mortal. It won't help you...`
      );
    }

    // exiting on pressing "enter" and its hardcore mode spin
    if (
      secretNumberGuess === "" &&
      userTries < maxAttempts &&
      hardcoreMode === true
    ) {
      console.log(
        `You ain't going nowhere! You have ${
          maxAttempts - userTries
        } more breaths...`
      );
    } else if (secretNumberGuess === "") {
      gameExited = true;
      break;
    }

    // numbers/STRING has to be N digits long
    if (
      secretNumberGuess.length !== digitsOfSecretNumber &&
      hardcoreMode === false
    ) {
      console.log(`The number has to be ${digitsOfSecretNumber} digits long`);
      continue;
    } else if (
      secretNumberGuess.length !== digitsOfSecretNumber &&
      hardcoreMode === true &&
      secretNumberGuess !== ""
    ) {
      console.log(`Mmmmm... You're crazy!.. I like that!`);
    }

    // making an array out of user's input
    const secretNumberGuessArr = [...secretNumberGuess];

    // looking for direct hits "BULLS" true/false
    const comparisons = secretNumberArr.map(
      (value, index) => value === secretNumberGuessArr[index]
    );

    // calculating the number of bulls
    bulls = comparisons.reduce((count, result) => {
      return count + (result === true ? 1 : 0);
    }, 0);

    // looking for global hits "BULLS" and "COWS" together
    const bullsAndCowsArr = secretNumberArr.filter((value) =>
      secretNumberGuessArr.includes(value)
    );
    const bullsAndCows = bullsAndCowsArr.reduce((acc, el) => acc + 1, 0);

    // calculating number of cows
    const cows = bullsAndCows - bulls;

    // printing stats for references
    if (bulls < digitsOfSecretNumber && hardcoreMode === false) {
      console.log(pickMotivationalMessage(bulls, cows));
    }
  } while (bulls !== digitsOfSecretNumber && userTries < maxAttempts);
}

function exitGame() {
  // condition for exiting the game
  if (userTries === maxAttempts) {
    console.log(`Now, your soul belongs to me... hahahahahahaha`);
  } else if (gameExited) {
    console.log(`Better luck next time!`);
  } else {
    console.log(`Congratulations, you've guessed it correctly!`);

    if (readlineSync.keyInYN(`Do you want another round, champ? `)) {
      generateSecretNumberArr();
      playGame();
      exitGame();
    } else {
      console.log(`Bye......`);
    }
  }
}

askUserName();

askDifficultyLevel();

generateSecretNumberArr();

playGame();

exitGame();

// the main purpose of classes:
// one puts in a state only things that matter in their particualr program
// FIELDS: username and gamemode << game session
// ACTIONS (functions): actionts that change the state of the obj
