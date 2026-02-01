import { useState } from 'react'
import './TowerOfHanoi.css'

const DISK_COUNTS = { easy: 3, medium: 4, hard: 5 }

const createInitialState = (numDisks) => {
  // All disks start on the first peg (index 0)
  // Disks are numbered from 1 (smallest) to numDisks (largest)
  const pegs = [[], [], []]
  for (let i = numDisks; i >= 1; i--) {
    pegs[0].push(i)
  }
  return pegs
}

const getMinMoves = (numDisks) => Math.pow(2, numDisks) - 1

export default function TowerOfHanoi({ onBack }) {
  const [difficulty, setDifficulty] = useState('easy')
  const [numDisks, setNumDisks] = useState(DISK_COUNTS[difficulty])
  const [pegs, setPegs] = useState(() => createInitialState(numDisks))
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  const handlePegClick = (pegIndex) => {
    if (won) return

    if (selectedPeg === null) {
      // Select this peg if it has disks
      if (pegs[pegIndex].length > 0) {
        setSelectedPeg(pegIndex)
      }
    } else {
      // Try to move from selectedPeg to pegIndex
      if (selectedPeg === pegIndex) {
        // Deselect
        setSelectedPeg(null)
        return
      }

      const fromPeg = pegs[selectedPeg]
      const toPeg = pegs[pegIndex]

      const diskToMove = fromPeg[fromPeg.length - 1]
      const topDiskOnTarget = toPeg[toPeg.length - 1]

      // Can only place smaller disk on larger disk (or empty peg)
      if (toPeg.length === 0 || diskToMove < topDiskOnTarget) {
        const newPegs = pegs.map(peg => [...peg])
        newPegs[selectedPeg].pop()
        newPegs[pegIndex].push(diskToMove)
        setPegs(newPegs)
        setMoves(m => m + 1)

        // Check win: all disks on the last peg
        if (newPegs[2].length === numDisks) {
          setWon(true)
        }
      }

      setSelectedPeg(null)
    }
  }

  const startNewGame = (diff) => {
    const disks = DISK_COUNTS[diff]
    setDifficulty(diff)
    setNumDisks(disks)
    setPegs(createInitialState(disks))
    setSelectedPeg(null)
    setMoves(0)
    setWon(false)
  }

  const getDiskWidth = (diskSize) => {
    const minWidth = 30
    const maxWidth = 140
    const step = (maxWidth - minWidth) / (numDisks - 1 || 1)
    return minWidth + step * (diskSize - 1)
  }

  const getDiskColor = (diskSize) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']
    return colors[(diskSize - 1) % colors.length]
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Tower of Hanoi</h1>
        <div className="spacer"></div>
      </div>

      <div className="difficulty-selector">
        {Object.keys(DISK_COUNTS).map(diff => (
          <button
            key={diff}
            className={`diff-btn ${difficulty === diff ? 'active' : ''}`}
            onClick={() => startNewGame(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)} ({DISK_COUNTS[diff]} disks)
          </button>
        ))}
      </div>

      <p className="game-instructions">
        Move all disks to the right peg. Click a peg to pick up its top disk, then click another peg to place it. You cannot place a larger disk on a smaller one.
      </p>

      <div className="game-info">
        Moves: {moves} | Minimum possible: {getMinMoves(numDisks)}
      </div>

      <div className="hanoi-board">
        {pegs.map((peg, pegIndex) => (
          <div
            key={pegIndex}
            className={`hanoi-peg ${selectedPeg === pegIndex ? 'selected' : ''}`}
            onClick={() => handlePegClick(pegIndex)}
          >
            <div className="peg-base"></div>
            <div className="peg-rod"></div>
            <div className="disks-container">
              {peg.map((diskSize, diskIndex) => (
                <div
                  key={diskIndex}
                  className={`disk ${selectedPeg === pegIndex && diskIndex === peg.length - 1 ? 'top-disk' : ''}`}
                  style={{
                    width: getDiskWidth(diskSize),
                    backgroundColor: getDiskColor(diskSize)
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={() => startNewGame(difficulty)}>Reset</button>

      {won && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Congratulations!</h2>
            <p className={`score ${moves === getMinMoves(numDisks) ? 'perfect' : ''}`}>
              {moves === getMinMoves(numDisks)
                ? `Perfect! Solved in minimum ${moves} moves!`
                : `Solved in ${moves} moves! (Minimum: ${getMinMoves(numDisks)})`
              }
            </p>
            <button className="reset-btn" onClick={() => startNewGame(difficulty)}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
