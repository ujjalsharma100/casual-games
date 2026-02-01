import { useState, useEffect, useCallback, useRef } from 'react'
import './SimonSays.css'

const COLORS = ['red', 'green', 'blue', 'yellow']
const INITIAL_DELAY = 500
const FLASH_DURATION = 400

export default function SimonSays({ onBack }) {
  const [sequence, setSequence] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [activeColor, setActiveColor] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [message, setMessage] = useState('Press Start to play!')

  const timeoutRef = useRef(null)

  const playSound = useCallback((color) => {
    // Create simple beep sounds with Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      const frequencies = { red: 329.63, green: 392, blue: 261.63, yellow: 440 }
      oscillator.frequency.value = frequencies[color]
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      // Audio not supported, continue without sound
    }
  }, [])

  const flashColor = useCallback((color, duration = FLASH_DURATION) => {
    setActiveColor(color)
    playSound(color)
    return new Promise(resolve => {
      setTimeout(() => {
        setActiveColor(null)
        setTimeout(resolve, 150)
      }, duration)
    })
  }, [playSound])

  const showSequence = useCallback(async (seq) => {
    setIsShowingSequence(true)
    setMessage('Watch carefully...')

    await new Promise(r => setTimeout(r, INITIAL_DELAY))

    for (const color of seq) {
      await flashColor(color)
    }

    setIsShowingSequence(false)
    setMessage('Your turn!')
  }, [flashColor])

  const addToSequence = useCallback(() => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const newSequence = [...sequence, newColor]
    setSequence(newSequence)
    setPlayerSequence([])
    showSequence(newSequence)
  }, [sequence, showSequence])

  const startGame = useCallback(() => {
    setSequence([])
    setPlayerSequence([])
    setGameOver(false)
    setIsPlaying(true)
    setScore(0)
    setMessage('Starting...')

    const firstColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const newSequence = [firstColor]
    setSequence(newSequence)

    timeoutRef.current = setTimeout(() => {
      showSequence(newSequence)
    }, 500)
  }, [showSequence])

  const handleColorClick = useCallback(async (color) => {
    if (!isPlaying || isShowingSequence || gameOver) return

    await flashColor(color, 200)

    const newPlayerSequence = [...playerSequence, color]
    setPlayerSequence(newPlayerSequence)

    const currentIndex = newPlayerSequence.length - 1

    if (color !== sequence[currentIndex]) {
      setGameOver(true)
      setIsPlaying(false)
      setMessage('Game Over!')
      if (score > highScore) {
        setHighScore(score)
      }
      return
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = sequence.length
      setScore(newScore)
      setMessage('Correct! Next round...')

      timeoutRef.current = setTimeout(() => {
        addToSequence()
      }, 1000)
    }
  }, [isPlaying, isShowingSequence, gameOver, playerSequence, sequence, score, highScore, flashColor, addToSequence])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Simon Says</h1>
        <div className="spacer"></div>
      </div>

      <p className="game-instructions">
        Watch the pattern, then repeat it by clicking the colors.
      </p>

      <div className="simon-scores">
        <div className="simon-score">Score: {score}</div>
        <div className="simon-score">Best: {highScore}</div>
      </div>

      <div className="simon-board">
        {COLORS.map(color => (
          <div
            key={color}
            className={`simon-btn simon-${color} ${activeColor === color ? 'active' : ''}`}
            onClick={() => handleColorClick(color)}
          />
        ))}
        <div className="simon-center">
          <p>{message}</p>
        </div>
      </div>

      {!isPlaying && (
        <button className="reset-btn" onClick={startGame}>
          {gameOver ? 'Play Again' : 'Start'}
        </button>
      )}

      {gameOver && score > 0 && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Game Over!</h2>
            <p className={`score ${score === highScore && score > 0 ? 'perfect' : ''}`}>
              {score === highScore && score > 0 ? 'New High Score! ' : ''}
              You remembered {score} {score === 1 ? 'pattern' : 'patterns'}!
            </p>
            <button className="reset-btn" onClick={startGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  )
}
