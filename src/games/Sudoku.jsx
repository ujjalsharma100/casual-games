import { useState, useCallback } from 'react'
import './Sudoku.css'

// Pre-made puzzles with solutions (0 = empty cell)
const PUZZLES = {
  easy: [
    {
      puzzle: [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
      ],
      solution: [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
      ]
    }
  ],
  medium: [
    {
      puzzle: [
        [0,0,0,2,6,0,7,0,1],
        [6,8,0,0,7,0,0,9,0],
        [1,9,0,0,0,4,5,0,0],
        [8,2,0,1,0,0,0,4,0],
        [0,0,4,6,0,2,9,0,0],
        [0,5,0,0,0,3,0,2,8],
        [0,0,9,3,0,0,0,7,4],
        [0,4,0,0,5,0,0,3,6],
        [7,0,3,0,1,8,0,0,0]
      ],
      solution: [
        [4,3,5,2,6,9,7,8,1],
        [6,8,2,5,7,1,4,9,3],
        [1,9,7,8,3,4,5,6,2],
        [8,2,6,1,9,5,3,4,7],
        [3,7,4,6,8,2,9,1,5],
        [9,5,1,7,4,3,6,2,8],
        [5,1,9,3,2,6,8,7,4],
        [2,4,8,9,5,7,1,3,6],
        [7,6,3,4,1,8,2,5,9]
      ]
    }
  ],
  hard: [
    {
      puzzle: [
        [0,0,0,6,0,0,4,0,0],
        [7,0,0,0,0,3,6,0,0],
        [0,0,0,0,9,1,0,8,0],
        [0,0,0,0,0,0,0,0,0],
        [0,5,0,1,8,0,0,0,3],
        [0,0,0,3,0,6,0,4,5],
        [0,4,0,2,0,0,0,6,0],
        [9,0,3,0,0,0,0,0,0],
        [0,2,0,0,0,0,1,0,0]
      ],
      solution: [
        [5,8,1,6,7,2,4,3,9],
        [7,9,2,8,4,3,6,5,1],
        [3,6,4,5,9,1,7,8,2],
        [4,3,8,9,5,7,2,1,6],
        [2,5,6,1,8,4,9,7,3],
        [1,7,9,3,2,6,8,4,5],
        [8,4,5,2,1,9,3,6,7],
        [9,1,3,7,6,8,5,2,4],
        [6,2,7,4,3,5,1,9,8]
      ]
    }
  ]
}

export default function Sudoku({ onBack }) {
  const [difficulty, setDifficulty] = useState('easy')
  const [puzzleIndex] = useState(0)
  const [board, setBoard] = useState(() =>
    PUZZLES[difficulty][puzzleIndex].puzzle.map(row => [...row])
  )
  const [selected, setSelected] = useState(null)
  const [errors, setErrors] = useState(new Set())
  const [won, setWon] = useState(false)

  const original = PUZZLES[difficulty][puzzleIndex].puzzle
  const solution = PUZZLES[difficulty][puzzleIndex].solution

  const isOriginal = (r, c) => original[r][c] !== 0

  const checkErrors = useCallback((newBoard) => {
    const newErrors = new Set()

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newBoard[r][c] !== 0 && newBoard[r][c] !== solution[r][c]) {
          newErrors.add(`${r}-${c}`)
        }
      }
    }

    return newErrors
  }, [solution])

  const checkWin = useCallback((newBoard) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newBoard[r][c] !== solution[r][c]) return false
      }
    }
    return true
  }, [solution])

  const handleCellClick = (r, c) => {
    if (!isOriginal(r, c) && !won) {
      setSelected({ r, c })
    }
  }

  const handleNumberInput = (num) => {
    if (!selected || won) return

    const { r, c } = selected
    if (isOriginal(r, c)) return

    const newBoard = board.map(row => [...row])
    newBoard[r][c] = num

    setBoard(newBoard)
    setErrors(checkErrors(newBoard))

    if (checkWin(newBoard)) {
      setWon(true)
    }
  }

  const handleKeyDown = (e) => {
    if (!selected || won) return

    const num = parseInt(e.key)
    if (num >= 1 && num <= 9) {
      handleNumberInput(num)
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      handleNumberInput(0)
    }
  }

  const startNewGame = (diff) => {
    setDifficulty(diff)
    setBoard(PUZZLES[diff][0].puzzle.map(row => [...row]))
    setSelected(null)
    setErrors(new Set())
    setWon(false)
  }

  return (
    <div className="game-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Sudoku</h1>
        <div className="spacer"></div>
      </div>

      <div className="difficulty-selector">
        {Object.keys(PUZZLES).map(diff => (
          <button
            key={diff}
            className={`diff-btn ${difficulty === diff ? 'active' : ''}`}
            onClick={() => startNewGame(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      <p className="game-instructions">
        Fill each row, column, and 3x3 box with numbers 1-9. Click a cell, then type or click a number.
      </p>

      <div className="sudoku-board">
        {board.map((row, r) => (
          <div key={r} className="sudoku-row">
            {row.map((cell, c) => (
              <div
                key={c}
                className={`sudoku-cell
                  ${isOriginal(r, c) ? 'original' : 'editable'}
                  ${selected?.r === r && selected?.c === c ? 'selected' : ''}
                  ${errors.has(`${r}-${c}`) ? 'error' : ''}
                  ${c === 2 || c === 5 ? 'border-right' : ''}
                  ${r === 2 || r === 5 ? 'border-bottom' : ''}
                `}
                onClick={() => handleCellClick(r, c)}
              >
                {cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} onClick={() => handleNumberInput(num)}>{num}</button>
        ))}
        <button onClick={() => handleNumberInput(0)} className="clear-btn">Clear</button>
      </div>

      {won && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Congratulations!</h2>
            <p className="score perfect">You solved the puzzle!</p>
            <button className="reset-btn" onClick={() => startNewGame(difficulty)}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
