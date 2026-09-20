#!/usr/bin/env node

/**
 * OnlinePianist Virtual Piano Automated Player
 * Controls browser, sets visible keys to 88, and plays songs with studio-grade audio synthesis.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 88-Key Note-to-Keyboard Mapping (Fallback & Reverse Lookup)
const NOTE_MAP = {
  'C2': '1', 'C#2': '!', 'Db2': '!', 'D2': '2', 'D#2': '@', 'Eb2': '@',
  'E2': '3', 'F2': '4', 'F#2': '$', 'Gb2': '$', 'G2': '5', 'G#2': '%', 'Ab2': '%',
  'A2': '6', 'A#2': '^', 'Bb2': '^', 'B2': '7',
  'C3': '8', 'C#3': '*', 'Db3': '*', 'D3': '9', 'D#3': '(', 'Eb3': '(',
  'E3': '0', 'F3': 'q', 'F#3': 'Q', 'Gb3': 'Q', 'G3': 'w', 'G#3': 'W', 'Ab3': 'W',
  'A3': 'e', 'A#3': 'E', 'Bb3': 'E', 'B3': 'r',
  'C4': 't', 'C#4': 'T', 'Db4': 'T', 'D4': 'y', 'D#4': 'Y', 'Eb4': 'Y',
  'E4': 'u', 'F4': 'i', 'F#4': 'I', 'Gb4': 'I', 'G4': 'o', 'G#4': 'O', 'Ab4': 'O',
  'A4': 'p', 'A#4': 'P', 'Bb4': 'P', 'B4': 'a',
  'C5': 's', 'C#5': 'S', 'Db5': 'S', 'D5': 'd', 'D#5': 'D', 'Eb5': 'D',
  'E5': 'f', 'F5': 'g', 'F#5': 'G', 'Gb5': 'G', 'G5': 'h', 'G#5': 'H', 'Ab5': 'H',
  'A5': 'j', 'A#5': 'J', 'Bb5': 'J', 'B5': 'k',
  'C6': 'l', 'C#6': 'L', 'Db6': 'L', 'D6': 'z', 'D#6': 'Z', 'Eb6': 'Z',
  'E6': 'x', 'F6': 'c', 'F#6': 'C', 'Gb6': 'C', 'G6': 'v', 'G#6': 'V', 'Ab6': 'V',
  'A6': 'b', 'A#6': 'B', 'Bb6': 'B', 'B6': 'n',
  'C7': 'm'
};

const NOTE_OFFSETS = {
  'C': 0, 'C#': 1, 'DB': 1,
  'D': 2, 'D#': 3, 'EB': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'GB': 6,
  'G': 7, 'G#': 8, 'AB': 8,
  'A': 9, 'A#': 10, 'BB': 10,
  'B': 11
};

function pitchStringToMidi(note) {
  if (typeof note !== 'string') return null;
  const normalized = note.trim().replace(/^([A-Ga-g])s(\d+)$/, '$1#$2');
  const m = normalized.match(/^([A-Ga-g][#b]?)(-?\d+)$/);
  if (!m) return null;
  const name = m[1].toUpperCase();
  const oct = parseInt(m[2], 10);
  const offset = NOTE_OFFSETS[name];
  if (offset === undefined) return null;
  return (oct + 1) * 12 + offset;
}

const CHAR_TO_MIDI = {};
for (const [note, char] of Object.entries(NOTE_MAP)) {
  const m = pitchStringToMidi(note);
  if (m !== null) CHAR_TO_MIDI[char] = m;
}

function noteToMidi(note) {
  if (typeof note === 'number') return note;
  if (!note || typeof note !== 'string') return null;
  const trimmed = note.trim();
  const fromPitch = pitchStringToMidi(trimmed);
  if (fromPitch !== null) return fromPitch;
  if (CHAR_TO_MIDI[trimmed] !== undefined) return CHAR_TO_MIDI[trimmed];
  return null;
}

function listSongs() {
  const songsDir = path.join(__dirname, 'songs');
  const files = fs.existsSync(songsDir) ? fs.readdirSync(songsDir).filter(f => f.endsWith('.json')) : [];

  const SONG_ORDER = [
    { file: 'amelie.json', alias: 'amelie', shortcut: 'play-amelie' },
    { file: 'chopin_nocturne.json', alias: 'nocturne', shortcut: 'play-nocturne' },
    { file: 'golden_hour.json', alias: 'golden', shortcut: 'play-golden' },
    { file: 'idea_10.json', alias: 'idea10', shortcut: 'play-idea10' },
    { file: 'solas.json', alias: 'solas', shortcut: 'play-solas' },
    { file: 'blue.json', alias: 'blue', shortcut: 'play-blue' },
    { file: 'love_story.json', alias: 'lovestory', shortcut: 'play-lovestory' },
    { file: 'hijo_de_la_luna.json', alias: 'luna', shortcut: 'play-luna' },
    { file: 'pretty_little_baby.json', alias: 'baby', shortcut: 'play-baby' },
    { file: 'hotline.json', alias: 'hotline', shortcut: 'play-hotline' },
    { file: 'i_thought_i_saw_your_face_today.json', alias: 'face', shortcut: 'play-face' },
    { file: 'every_living_breathing_moment.json', alias: 'moment', shortcut: 'play-moment' },
    { file: 'succession.json', alias: 'succession', shortcut: 'play-succession' },
    { file: 'still_dre.json', alias: 'still', shortcut: 'play-still' },
    { file: 'paint_it_black.json', alias: 'paint', shortcut: 'play-paint' },
    { file: 'vivaldi_winter.json', alias: 'winter', shortcut: 'play-winter' },
    { file: 'chopin_etude.json', alias: 'chopin', shortcut: 'play-chopin' },
    { file: 'fur_elise.json', alias: 'elise', shortcut: 'play-elise' }
  ];

  const seen = new Set();
  const rows = [];

  for (const item of SONG_ORDER) {
    const fPath = path.join(songsDir, item.file);
    if (fs.existsSync(fPath)) {
      seen.add(item.file);
      try {
        const d = JSON.parse(fs.readFileSync(fPath, 'utf8'));
        let dur = d.targetDurationSec;
        if (!dur && d.notes) {
          dur = Math.round(Math.max(...d.notes.map(n => n.startMs + n.durMs)) / 1000);
        } else if (!dur && d.events) {
          dur = Math.round(d.events.reduce((acc, e) => acc + (e.dur || 0) + (e.wait || 0), 0) / 1000);
        }
        rows.push({
          alias: item.alias,
          shortcut: item.shortcut,
          title: d.title || item.file,
          composer: d.composer || 'Unknown',
          key: d.key || '-',
          duration: `~${dur || 60}s`
        });
      } catch (_) {}
    }
  }

  for (const f of files) {
    if (seen.has(f) || f === 'comptine_dun_autre_ete.json') continue;
    try {
      const fPath = path.join(songsDir, f);
      const d = JSON.parse(fs.readFileSync(fPath, 'utf8'));
      const base = f.replace('.json', '');
      rows.push({
        alias: base,
        shortcut: `play-${base}`,
        title: d.title || f,
        composer: d.composer || 'Custom',
        key: d.key || '-',
        duration: d.targetDurationSec ? `~${d.targetDurationSec}s` : '-'
      });
    } catch (_) {}
  }

  console.log('\n====================================================================================================');
  console.log('                            🎹  ONLINEPIANIST VIRTUAL PIANO — SONG CATALOG');
  console.log('====================================================================================================');
  console.log(` ${'ALIAS'.padEnd(12)} | ${'SHORTCUT'.padEnd(17)} | ${'TITLE'.padEnd(32)} | ${'COMPOSER'.padEnd(20)} | ${'KEY'.padEnd(9)} | ${'DUR'}`);
  console.log('----------------------------------------------------------------------------------------------------');
  rows.forEach(r => {
    const title = r.title.length > 32 ? r.title.slice(0, 29) + '...' : r.title;
    const composer = r.composer.length > 20 ? r.composer.slice(0, 17) + '...' : r.composer;
    console.log(` ${r.alias.padEnd(12)} | ${r.shortcut.padEnd(17)} | ${title.padEnd(32)} | ${composer.padEnd(20)} | ${r.key.padEnd(9)} | ${r.duration}`);
  });
  console.log('====================================================================================================');
  console.log('\nQuick Play Commands:');
  console.log('  piano <alias>                 e.g. piano amelie, piano succession, piano still');
  console.log('  <shortcut>                    e.g. play-amelie, play-succession, play-still');
  console.log('  node play.js <alias>          (when inside this directory)\n');
}

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--list' || args[0] === 'list' || args[0] === '-l' || args[0] === 'songs') {
    listSongs();
    process.exit(0);
  }

  const options = {
    song: null,
    file: null,
    tempo: 1.0,
    headless: false,
    sustain: true,
    chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  };

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--song' || args[i] === '-s') && args[i + 1]) {
      options.song = args[++i];
    } else if ((args[i] === '--file' || args[i] === '-f') && args[i + 1]) {
      options.file = args[++i];
    } else if ((args[i] === '--tempo' || args[i] === '-t') && args[i + 1]) {
      options.tempo = parseFloat(args[++i]) || 1.0;
    } else if (args[i] === '--headless') {
      options.headless = args[i + 1] === 'true';
      if (args[i + 1] === 'true' || args[i + 1] === 'false') i++;
    } else if (args[i] === '--sustain') {
      options.sustain = args[i + 1] !== 'false';
      if (args[i + 1] === 'true' || args[i + 1] === 'false') i++;
    } else if (args[i] === '--list' || args[i] === '-l' || args[i] === 'list') {
      listSongs();
      process.exit(0);
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Virtual Piano Player CLI
Usage: node play.js [options] [song_alias]

Options:
  --song, -s <name>   Preset song name or alias (e.g. "amelie", "succession", "still")
  --list, -l          List all available songs and shortcuts
  --file, -f <path>   Path to custom song JSON file
  --tempo, -t <float> Tempo multiplier (default: 1.0; e.g. 1.2 for faster, 0.8 for slower)
  --headless <bool>   Run in headless mode (default: false)
  --sustain <bool>    Enable sustain pedal (default: true)
  --help, -h          Show this help message
      `);
      process.exit(0);
    } else if (!options.song && !args[i].startsWith('-')) {
      options.song = args[i];
    }
  }

  if (!options.song && !options.file) {
    listSongs();
    process.exit(0);
  }

  return options;
}

function loadSong(options) {
  let filePath = options.file;

  if (!filePath) {
    const songsDir = path.join(__dirname, 'songs');
    const s = (options.song || '').toLowerCase().trim();
    if (s === 'nocturne' || s === 'chopin_nocturne' || s === 'chopin-nocturne' || s === 'op9' || s === 'op9no2' || s === 'csabay' || s === 'domonkos') {
      filePath = path.join(songsDir, 'chopin_nocturne.json');
    } else if (s === 'chopin' || s === 'chopin_etude') {
      filePath = path.join(songsDir, 'chopin_etude.json');
    } else if (s === 'fur_elise' || s === 'beethoven' || s === 'elise') {
      filePath = path.join(songsDir, 'fur_elise.json');
    } else if (s === 'winter' || s === 'vivaldi' || s === 'vivaldi_winter') {
      filePath = path.join(songsDir, 'vivaldi_winter.json');
    } else if (s === 'paint_it_black' || s === 'paint' || s === 'paintitblack' || s === 'stones') {
      filePath = path.join(songsDir, 'paint_it_black.json');
    } else if (s === 'still' || s === 'still_dre' || s === 'stilldre' || s === 'snoop' || s === 'snoopdog' || s === 'dre') {
      filePath = path.join(songsDir, 'still_dre.json');
    } else if (s === 'succession' || s === 'britell' || s === 'succession_theme' || s === 'roy') {
      filePath = path.join(songsDir, 'succession.json');
    } else if (s === 'amelie' || s === 'comptine' || s === 'comptine_dun_autre_ete' || s === 'tiersen' || s === 'yann_tiersen') {
      filePath = path.join(songsDir, 'amelie.json');
    } else if (s === 'golden' || s === 'golden_hour' || s === 'goldenhour' || s === 'jvke' || s === 'jvke_golden_hour') {
      filePath = path.join(songsDir, 'golden_hour.json');
    } else if (s === 'idea10' || s === 'idea_10' || s === 'idea' || s === 'gibran' || s === 'alcocer' || s === 'gibran_alcocer') {
      filePath = path.join(songsDir, 'idea_10.json');
    } else if (s === 'solas' || s === 'jamie' || s === 'duffy' || s === 'jamie_duffy') {
      filePath = path.join(songsDir, 'solas.json');
    } else if (s === 'blue' || s === 'yungkai' || s === 'yung_kai' || s === 'kai') {
      filePath = path.join(songsDir, 'blue.json');
    } else if (s === 'baby' || s === 'pretty_little_baby' || s === 'pretty' || s === 'connie' || s === 'francis' || s === 'connie_francis') {
      filePath = path.join(songsDir, 'pretty_little_baby.json');
    } else if (s === 'hotline' || s === 'hotline_edit' || s === 'billie' || s === 'eilish' || s === 'billie_eilish' || s === 'hotline_bling') {
      filePath = path.join(songsDir, 'hotline.json');
    } else if (s === 'face' || s === 'i_thought_i_saw_your_face_today' || s === 'she_and_him' || s === 'she&him' || s === 'sheandhim' || s === 'deschanel') {
      filePath = path.join(songsDir, 'i_thought_i_saw_your_face_today.json');
    } else if (s === 'luna' || s === 'hijo_de_la_luna' || s === 'hijo' || s === 'mecano' || s === 'cano') {
      filePath = path.join(songsDir, 'hijo_de_la_luna.json');
    } else if (s === 'lovestory' || s === 'love_story' || s === 'indila' || s === 'love') {
      filePath = path.join(songsDir, 'love_story.json');
    } else if (s === 'moment' || s === 'every_living_breathing_moment' || s === 'grant' || s === 'steller' || s === 'grant_steller' || s === 'breathing') {
      filePath = path.join(songsDir, 'every_living_breathing_moment.json');
    } else {
      filePath = path.join(songsDir, `${s}.json`);
    }
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Song file not found at: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const options = parseArgs();
  const songData = loadSong(options);

  console.log(`Loaded song: "${songData.title}" by ${songData.composer}`);
  const noteCount = songData.notes ? songData.notes.length : (songData.events ? songData.events.length : 0);
  console.log(`Track elements: ${noteCount}, Base tempo multiplier: ${options.tempo}`);

  let browser;
  try {
    // Clean up any stale or orphaned piano browser instances and lock files
    try {
      execSync('pkill -9 -f "chrome-piano-profile" 2>/dev/null || true');
      execSync('rm -f /tmp/chrome-piano-profile/Singleton* 2>/dev/null || true');
      await new Promise(r => setTimeout(r, 200));
    } catch (_) {}

    console.log('Launching browser to play virtual piano...');
    browser = await puppeteer.launch({
      executablePath: options.chromePath,
      headless: options.headless,
      defaultViewport: null,
      args: [
        '--start-maximized',
        '--user-data-dir=/tmp/chrome-piano-profile',
        '--autoplay-policy=no-user-gesture-required'
      ]
    });

    // Register signal handlers for clean exit on Ctrl+C or kill
    const cleanup = async () => {
      try {
        if (browser) await browser.close();
      } catch (_) {}
      try {
        execSync('pkill -9 -f "chrome-piano-profile" 2>/dev/null || true');
      } catch (_) {}
      process.exit(0);
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    const page = (await browser.pages())[0] || await browser.newPage();

    if (!options.headless) {
      try {
        execSync('osascript -e \'tell application "Google Chrome" to activate\'');
      } catch (_) {}
    }

    console.log('Navigating to https://www.onlinepianist.com/virtual-piano...');
    await page.goto('https://www.onlinepianist.com/virtual-piano', {
      waitUntil: 'domcontentloaded',
      timeout: 35000
    });

    console.log('Waiting for piano audio samples to load...');
    await page.waitForFunction(() => !document.body.innerText.includes('WARMING UP PIANO'), {
      timeout: 45000
    });
    console.log('Piano audio engine is ready.');

    // Configure keyboard settings: Set layout to Full and visible keys to Max (88 keys)
    console.log('Configuring keyboard: Setting layout to Full and visible keys to Max (88 keys)...');
    await page.click('.synth-btn--settings');
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, div, span, .keyboard-panel-option'));
      const fullBtn = buttons.find(b => b.innerText?.trim() === 'Full');
      if (fullBtn) fullBtn.click();
      const maxBtn = buttons.find(b => b.innerText?.trim() === 'Max');
      if (maxBtn) maxBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await page.click('.synth-btn--settings');
    await new Promise(r => setTimeout(r, 400));

    // Scroll keyboard into view
    await page.evaluate(() => {
      const kb = document.querySelector('.piano-keyboard-wrap');
      if (kb) kb.scrollIntoView({ behavior: 'instant', block: 'end' });
    });
    await new Promise(r => setTimeout(r, 300));

    const totalKeys = await page.evaluate(() => document.querySelectorAll('.piano-key-white, .piano-key-black').length);
    console.log(`Keyboard display active with all ${totalKeys} keys visible.`);

    // Configure Sustain
    const desiredSustain = songData.sustain !== undefined ? songData.sustain : options.sustain;
    const sustainOn = await page.evaluate(() => {
      const btn = document.querySelector('.synth-btn--sustain');
      return btn ? btn.classList.contains('synth-btn--on') : true;
    });

    if (desiredSustain && !sustainOn) {
      console.log('Activating Sustain pedal...');
      await page.click('.synth-btn--sustain');
    } else if (!desiredSustain && sustainOn) {
      console.log('Deactivating Sustain pedal...');
      await page.click('.synth-btn--sustain');
    }

    // Inject Native Audio Bridge
    console.log('Injecting native audio bridge into OnlinePianist engine...');
    const bridgeInjected = await page.evaluate(() => {
      const key = document.querySelector('.piano-key-white[data-midi="60"]') || document.querySelector('[data-midi]');
      if (!key) return false;
      const fiberKey = Object.keys(key).find(k => k.startsWith('__reactFiber'));
      if (!fiberKey) return false;
      let curr = key[fiberKey];
      let playFn = null;
      let releaseFn = null;

      while (curr) {
        let h = curr.memoizedState;
        while (h) {
          if (Array.isArray(h.memoizedState) && typeof h.memoizedState[0] === 'function') {
            const s = h.memoizedState[0].toString();
            if (s.includes('playNote') && s.includes('octaveShift')) playFn = h.memoizedState[0];
            if (s.includes('releaseNote') && s.includes('octaveShift')) releaseFn = h.memoizedState[0];
          }
          h = h.next;
        }
        if (playFn && releaseFn) break;
        curr = curr.return;
      }

      if (!playFn || !releaseFn) return false;

      window.__playMidi = (midi) => {
        playFn(midi);
        const el = document.querySelector(`[data-midi="${midi}"]`);
        if (el) {
          el.classList.add('piano-key--active');
          const glow = el.querySelector('.key-glow');
          if (glow) glow.classList.add('key-glow--active');
        }
      };

      window.__releaseMidi = (midi) => {
        releaseFn(midi);
        const el = document.querySelector(`[data-midi="${midi}"]`);
        if (el) {
          el.classList.remove('piano-key--active');
          const glow = el.querySelector('.key-glow');
          if (glow) glow.classList.remove('key-glow--active');
        }
      };

      return true;
    });

    console.log(`Native audio bridge status: ${bridgeInjected ? 'CONNECTED (Studio Direct)' : 'FALLBACK (Keyboard Sim)'}`);

    console.log('================================================================');
    console.log(`NOW PLAYING: ${songData.title}`);
    console.log('================================================================');

    const tempoMultiplier = options.tempo || 1.0;
    const startTime = Date.now();

    if (songData.notes && bridgeInjected) {
      // High-precision timeline playback in browser
      console.log(`Streaming ${songData.notes.length} notes via client-side timeline...`);
      await page.evaluate((notes, mult) => {
        return new Promise((resolve) => {
          const maxTime = Math.max(...notes.map(n => n.startMs + n.durMs)) / mult;
          notes.forEach(n => {
            const sTime = n.startMs / mult;
            const sDur = n.durMs / mult;
            setTimeout(() => {
              window.__playMidi(n.midi);
              setTimeout(() => window.__releaseMidi(n.midi), sDur);
            }, sTime);
          });
          setTimeout(resolve, maxTime + 1000);
        });
      }, songData.notes, tempoMultiplier);
    } else if (songData.events) {
      // Step-by-step playback with direct audio bridge or keyboard fallback
      let nextStepTime = startTime;
      for (let i = 0; i < songData.events.length; i++) {
        const event = songData.events[i];
        const dur = Math.max(20, Math.round(event.dur * tempoMultiplier));
        const wait = Math.max(0, Math.round(event.wait * tempoMultiplier));
        const stepTotal = dur + wait;

        if (bridgeInjected) {
          const midis = event.keys.map(k => noteToMidi(k)).filter(m => m !== null);
          if (midis.length > 0) {
            await page.evaluate((mList) => mList.forEach(m => window.__playMidi(m)), midis);
          }
          await new Promise(r => setTimeout(r, dur));
          if (midis.length > 0) {
            await page.evaluate((mList) => mList.forEach(m => window.__releaseMidi(m)), midis);
          }
        } else {
          const chars = event.keys.map(k => NOTE_MAP[k] || k).filter(Boolean);
          if (chars.length > 0) {
            await Promise.all(chars.map(c => page.keyboard.down(c)));
          }
          await new Promise(r => setTimeout(r, dur));
          if (chars.length > 0) {
            await Promise.all(chars.map(c => page.keyboard.up(c)));
          }
        }

        nextStepTime += stepTotal;
        const remainingWait = nextStepTime - Date.now();
        if (remainingWait > 0) {
          await new Promise(r => setTimeout(r, remainingWait));
        }
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('================================================================');
    console.log(`Playback complete! Total duration: ${elapsed}s`);
    console.log('================================================================');

    console.log('Allowing final chord resonance to ring out...');
    await new Promise(r => setTimeout(r, 6000));

    await browser.close();
    console.log('Browser session finished.');
  } catch (err) {
    console.error('Playback failed:', err);
    if (browser) await browser.close();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { NOTE_MAP, noteToMidi, loadSong, listSongs, main };
