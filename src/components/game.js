import React, { useState, useEffect } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import { gsap } from "gsap";
import "./game.css"; // Import CSS file

const customWords = [
  "hello",
  "world",
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

  useEffect(() => {
    setTargetWord(customWords[Math.floor(Math.random() * customWords.length)]);
  }, []);

  useEffect(() => {
    if (guess.length === 5) {
      checkGuess();
    }
  }, [guess]);
  useEffect(() => {
    animateTiles();
  }, [attempts]);

  const checkGuess = () => {
    let newTiles = [];
    let correctCount = 0;
    for (let i = 0; i < 5; i++) {
      if (guess[i] === targetWord[i]) {
        newTiles.push({ color: customColors.correct, letter: guess[i] });
        correctCount++;
      } else if (targetWord.includes(guess[i])) {
        newTiles.push({ color: customColors.partial, letter: guess[i] });
      } else {
        newTiles.push({ color: customColors.incorrect, letter: guess[i] });
      }
    }

    const newAttempt = { guess: guess, tiles: newTiles };
    const updatedAttempts = [...attempts, newAttempt];

    if (correctCount === 5) {
      setFeedback("Congratulations! You guessed the word!");
      setGuess("");
    } else {
      setAttemptsLeft(attemptsLeft - 1);
      setFeedback("Incorrect guess. Try again.");
      if (attemptsLeft === 1) {
        setFeedback(`Out of attempts! The word was ${targetWord}`);
        setGuess("");
      }
    }

    setAttempts(updatedAttempts);
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
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <h1>Wordle Game</h1>
      </Grid>
      <Grid item>
        <p>Attempts Left: {attemptsLeft}</p>
      </Grid>
      <Grid item>
        <TextField
          type="text"
          maxLength="5"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={checkGuess}>
          Guess
        </Button>
      </Grid>
      <Grid item>
        <p>{feedback}</p>
      </Grid>
      {attempts.map((attempt, index) => (
        <Grid item key={index}>
          <div style={{ display: "flex" }}>
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
    </Grid>
  );
}

export default Game;
