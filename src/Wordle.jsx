import {useEffect, useState} from "react";
import './wordle.css'

const wordleApi = 'https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt'

// Game Setting
// This will create how many line of tried that user guess
const LINE_LENGTH = 6;

// This will be determined how many word tile in 1 line
const TILE_LENGTH = 10;

function Wordle() {
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState(Array(LINE_LENGTH).fill("tests"))

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
        <>
            <div>
                Solution: {solution}
            </div>

            <div className="board">
                {guesses.map((guess, index) => {
                    return (
                        <Line key={index}
                              guess={guess ?? ''}
                        />
                    )
                })}
            </div>
        </>
    )
}

function Line ({guess}) {
    const tiles = [];

    for ( let i = 0; i < TILE_LENGTH; i++) {
        const char = guess[i];
        tiles.push(
            <div key={i} className="tile">
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
