const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const QUnit = require('qunit');

const PROJECT_ROOT = path.join(__dirname, '..');
const EXECUTABLE_PATH = path.join(PROJECT_ROOT, 'bin', 'cli.js');
const FIXTURE_PATH = path.join(__dirname, 'fixtures/input');

// resolved from the root of the project
const inputDir = path.resolve('./tests/fixtures/input');
const execOpts = { cwd: inputDir, stderr: 'inherit' };

QUnit.module('atam-cli', function (hooks) {
  QUnit.module('constant', function () {
    const dest = 'packages/engines/dashboards';

    hooks.afterEach(async function () {
      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/constants/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'app/constants/sample.js'));
    });

    QUnit.test('should move a constant', async function (assert) {
      const dest = 'packages/engines/dashboards';
      const result = await execa(EXECUTABLE_PATH, ['constant', 'sample', dest], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/constants/sample.js')));
    });

    QUnit.test('should not move a constant with dry-run', async function (assert) {
      const dest = 'packages/engines/dashboards';
      const result = await execa(EXECUTABLE_PATH, ['constant', 'sample', dest, '-d'], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/constants/sample.js')));
    });
  });
});
