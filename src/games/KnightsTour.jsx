import { useState, useCallback } from 'react'
import './KnightsTour.css'

const SIZES = { '5x5': 5, '6x6': 6, '8x8': 8 }

const getKnightMoves = (row, col, size) => {
  const moves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ]

  return moves
    .map(([dr, dc]) => [row + dr, col + dc])
    .filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size)
}

export default function KnightsTour({ onBack }) {
  const [boardSize, setBoardSize] = useState(5)
  const [board, setBoard] = useState(() =>
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(0))
  )
  const [knightPos, setKnightPos] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [validMoves, setValidMoves] = useState([])

  const totalCells = boardSize * boardSize

  const calculateValidMoves = useCallback((pos, currentBoard) => {
    if (!pos) return []
    return getKnightMoves(pos[0], pos[1], boardSize)
      .filter(([r, c]) => currentBoard[r][c] === 0)
  }, [boardSize])

  const handleCellClick = (row, col) => {
    if (gameOver) return

    // First click - place the knight
    if (!knightPos) {
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = 1
      setBoard(newBoard)
      setKnightPos([row, col])
      setMoveCount(1)
      setValidMoves(calculateValidMoves([row, col], newBoard))
      return
    }

    // Check if this is a valid knight move
    const isValid = validMoves.some(([r, c]) => r === row && c === col)
    if (!isValid) return

    // Make the move
    const newBoard = board.map(r => [...r])
    const newMoveCount = moveCount + 1
    newBoard[row][col] = newMoveCount

    setBoard(newBoard)
    setKnightPos([row, col])
    setMoveCount(newMoveCount)

    const newValidMoves = calculateValidMoves([row, col], newBoard)
    setValidMoves(newValidMoves)

    // Check win/lose
    if (newMoveCount === totalCells) {
      setWon(true)
      setGameOver(true)
    } else if (newValidMoves.length === 0) {
      setGameOver(true)
    }
  }

  const startNewGame = (size) => {
    setBoardSize(size)
    setBoard(Array(size).fill(null).map(() => Array(size).fill(0)))
    setKnightPos(null)
    setMoveCount(0)
    setGameOver(false)
    setWon(false)
    setValidMoves([])
  }

  const isValidMove = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col)
  }


  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Knight's Tour</h1>
        <div className="spacer"></div>
      </div>

      <div className="difficulty-selector">
        {Object.entries(SIZES).map(([label, size]) => (
          <button
            key={label}
            className={`diff-btn ${boardSize === size ? 'active' : ''}`}
            onClick={() => startNewGame(size)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="game-instructions">
        {!knightPos
          ? 'Click any cell to place the knight.'
          : 'Move the knight to visit every cell exactly once.'
        }
      </p>

      <div className="game-info">
        Visited: {moveCount} / {totalCells}
      </div>

      <div className="knights-board" style={{ '--size': boardSize }}>
        {board.map((row, r) => (
          <div key={r} className="knights-row">
            {row.map((cell, c) => {
              const isKnight = knightPos && knightPos[0] === r && knightPos[1] === c
              const isDark = (r + c) % 2 === 1

              return (
                <div
                  key={c}
                  className={`knights-cell ${isDark ? 'dark' : 'light'} ${cell > 0 ? 'visited' : ''}`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {isKnight && <div className="knight">♞</div>}
                  {cell > 0 && !isKnight && <span className="move-number">{cell}</span>}
                </div>
              )
            })}
          </div>
        ))}
      </div>


      <button className="reset-btn" onClick={() => startNewGame(boardSize)}>Restart</button>

      {gameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>{won ? 'Perfect Tour!' : 'No More Moves!'}</h2>
            <p className={`score ${won ? 'perfect' : ''}`}>
              {won
                ? `You visited all ${totalCells} cells!`
                : `Visited ${moveCount} of ${totalCells} cells.`
              }
            </p>
            <button className="reset-btn" onClick={() => startNewGame(boardSize)}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
