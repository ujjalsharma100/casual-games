import { useState, useMemo } from 'react'
import './Nonogram.css'

// Pre-made puzzles - 1 = filled, 0 = empty
const PUZZLES = [
  {
    name: 'Heart',
    size: 5,
    solution: [
      [0,1,0,1,0],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [0,1,1,1,0],
      [0,0,1,0,0]
    ]
  },
  {
    name: 'Arrow',
    size: 5,
    solution: [
      [0,0,1,0,0],
      [0,1,1,0,0],
      [1,1,1,1,1],
      [0,1,1,0,0],
      [0,0,1,0,0]
    ]
  },
  {
    name: 'House',
    size: 7,
    solution: [
      [0,0,0,1,0,0,0],
      [0,0,1,1,1,0,0],
      [0,1,1,1,1,1,0],
      [1,1,1,1,1,1,1],
      [1,1,0,0,0,1,1],
      [1,1,0,0,0,1,1],
      [1,1,1,1,1,1,1]
    ]
  },
  {
    name: 'Star',
    size: 7,
    solution: [
      [0,0,0,1,0,0,0],
      [0,0,1,1,1,0,0],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
      [0,1,1,0,1,1,0],
      [1,1,0,0,0,1,1]
    ]
  },
  {
    name: 'Boat',
    size: 8,
    solution: [
      [0,0,0,1,0,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,1,0,0],
      [0,1,0,1,1,1,1,0],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0]
    ]
  }
]

const calculateClues = (solution) => {
  const size = solution.length
  const rowClues = []
  const colClues = []

  // Row clues
  for (let r = 0; r < size; r++) {
    const clue = []
    let count = 0
    for (let c = 0; c < size; c++) {
      if (solution[r][c] === 1) {
        count++
      } else if (count > 0) {
        clue.push(count)
        count = 0
      }
    }
    if (count > 0) clue.push(count)
    rowClues.push(clue.length > 0 ? clue : [0])
  }

  // Column clues
  for (let c = 0; c < size; c++) {
    const clue = []
    let count = 0
    for (let r = 0; r < size; r++) {
      if (solution[r][c] === 1) {
        count++
      } else if (count > 0) {
        clue.push(count)
        count = 0
      }
    }
    if (count > 0) clue.push(count)
    colClues.push(clue.length > 0 ? clue : [0])
  }

  return { rowClues, colClues }
}

