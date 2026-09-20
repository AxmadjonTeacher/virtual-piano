#!/usr/bin/env node

/**
 * Virtual Piano CLI
 * Entry point for global binary execution (piano, virtual-piano) and npx runner.
 */

const { main } = require('../scripts/play.js');

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
