import { useState, useCallback } from 'react'
import './LightsOut.css'

const SIZES = { easy: 3, medium: 4, hard: 5 }

const createSolvableBoard = (size) => {
  // Start with all lights off, then make random valid moves
  const board = Array(size).fill(null).map(() => Array(size).fill(false))

  // Make random moves to create a solvable puzzle
  const numMoves = size * size + Math.floor(Math.random() * size)
  for (let i = 0; i < numMoves; i++) {
    const r = Math.floor(Math.random() * size)
    const c = Math.floor(Math.random() * size)
    toggleWithNeighbors(board, r, c, size)
  }

  // Ensure at least some lights are on
  const lightsOn = board.flat().filter(x => x).length
  if (lightsOn < 3) {
    return createSolvableBoard(size)
  }

  return board
}

const toggleWithNeighbors = (board, r, c, size) => {
  const positions = [
    [r, c],
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1]
  ]

  positions.forEach(([row, col]) => {
    if (row >= 0 && row < size && col >= 0 && col < size) {
      board[row][col] = !board[row][col]
    }
  })
}

const isAllOff = (board) => board.flat().every(cell => !cell)

export default function LightsOut({ onBack }) {
  const [difficulty, setDifficulty] = useState('medium')
  const [board, setBoard] = useState(() => createSolvableBoard(SIZES[difficulty]))
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  const size = SIZES[difficulty]

  const handleClick = useCallback((r, c) => {
    if (won) return

    const newBoard = board.map(row => [...row])
    toggleWithNeighbors(newBoard, r, c, size)
    setBoard(newBoard)
    setMoves(m => m + 1)

    if (isAllOff(newBoard)) {
      setWon(true)
    }
  }, [board, size, won])

  const startGame = (diff) => {
    const newSize = SIZES[diff]
    setDifficulty(diff)
    setBoard(createSolvableBoard(newSize))
    setMoves(0)
    setWon(false)
  }

  const lightsOn = board.flat().filter(x => x).length

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Lights Out</h1>
        <div className="spacer"></div>
      </div>

      <div className="difficulty-selector">
        {Object.keys(SIZES).map(diff => (
          <button
            key={diff}
            className={`diff-btn ${difficulty === diff ? 'active' : ''}`}
            onClick={() => startGame(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      <p className="game-instructions">
        Click a cell to toggle it and its neighbors. Turn all lights off!
      </p>

      <div className="game-info">
        Moves: {moves} | Lights On: {lightsOn}
      </div>

      <div className="lights-board" style={{ '--size': size }}>
        {board.map((row, r) => (
          <div key={r} className="lights-row">
            {row.map((cell, c) => (
              <div
                key={c}
                className={`light-cell ${cell ? 'on' : 'off'}`}
                onClick={() => handleClick(r, c)}
              />
            ))}
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={() => startGame(difficulty)}>New Puzzle</button>

      {won && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>You Win!</h2>
            <p className="score perfect">
              Solved in {moves} moves!
            </p>
            <button className="reset-btn" onClick={() => startGame(difficulty)}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
