import { useState } from 'react'
import './BrainTeasers.css'
import { brainTeasers } from './brainTeasersConfig'

export default function BrainTeasers({ onBack }) {
  const [currentTeaser, setCurrentTeaser] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const getRandomTeaser = () => {
    const randomIndex = Math.floor(Math.random() * brainTeasers.length)
    const teaser = brainTeasers[randomIndex]
    setCurrentTeaser(teaser)
    setShowAnswer(false)
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Brain Teasers</h1>
        <div className="spacer"></div>
      </div>

      <p className="game-instructions">
        Click the button below to get a random brain teaser. Try to solve it before showing the answer!
      </p>

      <div className="brain-teasers-content">
        {!currentTeaser ? (
          <div className="teaser-placeholder">
            <p>Click below to get your first brain teaser!</p>
          </div>
        ) : (
          <div className="teaser-display">
            <div className="teaser-question">
              <h2>Question:</h2>
              <p>{currentTeaser.question}</p>
            </div>

            {showAnswer ? (
              <div className="teaser-answer">
                <h2>Answer:</h2>
                <p>{currentTeaser.answer}</p>
              </div>
            ) : (
              <button className="show-answer-btn" onClick={handleShowAnswer}>
                Show Answer
              </button>
            )}
          </div>
        )}

        <button className="new-teaser-btn" onClick={getRandomTeaser}>
          {currentTeaser ? 'Get Another Teaser' : 'Get Brain Teaser'}
        </button>
      </div>
    </div>
  )
}
