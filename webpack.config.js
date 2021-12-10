var path = require('path');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    cjs: path.join(__dirname, './cjs/index.js'),
    mjs: path.join(__dirname, './mjs/index.js'),
  },
  output: {
    path: path.join(__dirname, './outputs'),
    filename: '[name].js',
  },
};
