# Casual Games

A collection of engaging single-player puzzle games built with React. All games are pure logic - no randomness or luck involved!

## Games Included

| Game | Description | Difficulty |
|------|-------------|------------|
| **Peg Solitaire** | Jump pegs to remove them. Try to leave only one peg remaining! | Hard |
| **Klotski** | Slide blocks to move the red block to the exit. Minimum 81 moves needed! | Hard |
| **Knight's Tour** | Move the knight to visit every square exactly once. A chess puzzle! | Hard |
| **Nonogram** | Use the number clues to reveal the hidden picture. Pure logic puzzle! | Hard |
| **Sudoku** | Fill the 9x9 grid so each row, column, and 3x3 box has digits 1-9. | Adjustable |
| **Lights Out** | Toggle lights to turn them all off. Each click affects neighbors! | Hard |
| **Tower of Hanoi** | Move all disks to the rightmost peg. Larger disks cannot go on smaller ones! | Medium |
| **15 Puzzle** | Slide tiles to arrange numbers 1-15 in order. A classic brain teaser! | Medium |
| **Simon Says** | Remember and repeat the color pattern. How far can you go? | Adjustable |
| **Brain Teasers** | Challenge your mind with difficult riddles and brain teasers. Can you solve them? | Hard |

## Local Development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

### 1. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., `casual-games`)
3. Don't initialize with README

### 2. Configure Vite for GitHub Pages

Edit `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/casual-games/', // Replace with your repo name
})
```

### 3. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 4. Add Deploy Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 5. Initialize Git and Push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/casual-games.git
git push -u origin main
```

### 6. Deploy

```bash
npm run deploy
```

### 7. Enable GitHub Pages

1. Go to your repository Settings > Pages
2. Source: Deploy from branch
3. Branch: `gh-pages` / `/ (root)`
4. Save

Your site will be live at: `https://YOUR_USERNAME.github.io/casual-games/`

## Game Controls

### Sudoku
- Click a cell, then type a number (1-9) or use the number pad

### Nonogram
- **Left-click**: Fill a cell
- **Shift+click** or **Right-click**: Mark as empty (X)

### Tower of Hanoi
- Click a peg to pick up its top disk, click another peg to place it

### Other Games
- Click/tap to interact
