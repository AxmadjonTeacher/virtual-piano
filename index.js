/**
 * Virtual Piano Player Programmatic Module
 * Exports core audio mapping, catalog metadata, and playback engine.
 */

const { NOTE_MAP, noteToMidi, loadSong, listSongs, main } = require('./scripts/play.js');

module.exports = {
  NOTE_MAP,
  noteToMidi,
  loadSong,
  listSongs,
  play: main
};
