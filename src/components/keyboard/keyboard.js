import React from "react";
import "./style.css"; // Import CSS file


function Keyboard({ guessedLetters, onLetterClick, keys }) {
  const qwertyLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];
  console.log("KEYS", keys)

  const handleClick = (letter) => {
    onLetterClick(letter);
  };

  const getKeyColor = (letter) => {
    const key = keys.find((key) => key.letter.toLowerCase() === letter);
    return key ? key.color : "#dce0e6"; // Default grey color if key not found
  };

  return (
    <div className="container-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      {qwertyLayout.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((letter, index) => (
            <button
              className="keys"
              key={index}
              onClick={() => handleClick(letter)}
              disabled={guessedLetters.includes(letter)}
              style={{
                margin: "5px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: guessedLetters.includes(letter) ? "#000" : getKeyColor(letter),
                color: guessedLetters.includes(letter) ? "#fff" : "#000",
                cursor: guessedLetters.includes(letter) ? "default" : "pointer",
              }}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
