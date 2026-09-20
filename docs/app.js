/**
 * Virtual Piano Player — Modern Studio Application
 * Author: Axmadjon
 * High-definition 88-key physical piano simulation, studio Web Audio synthesis,
 * falling notes visualizer, and interactive song catalog.
 */

// ============================================================================
// 1. CONSTANTS & NOTE DEFINITIONS (88 KEYS: MIDI 21 [A0] -> 108 [C8])
// ============================================================================

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const COLOR_PALETTE = [
  '#38bdf8', // C  - Cyan
  '#a855f7', // C# - Purple
  '#60a5fa', // D  - Blue
  '#c084fc', // D# - Violet
  '#34d399', // E  - Emerald
  '#fbbf24', // F  - Gold
  '#f43f5e', // F# - Rose
  '#fb923c', // G  - Orange
  '#ec4899', // G# - Pink
  '#22d3ee', // A  - Sky
  '#e879f9', // A# - Fuchsia
  '#a3e635'  // B  - Lime
];

// QWERTY Key mappings for Middle Range (C2 to C7)
const KEYBOARD_MAP = {
  '1': 36, '!': 37, '2': 38, '@': 39, '3': 40, '4': 41, '$': 42, '5': 43, '%': 44, '6': 45, '^': 46, '7': 47,
  '8': 48, '*': 49, '9': 50, '(': 51, '0': 52, 'q': 53, 'Q': 54, 'w': 55, 'W': 56, 'e': 57, 'E': 58, 'r': 59,
  't': 60, 'T': 61, 'y': 62, 'Y': 63, 'u': 64, 'i': 65, 'I': 66, 'o': 67, 'O': 68, 'p': 69, 'P': 70, 'a': 71,
  's': 72, 'S': 73, 'd': 74, 'D': 75, 'f': 76, 'g': 77, 'G': 78, 'h': 79, 'H': 80, 'j': 81, 'J': 82, 'k': 83,
  'l': 84, 'L': 85, 'z': 86, 'Z': 87, 'x': 88, 'c': 89, 'C': 90, 'v': 91, 'V': 92, 'b': 93, 'B': 94, 'n': 95,
  'm': 96
};

// Reverse map for key labels
const MIDI_TO_CHAR = {};
for (const [char, midi] of Object.entries(KEYBOARD_MAP)) {
  MIDI_TO_CHAR[midi] = char;
}

