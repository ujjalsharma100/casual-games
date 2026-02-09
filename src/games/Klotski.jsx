import { useState, useCallback, useEffect } from 'react'
import './Klotski.css'

// Classic Klotski puzzle - move the big red block to the bottom center exit
// Block types: 1=1x1, 2=1x2 vertical, 3=2x1 horizontal, 4=2x2 (main block)
const INITIAL_BLOCKS = [
  { id: 'main', type: 4, row: 0, col: 1, width: 2, height: 2, isMain: true },
  { id: 'v1', type: 2, row: 0, col: 0, width: 1, height: 2 },
  { id: 'v2', type: 2, row: 0, col: 3, width: 1, height: 2 },
  { id: 'v3', type: 2, row: 2, col: 0, width: 1, height: 2 },
  { id: 'v4', type: 2, row: 2, col: 3, width: 1, height: 2 },
  { id: 'h1', type: 3, row: 2, col: 1, width: 2, height: 1 },
  { id: 's1', type: 1, row: 3, col: 1, width: 1, height: 1 },
  { id: 's2', type: 1, row: 3, col: 2, width: 1, height: 1 },
  { id: 's3', type: 1, row: 4, col: 0, width: 1, height: 1 },
  { id: 's4', type: 1, row: 4, col: 3, width: 1, height: 1 }
]

const ROWS = 5
const COLS = 4

export default function Klotski({ onBack }) {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS.map(b => ({ ...b })))
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [cellSize, setCellSize] = useState(window.innerWidth <= 400 ? 50 : 60)
  const gap = 4
  const padding = 4

  useEffect(() => {
    const handleResize = () => {
      setCellSize(window.innerWidth <= 400 ? 50 : 60)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getOccupiedCells = useCallback((blockList, excludeId = null) => {
    const cells = new Set()
    blockList.forEach(block => {
      if (block.id === excludeId) return
      for (let r = block.row; r < block.row + block.height; r++) {
        for (let c = block.col; c < block.col + block.width; c++) {
          cells.add(`${r},${c}`)
        }
      }
    })
    return cells
  }, [])

  const canMove = useCallback((block, dr, dc, blockList) => {
    const newRow = block.row + dr
    const newCol = block.col + dc

    // Check bounds
    for (let r = newRow; r < newRow + block.height; r++) {
      for (let c = newCol; c < newCol + block.width; c++) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false
      }
    }

    // Check collisions
    const occupied = getOccupiedCells(blockList, block.id)
    for (let r = newRow; r < newRow + block.height; r++) {
      for (let c = newCol; c < newCol + block.width; c++) {
        if (occupied.has(`${r},${c}`)) return false
      }
    }

    return true
  }, [getOccupiedCells])

  const moveBlock = useCallback((block, dr, dc) => {
    if (won) return false
    if (!canMove(block, dr, dc, blocks)) return false

    const newBlocks = blocks.map(b =>
      b.id === block.id
        ? { ...b, row: b.row + dr, col: b.col + dc }
        : { ...b }
    )

    setBlocks(newBlocks)
    setMoves(m => m + 1)

    // Check win - main block at row 3, col 1 (bottom center exit)
    const mainBlock = newBlocks.find(b => b.isMain)
    if (mainBlock.row === 3 && mainBlock.col === 1) {
      setWon(true)
    }

    return true
  }, [blocks, won, canMove])

  const handleBlockClick = (block) => {
    if (won) return
    setSelectedBlock(selectedBlock?.id === block.id ? null : block)
  }

  const handleMove = (dr, dc) => {
    if (!selectedBlock) return
    const block = blocks.find(b => b.id === selectedBlock.id)
    if (block) moveBlock(block, dr, dc)
  }

  const handleCellClick = (row, col) => {
    if (!selectedBlock || won) return

    const block = blocks.find(b => b.id === selectedBlock.id)
    if (!block) return

    // Determine direction to move - only allow horizontal OR vertical, not diagonal
    const dr = Math.sign(row - block.row)
    const dc = Math.sign(col - block.col)

    // Only move if it's purely horizontal or purely vertical (not both)
    if (dr !== 0 && dc === 0) {
      // Vertical movement only
      moveBlock(block, dr, 0)
    } else if (dc !== 0 && dr === 0) {
      // Horizontal movement only
      moveBlock(block, 0, dc)
    }
  }

  const reset = () => {
    setBlocks(INITIAL_BLOCKS.map(b => ({ ...b })))
    setSelectedBlock(null)
    setMoves(0)
    setWon(false)
  }

  const getBlockAtCell = (row, col) => {
    return blocks.find(b =>
      row >= b.row && row < b.row + b.height &&
      col >= b.col && col < b.col + b.width
    )
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Klotski</h1>
        <div className="spacer"></div>
      </div>

      <p className="game-instructions">
        Move the large red block to the bottom exit. Click a block to select it, then use arrows or click to move. The minimum solution is 81 moves!
      </p>

      <div className="game-info">Moves: {moves}</div>

      <div className="klotski-container">
        <div className="klotski-board">
          {/* Render grid background */}
          {Array(ROWS).fill(null).map((_, r) => (
            <div key={r} className="klotski-row">
              {Array(COLS).fill(null).map((_, c) => (
                <div
                  key={c}
                  className={`klotski-cell ${r === 4 && (c === 1 || c === 2) ? 'exit' : ''}`}
                  onClick={() => handleCellClick(r, c)}
                />
              ))}
            </div>
          ))}

          {/* Render blocks */}
          {blocks.map(block => (
            <div
              key={block.id}
              className={`klotski-block type-${block.type} ${block.isMain ? 'main' : ''} ${selectedBlock?.id === block.id ? 'selected' : ''}`}
              style={{
                top: `${padding + block.row * (cellSize + gap)}px`,
                left: `${padding + block.col * (cellSize + gap)}px`,
                width: `${block.width * cellSize + (block.width - 1) * gap}px`,
                height: `${block.height * cellSize + (block.height - 1) * gap}px`
              }}
              onClick={() => handleBlockClick(block)}
            />
          ))}
        </div>

        {/* Exit indicator */}
        <div className="exit-indicator">↓ EXIT ↓</div>
      </div>

      <div className="mobile-controls">
        <button onClick={() => handleMove(-1, 0)}>↑</button>
        <div className="mobile-controls-row">
          <button onClick={() => handleMove(0, -1)}>←</button>
          <button onClick={() => handleMove(0, 1)}>→</button>
        </div>
        <button onClick={() => handleMove(1, 0)}>↓</button>
      </div>

      <button className="reset-btn" onClick={reset}>Reset</button>

      {won && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Congratulations!</h2>
            <p className={`score ${moves <= 85 ? 'perfect' : ''}`}>
              {moves <= 81 ? 'Perfect! Optimal solution!' : moves <= 100 ? 'Excellent!' : 'Well done!'}
              <br />Solved in {moves} moves!
            </p>
            <button className="reset-btn" onClick={reset}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
