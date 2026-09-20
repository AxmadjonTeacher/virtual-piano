# 🎹 Virtual Piano Player

> Autonomous browser-controlled virtual piano player with 88 visible keys, sustain pedal resonance, and studio-grade Web Audio synthesis. Designed as both a standalone CLI and an AI agent skill for **Antigravity**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: >=18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Puppeteer](https://img.shields.io/badge/puppeteer--core-%5E25.0.0-orange.svg)](https://pptr.dev/)

---

## ✨ Features

- 🎹 **Full 88-Key Keyboard Support**: Automatically expands layout to Full and sets visible keys to Max (88 keys).
- 🔊 **Studio Direct Native Audio Bridge**: Bypasses OS keyboard input lag by connecting directly into the underlying Web Audio synthesis engine with visual key glow feedback.
- 🎼 **Curated Song Library**: Includes masterpieces by Chopin, Yann Tiersen, Beethoven, Vivaldi, Nicholas Britell, and Dr. Dre.
- ⚡ **Instant Execution**: Run immediately via `npx`, install globally via `npm`, or use as an AI agent skill in Antigravity.
- 🛡️ **Auto-Healing & Recovery**: Pre-flight singleton lock cleanup and signal traps ensure smooth playback with zero orphaned browser processes.

---

## 🚀 Quick Start

### 1. Instant Run via NPX
Play any song instantly without manual installation:

```bash
npx virtual-piano-player amelie
# or
npx virtual-piano-player nocturne
```

---

### 2. Global CLI Installation
Install globally to get access to the `piano` and `virtual-piano` commands:

```bash
npm install -g virtual-piano-player

# View catalog
piano

# Play songs
piano amelie
piano nocturne
piano succession
piano still
```

---

### 3. Install as an Antigravity AI Agent Skill
To equip your Antigravity agent or assistant with piano playing capabilities:

```bash
# Clone directly into your global agents skills directory:
git clone https://github.com/AxmadjonTeacher/virtual-piano.git ~/.agents/skills/virtual-piano-player
cd ~/.agents/skills/virtual-piano-player
npm install
```

---

## 🎵 Song Catalog

| Alias | Shortcut | Title | Composer / Artist | Key | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `amelie` | `play-amelie` | Amélie (Comptine d'un autre été) | Yann Tiersen | E minor | ~122s |
| `nocturne` | `play-nocturne` | Nocturne Op. 9 No. 2 (Andante) | Frédéric Chopin (Csabay Domonkos) | Eb major | ~248s |
| `succession` | `play-succession` | Succession (Main Title Theme) | Nicholas Britell | C minor | ~89s |
| `still` | `play-still` | Still D.R.E. (Polished Master) | Dr. Dre ft. Snoop Dogg | A minor | ~66s |
| `paint` | `play-paint` | Paint It, Black | The Rolling Stones (Westworld) | E minor | ~50s |
| `winter` | `play-winter` | Winter (L'Inverno - Allegro) | Antonio Vivaldi | F minor | ~45s |
| `chopin` | `play-chopin` | Impromptu-Etude in C# minor | Frédéric Chopin style | C# minor | ~60s |
| `elise` | `play-elise` | Für Elise (Bagatelle No. 25) | Ludwig van Beethoven | A minor | ~25s |

---

## 🛠️ CLI Usage & Options

```text
Virtual Piano Player CLI
Usage: piano [options] [song_alias]

Options:
  --song, -s <name>   Preset song name or alias (e.g. "amelie", "nocturne", "still")
  --list, -l          Display the interactive song catalog table
  --file, -f <path>   Path to custom song JSON file
  --tempo, -t <float> Tempo multiplier (default: 1.0; e.g. 1.2 for faster, 0.8 for slower)
  --headless <bool>   Run in headless mode (default: false)
  --sustain <bool>    Enable sustain pedal (default: true)
  --help, -h          Show help message
```

### Examples:
```bash
# Play Chopin Nocturne at 1.15x tempo
piano nocturne --tempo 1.15

# Run in headless mode for automated audio rendering
piano elise --headless true

# Play a custom song file
piano --file ./my_composition.json
```

---

## 💻 Programmatic API (Node.js)

You can also use Virtual Piano Player directly within your own Node.js scripts:

```javascript
const { play, listSongs, NOTE_MAP, noteToMidi } = require('virtual-piano-player');

// Display catalog
listSongs();

// Play a song programmatically
await play();
```

---

## 📦 Local Development & Verification

To contribute or test changes locally:

```bash
# Clone the repository
git clone https://github.com/AxmadjonTeacher/virtual-piano.git
cd virtual-piano

# Install dependencies
npm install

# Symlink package binary locally
npm link

# Test CLI commands globally
piano --list
piano elise --headless true

# Unlink when finished
npm unlink -g virtual-piano-player
```

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright (c) 2026 **AxmadjonTeacher**.
