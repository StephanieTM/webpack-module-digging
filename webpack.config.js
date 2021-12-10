var path = require('path');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: path.join(__dirname, './mjs/index.js'),
  output: {
    path: path.join(__dirname, './output/mjs'),
    filename: 'index.js',
  },
};
