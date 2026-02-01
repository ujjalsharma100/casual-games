import { useState, useCallback } from 'react'
import './FifteenPuzzle.css'

const SIZE = 4

const createSolvedBoard = () => {
  const board = []
  for (let i = 0; i < SIZE * SIZE - 1; i++) {
    board.push(i + 1)
  }
  board.push(0) // Empty space
  return board
}

const isSolvable = (board) => {
  let inversions = 0
  const tiles = board.filter(t => t !== 0)

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inversions++
    }
  }

  const emptyRow = Math.floor(board.indexOf(0) / SIZE)
  const emptyRowFromBottom = SIZE - emptyRow

  // For 4x4: solvable if (inversions + empty row from bottom) is odd
  return (inversions + emptyRowFromBottom) % 2 === 1
}

const shuffleBoard = () => {
  let board
  do {
    board = [...createSolvedBoard()]
    // Fisher-Yates shuffle
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[board[i], board[j]] = [board[j], board[i]]
    }
  } while (!isSolvable(board) || isSolved(board))

  return board
}

const isSolved = (board) => {
  for (let i = 0; i < SIZE * SIZE - 1; i++) {
    if (board[i] !== i + 1) return false
  }
  return board[SIZE * SIZE - 1] === 0
}

const getEmptyIndex = (board) => board.indexOf(0)

const canMove = (index, emptyIndex) => {
  const row = Math.floor(index / SIZE)
  const col = index % SIZE
  const emptyRow = Math.floor(emptyIndex / SIZE)
  const emptyCol = emptyIndex % SIZE

  return (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  )
}

export default function FifteenPuzzle({ onBack }) {
  const [board, setBoard] = useState(shuffleBoard)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  const handleClick = useCallback((index) => {
    if (won) return

    const emptyIndex = getEmptyIndex(board)
    if (!canMove(index, emptyIndex)) return

    const newBoard = [...board]
    ;[newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]]
    setBoard(newBoard)
    setMoves(m => m + 1)

    if (isSolved(newBoard)) {
      setWon(true)
    }
  }, [board, won])

  const reset = () => {
    setBoard(shuffleBoard())
    setMoves(0)
    setWon(false)
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>15 Puzzle</h1>
        <div className="spacer"></div>
      </div>

      <p className="game-instructions">
        Slide tiles to arrange numbers 1-15 in order.
      </p>

      <div className="game-info">Moves: {moves}</div>

      <div className="fifteen-board">
        {board.map((tile, index) => (
          <div
            key={index}
            className={`fifteen-tile ${tile === 0 ? 'empty' : ''} ${canMove(index, getEmptyIndex(board)) ? 'movable' : ''}`}
            onClick={() => handleClick(index)}
          >
            {tile !== 0 && tile}
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={reset}>Shuffle</button>

      {won && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>You Win!</h2>
            <p className="score perfect">
              Solved in {moves} moves!
            </p>
            <button className="reset-btn" onClick={reset}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