function midiToNoteInfo(midi) {
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const noteName = NOTE_NAMES[noteIndex];
  const isBlack = noteName.includes('#');
  return {
    midi,
    name: `${noteName}${octave}`,
    pitchClass: noteName,
    octave,
    isBlack,
    color: COLOR_PALETTE[noteIndex]
  };
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ============================================================================
// 2. STUDIO WEB AUDIO ACOUSTIC SYNTHESIZER
// ============================================================================

class StudioPianoAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sustainPedal = true;
    this.activeVoices = new Map(); // midi -> array of voice objects
    this.volume = 0.85;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Subtle warming compressor & EQ
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
    compressor.knee.setValueAtTime(10, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(3, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    // Warm wooden soundboard resonance filter
    const soundboardFilter = this.ctx.createBiquadFilter();
    soundboardFilter.type = 'lowpass';
    soundboardFilter.frequency.setValueAtTime(8000, this.ctx.currentTime);
    soundboardFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    this.masterGain.connect(soundboardFilter);
    soundboardFilter.connect(compressor);
    compressor.connect(this.ctx.destination);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  setSustain(enabled) {
    this.sustainPedal = enabled;
  }

  playNote(midi, vel = 85) {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const freq = midiToFrequency(midi);
    const now = this.ctx.currentTime;
    const velocityNorm = Math.min(1.0, Math.max(0.1, vel / 127));

    // Create note gain node with exponential decay
    const noteGain = this.ctx.createGain();
    const peakGain = 0.35 * velocityNorm;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(peakGain, now + 0.005); // quick 5ms hammer strike

    // Decay rate: lower notes sustain longer than higher notes (natural piano physics)
    const decayDuration = 3.0 + (108 - midi) * 0.05;
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

    // Additive synthesis: Fundamental + 4 acoustic harmonics + triple-string unison detuning
    const oscillators = [];
    const harmonics = [
      { mult: 1.0, gain: 1.0, detune: 0 },
      { mult: 1.0, gain: 0.7, detune: 1.5 },   // unison right string
      { mult: 1.0, gain: 0.7, detune: -1.5 },  // unison left string
      { mult: 2.0, gain: 0.45, detune: 0.8 },  // 2nd harmonic (octave)
      { mult: 3.0, gain: 0.25, detune: 0 },    // 3rd harmonic (fifth)
      { mult: 4.0, gain: 0.12, detune: 0 },    // 4th harmonic
      { mult: 5.0, gain: 0.06, detune: 0 }     // 5th harmonic
    ];

    harmonics.forEach(h => {
      const hFreq = freq * h.mult;
      if (hFreq < 18000) {
        const osc = this.ctx.createOscillator();
        osc.type = h.mult === 1.0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(hFreq, now);
        osc.detune.setValueAtTime(h.detune, now);

        const hGain = this.ctx.createGain();
        hGain.gain.setValueAtTime(h.gain, now);

        osc.connect(hGain);
        hGain.connect(noteGain);
        osc.start(now);
        osc.stop(now + decayDuration + 0.1);
        oscillators.push(osc);
      }
    });

    noteGain.connect(this.masterGain);

    const voice = {
      midi,
      noteGain,
      oscillators,
      startTime: now,
      released: false
    };

    if (!this.activeVoices.has(midi)) {
      this.activeVoices.set(midi, []);
    }
    this.activeVoices.get(midi).push(voice);

    return voice;
  }

  releaseNote(midi) {
    if (!this.ctx || !this.activeVoices.has(midi)) return;
    const voices = this.activeVoices.get(midi);
    const now = this.ctx.currentTime;

    voices.forEach(voice => {
      if (voice.released) return;
      voice.released = true;

      // If sustain pedal is NOT held, damp note immediately (60ms damper release)
      if (!this.sustainPedal) {
        try {
          const currentGain = voice.noteGain.gain.value;
          voice.noteGain.gain.cancelScheduledValues(now);
          voice.noteGain.gain.setValueAtTime(Math.max(0.0001, currentGain), now);
          voice.noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
          setTimeout(() => {
            voice.oscillators.forEach(osc => {
              try { osc.stop(); } catch (_) {}
            });
          }, 100);
        } catch (_) {}
      }
    });

    // Cleanup dead voices
    this.activeVoices.set(midi, voices.filter(v => now - v.startTime < 6.0));
  }

  stopAll() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const [midi, voices] of this.activeVoices) {
      voices.forEach(v => {
        try {
          v.noteGain.gain.cancelScheduledValues(now);
          v.noteGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
          v.oscillators.forEach(o => {
            try { o.stop(now + 0.06); } catch (_) {}
          });
        } catch (_) {}
      });
    }
    this.activeVoices.clear();
  }
}

// ============================================================================
// 3. PIANO KEYBOARD COMPONENT (88 KEYS: A0 to C8)
// ============================================================================

class PianoKeyboard {
  constructor(containerEl, audioSynth) {
    this.container = containerEl;
    this.audio = audioSynth;
    this.keys = new Map(); // midi -> DOM element
    this.keyCoords = new Map(); // midi -> { left, width, isBlack }
    this.labelMode = 'notes'; // 'notes' | 'keys' | 'none'
    this.activeKeys = new Set();
    this.initKeyboard();
    this.bindEvents();
  }

