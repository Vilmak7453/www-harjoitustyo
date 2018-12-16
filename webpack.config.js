const path = require('path');

module.exports = [{
  entry: './scripts/clients/game.js',
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist')
  }
},{
  entry: './scripts/clients/profile.js',
  output: {
    filename: 'profile.js',
    path: path.resolve(__dirname, 'dist')
  }
},{
  entry: './scripts/clients/searchFriends.js',
  output: {
    filename: 'searchFriends.js',
    path: path.resolve(__dirname, 'dist')
  }
},{
  entry: './scripts/clients/friendOverview.js',
  output: {
    filename: 'friendOverview.js',
    path: path.resolve(__dirname, 'dist')
  }
},{
  entry: './scripts/clients/chat.js',
  output: {
    filename: 'chat.js',
    path: path.resolve(__dirname, 'dist')
  }
}];