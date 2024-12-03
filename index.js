"use strict";

const readlineSync = require("readline-sync");

class Game {
  constructor() {
    // State (variables)
    this.hardcoreMode = false;
    this.userName = "stranger";
    this.gameExited = false;
    this.bulls = 0;
    this.cows = 0;
    this.userTries = 0;
    this.maxAttempts = Infinity;
    this.secretNumberGuess = "";
    this.digitsOfSecretNumber = 0;
    this.secretNumberArr = [];
    this.avgGuess = 0;
    this.gameStats = {
      user: "",
      difficulty: "",
      gamesPlayed: 0,
      tries: [],
    };
  }

  // asking for username
  askUserName() {
    this.userName = readlineSync.question("May I have your name? ");
    if (this.userName === "") {
      this.userName = "stranger";
      console.log(`Hello, ${this.userName}`);
    } else {
      console.log(`Greetings ${this.userName}!`);
    }
    this.gameStats.user = `${this.userName}`;
  }

  // setting difficulty level
  askDifficultyLevel() {
    if (readlineSync.keyInYN(`Are you interested in hardcore mode? `)) {
      console.log(`Welcome to my dungeon, mortal!..`);

      // setting the number of tries
      this.maxAttempts = readlineSync.questionInt(
        "How many breaths do you want to take? "
      );
      this.digitsOfSecretNumber = 4;
      this.hardcoreMode = true;
    } else {
      console.log(`ATTENTION! ${this.userName} is a chicken!`);
      this.digitsOfSecretNumber = 3;
    }
    this.gameStats.difficulty = this.hardcoreMode ? "Hardcore" : "Normal";
  }

  generateSecretNumberArr() {
    // generating an array with 10 elements (numbers 0-9)
    const digits = [...Array(10).keys()];

    // shuffling them with sort mechanism and Math.random()
    const randomDigitsArr = digits.sort(() => Math.random() - 0.5);

    // slicing the first 4 digits of an array to receive a secret number + map() to make strings
    this.secretNumberArr = randomDigitsArr
      .slice(0, this.digitsOfSecretNumber)
      .map(String);

    console.log(this.secretNumberArr); // THE ANSWER
  }

