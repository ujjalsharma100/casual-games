import { useState, useEffect, useCallback } from 'react'
import './PegSolitaire.css'

const BOARD_SIZE = 7

const isValidPosition = (row, col) => {
  if (row < 2 && col < 2) return false
  if (row < 2 && col > 4) return false
  if (row > 4 && col < 2) return false
  if (row > 4 && col > 4) return false
  return true
}

const createInitialBoard = () => {
  const board = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowArr = []
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!isValidPosition(row, col)) {
        rowArr.push(null)
      } else if (row === 3 && col === 3) {
        rowArr.push(false)
      } else {
        rowArr.push(true)
      }
    }
    board.push(rowArr)
  }
  return board
}

const countPegs = (board) => {
  let count = 0
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === true) count++
    }
  }
  return count
}

const getValidMoves = (board) => {
  const moves = []
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === true) {
        for (const [dr, dc] of directions) {
          const midRow = row + dr
          const midCol = col + dc
          const endRow = row + 2 * dr
          const endCol = col + 2 * dc

          if (
            endRow >= 0 && endRow < BOARD_SIZE &&
            endCol >= 0 && endCol < BOARD_SIZE &&
            isValidPosition(endRow, endCol) &&
            board[midRow][midCol] === true &&
            board[endRow][endCol] === false
          ) {
            moves.push({ from: { row, col }, over: { row: midRow, col: midCol }, to: { row: endRow, col: endCol } })
          }
        }
      }
    }
  }
  return moves
}

const getMovesForPeg = (board, row, col) => {
  const moves = []
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  for (const [dr, dc] of directions) {
    const midRow = row + dr
    const midCol = col + dc
    const endRow = row + 2 * dr
    const endCol = col + 2 * dc

    if (
      endRow >= 0 && endRow < BOARD_SIZE &&
      endCol >= 0 && endCol < BOARD_SIZE &&
      isValidPosition(endRow, endCol) &&
      board[midRow]?.[midCol] === true &&
      board[endRow][endCol] === false
    ) {
      moves.push({ row: endRow, col: endCol, overRow: midRow, overCol: midCol })
    }
  }
  return moves
}

export default function PegSolitaire({ onBack }) {
  const [board, setBoard] = useState(createInitialBoard)
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [validDestinations, setValidDestinations] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [pegsRemaining, setPegsRemaining] = useState(32)

  const checkGameOver = useCallback((currentBoard) => {
    const moves = getValidMoves(currentBoard)
    if (moves.length === 0) {
      setGameOver(true)
      setPegsRemaining(countPegs(currentBoard))
    }
  }, [])

  useEffect(() => {
    checkGameOver(board)
  }, [board, checkGameOver])

  const handleCellClick = (row, col) => {
    if (gameOver) return

    const cell = board[row][col]
    if (cell === null) return

    if (cell === true) {
      const moves = getMovesForPeg(board, row, col)
      if (moves.length > 0) {
        setSelectedPeg({ row, col })
        setValidDestinations(moves)
      } else {
        setSelectedPeg(null)
        setValidDestinations([])
      }
      return
    }

    if (cell === false && selectedPeg) {
      const destination = validDestinations.find(d => d.row === row && d.col === col)
      if (destination) {
        const newBoard = board.map(r => [...r])
        newBoard[selectedPeg.row][selectedPeg.col] = false
        newBoard[destination.overRow][destination.overCol] = false
        newBoard[row][col] = true
        setBoard(newBoard)
        setSelectedPeg(null)
        setValidDestinations([])
      }
    }
  }

  const reset = () => {
    setBoard(createInitialBoard())
    setSelectedPeg(null)
    setValidDestinations([])
    setGameOver(false)
    setPegsRemaining(32)
  }

  const getMessage = () => {
    if (pegsRemaining === 1) return "Perfect! You solved the puzzle!"
    if (pegsRemaining === 2) return "So close! Only 2 pegs left."
    if (pegsRemaining <= 4) return `Great job! ${pegsRemaining} pegs remaining.`
    return `Game Over! ${pegsRemaining} pegs remaining.`
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Peg Solitaire</h1>
        <div className="spacer"></div>
      </div>

      <p className="game-instructions">
        Click a peg to select, then click a highlighted space to jump.
      </p>

      <div className="peg-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="peg-row">
            {row.map((cell, colIndex) => {
              if (cell === null) {
                return <div key={colIndex} className="peg-cell invalid" />
              }

              const selected = selectedPeg?.row === rowIndex && selectedPeg?.col === colIndex
              const destination = validDestinations.some(d => d.row === rowIndex && d.col === colIndex)

              return (
                <div
                  key={colIndex}
                  className={`peg-cell hole ${cell ? 'has-peg' : 'empty'} ${selected ? 'selected' : ''} ${destination ? 'valid-move' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && <div className="peg" />}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="game-info">Pegs: {countPegs(board)} / 32</div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>{pegsRemaining === 1 ? 'Perfect!' : 'Game Over'}</h2>
            <p className={`score ${pegsRemaining === 1 ? 'perfect' : ''}`}>{getMessage()}</p>
            <button className="reset-btn" onClick={reset}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
