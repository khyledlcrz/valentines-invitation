# 💝 Valentine's Invitation System

A special Valentine's Day invitation website with a Wordle-style puzzle game!

## 🎮 Features

- **Interactive Word Puzzle**: Wordle-style game where your girlfriend has to guess "WILL YOU BE MY VALENTINE"
- **Clever Answer System**: Only accepts "YES" as the answer (with hints!)
- **Beautiful Animations**: Confetti, floating hearts, and smooth transitions
- **Mobile-Friendly**: Fully responsive design that works on all devices
- **Romantic Reveal**: Special message and celebration after saying yes!

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open your browser and visit `http://localhost:5173`

## 📦 Deployment to GitHub Pages

### First Time Setup

1. Create a new repository on GitHub named `valentines-invitation`

2. Initialize git and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Valentine's invitation website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/valentines-invitation.git
git push -u origin main
```

3. Update `vite.config.js` with your GitHub username:

```javascript
export default defineConfig({
  plugins: [react()],
  base: "/valentines-invitation/", // Change if your repo name is different
});
```

### Deploy

Deploy to GitHub Pages:

```bash
npm run deploy
```

Your site will be available at: `https://YOUR_USERNAME.github.io/valentines-invitation/`

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select `gh-pages` branch
4. Click "Save"
5. Wait a few minutes and your site will be live!

## 🎨 Customization

### Modify the Final Message

Edit the reveal stage in [src/App.jsx](src/App.jsx#L250-L289) to personalize your message.

### Change Colors

The color scheme uses Tailwind's rose/pink/red gradients. You can modify these in the component classes.

### Add More Stages

The app uses a stage system (`'game'`, `'question'`, `'loading'`, `'reveal'`). You can add more stages by:

1. Adding a new stage name
2. Creating a render function
3. Adding it to the main return statement

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **react-confetti** - Confetti effects

## 💡 How It Works

1. **Word Puzzle Stage**: Player types to guess "WILLYOUBEMYVALENTINE"
   - Green tiles = correct letter in correct position
   - Yellow tiles = correct letter in wrong position
   - Gray tiles = letter not in the phrase
   - "Give Up" button skips to next stage

2. **Question Stage**: "Will you be my Valentine?"
   - Only "YES" is accepted
   - Keyboard keys that spell "YES" are highlighted
   - Hint appears when user tries to type

3. **Loading Stage**: Brief transition with animation

4. **Reveal Stage**: Final romantic message with confetti and floating hearts

## 📱 Mobile Friendly

The entire experience is optimized for mobile devices with:

- Responsive grid layouts
- Touch-friendly buttons
- Proper viewport scaling
- Mobile-optimized font sizes

## ❤️ Made with Love

Created with React, Tailwind CSS, and lots of ❤️ for a special Valentine's Day!

---

**Note**: Remember to send the link to your girlfriend and enjoy her reaction! 🥰
