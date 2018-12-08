const path = require('path');

module.exports = {
  entry: './scripts/game.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};