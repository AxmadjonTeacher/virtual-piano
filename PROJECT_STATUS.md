# 🎹 Virtual Piano Player — Project Status & Handover Documentation

> **Status Date**: September 21, 2026  
> **Package Version**: `1.0.2`  
> **NPM Package**: [`virtual-piano-by-axmadjon@1.0.2`](https://www.npmjs.com/package/virtual-piano-by-axmadjon)  
> **GitHub Repository**: [`AxmadjonTeacher/virtual-piano`](https://github.com/AxmadjonTeacher/virtual-piano)  
> **Web Player**: [https://axmadjonteacher.github.io/virtual-piano/](https://axmadjonteacher.github.io/virtual-piano/)  
> **Skill URI**: `/Users/ahmetyadgarov/.agents/skills/virtual-piano-player`  
> **Global Agent Mirror**: `~/.gemini/config/skills/virtual-piano-player`

---

## 🎯 Executive Summary for Subsequent Agents

The **Virtual Piano Player** is a production-grade autonomous browser automation tool and standalone CLI for the **OnlinePianist** virtual piano interface (`https://www.onlinepianist.com/virtual-piano`), alongside a zero-install **HTML5/CSS3/ES6 Web Player** deployed on GitHub Pages.

All 18 song scores in the catalog are high-precision, authentic multi-track timelines encoded in JSON (`notes: [{midi, note, startMs, durMs, vel}]`).

---

## 🎼 Recent Major Refinements (v1.0.1 → v1.0.2)

### 1. Gibran Alcocer — Idea 10
* **Structure**: Full **118-measure** authentic score transcribed from official sheet music in **G minor (3/4 time)**.
* **Content**: Fast flowing 3/4 waltz arpeggios, expressive rubato phrasing, delicate left-hand accompaniment, and resonant minor resolution.
* **Metrics**: 925 notes, target duration ~125s.
* **Files**: `scripts/songs/idea_10.json` & `docs/songs/idea_10.json`.

### 2. Jamie Duffy — Solas
* **Structure**: Full **78-measure** unabridged score transcribed from the official 5-page sheet music in **E minor (12/8 compound meter, dotted quarter = 90 BPM)**.
* **Content**:
  * Authentic opening motif (`F#5 → A5 | G5 → D#5`).
  * Iconic 12-note flowing arpeggio wave (`E4 - G4 - B4 - E5 - B4 - G4`).
  * Lyrical theme with genuine mordent ornaments on `E5`, `D5`, `A5`, `B5`.
  * Soaring **8va** variation in measures 35–42.
  * Fortissimo climax in measures 51–58 with sweeping multi-octave arpeggios.
  * Serene coda with fermatas, ascending harp run (`D#5 - G5 - B5 - E6 - F#6 - B6`), and deep low E minor chord (`E1 - E2 - B2 - E3 - G3`).
* **Metrics**: 1,636 notes, target duration ~214s.
* **Files**: `scripts/songs/solas.json` & `docs/songs/solas.json`.

### 3. Yung Kai — Blue
* **Structure**: Rebuilt in **E Major (6/8 ballad time, dotted quarter = 62 BPM)** across **56 measures**.
* **Content**:
  * Replaced muddy block chords with the complete singing vocal melody line:
    * *"Your morning eyes, I could stare like watching stars..."*
    * *"You'd be mine, would you mind if I took your hand tonight..."*
    * *"I'll imagine we fell in love, I'll nap under moonlight skies with you..."*
    * *"Quiet on a Sunday afternoon... tell me what I gotta do..."*
  * Rich 6/8 ballad left-hand arpeggios (`Amaj7 - B7 - E - G#m7 - C#m7`).
  * Soaring 8va peak chorus, delicate bridge (*"It's blue..."*), and ethereal harp arpeggio finish.
* **Metrics**: 684 notes, target duration ~113s.
* **Files**: `scripts/songs/blue.json` & `docs/songs/blue.json`.

---

## 📁 Repository & Directory Layout

```text
virtual-piano-player/
├── bin/
│   └── cli.js                    # Executable CLI binary (piano, virtual-piano, npx runner)
├── docs/                         # GitHub Pages Zero-Install Web Player
│   ├── index.html                # Modern 88-key web player with Synthesia visualizer
│   ├── style.css                 # Dark studio theme, 3D keys & glassmorphism
│   ├── app.js                    # Web Audio synth engine, falling notes canvas & player
│   ├── songs-manifest.json       # Metadata catalog for all 18 songs
│   └── songs/                    # Normalized JSON song files for web player
├── scripts/
│   ├── play.js                   # Master playback engine, cross-platform Chrome & audio bridge
│   ├── list.sh                   # In-directory bash catalog runner
│   └── songs/                    # Curated library of high-precision song JSONs (18 songs)
├── PROJECT_STATUS.md             # This handover & architecture document
├── index.js                      # Programmatic Node.js exports (play, listSongs, loadSong)
├── package.json                  # NPM manifest (v1.0.2)
├── package-lock.json             # Exact dependency lockfile (puppeteer-core)
├── SKILL.md                      # Agent skill instructions & key mappings
├── skill.json                    # Skill metadata for Antigravity & agent discovery
└── README.md                     # Public documentation, quickstart & catalog table
```

---

## ⚡ Master Catalog Reference (18 Songs)

| Alias | Shortcut | Title | Composer / Artist | Key | Duration | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `amelie` | `play-amelie` | Amélie (Comptine d'un autre été) | Yann Tiersen | E minor | ~122s | 945 notes |
| `nocturne` | `play-nocturne` | Nocturne Op. 9 No. 2 (Andante) | Frédéric Chopin (Domonkos Csabay) | Eb major | ~248s | 1,242 notes |
| `golden` | `play-golden` | Golden Hour | JVKE | E major | ~207s | 2,716 notes |
| `idea10` | `play-idea10` | Idea 10 | Gibran Alcocer | G minor | ~125s | 925 notes |
| `solas` | `play-solas` | Solas | Jamie Duffy | E minor | ~214s | 1,636 notes |
| `blue` | `play-blue` | Blue | Yung Kai | E major | ~113s | 684 notes |
| `lovestory` | `play-lovestory` | Love Story | Indila | Bb minor | ~253s | 1,655 notes |
| `luna` | `play-luna` | Hijo de la Luna | Mecano (José María Cano) | A minor | ~268s | 1,636 notes |
| `baby` | `play-baby` | Pretty Little Baby | Connie Francis | Db major | ~94s | 754 notes |
| `hotline` | `play-hotline` | Hotline (Edit) | Billie Eilish | A minor | ~94s | 329 notes |
| `face` | `play-face` | I Thought I Saw Your Face Today | She & Him (Zooey Deschanel) | G major | ~86s | 550 notes |
| `moment` | `play-moment` | Every Living Breathing Moment | Grant Steller | F major | ~101s | 431 notes |
| `succession` | `play-succession` | Succession (Main Title Theme) | Nicholas Britell | C minor | ~89s | 263 notes |
| `still` | `play-still` | Still D.R.E. (Polished Master) | Dr. Dre ft. Snoop Dogg | A minor | ~66s | 733 notes |
| `paint` | `play-paint` | Paint It, Black | The Rolling Stones (Westworld) | E minor | ~50s | 98 events |
| `winter` | `play-winter` | Winter (L'Inverno - Allegro) | Antonio Vivaldi | F minor | ~45s | 80 events |
| `chopin` | `play-chopin` | Impromptu-Etude in C# minor | Frédéric Chopin style | C# minor | ~60s | 257 events |
| `elise` | `play-elise` | Für Elise (Bagatelle No. 25) | Ludwig van Beethoven | A minor | ~25s | 53 events |

---

## 🛠️ Release & Synchronization Protocol for Next Agent

Whenever editing songs or codebase:

1. **Dual Track Parity**:
   * Always update both `scripts/songs/<song>.json` AND `docs/songs/<song>.json`.
   * Update `docs/songs-manifest.json` (`noteCount` and `durationSec`).
   * Mirror files to `~/.gemini/config/skills/virtual-piano-player/`.

2. **Validation**:
   * Verify MIDI pitch boundaries (21 <= midi <= 108).
   * Ensure `notes` array is monotonically sorted by `startMs`.
   * Run `node scripts/play.js --list` to confirm display formatting.

3. **Release Sequence**:
   ```bash
   cd ~/.agents/skills/virtual-piano-player
   npm version patch --no-git-tag-version  # updates package.json & package-lock.json
   # update version in skill.json to match
   git commit -am "chore: bump version to <new_version>"
   git tag v<new_version>
   git push origin main --tags
   npm publish --access public
   ```