export default function Nonogram({ onBack }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const puzzle = PUZZLES[puzzleIndex]
  const { rowClues, colClues } = useMemo(() => calculateClues(puzzle.solution), [puzzle])

  const [board, setBoard] = useState(() =>
    Array(puzzle.size).fill(null).map(() => Array(puzzle.size).fill(0))
  )
  const [won, setWon] = useState(false)
  const [showHelp, setShowHelp] = useState(true)
  const [markMode, setMarkMode] = useState(false) // For mobile: toggle between fill and mark mode

  const handleCellClick = (r, c, e) => {
    if (won) return

    const newBoard = board.map(row => [...row])

    if (e.button === 2 || e.shiftKey || markMode) {
      // Right click, shift+click, or mark mode: mark as X (definitely empty)
      newBoard[r][c] = board[r][c] === 2 ? 0 : 2
    } else {
      // Left click: fill
      newBoard[r][c] = board[r][c] === 1 ? 0 : 1
    }

    setBoard(newBoard)

    // Check win - only filled cells (1) need to match
    let isWon = true
    for (let row = 0; row < puzzle.size; row++) {
      for (let col = 0; col < puzzle.size; col++) {
        if (puzzle.solution[row][col] === 1 && newBoard[row][col] !== 1) {
          isWon = false
        }
        if (puzzle.solution[row][col] === 0 && newBoard[row][col] === 1) {
          isWon = false
        }
      }
    }
    if (isWon) setWon(true)
  }

  const startNewPuzzle = (index) => {
    const newPuzzle = PUZZLES[index]
    setPuzzleIndex(index)
    setBoard(Array(newPuzzle.size).fill(null).map(() => Array(newPuzzle.size).fill(0)))
    setWon(false)
  }

  const maxRowClueLength = Math.max(...rowClues.map(c => c.length))
  const maxColClueLength = Math.max(...colClues.map(c => c.length))

  return (
    <div className="game-container" onContextMenu={(e) => e.preventDefault()}>
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Nonogram</h1>
        <div className="spacer"></div>
      </div>

      <div className="puzzle-selector">
        {PUZZLES.map((p, i) => (
          <button
            key={i}
            className={`diff-btn ${puzzleIndex === i ? 'active' : ''}`}
            onClick={() => startNewPuzzle(i)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <button className="help-toggle" onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? 'Hide' : 'Show'} How to Play
      </button>

      {showHelp && (
        <div className="nonogram-help">
          <h3>How to Read the Numbers</h3>
          <p>Each number tells you how many <strong>consecutive filled cells</strong> are in that row or column.</p>

          <div className="help-example">
            <div className="example-label">Example row with clue "3":</div>
            <div className="example-row">
              <span className="example-clue">3</span>
              <span className="example-cell filled"></span>
              <span className="example-cell filled"></span>
              <span className="example-cell filled"></span>
              <span className="example-cell"></span>
              <span className="example-cell"></span>
            </div>
            <div className="example-explain">= 3 filled cells in a row (could be anywhere)</div>
          </div>

          <div className="help-example">
            <div className="example-label">Example row with clue "2 1":</div>
            <div className="example-row">
              <span className="example-clue">2 1</span>
              <span className="example-cell filled"></span>
              <span className="example-cell filled"></span>
              <span className="example-cell"></span>
              <span className="example-cell filled"></span>
              <span className="example-cell"></span>
            </div>
            <div className="example-explain">= 2 filled cells, then a gap, then 1 filled cell</div>
          </div>

          <div className="help-example">
            <div className="example-label">Example row with clue "0":</div>
            <div className="example-row">
              <span className="example-clue">0</span>
              <span className="example-cell"></span>
              <span className="example-cell"></span>
              <span className="example-cell"></span>
              <span className="example-cell"></span>
              <span className="example-cell"></span>
            </div>
            <div className="example-explain">= No filled cells in this row (all empty)</div>
          </div>

          <p className="help-tip"><strong>Tip:</strong> Click to fill a cell. Right-click (or use Mark mode on mobile) to mark as empty (×).</p>
        </div>
      )}

      <div className="mode-toggle">
        <button
          className={`mode-btn ${!markMode ? 'active' : ''}`}
          onClick={() => setMarkMode(false)}
        >
          Fill
        </button>
        <button
          className={`mode-btn ${markMode ? 'active' : ''}`}
          onClick={() => setMarkMode(true)}
        >
          Mark ×
        </button>
      </div>

      <div className="nonogram-board">
        {/* Column clues */}
        <div className="col-clues" style={{ marginLeft: `${maxRowClueLength * 20 + 10}px` }}>
          {colClues.map((clue, c) => (
            <div key={c} className="col-clue">
              {Array(maxColClueLength - clue.length).fill(null).map((_, i) => (
                <span key={`empty-${i}`} className="clue-num empty"></span>
              ))}
              {clue.map((num, i) => (
                <span key={i} className="clue-num">{num}</span>
              ))}
            </div>
          ))}
        </div>

        {/* Board with row clues */}
        <div className="board-with-rows">
          {board.map((row, r) => (
            <div key={r} className="nonogram-row">
              <div className="row-clue" style={{ width: `${maxRowClueLength * 20}px` }}>
                {rowClues[r].map((num, i) => (
                  <span key={i} className="clue-num">{num}</span>
                ))}
              </div>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`nonogram-cell ${cell === 1 ? 'filled' : ''} ${cell === 2 ? 'marked' : ''}`}
                  onClick={(e) => handleCellClick(r, c, e)}
                  onContextMenu={(e) => { e.preventDefault(); handleCellClick(r, c, { button: 2 }) }}
                >
                  {cell === 2 && '×'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button className="reset-btn" onClick={() => startNewPuzzle(puzzleIndex)}>Clear Board</button>

      {won && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Congratulations!</h2>
            <p className="score perfect">You revealed: {puzzle.name}!</p>
            <button className="reset-btn" onClick={() => startNewPuzzle((puzzleIndex + 1) % PUZZLES.length)}>
              Next Puzzle
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
