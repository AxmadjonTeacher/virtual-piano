---
name: virtual-piano-player
description: Controls the browser to navigate to OnlinePianist (https://www.onlinepianist.com/virtual-piano), configure the 88-key piano interface (set visible keys to Max), and play classical, pop, jazz, or custom piano solos, melodies, and chords using automated keyboard simulation and studio-grade Web Audio synthesis.
---

# Virtual Piano Player Skill & CLI

This skill and standalone CLI automates the **[OnlinePianist Virtual Piano](https://www.onlinepianist.com/virtual-piano)** in Google Chrome. It automatically expands the keyboard to the full **88 visible keys**, activates the sustain pedal, connects directly into the browser's Web Audio synthesis engine (**Studio Direct** audio bridge), and performs classical piano solos, chords, or custom compositions with expressive timing and visual glow effects on each key.

---

## When to Activate This Skill

Activate this skill whenever the user:
- Asks to play, compose, or perform a song, melody, or solo on the OnlinePianist virtual piano (`https://www.onlinepianist.com/virtual-piano`).
- Mentions playing piano in the browser, controlling keyboard keys, or playing works by composers like Chopin, Yann Tiersen, Beethoven, Vivaldi, Nicholas Britell, or Dr. Dre.
- Requests setting visible keys to max / full 88-key piano view and performing music.
- Asks to manage, list, add, or publish songs to the virtual piano package or repository.

---

## Project & Directory Structure

```text
virtual-piano-player/
├── bin/
│   └── cli.js                    # Executable CLI binary (piano, virtual-piano, npx runner)
├── docs/                         # GitHub Pages zero-install Web Player
│   ├── index.html                # Modern 88-key web player with Synthesia visualizer
│   ├── style.css                 # Dark studio theme, 3D keys & glassmorphism
│   ├── app.js                    # Web Audio synth engine, falling notes canvas & player
│   ├── songs-manifest.json       # Metadata catalog for all 18 songs
│   └── songs/                    # Normalized JSON song files for web player
├── scripts/
│   ├── play.js                   # Master playback engine, cross-platform Chrome & audio bridge
│   ├── list.sh                   # In-directory bash catalog runner
│   └── songs/                    # Curated library of high-precision song JSONs
│       ├── golden_hour.json      # JVKE's Golden Hour (unabridged cascading piano ~207s)
│       ├── idea_10.json          # Gibran Alcocer's Idea 10 (3/4 waltz arpeggios ~125s)
│       ├── solas.json            # Jamie Duffy's Solas (emotive Celtic piano solo ~214s)
│       ├── blue.json             # Yung Kai's Blue (tender ballad ~113s)
│       ├── love_story.json       # Indila's Love Story (Bb minor harp & piano ~253s)
│       ├── hijo_de_la_luna.json  # Mecano's Hijo de la Luna (expressive A minor ~268s)
│       ├── pretty_little_baby.json # Connie Francis' Pretty Little Baby (1962 pop swing ~94s)
│       ├── hotline.json          # Billie Eilish's Hotline Edit (haunting ballad ~94s)
│       ├── i_thought_i_saw_your_face_today.json # She & Him's 60s folk swing ~86s
│       ├── every_living_breathing_moment.json # Grant Steller's cinematic theme ~101s
│       ├── chopin_nocturne.json  # Chopin's Nocturne Op. 9 No. 2 (Csabay Domonkos perf. ~248s)
│       ├── chopin_etude.json     # Fast Chopin Impromptu-Etude in C# minor
│       ├── vivaldi_winter.json   # Vivaldi's Winter (L'Inverno - Allegro non molto)
│       ├── paint_it_black.json   # The Rolling Stones' Paint It, Black
│       ├── still_dre.json        # Dr. Dre & Snoop Dogg's Still D.R.E.
│       ├── succession.json       # Nicholas Britell's Succession (Main Title Theme)
│       ├── amelie.json           # Yann Tiersen's Comptine d'un autre été (Amélie)
│       └── fur_elise.json        # Beethoven's Für Elise theme
├── index.js                      # Programmatic Node.js exports (play, listSongs, loadSong)
├── index.html                    # Root redirect to docs/ for GitHub Pages
├── package.json                  # NPM manifest with bin mappings, files whitelist & dependencies
├── package-lock.json             # Exact dependency lockfile (puppeteer-core)
├── SKILL.md                      # Agent skill instructions & key mappings
├── skill.json                    # Skill metadata for Antigravity & agent discovery
├── README.md                     # Public documentation, quickstart & catalog table
├── LICENSE                       # MIT License (AxmadjonTeacher)
└── .gitignore                    # Ignores node_modules/, scratch/, /tmp profiles, logs
```

---

## 🌐 Public Distribution & Releases

- **NPM Package**: [`virtual-piano-by-axmadjon`](https://www.npmjs.com/package/virtual-piano-by-axmadjon)
- **GitHub Repository**: [https://github.com/AxmadjonTeacher/virtual-piano](https://github.com/AxmadjonTeacher/virtual-piano)
- **Global Binaries**: `piano`, `virtual-piano`, `virtual-piano-by-axmadjon`

### 📦 Summary of Future Releases

Whenever you add new songs or tweak code, just run:

  cd ~/.agents/skills/virtual-piano-player
  npm version patch          # Increments version and tags git
  git push origin main --tags
  npm publish

---

## Quick Usage

### 1. View Song Catalog:
Run any of the following to see the interactive catalog table with all titles, composers, durations, and keys:
```bash
piano                        # From anywhere (via zsh function & npm link)
virtual-piano                # Direct npm binary
songs                        # Shell shortcut
./scripts/list.sh            # When inside virtual-piano-player directory
node scripts/play.js --list  # Direct Node CLI
```

### 2. Play Songs via Shell Shortcuts:
```bash
# Play with master "piano" or "virtual-piano" command:
piano golden                 # JVKE - Golden Hour (unabridged cascading piano)
piano idea10                 # Gibran Alcocer - Idea 10 (3/4 waltz arpeggios)
piano solas                  # Jamie Duffy - Solas (emotive Celtic piano solo)
piano blue                   # Yung Kai - Blue (tender ballad)
piano lovestory              # Indila - Love Story (Bb minor harp & piano)
piano luna                   # Mecano - Hijo de la Luna (expressive A minor)
piano baby                   # Connie Francis - Pretty Little Baby (1962 pop swing)
piano hotline                # Billie Eilish - Hotline Edit (haunting ballad)
piano face                   # She & Him - I Thought I Saw Your Face Today
piano moment                 # Grant Steller - Every Living Breathing Moment
piano nocturne               # Chopin - Nocturnes, Op. 9: No. 2 (Domonkos Csabay)
piano amelie                 # Yann Tiersen - Comptine d'un autre été (Amélie)
piano succession             # Nicholas Britell - Succession Main Title Theme
piano still                  # Dr. Dre & Snoop Dogg - Still D.R.E.
piano paint                  # The Rolling Stones - Paint It, Black
piano winter                 # Vivaldi - Winter (L'Inverno)
piano chopin                 # Chopin - Fast Impromptu-Etude
piano elise                  # Beethoven - Für Elise

# Or play with direct shortcut aliases:
play-golden
play-idea10
play-solas
play-blue
play-lovestory
play-luna
play-baby
play-hotline
play-face
play-moment
play-nocturne
play-amelie
play-succession
play-still
play-paint
play-winter
play-chopin
play-elise

# Play at custom tempo (e.g. 1.15x speed):
piano golden --tempo 1.15

# Play headlessly (for audio testing/CI):
piano elise --headless true

# Play a custom song JSON file:
piano --file /path/to/my_song.json
```

### 3. Instant Zero-Install Execution (NPX):
```bash
npx virtual-piano-by-axmadjon golden
npx virtual-piano-by-axmadjon solas
npx virtual-piano-by-axmadjon idea10
npx virtual-piano-by-axmadjon amelie
```

---

## 🎵 Song Catalog Reference

| Alias | Shortcut | Title | Composer / Artist | Key | Duration | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `amelie` | `play-amelie` | Amélie (Comptine d'un autre été) | Yann Tiersen | E minor | ~122s | 945 notes, client timeline |
| `nocturne` | `play-nocturne` | Nocturne Op. 9 No. 2 (Andante) | Frédéric Chopin (Csabay Domonkos) | Eb major | ~248s | 1,242 notes, full unabridged |
| `golden` | `play-golden` | Golden Hour | JVKE | E major | ~207s | 2,716 notes, sparkling arpeggios |
| `idea10` | `play-idea10` | Idea 10 | Gibran Alcocer | G minor | ~125s | 925 notes, 3/4 waltz arpeggios |
| `solas` | `play-solas` | Solas | Jamie Duffy | E minor | ~214s | 1,636 notes, full 78-measure authentic score |
| `blue` | `play-blue` | Blue | Yung Kai | E major | ~113s | 684 notes, tender acoustic ballad & melody |
| `lovestory` | `play-lovestory` | Love Story | Indila | Bb minor | ~253s | 1,655 notes, concert harp & piano |
| `luna` | `play-luna` | Hijo de la Luna | Mecano (José María Cano) | A minor | ~268s | 1,636 notes, expressive piano score |
| `baby` | `play-baby` | Pretty Little Baby | Connie Francis | Db major | ~94s | 754 notes, 1962 pop swing |
| `hotline` | `play-hotline` | Hotline (Edit) | Billie Eilish | A minor | ~94s | 329 notes, intimate acoustic ballad |
| `face` | `play-face` | I Thought I Saw Your Face Today | She & Him (Zooey Deschanel) | G major | ~86s | 550 notes, 60s folk pop swing |
| `moment` | `play-moment` | Every Living Breathing Moment | Grant Steller | F major | ~101s | 431 notes, cinematic film score |
| `succession` | `play-succession` | Succession (Main Title Theme) | Nicholas Britell | C minor | ~89s | 390 notes, hip-hop/classical |
| `still` | `play-still` | Still D.R.E. (Polished Master) | Dr. Dre ft. Snoop Dogg | A minor | ~66s | 374 notes, classic 8-beat loop |
| `paint` | `play-paint` | Paint It, Black | The Rolling Stones (Westworld) | E minor | ~50s | 98 events, driving rock rhythm |
| `winter` | `play-winter` | Winter (L'Inverno - Allegro) | Antonio Vivaldi | F minor | ~45s | 80 events, rapid violin runs |
| `chopin` | `play-chopin` | Impromptu-Etude in C# minor | Frédéric Chopin style | C# minor | ~60s | 257 events, tempestuous arpeggios |
| `elise` | `play-elise` | Für Elise (Bagatelle No. 25) | Ludwig van Beethoven | A minor | ~25s | 53 events, famous theme |

---

## 88-Key Keyboard Mapping Reference

OnlinePianist maps 5 full octaves (C2 through C7) directly to standard computer keyboard characters in the **Full** layout:

| Octave | Note | Keyboard Key | Shift? | Octave | Note | Keyboard Key | Shift? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2** | C2 | `1` | No | **4** | G#4 / Ab4 | `O` | **Shift+O** |
| **2** | C#2 / Db2 | `!` | **Shift+1** | **4** | A4 | `p` | No |
| **2** | D2 | `2` | No | **4** | A#4 / Bb4 | `P` | **Shift+P** |
| **2** | D#2 / Eb2 | `@` | **Shift+2** | **4** | B4 | `a` | No |
| **2** | E2 | `3` | No | **5** | C5 | `s` | No |
| **2** | F2 | `4` | No | **5** | C#5 / Db5 | `S` | **Shift+S** |
| **2** | F#2 / Gb2 | `$` | **Shift+4** | **5** | D5 | `d` | No |
| **2** | G2 | `5` | No | **5** | D#5 / Eb5 | `D` | **Shift+D** |
| **2** | G#2 / Ab2 | `%` | **Shift+5** | **5** | E5 | `f` | No |
| **2** | A2 | `6` | No | **5** | F5 | `g` | No |
| **2** | A#2 / Bb2 | `^` | **Shift+6** | **5** | F#5 / Gb5 | `G` | **Shift+G** |
| **2** | B2 | `7` | No | **5** | G5 | `h` | No |
| **3** | C3 | `8` | No | **5** | G#5 / Ab5 | `H` | **Shift+H** |
| **3** | C#3 / Db3 | `*` | **Shift+8** | **5** | A5 | `j` | No |
| **3** | D3 | `9` | No | **5** | A#5 / Bb5 | `J` | **Shift+J** |
| **3** | D#3 / Eb3 | `(` | **Shift+9** | **5** | B5 | `k` | No |
| **3** | E3 | `0` | No | **6** | C6 | `l` | No |
| **3** | F3 | `q` | No | **6** | C#6 / Db6 | `L` | **Shift+L** |
| **3** | F#3 / Gb3 | `Q` | **Shift+Q** | **6** | D6 | `z` | No |
| **3** | G3 | `w` | No | **6** | D#6 / Eb6 | `Z` | **Shift+Z** |
| **3** | G#3 / Ab3 | `W` | **Shift+W** | **6** | E6 | `x` | No |
| **3** | A3 | `e` | No | **6** | F6 | `c` | No |
| **3** | A#3 / Bb3 | `E` | **Shift+E** | **6** | F#6 / Gb6 | `C` | **Shift+C** |
| **3** | B3 | `r` | No | **6** | G6 | `v` | No |
| **4** | C4 (Middle C) | `t` | No | **6** | G#6 / Ab6 | `V` | **Shift+V** |
| **4** | C#4 / Db4 | `T` | **Shift+T** | **6** | A6 | `b` | No |
| **4** | D4 | `y` | No | **6** | A#6 / Bb6 | `B` | **Shift+B** |
| **4** | D#4 / Eb4 | `Y` | **Shift+Y** | **6** | B6 | `n` | No |
| **4** | E4 | `u` | No | **7** | C7 | `m` | No |
| **4** | F4 | `i` | No | | | | |
| **4** | F#4 / Gb4 | `I` | **Shift+I** | | | | |
| **4** | G4 | `o` | No | | | | |

---

## Technical Architecture & Automation Checklist

1. **Cross-Platform Chrome Auto-Discovery**: Uses `puppeteer-core` with automatic executable discovery across macOS (`/Applications/Google Chrome.app`, `~/Applications/...`, Edge, Brave, Chromium), Windows (`%LOCALAPPDATA%`, `%PROGRAMFILES%`), and Linux (`/usr/bin/google-chrome`, `/usr/bin/chromium`). Users can also override via `--chrome <path>` or `CHROME_PATH` env variable.
2. **Pre-flight Lock Cleanup & Auto-Recovery**: Prior to launching, `play.js` terminates orphaned `chrome-piano-profile` processes and removes stale `Singleton*` lock files in the cross-platform temporary directory (`path.join(os.tmpdir(), 'chrome-piano-profile')`), preventing browser startup collisions.
3. **Signal Trapping**: Intercepts `SIGINT` (Ctrl+C) and `SIGTERM` to close browser windows cleanly and release profile locks.
4. **Bring Window to Front**: On macOS, executes `osascript -e 'tell application "Google Chrome" to activate'` so visual animations and audio playback are front and center.
5. **Sound Engine Synchronization**: Polls until `!document.body.innerText.includes('WARMING UP PIANO')` so Web Audio samples are loaded before notes trigger.
6. **Set Visible Keys to Max**:
   - Clicks `.synth-btn--settings`.
   - Clicks `Full` layout and `Max` visible keys (88 keys).
   - Verifies 88 keys exist in DOM (`document.querySelectorAll('.piano-key-white, .piano-key-black').length === 88`).
7. **Ensure Sustain Pedal**: Confirms `.synth-btn--sustain` has class `synth-btn--on`.
8. **Studio Direct Audio Bridge**: Connects directly into OnlinePianist's Web Audio synthesis engine (`window.__playMidi`, `window.__releaseMidi`), bypassing OS keyboard modifier drops and ensuring 100% pitch fidelity for all black and white keys with simultaneous visual key glow.
9. **Zero-Install Web Player (docs/)**: Standalone HTML5/CSS3/ES6 web app hosted on GitHub Pages (`https://axmadjonteacher.github.io/virtual-piano/`) with physical acoustic grand piano additive synthesis, falling notes Synthesia canvas visualizer, and live interactive playing.
10. **Dual Playback Formats**:
   - `notes`: High-precision client-side timeline arrays with exact millisecond timestamps (`startMs`, `durMs`, `midi`), used for complex multi-track classical scores (Amélie, Chopin Nocturne, Still D.R.E.).
   - `events`: Sequential note events (`keys`, `dur`, `wait`), normalized into millisecond timelines for both browser and CLI execution.
