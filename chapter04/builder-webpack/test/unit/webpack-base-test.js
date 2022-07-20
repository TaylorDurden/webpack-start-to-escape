const assert = require('assert');

describe('webpack.base.js test cases', () => {
  const baseConfig = require('../../lib/webpack.base');
  console.log('baseConfig :', baseConfig);
  it('entry', () => {
    assert.equal(
      !!baseConfig.entry.index.indexOf(
        'test/smoke/template/src/index/index.js'
      ),
      true
    );
    assert.equal(
      !!baseConfig.entry.index.indexOf(
        'test/smoke/template/src/search/index.js'
      ),
      true
    );
  });
});
