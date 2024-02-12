import React, { useState, useEffect } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import { gsap } from "gsap";
import "./game.css"; // Import CSS file
import Keyboard from "./keyboard/keyboard";
import title from "../title.png"; // Assuming you have an image file named keyboard_image.png in the same directory as this component
import guessimg from "../guess.png"
import gameover from "../game-over.png"

const customWords = [
  "SGBOI",
  "ANSHI",
  "LOVES",
  "CARES",
  "LOLLA",
  "SMILE",
  "CUTIE",
  "NASIK",
];

// Define custom colors
const customColors = {
  correct: "#6BAA64", // Green
  partial: "#C9B559", // Yellow
  incorrect: "#9E9E9E" // Grey
};

function Game() {
  const [guess, setGuess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [feedback, setFeedback] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false)


  useEffect(() => {
    setTargetWord(customWords[Math.floor(Math.random() * customWords.length)]);
  }, []);

  useEffect(() => {
    animateTiles();
  }, [attempts, guessedLetters]);

// Check if a letter exists in the guessedLetters array
  
  // Modify the checkGuess function to handle guessed letters appropriately
  const checkGuess = () => {
    if (guess.length !== 5) {
      setFeedback("Please enter a 5-letter word.");
      return;
    }
  
    let newTiles = [];
    let correctCount = 0;
    const guessLower = guess.toLowerCase(); // Convert guessed word to lowercase
    var targetWordLower = targetWord.toLowerCase(); // Convert target word to lowercase
    targetWordLower = "lolla"
  
    let charCount = {};
 
    for (let i = 0; i < targetWordLower.length; i++) {
        let character = targetWordLower[i];
        charCount[character] = (charCount[character] || 0) + 1;
    }
    const charCountRes = charCount
    console.log(charCount, "CASE")
    for (let i = 0; i < 5; i++) {
        console.log("GUESS", guessLower[i], "TARGET", targetWordLower[i], "INC", targetWordLower.includes(guessLower[i]), "SEC", charCount[guessLower[i]], charCount[guessLower[i]]>0 )
      if (guessLower[i] === targetWordLower[i] && charCount[guessLower[i]] > 0) {
        newTiles.push({ color: customColors.correct, letter: guess[i] });
        correctCount++;
        console.log(charCount, "BEFORE GREEN")
        charCount[guessLower[i]] = charCount[guessLower[i]] - 1
        console.log(charCount, "AFTER GREEN")
      } else if (targetWordLower.includes(guessLower[i]) && charCount[guessLower[i]] > 0) {
        newTiles.push({ color: customColors.partial, letter: guess[i] });
        console.log(charCount, "BEFORE YELLOW")
        charCount[guessLower[i]] = charCount[guessLower[i]] - 1
        console.log(charCount, "AFTER YELLOW")
      } else {
        newTiles.push({ color: customColors.incorrect, letter: guess[i] });
      }
    }
  
    const newAttempt = { guess: guess, tiles: newTiles, charCount: charCountRes };
    const updatedAttempts = [...attempts, newAttempt];
  
    let updatedGuessedLetters = [...guessedLetters];
  
    for (let i = 0; i < 5; i++) {
      const existingIndex = updatedGuessedLetters.findIndex(
        (letter) => letter.letter === guess[i]
      );
      if (existingIndex !== -1) {
        // If the letter already exists, retain its color
        updatedGuessedLetters[existingIndex] = {
          ...updatedGuessedLetters[existingIndex],
          color: newTiles[i].color,
        };
      } else {
        updatedGuessedLetters.push({
          letter: guess[i],
          color: newTiles[i].color,
        });
      }
    }
  
    if (correctCount === 5) {
      setFeedback("Congratulations! You guessed the word!");
      setGuess("");
    } else {
      setAttemptsLeft(attemptsLeft - 1);
      setFeedback("Incorrect guess. Try again.");
      if (attemptsLeft === 1) {
        setFeedback(`Out of attempts! The word was ${targetWord}`);
        setGuess("");
        setGameOver(true)
      }
    }
    setAttempts(updatedAttempts);
    setGuessedLetters(updatedGuessedLetters);
    animateTiles();
  };
  
  const animateTiles = () => {
    gsap.fromTo(
      ".tile",
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }
    );
  };

  return (
    <Grid className="paper-container" container direction="column" alignItems="center" spacing={2}>
      <Grid item>
      <img src={title} alt="Keyboard" className="image"/>
      </Grid>
      <Grid item>
        <p className="attempts">Attempts Left: {attemptsLeft}</p>
      </Grid>
      <Grid  item>
        <TextField
          className="input"
          type="text"
          maxLength="5"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())} // Convert input to uppercase
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              checkGuess();
            }
          }}
          />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={checkGuess}>
          Guess
        </Button>
      </Grid>
      <Grid item>{
     gameOver && (
        <img src={gameover} className="thumbs-img"/>
    )}
      </Grid>
      <Grid item>
      {feedback !== "Congratulations! You guessed the word!" && (
               <p className="attempts">{feedback}</p>
    )}
        {feedback === "Congratulations! You guessed the word!" && (
        <img src={guessimg} className="thumbs-img"/>

    )}
      </Grid>
      {attempts.map((attempt, index) => (
        <Grid className="tile-container" item key={index}>
          <div  style={{ display: "flex" }}>
            {attempt.tiles.map((tile, i) => (
              <div
                className="tile"
                key={i}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: tile.color,
                  margin: "5px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "1.2rem"
                }}
              >
                {tile.letter}
              </div>
            ))}
          </div>
        </Grid>
      ))}
    <Keyboard  guessedLetters="" onLetterClick="" keys= {guessedLetters} />
    </Grid>
  );
}

export default Game;