  // motivational messages picker function
  pickMotivationalMessage(bulls, cows) {
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

  // motivational messages picker for HARDCORE mode
  pickEdgyMessagesHardcoreMode(bulls, cows) {
    const edgyMessages = [
      `I expected better, mortal! ${bulls} bulls and ${cows} cows won't save you from doom!`,
      `${bulls} bulls... ${cows} cows... Are you even trying, or do you want me to roast you alive?`,
      `Pathetic! ${bulls} bulls and ${cows} cows? I'll give you one more chance before I lose interest.`,
      `You call that an attempt? ${bulls} bulls and ${cows} cows. Try harder, or prepare to be crushed!`,
      `HAHAHA! ${bulls} bulls and ${cows} cows! I almost feel sorry for you. Almost.`,
    ];
    const randomNum = Math.floor(Math.random() * edgyMessages.length);
    return edgyMessages[randomNum];
  }

  // core game function
  playGame() {
    this.gameStats.gamesPlayed++;
    do {
      // number of tries for the user
      this.userTries++;

      // hardcore vs regular mode
      if (!this.hardcoreMode) {
        this.secretNumberGuess = readlineSync.question(
          `Go ahead, ${this.userName}, try to guess a number I have in mind: `
        );
      } else if (this.hardcoreMode && this.userTries === 1) {
        this.secretNumberGuess = readlineSync.question(
          `The number is ${this.digitsOfSecretNumber} digits long, but don't think too hard, mortal. It won't help you...`
        );
      } else {
        console.log(
          (this.secretNumberGuess = readlineSync.question(
            `Attempt #${this.userTries}... `
          ))
        );
      }

      // exiting on pressing "enter" and its hardcore mode spin
      if (
        this.secretNumberGuess === "" &&
        this.userTries < this.maxAttempts &&
        this.hardcoreMode
      ) {
        console.log(
          `You ain't going nowhere! You have ${
            this.maxAttempts - this.userTries
          } more breaths...`
        );
      } else if (this.secretNumberGuess === "") {
        this.gameExited = true;
        break;
      }

      // numbers/STRING has to be N digits long
      if (!this.hardcoreMode && isNaN(this.secretNumberGuess)) {
        console.log(`Enter a ${this.digitsOfSecretNumber}-digit number`);
        continue;
      } else if (
        this.secretNumberGuess.length !== this.digitsOfSecretNumber &&
        !this.hardcoreMode
      ) {
        console.log(
          `The number has to be ${this.digitsOfSecretNumber} digits long`
        );
        continue;
      } else if (
        this.secretNumberGuess.length !== this.digitsOfSecretNumber &&
        this.hardcoreMode === true &&
        this.secretNumberGuess !== ""
      ) {
        console.log(`Mmmmm... You're crazy!.. I like that!`);
      }

      // making an array out of user's input
      const secretNumberGuessArr = [...this.secretNumberGuess];

      // looking for direct hits "BULLS" true/false
      const comparisons = this.secretNumberArr.map(
        (value, index) => value === secretNumberGuessArr[index]
      );

      // calculating the number of bulls
      this.bulls = comparisons.reduce((count, result) => {
        return count + (result === true ? 1 : 0);
      }, 0);

      // looking for global hits "BULLS" and "COWS" together
      const bullsAndCowsArr = this.secretNumberArr.filter((value) =>
        secretNumberGuessArr.includes(value)
      );
      const bullsAndCows = bullsAndCowsArr.reduce((acc, el) => acc + 1, 0);

      // calculating number of cows
      this.cows = bullsAndCows - this.bulls;

      // providing feedback to the player
      if (this.bulls < this.digitsOfSecretNumber && !this.hardcoreMode) {
        console.log(this.pickMotivationalMessage(this.bulls, this.cows));
      } else if (
        this.bulls < this.digitsOfSecretNumber &&
        this.hardcoreMode &&
        this.secretNumberGuess !== ""
      ) {
        console.log(this.pickEdgyMessagesHardcoreMode(this.bulls, this.cows));
      }
    } while (
      this.bulls !== this.digitsOfSecretNumber &&
      this.userTries < this.maxAttempts
    );
    this.gameStats.tries.push(this.userTries);
  }

  resetGame() {
    this.bulls = 0;
    this.cows = 0;
    this.userTries = 0;
    this.gameExited = false;
    this.secretNumberGuess = "";
    this.secretNumberArr = [];
  }

  exitGame() {
    // condition for exiting the game
    if (
      this.userTries === this.maxAttempts &&
      this.bulls < 4 &&
      this.hardcoreMode
    ) {
      console.log(`Now, your soul belongs to me... hahahahahahaha`);
    } else if (this.gameExited) {
      console.log(`Better luck next time!`);
    } else {
      console.log(
        `Congratulations, ${this.userName}! You've guessed it correctly!`
      );

      // ask the user if they want to play again
      if (readlineSync.keyInYN(`Do you want another round, champ? `)) {
        this.resetGame();
        this.generateSecretNumberArr();
        this.playGame();
        this.exitGame();
      } else {
        console.log(`Bye......`);
      }
    }
  }
  printStats() {
    console.log(`\nName of the player: ${this.gameStats.user}
    \nDifficulty level: ${this.gameStats.difficulty}
    \nNumber of games played: ${this.gameStats.gamesPlayed}
    \nAverage number of tries per correct guess: ${(this.avgGuess =
      this.gameStats.tries.reduce((acc, el) => acc + el, 0) /
      this.gameStats.tries.length)}`);
  }
}

const game = new Game();

game.askUserName();

game.askDifficultyLevel();

game.generateSecretNumberArr();

game.playGame();

game.exitGame();

game.printStats();
