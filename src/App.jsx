import { useState, useEffect } from 'react'
import './App.css'
import PegSolitaire from './games/PegSolitaire'
import LightsOut from './games/LightsOut'
import FifteenPuzzle from './games/FifteenPuzzle'
import SimonSays from './games/SimonSays'
import Sudoku from './games/Sudoku'
import TowerOfHanoi from './games/TowerOfHanoi'
import Nonogram from './games/Nonogram'
import Klotski from './games/Klotski'
import KnightsTour from './games/KnightsTour'
import BrainTeasers from './games/BrainTeasers'

const games = [
  {
    id: 'peg-solitaire',
    name: 'Peg Solitaire',
    icon: '🎯',
    description: 'Jump pegs to remove them. Try to leave only one peg remaining!',
    difficulty: 'hard',
    component: PegSolitaire
  },
  {
    id: 'klotski',
    name: 'Klotski',
    icon: '🟥',
    description: 'Slide blocks to move the red block to the exit. Minimum 81 moves needed!',
    difficulty: 'hard',
    component: Klotski
  },
  {
    id: 'knights-tour',
    name: "Knight's Tour",
    icon: '♞',
    description: 'Move the knight to visit every square exactly once. A chess puzzle!',
    difficulty: 'hard',
    component: KnightsTour
  },
  {
    id: 'nonogram',
    name: 'Nonogram',
    icon: '🖼️',
    description: 'Use the number clues to reveal the hidden picture. Pure logic puzzle!',
    difficulty: 'hard',
    component: Nonogram
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    icon: '🔢',
    description: 'Fill the 9x9 grid so each row, column, and 3x3 box has digits 1-9.',
    difficulty: 'variable',
    component: Sudoku
  },
  {
    id: 'lights-out',
    name: 'Lights Out',
    icon: '💡',
    description: 'Toggle lights to turn them all off. Each click affects neighbors!',
    difficulty: 'hard',
    component: LightsOut
  },
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    icon: '🗼',
    description: 'Move all disks to the rightmost peg. Larger disks cannot go on smaller ones!',
    difficulty: 'medium',
    component: TowerOfHanoi
  },
  {
    id: '15-puzzle',
    name: '15 Puzzle',
    icon: '🧩',
    description: 'Slide tiles to arrange numbers 1-15 in order. A classic brain teaser!',
    difficulty: 'medium',
    component: FifteenPuzzle
  },
  {
    id: 'simon-says',
    name: 'Simon Says',
    icon: '🎨',
    description: 'Remember and repeat the color pattern. How far can you go?',
    difficulty: 'variable',
    component: SimonSays
  },
  {
    id: 'brain-teasers',
    name: 'Brain Teasers',
    icon: '🧠',
    description: 'Challenge your mind with difficult riddles and brain teasers. Can you solve them?',
    difficulty: 'hard',
    component: BrainTeasers
  }
]

function App() {
  const [currentGame, setCurrentGame] = useState(null)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  if (currentGame) {
    const GameComponent = currentGame.component
    return (
      <div className="app">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <GameComponent onBack={() => setCurrentGame(null)} />
      </div>
    )
  }

  return (
    <div className="app">
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className="home">
        <div className="home-hero">
          <div className="home-badge">🎮 10 Classic Games</div>
          <h1>Casual Games</h1>
          <p className="subtitle">Pick a game and challenge yourself!</p>
        </div>

        <div className="games-grid">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => setCurrentGame(game)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="icon">{game.icon}</div>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
              <div className="card-footer">
                <span className={`difficulty ${game.difficulty}`}>
                  {game.difficulty === 'variable' ? 'Adjustable' : game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                </span>
                <span className="play-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
