import {useEffect, useState} from "react";
import './wordle.css'

/*
    - React Coding Interview Ft. Clément Mihailescu(https://www.youtube.com/watch?v=5xf4_Kx7azg)
 */

const wordleApi = 'https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt'

// Game Setting
const LINE_LENGTH = 6; // This will create how many line of tried that user guess
const WORD_LENGTH = 5; // This will be determined how many word in that line

function Wordle() {
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState(Array(LINE_LENGTH).fill(null))
    const [currentGuess, setCurrentGuess] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);

    function restartGame() {
        setCurrentGuess('')
        setGuesses(Array(LINE_LENGTH).fill(null))
        setIsGameOver(false)
        randomWord()
    }

    // Fetch data
    const randomWord = async () => {
        const listWord = await fetch(wordleApi)
        const wordArray = (await listWord.text()).split("\n")
        const chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)]
        setSolution(chosenWord)
    }

    useEffect(() => {
        randomWord();
    }, []); // Run once

    // Game logic
    useEffect(() => {
        const handleType = (event) => {
            // handle game state
            if (event.key === 'Enter' && isGameOver) {
                restartGame()
                return;
            }

            // handle submit
            if (event.key === 'Enter') {
                // if word doesn't fill up
                if (currentGuess.length !== WORD_LENGTH) {
                    return;
                }

                const newGuesses = [...guesses];
                newGuesses[guesses.findIndex(val => val == null)] = currentGuess;
                setGuesses(newGuesses);
                setCurrentGuess('');
                console.log(newGuesses)

                // when is correct
                const isCorrect = solution === currentGuess;
                if (isCorrect) {
                    setIsGameOver(true)
                    return;
                }

                // when out of tries
                // console.log(newGuesses.every(value => value !== null) === true)
                if (newGuesses.every(value => value !== null)) {
                    setIsGameOver(true)
                }
            }

            // handle backspace
            if (event.key === 'Backspace') {
                setCurrentGuess(currentGuess.slice(0, -1));
                return;
            }

            // handle limit
            if (currentGuess.length >= WORD_LENGTH) {
                return;
            }

            // handle word input
            const isLetter = event.key.match(/^[a-z]$/)
            if (isLetter) {
                setCurrentGuess(oldGuess => oldGuess + event.key)
            }
        };

        window.addEventListener('keydown', handleType)

        return () => window.removeEventListener('keydown', handleType)

    }, [currentGuess, guesses, isGameOver, solution]); // Run everytime variable changed

    return (
        <div style={{
            display: `flex`,
            gap: `10px`,
            flexWrap: `wrap`,
            justifyContent: `center`,
            alignItem: `center`,
        }}
        >
            <div className="container">
                <h1 style={{textAlign: `center`}}>Wordle</h1>
                {
                    isGameOver &&
                    <>
                        <h3 style={{margin: `0 0`, display: `flex`, justifyContent: `center`}}>The word is {solution.toUpperCase()}</h3>
                        <button onClick={restartGame}>
                            Press enter to restart
                        </button>
                    </>
                }

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

            <div className="container">
                <h1 style={{textAlign: `center`}}>Guide</h1>
                <ul style={{paddingLeft: `24px`, marginTop: `0`}}>
                    <li>Enter any five-letter word and press "Enter" to submit</li>
                    <li>
                        After each guess, Wordle will indicate the accuracy of your letters using color-coded tiles:
                        <ul>
                            <li>Green: The letter is correct and in the right spot.</li>
                            <li>Yellow: The letter is in the word but in the wrong position.</li>
                            <li>Gray: The letter is not in the word.</li>
                        </ul>
                    </li>
                </ul>

                {/*<p>Solution: {solution}</p>*/}
                {/*<p>Press: {currentGuess}</p>*/}
                <div style={{display: `flex`, justifyContent: `center`}}>
                    <a href="https://github.com/DannyTheKO/react_wordle_project"
                       target="_blank"
                       className="creditButton"
                    >
                        Build by Danny &hearts;
                    </a>
                </div>
            </div>
        </div>
    )
}

function Line({guess, isFinal, solution}) {
    const tiles = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
        const char = guess[i];
        let className = 'tile';

        if (isFinal) {
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