  initKeyboard() {
    this.container.innerHTML = '';
    const whiteKeys = [];
    const blackKeys = [];

    // 88 Keys: MIDI 21 (A0) to 108 (C8)
    for (let midi = 21; midi <= 108; midi++) {
      const info = midiToNoteInfo(midi);
      const el = document.createElement('div');
      el.dataset.midi = midi;

      if (info.isBlack) {
        el.className = 'piano-key-black';
        blackKeys.push({ midi, info, el });
      } else {
        el.className = 'piano-key-white';
        whiteKeys.push({ midi, info, el });
      }
      this.keys.set(midi, el);
    }

    // Append all white keys in sequence
    whiteKeys.forEach(wk => {
      this.container.appendChild(wk.el);
    });

    // Append black keys positioned relative to white keys
    blackKeys.forEach(bk => {
      this.container.appendChild(bk.el);
    });

    this.updateKeyGeometry();
    this.updateLabels();
  }

  updateKeyGeometry() {
    // Measure coordinates of each key for exact visualizer alignment
    const railRect = this.container.getBoundingClientRect();
    const whiteWidth = 28;
    const blackWidth = 18;

    let whiteIndex = 0;
    for (let midi = 21; midi <= 108; midi++) {
      const info = midiToNoteInfo(midi);
      if (!info.isBlack) {
        const left = whiteIndex * whiteWidth;
        this.keyCoords.set(midi, { left, width: whiteWidth, isBlack: false });
        whiteIndex++;
      } else {
        // Place black key right between preceding and following white keys
        const left = (whiteIndex * whiteWidth) - (blackWidth / 2);
        const el = this.keys.get(midi);
        if (el) {
          el.style.left = `${left}px`;
        }
        this.keyCoords.set(midi, { left, width: blackWidth, isBlack: true });
      }
    }
  }

  setLabelMode(mode) {
    this.labelMode = mode;
    this.updateLabels();
  }

  updateLabels() {
    for (let midi = 21; midi <= 108; midi++) {
      const el = this.keys.get(midi);
      if (!el) continue;
      const info = midiToNoteInfo(midi);
      el.innerHTML = '';

      if (this.labelMode === 'notes') {
        const span = document.createElement('span');
        span.className = 'key-label-note';
        span.textContent = info.name;
        el.appendChild(span);
      } else if (this.labelMode === 'keys') {
        const char = MIDI_TO_CHAR[midi];
        if (char) {
          const span = document.createElement('span');
          span.className = 'key-label-kbd';
          span.textContent = char;
          el.appendChild(span);
        }
      }
    }
  }

  pressKey(midi, vel = 85, fromManual = false) {
    const el = this.keys.get(midi);
    if (el) {
      el.classList.add('active');
    }
    this.activeKeys.add(midi);
    if (fromManual) {
      this.audio.playNote(midi, vel);
    }
  }

  releaseKey(midi, fromManual = false) {
    const el = this.keys.get(midi);
    if (el) {
      el.classList.remove('active');
    }
    this.activeKeys.delete(midi);
    if (fromManual) {
      this.audio.releaseNote(midi);
    }
  }

  releaseAll() {
    this.activeKeys.forEach(midi => {
      const el = this.keys.get(midi);
      if (el) el.classList.remove('active');
    });
    this.activeKeys.clear();
  }

