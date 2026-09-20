---
name: virtual-piano-player
description: Controls the browser to navigate to OnlinePianist (https://www.onlinepianist.com/virtual-piano), configure the 88-key piano interface (set visible keys to Max), and play classical, pop, jazz, or custom piano solos, melodies, and chords using automated keyboard simulation and Web Audio.
---

# Virtual Piano Player Skill

This skill automates the **[OnlinePianist Virtual Piano](https://www.onlinepianist.com/virtual-piano)** in the browser. It configures the keyboard to the full **88 visible keys**, activates the sustain pedal, and plays classical piano solos, chords, or custom compositions with expressive timing and visual glow effects on each key.

---

## When to Activate This Skill

Activate this skill whenever the user:
- Asks to play, compose, or perform a song, melody, or solo on the OnlinePianist virtual piano (`https://www.onlinepianist.com/virtual-piano`).
- Mentions playing piano in the browser, controlling keyboard keys, or playing in the style of composers like Chopin, Beethoven, Mozart, Bach, Debussy, or modern artists.
- Requests setting visible keys to max / full 88-key piano view and performing music.

---

## Directory Structure

```text
virtual-piano-player/
├── SKILL.md                          # Main skill instructions and documentation
├── package.json                      # Node dependencies (puppeteer-core)
└── scripts/
    ├── play.js                       # Master CLI runner for browser automation & playback
    └── songs/
        ├── chopin_nocturne.json      # Chopin's Nocturne Op. 9 No. 2 (Csabay Domonkos perf. ~248s)
        ├── chopin_etude.json         # 60s Fast Chopin Impromptu-Etude in C# minor
        ├── vivaldi_winter.json       # Vivaldi's Winter (L'Inverno - Allegro non molto)
        ├── paint_it_black.json       # The Rolling Stones' Paint It, Black
        ├── still_dre.json            # Dr. Dre & Snoop Dogg's Still D.R.E.
        ├── succession.json           # Nicholas Britell's Succession (Main Title Theme)
        ├── amelie.json               # Yann Tiersen's Comptine d'un autre été (Amélie)
        └── fur_elise.json            # Beethoven's Für Elise theme
```

---

## Quick Usage

### View Available Songs Catalog:
Run any of the following to see the catalog table with all titles, composers, durations, and keys:
```bash
piano                        # From anywhere (via zsh function)
songs                        # Global alias
./scripts/list.sh            # When inside virtual-piano-player directory
node scripts/play.js --list  # Direct Node CLI
```

### Play Songs via Shell Shortcuts:
```bash
# Play with master "piano" command:
piano nocturne               # Chopin - Nocturnes, Op. 9: No. 2 (Domonkos Csabay)
piano amelie                 # Yann Tiersen - Comptine d'un autre été (Amélie)
piano succession             # Nicholas Britell - Succession Main Title Theme
piano still                  # Dr. Dre & Snoop Dogg - Still D.R.E.
piano paint                  # The Rolling Stones - Paint It, Black
piano winter                 # Vivaldi - Winter (L'Inverno)
piano chopin                 # Chopin - Fast Impromptu-Etude
piano elise                  # Beethoven - Für Elise

# Or play with direct shortcut aliases:
play-nocturne
play-amelie
play-succession
play-still
play-paint
play-winter
play-chopin
play-elise

# Play at custom tempo (e.g. 1.2x speed):
piano chopin --tempo 1.2

# Play a custom song JSON file:
piano --file /path/to/my_song.json
```

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

## How to Compose New Songs

Songs are JSON objects with an array of sequential `events`. Each event contains:
- `keys`: An array of note strings (e.g. `["C4"]` or `["C4", "E4", "G4"]` for a chord), or direct key letters (e.g. `["t", "u", "o"]`).
- `dur`: Note hold duration in milliseconds (e.g. `80` for staccato / 16th-note, `400` for quarter note).
- `wait`: Pause before the next event in milliseconds (e.g. `20` for continuous legato, `200` for rests).

### Example Song JSON

```json
{
  "title": "Moonlight Sonata (Opening Theme)",
  "composer": "Ludwig van Beethoven",
  "key": "C# minor",
  "events": [
    { "keys": ["Cs2", "Cs3"], "dur": 600, "wait": 100 },
    { "keys": ["Gs3"], "dur": 180, "wait": 40 },
    { "keys": ["Cs4"], "dur": 180, "wait": 40 },
    { "keys": ["E4"], "dur": 180, "wait": 40 },
    { "keys": ["Gs3"], "dur": 180, "wait": 40 },
    { "keys": ["Cs4"], "dur": 180, "wait": 40 },
    { "keys": ["E4"], "dur": 180, "wait": 40 }
  ]
}
```

---

## Procedural Automation Checklist

When automating OnlinePianist:
1. **Launch Google Chrome**: Use `puppeteer-core` pointing to `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
2. **Bring Window to Front**: Execute `osascript -e 'tell application "Google Chrome" to activate'` so visual animations and audio playback are front and center.
3. **Wait for Sound Engine**: Poll until `!document.body.innerText.includes('WARMING UP PIANO')` so Web Audio fonts are fully initialized before playing.
4. **Remove Ad Overlays**: Remove `#layoutDesign` and `.vp-btf-container` from the DOM to avoid pointer interception.
5. **Set Visible Keys to Max**:
   - Click `.synth-btn--settings`.
   - Find the button with text `Max` under `VISIBLE KEYS` and click it.
   - Close the settings menu by clicking `.synth-btn--settings` again.
6. **Verify 88 Keys**: Ensure `document.querySelectorAll('.piano-key-white, .piano-key-black').length === 88`.
7. **Ensure Sustain Pedal**: Verify `.synth-btn--sustain` has class `synth-btn--on`.
8. **Native Audio Bridge**: Connects directly to OnlinePianist's Web Audio synthesis engine (`te.playNote(midi)`), eliminating OS keyboard modifier drops and ensuring 100% pitch fidelity for all black and white keys with simultaneous visual key glow.
9. **Dual Playback Formats**:
   - `notes`: High-precision client-side timeline arrays with exact millisecond timestamps (`startMs`, `durMs`, `midi`), ideal for official transcribed multi-track scores.
   - `events`: Sequential step-by-step note events (`keys`, `dur`, `wait`), ideal for custom solos and arrangements.
