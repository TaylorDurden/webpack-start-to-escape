const path = require('path');

process.chdir(path.join(__dirname, 'smoke/template'));

describe('builder-webpack test cases', () => {
  require('./unit/webpack-base-test');
});