  bindEvents() {
    let isMouseDown = false;

    this.container.addEventListener('mousedown', (e) => {
      const keyEl = e.target.closest('[data-midi]');
      if (!keyEl) return;
      isMouseDown = true;
      const midi = parseInt(keyEl.dataset.midi, 10);
      this.pressKey(midi, 95, true);
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      this.activeKeys.forEach(midi => this.releaseKey(midi, true));
    });

    this.container.addEventListener('mouseover', (e) => {
      if (!isMouseDown) return;
      const keyEl = e.target.closest('[data-midi]');
      if (!keyEl) return;
      const midi = parseInt(keyEl.dataset.midi, 10);
      this.pressKey(midi, 95, true);
    });

    this.container.addEventListener('mouseout', (e) => {
      if (!isMouseDown) return;
      const keyEl = e.target.closest('[data-midi]');
      if (!keyEl) return;
      const midi = parseInt(keyEl.dataset.midi, 10);
      this.releaseKey(midi, true);
    });

    // Touch support for mobile/tablets
    this.container.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const el = document.elementFromPoint(touches[i].clientX, touches[i].clientY);
        const keyEl = el ? el.closest('[data-midi]') : null;
        if (keyEl) {
          const midi = parseInt(keyEl.dataset.midi, 10);
          this.pressKey(midi, 95, true);
        }
      }
    }, { passive: false });

    this.container.addEventListener('touchend', (e) => {
      this.activeKeys.forEach(midi => this.releaseKey(midi, true));
    });

    // Computer Keyboard Listener
    window.addEventListener('keydown', (e) => {
      if (e.repeat || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      const key = e.key;
      const midi = KEYBOARD_MAP[key];
      if (midi !== undefined) {
        this.pressKey(midi, 95, true);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      const key = e.key;
      const midi = KEYBOARD_MAP[key];
      if (midi !== undefined) {
        this.releaseKey(midi, true);
      }
    });
  }

  scrollToOctave(octave) {
    // Octave: 0 (A0), 4 (C4 Middle C)
    const targetMidi = octave === 0 ? 21 : (octave + 1) * 12;
    const coord = this.keyCoords.get(targetMidi);
    const viewport = document.getElementById('keyboardViewport');
    if (coord && viewport) {
      viewport.scrollTo({
        left: Math.max(0, coord.left - (viewport.clientWidth / 2) + 20),
        behavior: 'smooth'
      });
    }
  }

  fitAll() {
    const viewport = document.getElementById('keyboardViewport');
    if (viewport) {
      viewport.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }
}

// ============================================================================
// 4. SYNTHESIA-STYLE FALLING NOTES CANVAS VISUALIZER
// ============================================================================

class SynthesiaVisualizer {
  constructor(canvasEl, keyboard) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.keyboard = keyboard;
    this.notes = [];
    this.currentTimeMs = 0;
    this.timeWindowMs = 2600; // ms of falling notes visible above keyboard
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.width = rect.width;
    this.height = rect.height;
  }

  setNotes(notes) {
    this.notes = notes || [];
  }

  render(currentTimeMs) {
    this.currentTimeMs = currentTimeMs;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    if (this.notes.length === 0) return;

    // Get horizontal offset from keyboard viewport scroll
    const viewport = document.getElementById('keyboardViewport');
    const scrollLeft = viewport ? viewport.scrollLeft : 0;
    const viewportWidth = viewport ? viewport.clientWidth : w;

    const visibleStart = this.currentTimeMs;
    const visibleEnd = this.currentTimeMs + this.timeWindowMs;

    // Render falling note bars
    for (let i = 0; i < this.notes.length; i++) {
      const n = this.notes[i];
      const noteEnd = n.startMs + n.durMs;

      // Skip notes not currently in the falling window
      if (noteEnd < visibleStart || n.startMs > visibleEnd) continue;

      const coord = this.keyboard.keyCoords.get(n.midi);
      if (!coord) continue;

      const x = coord.left - scrollLeft;
      const keyW = coord.width;

      // Skip offscreen horizontally
      if (x + keyW < -20 || x > viewportWidth + 20) continue;

      // Calculate vertical position (Top is future, Bottom is current time)
      const bottomY = h - ((n.startMs - this.currentTimeMs) / this.timeWindowMs) * h;
      const topY = h - ((noteEnd - this.currentTimeMs) / this.timeWindowMs) * h;
      const barHeight = Math.max(8, bottomY - topY);
      const barY = bottomY - barHeight;

      const info = midiToNoteInfo(n.midi);
      const noteColor = info.color;

      ctx.save();
      ctx.fillStyle = noteColor;
      ctx.shadowColor = noteColor;
      ctx.shadowBlur = 10;

      // Rounded rectangle for each falling note
      const radius = 4;
      ctx.beginPath();
      ctx.roundRect(x + 2, barY, Math.max(4, keyW - 4), barHeight, radius);
      ctx.fill();

      // Highlight line when note strikes the bottom (active)
      if (this.currentTimeMs >= n.startMs && this.currentTimeMs <= noteEnd) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 14;
        ctx.fillRect(x + 1, h - 4, keyW - 2, 4);
      }

      ctx.restore();
    }
  }
}

