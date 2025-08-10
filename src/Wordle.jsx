import {useEffect, useState} from "react";
import './wordle.css'

const wordleApi = 'https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt'

// Game Setting
const LINE_LENGTH = 6; // This will create how many line of tried that user guess
const TILE_LENGTH = 5; // This will be determined how many tile in that line

function Wordle() {
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState(Array(LINE_LENGTH).fill(null))
    const [currentGuess, setCurrentGuess] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const handleType = (event) => {
            // handle game state
            if (isGameOver) {
                return;
            }

            // handle submit
            if (event.key === 'Enter') {
                if (currentGuess.length !== TILE_LENGTH) {
                    return;
                }
                const newGuesses = [...guesses];
                console.log(newGuesses)
                newGuesses[guesses.findIndex(val => val == null)] = currentGuess;
                setGuesses(newGuesses);
                setCurrentGuess('');

                const isCorrect = solution === currentGuess;
                if (isCorrect) {
                    setIsGameOver(true)
                }
            }

            // handle backspace
            if (event.key === 'Backspace') {
                setCurrentGuess(currentGuess.slice(0, -1));
                return;
            }

            // handle limit
            if (currentGuess.length >= TILE_LENGTH) {
                return;
            }

            setCurrentGuess(oldGuess => oldGuess + event.key)
        };

        window.addEventListener('keydown', handleType)

        return () => window.removeEventListener('keydown', handleType)

    }, [currentGuess, guesses, isGameOver, solution]);

    useEffect(() => {
        const randomWord = async () => {
            const listWord = await fetch(wordleApi)
            const wordArray = (await listWord.text()).split("\n")
            const chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)]
            setSolution(chosenWord)
        }

        randomWord();
    }, []);

    return (
        <div className="container">
            <div>
                <p>Solution: {solution}</p>
                <p>Press: {currentGuess}</p>
            </div>

            <div className="board">
                {guesses.map((guess, index) => {
                    /*
                    * Check if this row is the "current guess" row:
                    *
                    * - This essentially find the first null value
                    * in the null array using findIndex() method
                    *
                    * - If the current index matches that position,
                    * this is where the player is typing
                    * */
                    const isCurrentGuess = index === guesses.findIndex(val => val == null);

                    return (
                        <Line key={index}
                              guess={isCurrentGuess ? currentGuess : guess ?? ''}
                              isFinal={!isCurrentGuess && guess != null}
                              solution={solution}
                        />
                    )
                })}
            </div>
        </div>
    )
}

function Line({guess, isFinal, solution}) {
    const tiles = [];

    for (let i = 0; i < TILE_LENGTH; i++) {
        const char = guess[i];
        let className = 'tile';

        if(isFinal) {
            if (char === solution[i]) {
                className += ' correct'
            } else if (solution.includes(char)) {
                className += ' close'
            } else {
                className += ' incorrect'
            }
        }

        tiles.push(
            <div key={i} className={className}>
                {char}
            </div>
        )
    }

    return (
        <div className="line">
            {tiles}
        </div>
    )
}

export default Wordle