// ============================================================================
// 5. MASTER SONG PLAYER ENGINE
// ============================================================================

class SongPlayer {
  constructor(audioSynth, keyboard, visualizer) {
    this.audio = audioSynth;
    this.keyboard = keyboard;
    this.visualizer = visualizer;

    this.manifest = [];
    this.currentSong = null;
    this.currentSongData = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.tempoMultiplier = 1.0;

    this.currentTimeMs = 0;
    this.durationMs = 0;
    this.playbackStartWallTime = 0;
    this.playbackStartSeekMs = 0;
    this.activeNoteIndex = 0;
    this.activeNoteVoices = new Map(); // noteRef -> timeout IDs

    this.animationFrameId = null;
  }

  async loadManifest() {
    try {
      const res = await fetch('songs-manifest.json');
      this.manifest = await res.json();
      return this.manifest;
    } catch (e) {
      console.error('Failed to load songs-manifest.json:', e);
      return [];
    }
  }

  async selectSong(songId) {
    const item = this.manifest.find(s => s.id === songId);
    if (!item) return;

    this.stop();
    this.currentSong = item;

    // Update watermark
    document.getElementById('visTrackTitle').textContent = item.title;
    document.getElementById('visTrackComposer').textContent = `${item.composer} • Key: ${item.key}`;
    document.getElementById('timeTotal').textContent = formatTime(item.durationSec);
    document.getElementById('timeCurrent').textContent = '0:00';
    document.getElementById('scrubBar').value = 0;

    // Fetch song JSON
    try {
      const res = await fetch(`songs/${item.file}`);
      this.currentSongData = await res.json();
      this.durationMs = item.durationSec * 1000;
      this.visualizer.setNotes(this.currentSongData.notes);

      // Sustain setting from song metadata
      if (this.currentSongData.sustain !== undefined) {
        const btnSustain = document.getElementById('btnSustain');
        if (btnSustain) {
          if (this.currentSongData.sustain) {
            btnSustain.classList.add('active');
            this.audio.setSustain(true);
          } else {
            btnSustain.classList.remove('active');
            this.audio.setSustain(false);
          }
        }
      }

      // Auto-scroll piano to song's focal octave
      if (this.currentSongData.notes && this.currentSongData.notes.length > 0) {
        const avgMidi = Math.round(
          this.currentSongData.notes.slice(0, 30).reduce((acc, n) => acc + n.midi, 0) / Math.min(30, this.currentSongData.notes.length)
        );
        const focusOctave = Math.max(1, Math.min(6, Math.floor(avgMidi / 12) - 1));
        this.keyboard.scrollToOctave(focusOctave);
      }
    } catch (e) {
      console.error(`Failed to load song data for ${songId}:`, e);
    }
  }

  play() {
    if (!this.currentSongData || !this.currentSongData.notes) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.playbackStartWallTime = performance.now();
    this.playbackStartSeekMs = this.currentTimeMs;

    this.audio.init();

    // Update Play/Pause UI
    document.getElementById('playIcon').textContent = '⏸';
    document.getElementById('playLabel').textContent = 'Pause';

    this.tick();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.keyboard.releaseAll();
    this.audio.stopAll();

    document.getElementById('playIcon').textContent = '▶';
    document.getElementById('playLabel').textContent = 'Play';
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.currentTimeMs = 0;
    this.keyboard.releaseAll();
    this.audio.stopAll();

    document.getElementById('playIcon').textContent = '▶';
    document.getElementById('playLabel').textContent = 'Play';
    document.getElementById('timeCurrent').textContent = '0:00';
    document.getElementById('scrubBar').value = 0;
    this.visualizer.render(0);
  }

  seek(percent) {
    if (!this.durationMs) return;
    const targetMs = (percent / 100) * this.durationMs;
    this.currentTimeMs = targetMs;
    this.playbackStartWallTime = performance.now();
    this.playbackStartSeekMs = targetMs;

    this.keyboard.releaseAll();
    this.audio.stopAll();

    document.getElementById('timeCurrent').textContent = formatTime(targetMs / 1000);
    this.visualizer.render(this.currentTimeMs);
  }

  setTempo(mult) {
    const current = this.currentTimeMs;
    this.tempoMultiplier = mult;
    if (this.isPlaying) {
      this.playbackStartWallTime = performance.now();
      this.playbackStartSeekMs = current;
    }
  }

  tick() {
    if (!this.isPlaying) return;

    const elapsedWall = (performance.now() - this.playbackStartWallTime) * this.tempoMultiplier;
    this.currentTimeMs = this.playbackStartSeekMs + elapsedWall;

    // Check if song finished
    if (this.currentTimeMs >= this.durationMs) {
      this.stop();
      return;
    }

    // UI Scrubber update
    const percent = (this.currentTimeMs / this.durationMs) * 100;
    document.getElementById('scrubBar').value = percent;
    document.getElementById('timeCurrent').textContent = formatTime(this.currentTimeMs / 1000);

    // Audio & Key triggers
    const notes = this.currentSongData.notes;
    for (let i = 0; i < notes.length; i++) {
      const n = notes[i];
      // Check if note begins within this frame interval (~20ms)
      const diff = this.currentTimeMs - n.startMs;
      if (diff >= 0 && diff < 25 && !n.__triggeredAtTime) {
        n.__triggeredAtTime = this.currentTimeMs;
        this.keyboard.pressKey(n.midi, n.vel || 85, false);
        this.audio.playNote(n.midi, n.vel || 85);
      }

      // Check if note release
      const endDiff = this.currentTimeMs - (n.startMs + n.durMs);
      if (endDiff >= 0 && endDiff < 30 && n.__triggeredAtTime && !n.__releasedAtTime) {
        n.__releasedAtTime = this.currentTimeMs;
        this.keyboard.releaseKey(n.midi, false);
        this.audio.releaseNote(n.midi);
      }

      // Reset triggers when scrubbed backwards
      if (this.currentTimeMs < n.startMs) {
        n.__triggeredAtTime = null;
        n.__releasedAtTime = null;
      }
    }

    // Render falling visualizer
    this.visualizer.render(this.currentTimeMs);

    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }
}

// ============================================================================
// 6. APPLICATION INITIALIZATION & UI BINDING
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  const audioSynth = new StudioPianoAudio();
  const keyboardContainer = document.getElementById('pianoKeyboard');
  const canvasEl = document.getElementById('pianoRollCanvas');

  const keyboard = new PianoKeyboard(keyboardContainer, audioSynth);
  const visualizer = new SynthesiaVisualizer(canvasEl, keyboard);
  const player = new SongPlayer(audioSynth, keyboard, visualizer);

  // Load Catalog
  const manifest = await player.loadManifest();
  const songListContainer = document.getElementById('songList');
  const songCountBadge = document.getElementById('songCountBadge');

  if (songCountBadge) {
    songCountBadge.textContent = `${manifest.length} songs`;
  }

  function renderSongCards(filterCat = 'all', searchQuery = '') {
    songListContainer.innerHTML = '';
    const query = searchQuery.toLowerCase().trim();

    const filtered = manifest.filter(s => {
      const matchesCat = filterCat === 'all' || s.category.toLowerCase().includes(filterCat.toLowerCase());
      const matchesSearch = !query || 
        s.title.toLowerCase().includes(query) ||
        s.composer.toLowerCase().includes(query) ||
        s.key.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      songListContainer.innerHTML = '<div class="catalog-loading">No songs found matching your search.</div>';
      return;
    }

    filtered.forEach(song => {
      const card = document.createElement('div');
      card.className = `song-card ${player.currentSong && player.currentSong.id === song.id ? 'active' : ''}`;
      card.dataset.songId = song.id;

      card.innerHTML = `
        <div class="song-play-icon">▶</div>
        <div class="song-info">
          <div class="song-card-title">${song.title}</div>
          <div class="song-card-composer">${song.composer}</div>
          <div class="song-meta-tags">
            <span class="tag-pill key">${song.key}</span>
            <span class="tag-pill">${song.category}</span>
            <span class="tag-pill">${song.noteCount} notes</span>
          </div>
        </div>
        <div class="song-dur">${formatTime(song.durationSec)}</div>
      `;

      card.addEventListener('click', async () => {
        document.querySelectorAll('.song-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        await player.selectSong(song.id);
        player.play();
      });

      songListContainer.appendChild(card);
    });
  }

  renderSongCards();

  // Search filter
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  searchInput.addEventListener('input', () => {
    const val = searchInput.value;
    searchClear.style.display = val ? 'block' : 'none';
    const activeTab = document.querySelector('.tab-btn.active');
    renderSongCards(activeTab ? activeTab.dataset.cat : 'all', val);
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    const activeTab = document.querySelector('.tab-btn.active');
    renderSongCards(activeTab ? activeTab.dataset.cat : 'all', '');
  });

  // Category Tabs
  document.getElementById('categoryTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSongCards(btn.dataset.cat, searchInput.value);
  });

  // Controls: Play/Pause, Stop, Scrub
  document.getElementById('btnPlayPause').addEventListener('click', () => {
    player.togglePlayPause();
  });

  document.getElementById('btnStop').addEventListener('click', () => {
    player.stop();
  });

  const scrubBar = document.getElementById('scrubBar');
  scrubBar.addEventListener('input', (e) => {
    player.seek(parseFloat(e.target.value));
  });

  // Tempo Speed
  document.getElementById('tempoSelect').addEventListener('change', (e) => {
    player.setTempo(parseFloat(e.target.value));
  });

  // Sustain Pedal
  const btnSustain = document.getElementById('btnSustain');
  btnSustain.addEventListener('click', () => {
    const isActive = btnSustain.classList.toggle('active');
    audioSynth.setSustain(isActive);
  });

  // Key Labels Toggle
  document.getElementById('labelModeSelect').addEventListener('change', (e) => {
    keyboard.setLabelMode(e.target.value);
  });

  // Volume Slider
  const volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.addEventListener('input', (e) => {
    audioSynth.setVolume(parseFloat(e.target.value) / 100);
  });

  // Octave Navigation Buttons
  document.querySelectorAll('.btn-octave').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-octave').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      keyboard.scrollToOctave(parseInt(btn.dataset.octave, 10));
    });
  });

  document.getElementById('btnFitAll').addEventListener('click', () => {
    keyboard.fitAll();
  });

  // Copy NPX Button
  document.getElementById('copyNpxBtn').addEventListener('click', () => {
    navigator.clipboard.writeText('npx virtual-piano-by-axmadjon');
    const btn = document.getElementById('copyNpxBtn');
    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = '📋'; }, 2000);
  });

  // Spacebar to Play/Pause
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      player.togglePlayPause();
    }
  });

  // Auto-load first song or hash parameter
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const initialSong = manifest.find(s => s.id === hash) || manifest[0];
  if (initialSong) {
    await player.selectSong(initialSong.id);
  }
});
